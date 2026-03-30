import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CreditCard, Lock } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceTitle: string;
  priceAmount: number;
  currency: string;
}

export const PaymentModal = ({ isOpen, onClose, onConfirm, serviceTitle, priceAmount, currency }: PaymentModalProps) => {
  const stripeEnabled = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-wellness-sage" />
            Complete Booking
          </DialogTitle>
          <DialogDescription>
            You are booking: {serviceTitle} for {currency === 'GBP' ? '£' : ''}{priceAmount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          {!stripeEnabled ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Stripe Not Configured</p>
                <p className="opacity-90 leading-relaxed">
                  To accept live payments, the platform requires integration with Stripe. 
                  Please supply a <strong>VITE_STRIPE_PUBLISHABLE_KEY</strong> in your environment variables.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full">
              {/* Future Stripe Elements Provider goes here */}
              <div className="h-40 border border-dashed border-muted-foreground/30 rounded-xl flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-2">
                  <Lock className="w-6 h-6 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium text-muted-foreground">Secure Stripe Checkout Loading...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-wellness-sage hover:bg-wellness-sage/90 text-white rounded-xl"
          >
            {stripeEnabled ? "Pay Securely" : "Submit Request (Pay Later)"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
