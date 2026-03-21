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
    <div className="fixed bottom-28 left-4 right-4 z-[100] sm:left-auto sm:right-6 sm:w-80 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-md p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-sm font-semibold text-foreground leading-tight">
            Install Mumtaz Health
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-normal">
            Faster access and works offline. No App Store required.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              onClick={triggerInstall}
              className="h-8 px-4 text-xs font-bold rounded-full bg-accent hover:bg-accent/90"
            >
              Install now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={dismiss}
              className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Later
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
