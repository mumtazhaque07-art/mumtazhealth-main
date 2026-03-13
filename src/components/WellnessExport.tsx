import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Table2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import jsPDF from "jspdf";

type ExportRange = "7d" | "30d" | "90d" | "all";

const RANGES: { label: string; value: ExportRange; days: number | null }[] = [
  { label: "Last 7 days", value: "7d", days: 7 },
  { label: "Last 30 days", value: "30d", days: 30 },
  { label: "Last 90 days", value: "90d", days: 90 },
  { label: "All time", value: "all", days: null },
];

export function WellnessExport() {
  const [exporting, setExporting] = useState(false);
  const [range, setRange] = useState<ExportRange>("30d");

  const fetchEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const rangeConfig = RANGES.find((r) => r.value === range);
    let query = supabase
      .from("wellness_entries")
      .select("entry_date, emotional_score, emotional_state, pain_level, cycle_phase, physical_symptoms, spiritual_anchor")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: true });

    if (rangeConfig?.days) {
      const startDate = subDays(new Date(), rangeConfig.days);
      query = query.gte("entry_date", format(startDate, "yyyy-MM-dd"));
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const entries = await fetchEntries();
      if (entries.length === 0) {
        toast.info("No wellness entries found for this period.");
        return;
      }

      const headers = ["Date", "Emotional Score", "Emotional State", "Pain Level", "Cycle Phase", "Physical Symptoms", "Spiritual Anchor"];
      const rows = entries.map((e) => [
        e.entry_date,
        e.emotional_score ?? "",
        e.emotional_state ?? "",
        e.pain_level ?? "",
        e.cycle_phase ?? "",
        e.physical_symptoms ?? "",
        e.spiritual_anchor ?? "",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      downloadBlob(blob, `mumtaz-health-wellness-${range}.csv`);
      toast.success("CSV exported successfully!");
    } catch (err) {
      console.error("CSV export error:", err);
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const entries = await fetchEntries();
      if (entries.length === 0) {
        toast.info("No wellness entries found for this period.");
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(139, 92, 246); // Purple accent
      doc.text("Mumtaz Health", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Wellness Journey Report", pageWidth / 2, 28, { align: "center" });

      const rangeLabel = RANGES.find((r) => r.value === range)?.label || range;
      doc.setFontSize(10);
      doc.text(`Period: ${rangeLabel} • Generated: ${format(new Date(), "d MMMM yyyy")}`, pageWidth / 2, 35, { align: "center" });

      // Summary stats
      const emotionalScores = entries.filter((e) => e.emotional_score !== null).map((e) => e.emotional_score!);
      const painLevels = entries.filter((e) => e.pain_level !== null).map((e) => e.pain_level!);

      let y = 48;
      doc.setFontSize(13);
      doc.setTextColor(50, 50, 50);
      doc.text("Summary", 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Total check-ins: ${entries.length}`, 14, y);
      y += 6;

      if (emotionalScores.length > 0) {
        const avg = (emotionalScores.reduce((a, b) => a + b, 0) / emotionalScores.length).toFixed(1);
        doc.text(`Average emotional score: ${avg}/10`, 14, y);
        y += 6;
      }

      if (painLevels.length > 0) {
        const avg = (painLevels.reduce((a, b) => a + b, 0) / painLevels.length).toFixed(1);
        doc.text(`Average pain level: ${avg}/10`, 14, y);
        y += 6;
      }

      // Table header
      y += 8;
      doc.setFontSize(13);
      doc.setTextColor(50, 50, 50);
      doc.text("Daily Entries", 14, y);
      y += 8;

      // Table
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const cols = ["Date", "Emotion", "State", "Pain", "Phase"];
      const colWidths = [28, 22, 50, 18, 30];
      let x = 14;

      // Header row
      doc.setFont("helvetica", "bold");
      cols.forEach((col, i) => {
        doc.text(col, x, y);
        x += colWidths[i];
      });
      y += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, pageWidth - 14, y);
      y += 5;

      // Data rows
      doc.setFont("helvetica", "normal");
      for (const entry of entries) {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }

        x = 14;
        const row = [
          format(new Date(entry.entry_date), "d MMM"),
          entry.emotional_score !== null ? String(entry.emotional_score) : "—",
          (entry.emotional_state || "—").substring(0, 25),
          entry.pain_level !== null ? String(entry.pain_level) : "—",
          (entry.cycle_phase || "—"),
        ];

        row.forEach((cell, i) => {
          doc.text(cell, x, y);
          x += colWidths[i];
        });
        y += 5;
      }

      // Footer
      y += 10;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("This report is for personal wellness tracking only. It is not medical advice.", 14, y);
      doc.text("Always consult a healthcare professional for medical concerns.", 14, y + 4);

      doc.save(`mumtaz-health-wellness-${range}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          Export Your Data
        </CardTitle>
        <CardDescription>Download your wellness entries as PDF or CSV</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Select value={range} onValueChange={(v) => setRange(v as ExportRange)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportPDF}
              disabled={exporting}
              className="gap-1.5"
            >
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              disabled={exporting}
              className="gap-1.5"
            >
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Table2 className="h-3.5 w-3.5" />}
              CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
