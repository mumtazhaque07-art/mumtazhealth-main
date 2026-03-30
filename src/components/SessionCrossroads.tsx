import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Sparkles as IconSparkles, 
  Moon as IconMoon, 
  Bell as IconBell, 
  ArrowRight as IconArrowRight 
} from "lucide-react";
import { toast } from "sonner";

interface SessionCrossroadsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextStepPath?: string;
  nextStepLabel?: string;
}

export function SessionCrossroads({ 
  open, 
  onOpenChange, 
  nextStepPath = "/content-library",
  nextStepLabel = "Explore more"
}: SessionCrossroadsProps) {
  const navigate = useNavigate();

  const handleRest = () => {
    onOpenChange(false);
    toast.success("May your rest be deep and restorative. 💜", {
      description: "Closing session. You've done enough today.",
      duration: 5000,
    });
    navigate("/");
  };

  const handleRemind = () => {
    onOpenChange(false);
    toast.info("Reminded! 🌿", {
      description: "We'll nudge you to check back later when you have more space.",
    });
    navigate("/");
  };

  const handleContinue = () => {
    onOpenChange(false);
    navigate(nextStepPath);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-none bg-white shadow-2xl backdrop-blur-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-wellness-taupe font-serif">
            How are you feeling now?
          </DialogTitle>
          <DialogDescription className="text-center text-wellness-taupe/80 italic">
            Honor your energy. There is no rush in this sanctuary.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-3 py-4">
          <Button 
            variant="outline" 
            onClick={handleContinue}
            className="h-16 justify-between px-6 border-wellness-sage/30 bg-wellness-sage/5 hover:bg-wellness-sage text-wellness-taupe hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <IconSparkles className="h-5 w-5 text-wellness-sage group-hover:text-white" />
              <div className="text-left">
                <p className="font-bold text-sm">I have a little more energy</p>
                <p className="text-[11px] opacity-70">Suggested: {nextStepLabel}</p>
              </div>
            </div>
            <IconArrowRight className="h-4 w-4 opacity-50" />
          </Button>

          <Button 
            variant="outline" 
            onClick={handleRest}
            className="h-16 justify-between px-6 border-wellness-lilac/30 bg-wellness-lilac/5 hover:bg-wellness-lilac text-wellness-taupe hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <IconMoon className="h-5 w-5 text-wellness-lilac group-hover:text-white" />
              <div className="text-left">
                <p className="font-bold text-sm">I need to rest now</p>
                <p className="text-[11px] opacity-70">Close with a gentle affirmation</p>
              </div>
            </div>
            <IconArrowRight className="h-4 w-4 opacity-50" />
          </Button>

          <Button 
            variant="outline" 
            onClick={handleRemind}
            className="h-16 justify-between px-6 border-slate-200 bg-slate-50 hover:bg-slate-500 text-wellness-taupe hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <IconBell className="h-5 w-5 text-wellness-taupe group-hover:text-white" />
              <div className="text-left">
                <p className="font-bold text-sm">Remind me to check back later</p>
                <p className="text-[11px] opacity-70">Save your progress and rest</p>
              </div>
            </div>
            <IconArrowRight className="h-4 w-4 opacity-50" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
