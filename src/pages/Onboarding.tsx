import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, Heart, Moon, Compass, ArrowRight, Activity, Leaf, Lock, ArrowLeft, Flower2, Wind, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";

type OnboardingStep = "welcome" | "philosophy" | "elements" | "phase" | "spiritual" | "finalize";

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
  const [primaryDosha, setPrimaryDosha] = useState<string>("");

  // Elements Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

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
        primary_dosha: primaryDosha || null,
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

  const quizQuestions = [
    {
      title: "When you feel stressed or overwhelmed, how does your body typically react?",
      options: [
        { id: 'vata', text: "I feel anxious, my mind races, and I lose my appetite or sleep.", icon: <Wind className="w-5 h-5 text-mumtaz-plum/60" /> },
        { id: 'pitta', text: "I become irritable, frustrated, or feel a lot of heat/inflammation in my body.", icon: <Flower2 className="w-5 h-5 text-wellness-lilac" /> },
        { id: 'kapha', text: "I withdraw, feel sluggish, and just want to sleep or comfort eat.", icon: <Leaf className="w-5 h-5 text-wellness-sage" /> }
      ]
    },
    {
      title: "How would you describe your natural energy levels throughout the day?",
      options: [
        { id: 'vata', text: "Very fluctuating. High bursts of energy followed by sudden exhaustion.", icon: <Wind className="w-5 h-5 text-mumtaz-plum/60" /> },
        { id: 'pitta', text: "Strong and consistent, especially if I have a goal. I easily push through.", icon: <Flower2 className="w-5 h-5 text-wellness-lilac" /> },
        { id: 'kapha', text: "Slow to start in the morning, but steady endurance once I get going.", icon: <Leaf className="w-5 h-5 text-wellness-sage" /> }
      ]
    },
    {
      title: "How does your digestion usually feel?",
      options: [
        { id: 'vata', text: "Irregular. Sometimes prone to bloating, gas, or constipation.", icon: <Wind className="w-5 h-5 text-mumtaz-plum/60" /> },
        { id: 'pitta', text: "Very strong. I get incredibly hungry and might experience heartburn if I wait too long.", icon: <Flower2 className="w-5 h-5 text-wellness-lilac" /> },
        { id: 'kapha', text: "A bit slow or sluggish. I often feel full for a very long time after eating.", icon: <Leaf className="w-5 h-5 text-wellness-sage" /> }
      ]
    }
  ];

  const handleQuizAnswer = (doshaId: string) => {
    const newAnswers = { ...quizAnswers, [currentQuestion]: doshaId };
    setQuizAnswers(newAnswers);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const counts: Record<string, number> = { vata: 0, pitta: 0, kapha: 0 };
      Object.values(newAnswers).forEach((dosha) => counts[dosha as string]++);
      
      let dominant = "tri-dosha";
      if (!(counts.vata === 1 && counts.pitta === 1 && counts.kapha === 1)) {
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        dominant = sorted[0][0];
      }
      
      setPrimaryDosha(dominant);
      setStep("phase");
    }
  };

  const stepsOrder = ["welcome", "philosophy", "elements", "phase", "spiritual", "finalize"];
  const currentIdx = stepsOrder.indexOf(step) + 1;

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-6 sm:p-4 bg-background">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="px-6 pt-6 pb-2">
          <ProgressIndicator currentStep={currentIdx} totalSteps={6} />
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
                <p className="text-muted-foreground leading-relaxed px-4 text-base">
                  A gentle space created to support you through every phase of womanhood. There are no heavy clinical forms here. We walk softly, learning about you intuitively together over time.
                </p>
                <Button onClick={() => setStep("philosophy")} size="lg" className="w-full max-w-xs mt-6 bg-mumtaz-plum hover:bg-mumtaz-plum/90 text-white rounded-full">
                  Begin Journey <ArrowRight className="h-4 w-4 shrink-0 ml-2" />
                </Button>
              </CardContent>
            </>
          )}

          {step === "philosophy" && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col justify-center min-h-[400px]">
              <CardHeader className="text-center space-y-4 pt-8">
                <div className="mx-auto p-4 rounded-full bg-wellness-lilac/10 w-fit mb-2">
                  <Flower2 className="h-8 w-8 text-wellness-lilac" />
                </div>
                <CardTitle className="text-2xl font-light text-mumtaz-plum italic font-accent px-4">
                  "A homecoming, coming back to the self."
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 flex flex-col items-center w-full px-8 pb-8">
                <p className="text-slate-600 leading-relaxed text-center font-medium max-w-md">
                  In this sanctuary, we blend the ancient art of Ayurveda with gentle movement and intuition. 
                  It's what the old wives tell us and why they make sense.
                </p>
                <p className="text-slate-500 leading-relaxed text-center text-sm max-w-md">
                  We use simple elements—Air, Fire, and Earth—to help you understand your unique individual body without comparison. There are no labels here. We just walk hand in hand, celebrating you.
                </p>
                
                <div className="w-full flex justify-between items-center mt-6 pt-4 border-t border-slate-100 max-w-md">
                  <Button variant="ghost" onClick={() => setStep("welcome")} className="text-xs font-semibold text-slate-500">
                    <ArrowLeft className="w-3 h-3 mr-1" /> Back
                  </Button>
                  <Button onClick={() => setStep("elements")} className="bg-wellness-sage hover:bg-wellness-sage/90 text-white rounded-full px-6">
                    Discover your Elements <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </div>
          )}

          {step === "elements" && (
            <div className="animate-in slide-in-from-right-8 duration-500 flex flex-col justify-center min-h-[400px]">
              <CardHeader className="text-center space-y-2 pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-wellness-sage">Your Blueprint ({currentQuestion + 1}/3)</span>
                <CardTitle className="text-xl sm:text-2xl font-medium text-mumtaz-plum px-4">
                  {quizQuestions[currentQuestion].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex flex-col w-full px-6 sm:px-10 pb-8 mt-4">
                {quizQuestions[currentQuestion].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(opt.id)}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl border border-slate-200 transition-all flex items-start gap-4 hover:border-wellness-sage/50 hover:bg-wellness-sage/5 hover:shadow-sm group bg-white/50"
                  >
                    <div className="mt-0.5 p-2 rounded-full bg-slate-50 group-hover:bg-white transition-colors">
                      {opt.icon}
                    </div>
                    <span className="text-[14px] sm:text-[15px] text-slate-700 leading-relaxed font-medium mt-1">{opt.text}</span>
                  </button>
                ))}
              </CardContent>
            </div>
          )}

          {step === "phase" && (
            <>
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-3 rounded-full bg-wellness-sage/20 w-fit">
                  <Activity className="h-8 w-8 text-wellness-sage" />
                </div>
                <CardTitle className="text-2xl font-bold text-mumtaz-plum">Which phase describes you best today?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex flex-col items-center w-full px-6 sm:px-10 pb-8">
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
                    className={`w-full max-w-md text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${lifeStage === phase.id ? 'border-wellness-lilac bg-wellness-lilac/10 shadow-sm' : 'border-slate-200 hover:border-wellness-sage/50 bg-white/50'} `}
                  >
                    <span className="font-medium text-slate-700">{phase.label}</span>
                    <ArrowRight className="w-5 h-5 text-wellness-sage opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </button>
                ))}
                <div className="w-full max-w-md flex justify-start mt-4">
                  <Button variant="ghost" onClick={() => { setStep("elements"); setCurrentQuestion(0); }} className="text-xs font-semibold text-slate-500 p-0 hover:bg-transparent">
                    <ArrowLeft className="w-3 h-3 mr-1" /> Back
                  </Button>
                </div>
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
              <CardContent className="space-y-3 flex flex-col items-center w-full px-6 sm:px-10 pb-8">
                {[
                  { id: "islamic", label: "Islamic Path", desc: "Rooted deeply in Sunnah, Dhikr & Quranic healing." },
                  { id: "universal", label: "Universal Mindfulness", desc: "Breathwork, grounding and mindful awareness." },
                  { id: "both", label: "The Holistic Blend", desc: "A seamless weaving of both worlds." },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => { setSpiritualPreference(pref.id); setStep("finalize"); }}
                    className={`w-full max-w-md text-left p-4 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer hover:border-wellness-lilac/50 bg-white/50 hover:bg-wellness-lilac/5 group`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{pref.label}</span>
                      <CheckCircle2 className="w-4 h-4 text-wellness-lilac opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-slate-500 leading-relaxed">{pref.desc}</span>
                  </button>
                ))}
                <div className="w-full max-w-md flex justify-start mt-4">
                  <Button variant="ghost" onClick={() => setStep("phase")} className="text-xs font-semibold text-slate-500 p-0 hover:bg-transparent">
                    <ArrowLeft className="w-3 h-3 mr-1" /> Back
                  </Button>
                </div>
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
                    className="w-full max-w-xs bg-mumtaz-plum hover:bg-mumtaz-plum/90 text-white rounded-full group"
                  >
                    {loading ? "Entering..." : "Enter Sanctuary"}
                    <Heart className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity group-hover:scale-110 transform" />
                  </Button>
                </div>
              <Button variant="ghost" onClick={() => setStep("spiritual")} className="mt-4 text-xs font-semibold text-slate-500">
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
