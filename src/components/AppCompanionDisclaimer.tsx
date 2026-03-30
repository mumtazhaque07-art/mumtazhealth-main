import { Heart, Shield } from "lucide-react";

interface AppCompanionDisclaimerProps {
  variant?: "inline" | "card" | "subtle";
  showMedicalNote?: boolean;
  className?: string;
}

export function AppCompanionDisclaimer({ 
  variant = "inline", 
  showMedicalNote = true,
  className = "" 
}: AppCompanionDisclaimerProps) {
  if (variant === "subtle") {
    return (
      <p className={`text-xs text-muted-foreground italic ${className}`}>
        Holistic suggestions only. Not medical advice. Always consult your GP.
      </p>
    );
  }

  if (variant === "card") {
    return (
      <div className={`p-4 rounded-lg bg-wellness-sage/5 border border-wellness-sage/20 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-wellness-sage/10 flex-shrink-0">
            <Shield className="w-4 h-4 text-wellness-sage" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-wellness-taupe font-medium">
              Your wellness companion
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As your founder and guide, I offer 30+ years of wisdom to support your journey. This app provides holistic advice and educational content — it does NOT diagnose, prescribe medication, or replace professional medical care.
            </p>
            {showMedicalNote && (
              <p className="text-xs text-muted-foreground italic font-medium text-wellness-taupe">
                Always consult your physician or speak with a practitioner for medical concerns.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg bg-wellness-lilac/5 border border-wellness-lilac/15 ${className}`}>
      <Shield className="w-4 h-4 text-wellness-lilac flex-shrink-0" />
      <p className="text-xs text-muted-foreground">
        Offering supportive wisdom and advice — not medical diagnosis or medication. 
        Consulting your physician or a practitioner is always recommended.
      </p>
    </div>
  );
}

export default AppCompanionDisclaimer;
