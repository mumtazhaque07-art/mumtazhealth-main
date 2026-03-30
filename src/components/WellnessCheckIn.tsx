import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Zap, 
  Heart, 
  Smile, 
  Sun, 
  Moon, 
  Battery, 
  BatteryLow, 
  BatteryFull, 
  Sparkles,
  Leaf,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface WellnessCheckInProps {
  userId?: string;
  onComplete?: () => void;
}

const SLIDER_OPTIONS = [
  { value: 1, emoji: "😴", label: "Very Low" },
  { value: 2, emoji: "😔", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "✨", label: "Great" },
];

export function WellnessCheckIn({ userId, onComplete }: WellnessCheckInProps) {
  const navigate = useNavigate();
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(3);
  const [comfort, setComfort] = useState(3);
  const [phase, setPhase] = useState<"sliders" | "crossroads" | "done">("sliders");
  const [saving, setSaving] = useState(false);

  const handleSubmitCheckIn = async () => {
    setSaving(true);
    try {
      if (userId) {
        // Save check-in data to wellness_entries
        const { error } = await supabase.from("wellness_entries").insert({
          user_id: userId,
          entry_date: new Date().toISOString().split("T")[0],
          notes: `Energy: ${energy}/5, Mood: ${mood}/5, Comfort: ${comfort}/5`,
          emotional_score: mood,
        });
        if (error) console.warn("Check-in save note:", error.message);
      }
      setPhase("crossroads");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCrossroadsChoice = (choice: "energy" | "rest" | "remind") => {
    switch (choice) {
      case "energy":
        toast.success("Let's keep going! 💪", { description: "Your next practice awaits." });
        navigate("/content-library");
        break;
      case "rest":
        toast("Rest well, beautiful soul 🌙", {
          description: "You've done enough for today. Peace be upon you.",
          duration: 5000,
        });
        setPhase("done");
        onComplete?.();
        break;
      case "remind":
        toast.info("We'll gently remind you later 🕊️", { duration: 4000 });
        setPhase("done");
        onComplete?.();
        break;
    }
  };

  if (phase === "done") {
    return (
      <Card className="overflow-hidden border-wellness-sage/20 shadow-lg bg-white/60 backdrop-blur-xl rounded-[2rem]">
        <CardContent className="py-10 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-wellness-sage mx-auto" />
          <p className="text-lg font-semibold text-foreground">Check-in Complete</p>
          <p className="text-sm text-muted-foreground">Your wellness data has been saved. 🌿</p>
        </CardContent>
      </Card>
    );
  }

  if (phase === "crossroads") {
    return (
      <Card className="overflow-hidden border-wellness-sage/20 shadow-lg bg-white/60 backdrop-blur-xl rounded-[2rem]">
        <CardContent className="py-8 space-y-6">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="text-xl font-bold text-foreground mb-1">How would you like to continue?</h3>
            <p className="text-sm text-muted-foreground">Choose what feels right for you right now.</p>
          </div>

          <div className="grid gap-3">
            <Button
              onClick={() => handleCrossroadsChoice("energy")}
              className="h-14 bg-wellness-sage hover:bg-wellness-sage/90 text-white rounded-2xl text-base font-semibold shadow-lg shadow-wellness-sage/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5 mr-3" />
              I have more energy — show me more
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>

            <Button
              onClick={() => handleCrossroadsChoice("rest")}
              variant="outline"
              className="h-14 border-accent/30 text-accent hover:bg-accent/10 rounded-2xl text-base font-semibold transition-all"
            >
              <Moon className="w-5 h-5 mr-3" />
              I need to rest now
              <Leaf className="w-4 h-4 ml-auto text-wellness-sage" />
            </Button>

            <Button
              onClick={() => handleCrossroadsChoice("remind")}
              variant="ghost"
              className="h-12 text-muted-foreground hover:text-foreground rounded-2xl text-sm transition-all"
            >
              <Bell className="w-4 h-4 mr-2" />
              Remind me later
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Phase: sliders
  return (
    <Card className="overflow-hidden border-wellness-sage/20 shadow-lg bg-white/60 backdrop-blur-xl rounded-[2rem]">
      <CardContent className="py-8 space-y-8">
        <div className="text-center">
          <Heart className="w-8 h-8 text-accent mx-auto mb-3" />
          <h3 className="text-xl font-bold text-foreground mb-1">Check-In</h3>
          <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
        </div>

        {/* Energy Slider */}
        <SliderRow
          icon={<Zap className="w-5 h-5 text-amber-500" />}
          label="Energy"
          value={energy}
          onChange={setEnergy}
          color="amber"
        />

        {/* Mood Slider */}
        <SliderRow
          icon={<Smile className="w-5 h-5 text-wellness-sage" />}
          label="Mood"
          value={mood}
          onChange={setMood}
          color="sage"
        />

        {/* Comfort Slider */}
        <SliderRow
          icon={<Sun className="w-5 h-5 text-accent" />}
          label="Comfort"
          value={comfort}
          onChange={setComfort}
          color="lilac"
        />

        <Button
          onClick={handleSubmitCheckIn}
          disabled={saving}
          className="w-full h-14 bg-wellness-sage hover:bg-wellness-sage/90 text-white rounded-2xl text-lg font-bold shadow-lg shadow-wellness-sage/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {saving ? "Saving..." : "Save My Check-In"}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── Visual Slider Row ─── */
interface SliderRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (val: number) => void;
  color: "amber" | "sage" | "lilac";
}

function SliderRow({ icon, label, value, onChange, color }: SliderRowProps) {
  const colorMap = {
    amber: {
      active: "bg-amber-400 text-white shadow-amber-400/30",
      ring: "ring-amber-300",
    },
    sage: {
      active: "bg-wellness-sage text-white shadow-wellness-sage/30",
      ring: "ring-wellness-sage/30",
    },
    lilac: {
      active: "bg-accent text-white shadow-accent/30",
      ring: "ring-accent/30",
    },
  };
  const colors = colorMap[color];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-foreground">{label}</span>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {SLIDER_OPTIONS.find((o) => o.value === value)?.label}
        </span>
      </div>
      <div className="flex gap-2 justify-between">
        {SLIDER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all duration-200 ${
              value === opt.value
                ? `${colors.active} border-transparent ring-2 ${colors.ring} shadow-lg scale-105`
                : "bg-background border-border/50 hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            <span className="text-xl">{opt.emoji}</span>
            <span className="text-[10px] font-medium leading-tight">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
