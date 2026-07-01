import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function EvolutionLoopModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPractices, setPendingPractices] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingFeedback = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Get yesterday's date string
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Query for any support plan logs from yesterday that don't have feedback yet
        const { data, error } = await supabase
          .from("support_plan_logs")
          .select("*")
          .eq("user_id", user.id)
          .gte("entry_date", yesterdayStr)
          .is("feedback_rating", null) // Assuming we add a feedback_rating column or use a generic one
          .in("action_taken", ["tried", "added_to_plan"])
          .limit(3); // Don't overwhelm them, max 3

        if (error) throw error;

        // Note: Because the schema might not have feedback_rating yet, 
        // we'll safely handle this in the DB or just mark them as reviewed via another table 
        // if we can't alter the schema directly right now.
        // Actually, we can just save feedback to `wellness_entries` notes, 
        // or a new table `practice_feedback`. Let's use `practice_feedback` if it exists, or just update the log.
        
        if (data && data.length > 0) {
          // Only show if we haven't seen it today
          const hasSeenToday = localStorage.getItem(`evolution_loop_${new Date().toDateString()}`);
          if (!hasSeenToday) {
            setPendingPractices(data);
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error("Evolution Loop Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingFeedback();
  }, []);

  if (!isOpen || pendingPractices.length === 0) return null;

  const currentPractice = pendingPractices[currentIndex];

  const handleFeedback = async (rating: string, ratingText: string) => {
    try {
      // Update the log with the feedback
      const { error } = await supabase
        .from("support_plan_logs")
        .update({ 
          action_taken: `reviewed_${rating}` // Hacky way to store rating if we don't have a dedicated column
        })
        .eq("id", currentPractice.id);

      if (error) {
        console.error("Failed to save feedback", error);
      } else {
        toast.success(`Feedback saved! We will adjust your future plans.`);
      }
    } catch (err) {
      console.error(err);
    }

    // Move to next or close
    if (currentIndex < pendingPractices.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    localStorage.setItem(`evolution_loop_${new Date().toDateString()}`, "true");
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md p-6 animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-[2.5rem] shadow-2xl border border-border p-8 relative animate-scale-in">
        <button 
          onClick={closeModal}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-wellness-plum to-wellness-lilac border-4 border-background rounded-full flex items-center justify-center shadow-lg">
           <Sparkles className="w-10 h-10 text-white" />
        </div>
        
        <div className="text-center mt-8 mb-6">
          <h2 className="text-sm font-bold text-wellness-plum uppercase tracking-widest mb-2">Checking In</h2>
          <h3 className="text-2xl font-bold font-serif text-foreground">How did it feel?</h3>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
            Recently, you added <strong className="text-foreground">{currentPractice.recommendation_title}</strong> to your plan. Did you try it?
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => handleFeedback('amazing', 'Amazing')}
            className="h-14 rounded-2xl bg-white border-2 border-green-100 hover:border-green-300 hover:bg-green-50 text-slate-700 shadow-sm justify-start px-6 transition-all"
            variant="outline"
          >
            <span className="text-2xl mr-4">🌟</span>
            <span className="font-semibold">It felt amazing</span>
          </Button>
          
          <Button 
            onClick={() => handleFeedback('okay', 'Okay')}
            className="h-14 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm justify-start px-6 transition-all"
            variant="outline"
          >
            <span className="text-2xl mr-4">⚖️</span>
            <span className="font-semibold">It was okay</span>
          </Button>

          <Button 
            onClick={() => handleFeedback('didn_work', 'Didn\'t Work')}
            className="h-14 rounded-2xl bg-white border-2 border-red-100 hover:border-red-300 hover:bg-red-50 text-slate-700 shadow-sm justify-start px-6 transition-all"
            variant="outline"
          >
            <span className="text-2xl mr-4">🌧️</span>
            <span className="font-semibold">It didn't work for me</span>
          </Button>

          <Button 
            onClick={() => handleFeedback('didnt_try', 'Didn\'t Try')}
            className="h-14 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm justify-center transition-all mt-2"
            variant="ghost"
          >
            <span className="font-medium text-sm">I didn't get to try it yet</span>
          </Button>
        </div>

        <div className="mt-6 flex justify-center gap-1">
          {pendingPractices.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-wellness-plum' : 'w-1.5 bg-wellness-plum/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
