import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sparkles, AlertCircle, BookOpen, Dumbbell } from "lucide-react";
import { CycleStatus } from "@/lib/fiqhCycleCalculator";

interface FiqhCycleStatusProps {
  status: CycleStatus;
  dayOfStatus: number;
  recommendations: {
    practices: string[];
    focus: string;
    notes: string;
    islamicNote?: string;
    physicalGuidance?: string;
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
        {status === "Hayd" && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl mb-4 animate-in fade-in duration-700">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="h-4 w-4 text-rose-500 fill-rose-500" />
              <p className="font-bold text-rose-950 text-sm italic">Sacred Rest Phase</p>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Your prayers are <strong>waived by Divine Mercy</strong> — not missed, not owed. Nothing to make up. Fill these days with dhikr and gentle healing. You remain fully in Allah's grace.
            </p>
          </div>
        )}

        {status === "Tuhr" && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 animate-in fade-in duration-700">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <p className="font-bold text-emerald-900 text-sm italic">Spiritual Bloom</p>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              You are in complete purity — your most spiritually expansive time. All acts of worship carry their full weight. Consider Tahajjud, extra Quran, and voluntary fasting on Mondays & Thursdays.
            </p>
          </div>
        )}

        {status === "Istihadah" && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-4 animate-in fade-in duration-700">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <p className="font-bold text-amber-900 text-sm italic">Continuous Worship</p>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Istihadah is irregular bleeding — distinct from Hayd. Perform wudu before each prayer and <strong>continue all acts of worship</strong> normally. If uncertain, consult a trusted scholar.
            </p>
          </div>
        )}

        <div className="p-3 bg-white/60 rounded-lg border border-wellness-taupe/10">
          <p className="text-sm font-medium text-wellness-taupe mb-1">Focus: {recommendations.focus}</p>
          <p className="text-xs text-muted-foreground">{recommendations.notes}</p>
        </div>

        {/* Islamic Scholarly Note */}
        {recommendations.islamicNote && (
          <div className="p-3 bg-wellness-lilac/5 rounded-lg border border-wellness-lilac/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-wellness-lilac" />
              <p className="text-[11px] font-semibold text-wellness-lilac uppercase tracking-wider">Scholarly Basis</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">{recommendations.islamicNote}</p>
          </div>
        )}

        {/* Physical / Holistic Guidance */}
        {recommendations.physicalGuidance && (
          <div className="p-3 bg-wellness-sage/8 rounded-lg border border-wellness-sage/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-wellness-sage" />
              <p className="text-[11px] font-semibold text-wellness-sage uppercase tracking-wider">Body Guidance</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{recommendations.physicalGuidance}</p>
          </div>
        )}
        
        <div>
          <p className="text-xs font-semibold text-wellness-taupe uppercase tracking-wider mb-2">Recommended Devotions & Practices</p>
          <ul className="space-y-1.5">
            {recommendations.practices.map((practice, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-wellness-sage flex-shrink-0" />
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

