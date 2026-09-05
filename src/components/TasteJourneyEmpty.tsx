import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SHIROO_DISCLAIMER =
  "Holistic suggestions only. Not medical advice. Always consult your GP or healthcare professional.";

export function TrackerFirstCheckInEmpty({ onCheckIn }: { onCheckIn: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-4 py-12 px-4 flex flex-col items-center">
      <h2 className="text-3xl font-serif text-slate-800">How is this body today?</h2>
      <p className="text-slate-500 max-w-md mx-auto">
        One check-in is enough to begin. We meet you where you are.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button
          className="bg-mumtaz-plum hover:bg-mumtaz-plum/90 text-white rounded-full px-6 min-h-[44px]"
          onClick={onCheckIn}
        >
          Check in now
        </Button>
        <Button
          variant="outline"
          className="border-mumtaz-plum text-mumtaz-plum hover:bg-mumtaz-plum/5 rounded-full px-6 min-h-[44px]"
          onClick={() => navigate('/content-library')}
        >
          Explore Practices
        </Button>
      </div>
      <p className="text-xs text-muted-foreground pt-8">{SHIROO_DISCLAIMER}</p>
    </div>
  );
}

export function PremiumSurfaceEmpty({ onStay }: { onStay?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-4 py-12 px-4">
      <h2 className="text-3xl font-bold text-foreground">Today&rsquo;s check-in stays free.</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Insights, journal history, and longer tracking live on Premium. Taste Journey keeps today&rsquo;s check-in.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          className="bg-wellness-sage hover:bg-wellness-sage/90 text-white"
          onClick={() => navigate("/upgrade")}
        >
          Continue with Premium
        </Button>
        {onStay && (
          <Button variant="outline" onClick={onStay}>
            Stay with today&rsquo;s check-in
          </Button>
        )}
      </div>
    </div>
  );
}
