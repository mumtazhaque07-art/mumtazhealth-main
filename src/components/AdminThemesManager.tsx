import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Calendar, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminThemesManager() {
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState<any[]>([]);
  
  // Form State
  const [stageId, setStageId] = useState("all");
  const [monthYear, setMonthYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posture, setPosture] = useState("");
  const [recipe, setRecipe] = useState("");
  
  useEffect(() => {
    // Set default month/year
    const d = new Date();
    const month = d.toLocaleString('default', { month: 'long' });
    setMonthYear(`${month} ${d.getFullYear()}`);
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from("monthly_themes" as any)
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching themes:", error);
      } else {
        setThemes(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTheme = async () => {
    if (!title || !description || !posture || !recipe) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      // Deactivate any existing active theme for this stage
      await supabase
        .from("monthly_themes" as any)
        .update({ is_active: false })
        .eq("stage_id", stageId)
        .eq("is_active", true);

      // Insert new theme
      const { error } = await supabase
        .from("monthly_themes" as any)
        .insert({
          stage_id: stageId,
          month_year: monthYear,
          title,
          description,
          posture,
          recipe,
          is_active: true
        });

      if (error) throw error;
      
      toast.success("Monthly Theme published successfully!");
      fetchThemes();
      
      // Reset some fields
      setTitle("");
      setDescription("");
      setPosture("");
      setRecipe("");
    } catch (err) {
      console.error("Failed to save theme:", err);
      toast.error("Failed to save theme. Ensure database migrations have been run in Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white w-full h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        <div>
          <h2 className="text-2xl font-serif text-slate-800 mb-2">Monthly Themes Manager</h2>
          <p className="text-slate-500">Update the dynamic content that appears in the Content Library.</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6 shadow-sm">
          <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Plus className="w-5 h-5 text-primary" /> Create New Theme
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Target Stage</Label>
              <Select value={stageId} onValueChange={setStageId}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages (Default)</SelectItem>
                  <SelectItem value="stage1">Stage 1: Cycle Health</SelectItem>
                  <SelectItem value="stage2">Stage 2: Fertility</SelectItem>
                  <SelectItem value="stage3">Stage 3: Pregnancy</SelectItem>
                  <SelectItem value="stage4">Stage 4: Postpartum</SelectItem>
                  <SelectItem value="stage5">Stage 5: Perimenopause</SelectItem>
                  <SelectItem value="stage6">Stage 6: Menopause</SelectItem>
                  <SelectItem value="stage7">Stage 7: Wise Woman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Month & Year</Label>
              <Input value={monthYear} onChange={e => setMonthYear(e.target.value)} className="bg-white" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Title</Label>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. The Season of Letting Go" 
                className="bg-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Theme Description</Label>
              <Textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="A short inspiring paragraph describing this month's focus..." 
                className="bg-white min-h-[100px]" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Featured Posture</Label>
                <Input 
                  value={posture} 
                  onChange={e => setPosture(e.target.value)} 
                  placeholder="e.g. Supta Baddha Konasana (Reclined Bound Angle)" 
                  className="bg-white" 
                />
              </div>
              <div className="space-y-2">
                <Label>Featured Recipe</Label>
                <Input 
                  value={recipe} 
                  onChange={e => setRecipe(e.target.value)} 
                  placeholder="e.g. Golden Turmeric Milk" 
                  className="bg-white" 
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSaveTheme} 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            Publish Monthly Theme
          </Button>
        </div>

        {/* Existing Themes List */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-200 pb-2">Active Themes History</h3>
          <div className="space-y-4">
            {themes.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No themes found. Have you run the database migration?</p>
            ) : (
              themes.map((theme) => (
                <div key={theme.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {theme.stage_id === 'all' ? 'All Stages' : theme.stage_id}
                      </span>
                      {theme.is_active && (
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-slate-900">{theme.title}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> {theme.month_year}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>Posture: {theme.posture}</p>
                    <p>Recipe: {theme.recipe}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
