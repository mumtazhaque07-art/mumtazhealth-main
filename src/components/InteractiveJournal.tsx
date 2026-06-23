import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BookOpen, Sparkles } from "lucide-react";

interface InteractiveJournalProps {
  contentTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveJournal: React.FC<InteractiveJournalProps> = ({ contentTitle, isOpen, onClose }) => {
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!reflection.trim()) {
      toast.error("Please write a reflection before saving.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate saving to backend - in reality this would go to a user_journal_entries table
    setTimeout(() => {
      toast.success("Your reflection has been logged securely in your private journal.");
      setReflection('');
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-wellness-sage/30 bg-gradient-to-br from-white to-wellness-sand/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-serif text-gray-900">
            <BookOpen className="h-6 w-6 text-primary" />
            Log Your Journey
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-gray-600">
            Take a moment to reflect on your practice of <span className="font-semibold text-primary">{contentTitle}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="bg-wellness-sage/10 p-4 rounded-xl border border-wellness-sage/20 relative overflow-hidden">
            <Sparkles className="absolute -top-2 -right-2 h-12 w-12 text-wellness-sage/20" />
            <p className="text-sm font-semibold text-gray-800 mb-2">Guided Prompt:</p>
            <p className="text-sm text-gray-700 italic">"How does your body feel right now? Did you notice any shifts in your energy, or any specific areas of resistance that softened during this practice?"</p>
          </div>
          
          <Textarea 
            placeholder="Take a deep breath and write whatever comes to mind..." 
            className="min-h-[160px] resize-none focus-visible:ring-primary border-gray-200 bg-white shadow-sm rounded-xl p-4 text-base"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={onClose} className="rounded-full border-gray-300">Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
            {isSubmitting ? "Saving..." : "Save to My Journal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
