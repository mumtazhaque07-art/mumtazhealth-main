import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Leaf, Moon, Sun } from "lucide-react";

interface SupportPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  entryDate: string;
  lifeStage: string;
  symptoms: string[];
  dosha?: string;
}

// Returns a gentle, personalised support suggestion based on the user's dosha
function getDoshaPractice(dosha?: string): { title: string; practice: string } {
  switch (dosha?.toLowerCase()) {
    case "vata":
      return {
        title: "Ground your Vata energy",
        practice:
          "Warm sesame oil on your feet before bed, a cup of warm spiced milk, and 5 minutes of slow, deep belly breathing.",
      };
    case "pitta":
      return {
        title: "Cool your Pitta fire",
        practice:
          "Step outside for fresh air, drink cool (not cold) water with a squeeze of lime, and spend 5 minutes in a gentle seated forward fold.",
      };
    case "kapha":
      return {
        title: "Lift your Kapha vitality",
        practice:
          "A 10-minute brisk walk, some energising pranayama (Kapalabhati breath), and a warm ginger tea to stimulate your digestion.",
      };
    default:
      return {
        title: "Nurture yourself today",
        practice:
          "Take 5 minutes in stillness — breathe slowly, place a hand on your heart, and simply notice how you feel without judgment.",
      };
  }
}

// Returns a life-stage-aware affirmation
function getLifeStageMessage(lifeStage: string): string {
  if (lifeStage?.includes("menstrual") || lifeStage?.includes("cycle")) {
    return "Your body is doing important work right now. Rest is productive. Honour this phase.";
  }
  if (lifeStage?.includes("pregnancy")) {
    return "You are growing life — that is extraordinary. Be gentle with yourself in every moment.";
  }
  if (lifeStage?.includes("postpartum") || lifeStage?.includes("post_birth")) {
    return "The fourth trimester is real. Your recovery matters as much as your baby's care.";
  }
  if (lifeStage?.includes("peri") || lifeStage?.includes("menopause")) {
    return "This transition holds deep wisdom. Your body is not breaking down — it is transforming.";
  }
  return "Every day you show up for yourself is a day of growth. That matters more than you know.";
}

export function SupportPlanModal({
  open,
  onOpenChange,
  lifeStage,
  symptoms,
  dosha,
}: SupportPlanModalProps) {
  const doshaPractice = getDoshaPractice(dosha);
  const lifeStageMessage = getLifeStageMessage(lifeStage);
  const hasSymptoms = symptoms && symptoms.filter(Boolean).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none shadow-2xl bg-gradient-to-b from-wellness-lavender/10 to-background">
        <DialogHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Your support plan for today
          </DialogTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Based on what you've shared, here is your gentle guide for the rest of your day.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Life stage affirmation */}
          <div className="rounded-xl bg-wellness-rose/10 border border-wellness-rose/20 p-4">
            <div className="flex items-start gap-3">
              <Heart className="w-4 h-4 text-wellness-rose mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed italic">
                "{lifeStageMessage}"
              </p>
            </div>
          </div>

          {/* Dosha-based practice */}
          <div className="rounded-xl bg-wellness-sage-light/30 border border-border/40 p-4">
            <div className="flex items-start gap-3">
              <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {doshaPractice.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {doshaPractice.practice}
                </p>
              </div>
            </div>
          </div>

          {/* If symptoms were logged, acknowledge them */}
          {hasSymptoms && (
            <div className="rounded-xl bg-wellness-lilac-light/30 border border-border/40 p-4">
              <div className="flex items-start gap-3">
                <Moon className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    You've acknowledged how you're feeling
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    That awareness itself is healing. If you're struggling today,
                    Ask Mumtaz is here — just tap the chat icon anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Evening reminder */}
          <div className="rounded-xl bg-muted/40 border border-border/30 p-4">
            <div className="flex items-start gap-3">
              <Sun className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wind down by 9pm tonight — dim the lights, step away from screens,
                and let your nervous system rest. Tomorrow is a fresh start.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full mt-2"
          size="lg"
        >
          Thank you — I'll take care of myself
        </Button>
      </DialogContent>
    </Dialog>
  );
}
