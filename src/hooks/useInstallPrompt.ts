import { useState, useEffect } from "react";

// This hook listens for the browser's "Add to Home Screen" install event.
// When the browser decides the app is installable, it fires a 'beforeinstallprompt'
// event. We capture it here and use it to show a custom install button.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed (running as a standalone app)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed this session
    const dismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }

    // Capture the browser's install prompt event
    const handler = (e: Event) => {
      e.preventDefault(); // Prevent the browser's default mini-infobar
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for when app gets installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  const dismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Show the banner if: prompt is available, not already installed, not dismissed
  const showBanner = !!installPrompt && !isInstalled && !isDismissed;

  return { showBanner, triggerInstall, dismiss, isInstalled };
}
