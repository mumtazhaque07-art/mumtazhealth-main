import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCog, FlaskConical, X, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function PersonaSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [lifeStage, setLifeStage] = useState<string>("not_sure");
  const [spiritualPreference, setSpiritualPreference] = useState<string>("universal");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if admin mode is enabled in local storage
    const checkAdminMode = () => {
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const storedAdmin = localStorage.getItem('mumtaz_dev_mode') === 'true';
      setIsAdminMode(isDev || storedAdmin);
    };
    
    checkAdminMode();
    window.addEventListener('storage', checkAdminMode);
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("user_wellness_profiles")
          .select("life_stage, spiritual_preference")
          .eq("user_id", user.id)
          .single();
          
        if (data) {
          if (data.life_stage) setLifeStage(data.life_stage);
          if (data.spiritual_preference) setSpiritualPreference(data.spiritual_preference);
        }
      }
    };
    
    fetchUser();
    
    return () => window.removeEventListener('storage', checkAdminMode);
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_wellness_profiles")
        .update({
          life_stage: lifeStage,
          spiritual_preference: spiritualPreference
        })
        .eq("user_id", userId);

      if (error) throw error;
      
      toast.success("Persona Updated!", { 
        description: "Refreshing to apply changes..." 
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (e) {
      console.error(e);
      toast.error("Failed to update persona");
    } finally {
      setSaving(false);
      setIsOpen(false);
    }
  };

  // Only render if in admin/dev mode
  if (!isAdminMode) return null;

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 left-6 z-50 rounded-full h-12 w-12 shadow-xl border-dashed border-2 border-primary bg-background/80 backdrop-blur-md"
        onClick={() => setIsOpen(true)}
      >
        <FlaskConical className="h-6 w-6 text-primary" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 left-6 z-50 w-80 shadow-2xl border-primary/50 animate-in slide-in-from-bottom-5">
      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCog className="h-5 w-5 text-primary" />
              Persona Switcher
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Dev Tools: Test the app as different users.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="-mt-2 -mr-2" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Life Stage</Label>
          <Select value={lifeStage} onValueChange={setLifeStage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menstrual_cycle">Cyclical</SelectItem>
              <SelectItem value="pregnancy">Pregnant</SelectItem>
              <SelectItem value="postpartum">Postpartum</SelectItem>
              <SelectItem value="perimenopause">Perimenopause</SelectItem>
              <SelectItem value="menopause">Menopause</SelectItem>
              <SelectItem value="not_sure">Not Sure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Spiritual Preference</Label>
          <Select value={spiritualPreference} onValueChange={setSpiritualPreference}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="islamic">Islamic</SelectItem>
              <SelectItem value="universal">Universal</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-yellow-500/10 p-2 rounded flex items-start gap-2 text-xs border border-yellow-500/20 text-yellow-800 dark:text-yellow-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>Saving will instantly reload the page to clear caches and apply the new persona filters.</p>
        </div>

        <Button 
          className="w-full" 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? "Deploying Persona..." : "Switch Persona"}
        </Button>
      </CardContent>
    </Card>
  );
}
