import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sparkles, AlertCircle } from "lucide-react";
import { CycleStatus } from "@/lib/fiqhCycleCalculator";

interface FiqhCycleStatusProps {
  status: CycleStatus;
  dayOfStatus: number;
  recommendations: {
    practices: string[];
    focus: string;
    notes: string;
  };
}

export function FiqhCycleStatus({ status, dayOfStatus, recommendations }: FiqhCycleStatusProps) {
  const getStatusColor = (s: CycleStatus) => {
    switch (s) {
      case "Hayd": return "bg-rose-100 text-rose-800 border-rose-200";
      case "Tuhr": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Istihadah": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (s: CycleStatus) => {
    switch (s) {
      case "Hayd": return <Moon className="w-5 h-5 text-rose-600" />;
      case "Tuhr": return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case "Istihadah": return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <Card className="border-wellness-taupe/20 shadow-sm overflow-hidden bg-gradient-to-br from-white to-wellness-warm/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <CardTitle className="text-lg text-wellness-taupe">Faith-Based Cycle Insight</CardTitle>
          </div>
          <Badge variant="outline" className={getStatusColor(status)}>
            {status} - Day {dayOfStatus}
          </Badge>
        </div>
        <CardDescription className="italic">
          Juridical guidance for your current rhythm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-white/60 rounded-lg border border-wellness-taupe/10">
          <p className="text-sm font-medium text-wellness-taupe mb-1">Focus: {recommendations.focus}</p>
          <p className="text-xs text-muted-foreground">{recommendations.notes}</p>
        </div>
        
        <div>
          <p className="text-xs font-semibold text-wellness-taupe uppercase tracking-wider mb-2">Recommended Devotions</p>
          <div className="flex flex-wrap gap-2">
            {recommendations.practices.map((practice, index) => (
              <Badge key={index} variant="secondary" className="bg-wellness-sage/10 text-wellness-sage hover:bg-wellness-sage/20 border-none">
                {practice}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
