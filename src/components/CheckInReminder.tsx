import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CheckInReminder() {
  const [isVisible, setIsVisible] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  useEffect(() => {
    checkLastCheckIn();
  }, []);

  const checkLastCheckIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('wellness_entries')
      .select('entry_date')
      .eq('user_id', user.id)
      .eq('entry_date', today)
      .maybeSingle();

    if (!data) {
      // No entry today, show reminder
      const dismissedToday = localStorage.getItem(`reminder_dismissed_${today}`);
      if (!dismissedToday) {
        setIsVisible(true);
      }
    }
  };

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`reminder_dismissed_${today}`, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-6 bg-wellness-lilac/10 border-wellness-lilac/30 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-wellness-lilac/20 text-wellness-lilac">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-semibold text-wellness-taupe">Daily Check-In</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your body is communicating with you every day. Take a moment to record how you're feeling and stay connected to your rhythm.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-xs text-muted-foreground hover:text-wellness-taupe"
                onClick={handleDismiss}
              >
                Maybe later
              </Button>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
