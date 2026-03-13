import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";
import { X, Smartphone } from "lucide-react";

// This banner appears at the top of the dashboard when the browser
// determines the app is ready to be installed on the home screen.
// It gives users a simple one-tap way to add Mumtaz Health to their phone.

export function InstallPromptBanner() {
  const { showBanner, triggerInstall, dismiss } = useInstallPrompt();

  if (!showBanner) return null;

  return (
    <div className="mx-4 mt-4 mb-2 rounded-xl border border-primary/20 bg-gradient-to-r from-wellness-lavender/30 via-background to-wellness-rose/20 p-3 shadow-sm animate-fade-in">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-primary" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">
            Add Mumtaz Health to your home screen
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            One tap away — like a real app, no App Store needed
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="default"
            onClick={triggerInstall}
            className="h-8 px-3 text-xs font-medium"
          >
            Add
          </Button>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
