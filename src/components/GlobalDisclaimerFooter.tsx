import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Global Compliance Disclaimer Footer
 * Appears at the bottom of every page per the Master Brief requirement:
 * "Holistic suggestions only. Not medical advice. Consult your GP."
 */
export function GlobalDisclaimerFooter() {
  return (
    <footer className="w-full border-t border-border/30 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Compliance Disclaimer */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-wellness-sage/60 shrink-0" />
          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-lg">
            Holistic suggestions only. Not medical advice. Always consult your GP or healthcare professional.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <span>·</span>
          <span>© {new Date().getFullYear()} Mumtaz Health</span>
        </div>
      </div>
    </footer>
  );
}
