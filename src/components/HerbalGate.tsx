import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Leaf, ArrowRight } from "lucide-react";

/**
 * The "Herbal Gate"
 * Per the Master Brief — any mention of herbal remedies or complex health histories
 * must trigger a "Consultation Required" card that routes the user to the Bookings page.
 *
 * Usage: Place this wherever herbal content is shown (Content Library, Recommendations, etc.)
 */

interface HerbalGateProps {
  /** If true, the gate is shown */
  show?: boolean;
  /** Optional context message */
  context?: string;
  className?: string;
}

export function HerbalGate({ show = true, context, className = "" }: HerbalGateProps) {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <Card className={`border-amber-300/50 bg-gradient-to-r from-amber-50/80 to-orange-50/60 shadow-md rounded-2xl overflow-hidden ${className}`}>
      <CardContent className="py-5 px-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-amber-100 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-amber-900 text-sm flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Consultation Recommended
            </h4>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              {context || "Herbal remedies and complex health histories require personalised guidance from a qualified practitioner. Before starting any herbal protocol, please book a consultation with Mumtaz."}
            </p>
            <Button
              size="sm"
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              onClick={() => navigate("/bookings")}
            >
              Book a Consultation
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Helper to detect herbal content in text
 * Returns true if the text mentions herbal remedies, specific herbs, or complex protocols
 */
export function containsHerbalContent(text: string): boolean {
  if (!text) return false;
  const herbalKeywords = [
    "herbal", "herb", "tincture", "decoction", "shatavari", "ashwagandha",
    "turmeric", "fenugreek", "black seed", "nigella", "triphala",
    "chyawanprash", "guggulu", "brahmi", "moringa", "neem",
    "arjuna", "licorice", "senna", "valerian", "st john",
    "supplement", "tonic", "elixir", "extract", "capsule",
    "dosage", "protocol", "prescription",
  ];
  const lower = text.toLowerCase();
  return herbalKeywords.some((kw) => lower.includes(kw));
}
