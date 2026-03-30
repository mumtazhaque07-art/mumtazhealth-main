import React, { useState, useEffect } from "react";
import { GhostLogCache } from "@/utils/GhostLogCache";
import { X, CloudFog, Sun, Download, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function MorningReviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [peacePulse, setPeacePulse] = useState(50); // 0 (Stormy) to 100 (Still)
  
  useEffect(() => {
    const checkMorningTrigger = () => {
      const hour = new Date().getHours();
      // Between 07:00 and 12:00
      if (hour >= 7 && hour < 12 && GhostLogCache.hasPendingLogs()) {
        const hasSeenToday = localStorage.getItem(`morning_review_${new Date().toDateString()}`);
        if (!hasSeenToday) {
           setIsOpen(true);
        }
      }
    };
    checkMorningTrigger();
    
    // For testing/demo purposes, expose a global method to open it
    (window as any).triggerMorningReview = () => setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  const handleClear = () => {
    GhostLogCache.clearLogs();
    closeModal();
  };

  const handleKeep = async () => {
    try {
      const logs = GhostLogCache.getLogs();
      const { data: { user } } = await supabase.auth.getUser();

      if (user && logs.length > 0) {
        const entriesToInsert = logs.map(log => ({
          user_id: user.id,
          entry_date: new Date(log.timestamp).toISOString().split('T')[0],
          emotional_state: log.emotions && log.emotions.length > 0 ? log.emotions[0] : 'neutral',
          physical_symptoms: log.symptoms.join(', '),
          monthly_reflection: `Night log (Peace Pulse: ${peacePulse}): ${log.notes || ''}`
        }));
        
        const { error } = await supabase.from("wellness_entries").insert(entriesToInsert);
        
        if (error) {
           console.error("Failed to sync night logs", error);
           toast.error("Failed to permanently save night logs.");
        } else {
           toast.success("Morning review complete. Night logs saved to your journey.");
        }
      } else if (!user) {
        toast.info("Night logs cleared. (Sign in to save them next time)");
      } else {
        toast.success("Morning review complete.");
      }
    } catch (err) {
      console.error(err);
    }
    
    GhostLogCache.clearLogs();
    closeModal();
  };

  const closeModal = () => {
    localStorage.setItem(`morning_review_${new Date().toDateString()}`, "true");
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
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-background rounded-full flex items-center justify-center shadow-lg">
           <Sun className="w-10 h-10 text-amber-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mt-8 mb-2 font-accent text-foreground">A New Morning</h2>
        <p className="text-center text-muted-foreground text-sm mb-8 leading-relaxed">
          You made some notes during the night. The light is here now. 
        </p>

        <div className="mb-8 p-6 bg-muted/30 rounded-3xl border border-border">
          <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
            <span className="flex items-center gap-1"><CloudFog className="w-4 h-4" /> Stormy</span>
            <span className="flex items-center gap-1">Still <Sun className="w-4 h-4" /></span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={peacePulse} 
            onChange={(e) => setPeacePulse(parseInt(e.target.value))}
            className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary border border-border/50"
            style={{ accentColor: "hsl(var(--primary))" }}
          />
          <p className="text-center text-xs mt-4 font-bold tracking-widest uppercase text-muted-foreground">The Peace Pulse</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={handleClear}
            className="h-14 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive shadow-sm"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear Space
          </Button>
          <Button 
            onClick={handleKeep}
            className="h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <Download className="w-5 h-5 mr-2" />
            Keep History
          </Button>
        </div>
      </div>
    </div>
  );
}
