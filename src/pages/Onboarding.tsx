import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, Heart, Moon, Compass, ArrowRight, Activity, Leaf, Lock, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

type OnboardingStep = "welcome" | "phase" | "spiritual" | "finalize";

const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const progress = currentStep / totalSteps;
  const size = 60; 
  const orbSize = 20 + (progress * 40); 
  
  return (
    <div className="flex flex-col items-center justify-center mb-8 space-y-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <div 
          className="absolute rounded-full bg-wellness-lilac/30 blur-xl transition-all duration-1000 ease-in-out animate-pulse"
          style={{ width: orbSize * 1.5, height: orbSize * 1.5 }}
        />
        <div 
          className="relative rounded-full bg-gradient-to-br from-wellness-lilac to-wellness-sage shadow-inner transition-all duration-1000 ease-in-out"
          style={{ width: orbSize, height: orbSize, opacity: 0.4 + (progress * 0.6) }}
        />
      </div>
      <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase opacity-70">
        {currentStep === totalSteps ? 'Complete' : 'Unfolding'}
      </span>
    </div>
  );
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [loading, setLoading] = useState(false);

  // Core Data
  const [lifeStage, setLifeStage] = useState<string>("");
  const [spiritualPreference, setSpiritualPreference] = useState<string>("both");

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in first");
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("user_wellness_profiles").upsert({
        user_id: user.id,
        life_stage: lifeStage,
        spiritual_preference: spiritualPreference,
        onboarding_completed: true,
      }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success("Welcome! Let's start your journey.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const currentIdx = ["welcome", "phase", "spiritual", "finalize"].indexOf(step) + 1;

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-6 sm:p-4 bg-background">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="px-6 pt-6 pb-2">
          <ProgressIndicator currentStep={currentIdx} totalSteps={4} />
        </div>
        
        <div className="flex justify-center mb-4">
          <Logo size="md" showText={false} />
        </div>

        <Card className="border-none shadow-xl bg-card/95 backdrop-blur-sm overflow-hidden min-h-[400px] flex flex-col justify-center">
          
          {step === "welcome" && (
            <>
              <CardHeader className="text-center space-y-6">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-mumtaz-plum leading-snug font-accent">
                  Welcome to Your Sanctuary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground leading-relaxed px-4">
                  A gentle space created to support you through every phase of womanhood. There are no heavy clinical forms here. We walk softly, learning about you intuitively together over time.
                </p>
                <Button onClick={() => setStep("phase")} size="lg" className="w-full max-w-xs mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                  Begin <ArrowRight className="h-4 w-4 shrink-0 ml-2" />
                </Button>
              </CardContent>
            </>
          )}

          {step === "phase" && (
            <>
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-3 rounded-full bg-wellness-sage/20 w-fit">
                  <Activity className="h-8 w-8 text-wellness-sage" />
                </div>
                <CardTitle className="text-2xl font-bold text-mumtaz-plum">Which phase describes you best today?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col items-center w-full px-8">
                {[
                  { id: "menstrual_cycle", label: "Menstrual Cycle / Core Years" },
                  { id: "pregnancy", label: "Pregnancy Journey" },
                  { id: "postpartum", label: "Postpartum & Healing" },
                  { id: "perimenopause", label: "Perimenopause Transition" },
                  { id: "menopause", label: "Menopause & Beyond" },
                ].map((phase) => (
                  <button
                    key={phase.id}
                    onClick={() => { setLifeStage(phase.id); setStep("spiritual"); }}
                    className={`w-full max-w-md text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group cursor-pointer ${lifeStage === phase.id ? 'border-wellness-lilac bg-wellness-lilac/5' : 'border-border/60 hover:border-wellness-sage/50 bg-background/50'} `}
                  >
                    <span className="font-medium text-foreground">{phase.label}</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-wellness-sage" />
                  </button>
                ))}
              </CardContent>
            </>
          )}

          {step === "spiritual" && (
            <>
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-3 rounded-full bg-wellness-lilac/20 w-fit">
                  <Moon className="h-8 w-8 text-wellness-lilac" />
                </div>
                <CardTitle className="text-2xl font-bold text-mumtaz-plum">How do you prefer your spiritual guidance?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col items-center w-full px-8">
                {[
                  { id: "islamic", label: "Islamic Path", desc: "Rooted deeply in Sunnah, Dhikr & Quranic healing." },
                  { id: "universal", label: "Universal Mindfulness", desc: "Breathwork, grounding and mindful awareness." },
                  { id: "both", label: "The Holistic Blend", desc: "A seamless weaving of both worlds." },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => { setSpiritualPreference(pref.id); setStep("finalize"); }}
                    className={`w-full max-w-md text-left p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 cursor-pointer hover:border-wellness-lilac/50 bg-background/50 hover:bg-wellness-lilac/5`}
                  >
                    <span className="font-bold text-foreground">{pref.label}</span>
                    <span className="text-xs text-muted-foreground">{pref.desc}</span>
                  </button>
                ))}
            <Button variant="ghost" onClick={() => setStep("phase")} className="mt-4 text-xs font-semibold">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back
            </Button>
              </CardContent>
            </>
          )}

          {step === "finalize" && (
            <>
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-3 rounded-full bg-green-500/20 w-fit">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-mumtaz-plum">Your Sanctuary is Ready</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">Everything else will dynamically shape to you as you check in each day. No pressure, just presence.</p>
                <div className="flex justify-center pt-6">
                  <Button 
                    onClick={saveProfile} 
                    disabled={loading}
                    size="lg"
                    className="w-full max-w-xs bg-accent hover:bg-accent/90 text-accent-foreground group"
                  >
                    {loading ? "Entering..." : "Enter Sanctuary"}
                    <Heart className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>
              <Button variant="ghost" onClick={() => setStep("spiritual")} className="mt-4 text-xs font-semibold text-muted-foreground">
                Wait, take me back
              </Button>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
