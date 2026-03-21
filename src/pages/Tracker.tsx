import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { wellnessEntrySchema, validateInput, truncateText } from "@/lib/validation";
import { LogOut, Save, Trash2, UserCog, BarChart3, Plus, X, Calendar, BookOpen, Sparkles, Settings, Menu, Info, Baby, HelpCircle, Flower2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Navigation } from "@/components/Navigation";
import { CyclePhaseHelper } from "@/components/CyclePhaseHelper";
import { CyclePhaseEducation } from "@/components/CyclePhaseEducation";
import { MenopauseEducation } from "@/components/MenopauseEducation";
import { PregnancyEducation } from "@/components/PregnancyEducation";
import { PostpartumEducation } from "@/components/PostpartumEducation";
import { PostBirthSupportEducation } from "@/components/PostBirthSupportEducation";
import { DailyRhythm } from "@/components/DailyRhythm";
import { BodyChangingEducation } from "@/components/BodyChangingEducation";
import { AppCompanionDisclaimer } from "@/components/AppCompanionDisclaimer";
import { SupportPlanModal } from "@/components/SupportPlan";
import { GentleSignInPrompt } from "@/components/GentleSignInPrompt";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { CheckInReminder } from "@/components/CheckInReminder";

interface DailyPractice {
  id: string;
  label: string;
  type: 'checkbox' | 'time' | 'number' | 'text';
  status?: boolean;
  detail?: string;
  notes?: string;
}

const DAILY_PRACTICES_BASE: DailyPractice[] = [
  { id: 'wake', label: 'Early Wake Up', type: 'time' },
  { id: 'water', label: 'Warm Water/Tea', type: 'checkbox' },
  { id: 'abhyanga', label: 'Abhyanga (Self-Massage)', type: 'checkbox' },
  { id: 'breakfast', label: 'Warm/Oily Meal', type: 'text' },
  { id: 'break', label: 'Mid-Day Break', type: 'checkbox' },
  { id: 'hydration', label: 'Warm Hydration Check', type: 'checkbox' },
  { id: 'tawakkul', label: 'Tawakkul Anchor', type: 'checkbox' },
  { id: 'breathing', label: 'Vata-Calming Breathing', type: 'checkbox' },
  { id: 'curfew', label: 'Device Curfew', type: 'checkbox' },
  { id: 'milk', label: 'Shukra Milk Tonic', type: 'checkbox' },
  { id: 'sleep', label: 'Total Sleep Achieved', type: 'number' },
];

const MENSTRUAL_ADJUSTMENTS = {
  'abhyanga': 'Passive Oil Application (Pelvic Area Only)',
  'breathing': 'Gentle Restorative Pranayama',
  'wake': 'Wake at Natural Time (REST)',
  'milk': 'Warm Broth/Ginger Tea (No Milk)',
};

export default function Tracker() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [cyclePhase, setCyclePhase] = useState('');
  const [isMenstrual, setIsMenstrual] = useState(false);
  const [lifeStage, setLifeStage] = useState<string>('');
  const [trimester, setTrimester] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [showCycleHelper, setShowCycleHelper] = useState(false);
  const [isMenarcheJourney, setIsMenarcheJourney] = useState(false);
  
  // Red Day Protocol fields
  const [painLevel, setPainLevel] = useState('');
  const [emotionalScore, setEmotionalScore] = useState('');
  const [spiritualAnchor, setSpiritualAnchor] = useState('Istighfar');
  
  // Symptom fields
  const [emotionalState, setEmotionalState] = useState('');
  const [physicalSymptoms, setPhysicalSymptoms] = useState('');
  const [vataCrash, setVataCrash] = useState('No');
  const [tweakPlan, setTweakPlan] = useState('');
  const [monthlyReflection, setMonthlyReflection] = useState('');
  
  // Daily practices state
  const [practices, setPractices] = useState<Record<string, any>>({});
  
  // Yoga practice fields
  const [yogaStyle, setYogaStyle] = useState('');
  const [yogaDuration, setYogaDuration] = useState('');
  const [yogaPoses, setYogaPoses] = useState('');
  
  // Nutrition fields
  const [meals, setMeals] = useState<Array<{name: string, time: string, doshaNotes: string}>>([]);
  
  // Spiritual practice fields
  const [fajr, setFajr] = useState(false);
  const [dhuhr, setDhuhr] = useState(false);
  const [asr, setAsr] = useState(false);
  const [maghrib, setMaghrib] = useState(false);
  const [isha, setIsha] = useState(false);
  const [mantras, setMantras] = useState('');
  const [meditationMinutes, setMeditationMinutes] = useState('');
  
  // Pregnancy tracking fields
  const [pregnancyNausea, setPregnancyNausea] = useState('');
  const [pregnancyFatigue, setPregnancyFatigue] = useState('');
  const [pregnancySleep, setPregnancySleep] = useState('');
  const [pregnancyMood, setPregnancyMood] = useState('');
  const [pregnancyBackPain, setPregnancyBackPain] = useState('');
  const [pregnancyDigestion, setPregnancyDigestion] = useState('');
  const [pregnancyBabyMovement, setPregnancyBabyMovement] = useState('');
  const [pregnancyNotes, setPregnancyNotes] = useState('');
  
  // Postpartum tracking fields
  const [postpartumSleep, setPostpartumSleep] = useState('');
  const [postpartumMood, setPostpartumMood] = useState('');
  const [postpartumEnergy, setPostpartumEnergy] = useState('');
  const [postpartumPain, setPostpartumPain] = useState('');
  const [postpartumFeeding, setPostpartumFeeding] = useState('');
  const [postpartumNotes, setPostpartumNotes] = useState('');
  
  // Menopause tracking fields
  const [menopauseHotFlashes, setMenopauseHotFlashes] = useState('');
  const [menopauseNightSweats, setMenopauseNightSweats] = useState('');
  const [menopauseMood, setMenopauseMood] = useState('');
  const [menopauseBrainFog, setMenopauseBrainFog] = useState('');
  const [menopauseEnergy, setMenopauseEnergy] = useState('');
  const [menopauseSleep, setMenopauseSleep] = useState('');
  const [menopauseJointPain, setMenopauseJointPain] = useState('');
  const [menopauseDigestion, setMenopauseDigestion] = useState('');
  
  // Support Plan modal state
  const [showSupportPlan, setShowSupportPlan] = useState(false);
  const [userDosha, setUserDosha] = useState<string | undefined>();
  
  const navigate = useNavigate();

  // Sign-in prompt state
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      checkAdminRole();
      checkOnboarding();
      loadData();
    }
  }, [user, selectedDate]);

  const checkOnboarding = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_wellness_profiles')
      .select('onboarding_completed, life_stage, primary_dosha, due_date, is_menarche_journey')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking onboarding:', error);
      return;
    }
    
    // Set life stage and dosha if available
    if (data?.life_stage) {
      setLifeStage(data.life_stage);
    }
    if (data?.primary_dosha) {
      setUserDosha(data.primary_dosha);
    }
    if (data?.due_date) {
      setDueDate(data.due_date);
    }
    if (data?.is_menarche_journey) {
      setIsMenarcheJourney(data.is_menarche_journey);
    }
    
    // If no profile exists or onboarding not completed, redirect to onboarding
    if (!data || !data.onboarding_completed) {
      navigate('/onboarding');
    }
  };

  const getTrackerTitle = () => {
    switch (lifeStage) {
      case 'menstrual_cycle':
        return 'Menstrual Cycle Tracker';
      case 'pregnancy':
        return trimester ? `Pregnancy Tracker (Trimester ${trimester})` : 'Pregnancy Tracker';
      case 'postpartum':
        return 'Postpartum Tracker';
      case 'perimenopause':
        return 'Perimenopause Tracker';
      case 'menopause':
        return 'Menopause Tracker';
      case 'post_menopause':
        return 'Post-Menopause Tracker';
      default:
        return 'Holistic Motherhood Tracker';
    }
  };

  useEffect(() => {
    setIsMenstrual(cyclePhase === 'Menstrual');
  }, [cyclePhase]);

  // Calculate exact pregnancy week and trimester based on due date
  useEffect(() => {
    if (lifeStage === 'pregnancy' && dueDate) {
      const due = new Date(dueDate);
      const today = new Date(selectedDate);
      
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const daysAlong = 280 - diffDays;
      const weeksAlong = Math.floor(daysAlong / 7);
      
      if (weeksAlong >= 0 && weeksAlong <= 42) {
        setCurrentWeek(weeksAlong);
        
        let calculatedTrimester = "";
        if (weeksAlong >= 1 && weeksAlong <= 13) calculatedTrimester = "1";
        else if (weeksAlong >= 14 && weeksAlong <= 27) calculatedTrimester = "2";
        else if (weeksAlong >= 28) calculatedTrimester = "3";
        
        setTrimester(calculatedTrimester);
      }
    }
  }, [dueDate, selectedDate, lifeStage]);

  const checkAdminRole = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    
    setIsAdmin(!!data);
  };

  const loadData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('wellness_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', selectedDate)
      .maybeSingle();
    
    if (error) {
      console.error('Error loading data:', error);
      return;
    }
    
    if (data) {
      setCyclePhase(data.cycle_phase || '');
      setTrimester(data.trimester?.toString() || '');
      setPainLevel(data.pain_level?.toString() || '');
      setEmotionalScore(data.emotional_score?.toString() || '');
      setSpiritualAnchor(data.spiritual_anchor || 'Istighfar');
      setEmotionalState(data.emotional_state || '');
      setPhysicalSymptoms(data.physical_symptoms || '');
      setVataCrash(data.vata_crash || 'No');
      setTweakPlan(data.tweak_plan || '');
      setMonthlyReflection(data.monthly_reflection || '');
      setPractices(typeof data.daily_practices === 'object' && data.daily_practices !== null ? data.daily_practices as Record<string, any> : {});
      
      const pregnancyData = typeof data.pregnancy_tracking === 'object' && data.pregnancy_tracking !== null ? data.pregnancy_tracking as Record<string, any> : {};
      setPregnancyNausea(pregnancyData.nausea || '');
      setPregnancyFatigue(pregnancyData.fatigue || '');
      setPregnancySleep(pregnancyData.sleep || '');
      setPregnancyMood(pregnancyData.mood || '');
      setPregnancyBackPain(pregnancyData.backPain || '');
      setPregnancyDigestion(pregnancyData.digestion || '');
      setPregnancyBabyMovement(pregnancyData.babyMovement || '');
      setPregnancyNotes(pregnancyData.notes || '');
      
      const postpartumData = typeof data.postpartum_tracking === 'object' && data.postpartum_tracking !== null ? data.postpartum_tracking as Record<string, any> : {};
      setPostpartumSleep(postpartumData.sleep || '');
      setPostpartumMood(postpartumData.mood || '');
      setPostpartumEnergy(postpartumData.energy || '');
      setPostpartumPain(postpartumData.pain || '');
      setPostpartumFeeding(postpartumData.feeding || '');
      setPostpartumNotes(postpartumData.notes || '');
      
      const menopauseData = typeof data.menopause_tracking === 'object' && data.menopause_tracking !== null ? data.menopause_tracking as Record<string, any> : {};
      setMenopauseHotFlashes(menopauseData.hotFlashes || '');
      setMenopauseNightSweats(menopauseData.nightSweats || '');
      setMenopauseMood(menopauseData.mood || '');
      setMenopauseBrainFog(menopauseData.brainFog || '');
      setMenopauseEnergy(menopauseData.energy || '');
      setMenopauseSleep(menopauseData.sleep || '');
      setMenopauseJointPain(menopauseData.jointPain || '');
      setMenopauseDigestion(menopauseData.digestion || '');
      
      const yogaData = typeof data.yoga_practice === 'object' && data.yoga_practice !== null ? data.yoga_practice as Record<string, any> : {};
      setYogaStyle(yogaData.style || '');
      setYogaDuration(yogaData.duration || '');
      setYogaPoses(yogaData.poses || '');
      
      const nutritionData = typeof data.nutrition_log === 'object' && data.nutrition_log !== null ? data.nutrition_log as Record<string, any> : {};
      setMeals(Array.isArray(nutritionData.meals) ? nutritionData.meals : []);
      
      const spiritualData = typeof data.spiritual_practices === 'object' && data.spiritual_practices !== null ? data.spiritual_practices as Record<string, any> : {};
      setFajr(spiritualData.fajr || false);
      setDhuhr(spiritualData.dhuhr || false);
      setAsr(spiritualData.asr || false);
      setMaghrib(spiritualData.maghrib || false);
      setIsha(spiritualData.isha || false);
      setMantras(spiritualData.mantras || '');
      setMeditationMinutes(spiritualData.meditationMinutes || '');
    } else {
      setCyclePhase('');
      setTrimester('');
      setPainLevel('');
      setEmotionalScore('');
      setSpiritualAnchor('Istighfar');
      setEmotionalState('');
      setPhysicalSymptoms('');
      setVataCrash('No');
      setTweakPlan('');
      setPractices({});
      setPregnancyNausea('');
      setPregnancyFatigue('');
      setPregnancySleep('');
      setPregnancyMood('');
      setPregnancyBackPain('');
      setPregnancyDigestion('');
      setPregnancyBabyMovement('');
      setPregnancyNotes('');
      setPostpartumSleep('');
      setPostpartumMood('');
      setPostpartumEnergy('');
      setPostpartumPain('');
      setPostpartumFeeding('');
      setPostpartumNotes('');
      setMenopauseHotFlashes('');
      setMenopauseNightSweats('');
      setMenopauseMood('');
      setMenopauseBrainFog('');
      setMenopauseEnergy('');
      setMenopauseSleep('');
      setMenopauseJointPain('');
      setMenopauseDigestion('');
      setYogaStyle('');
      setYogaDuration('');
      setYogaPoses('');
      setMeals([]);
      setFajr(false);
      setDhuhr(false);
      setAsr(false);
      setMaghrib(false);
      setIsha(false);
      setMantras('');
      setMeditationMinutes('');
      setMonthlyReflection('');
    }
  };

  const saveData = async () => {
    if (!user) {
      setShowSignInPrompt(true);
      return;
    }
    
    try {
      const validation = validateInput(wellnessEntrySchema, {
        emotional_state: emotionalState || null,
        physical_symptoms: physicalSymptoms || null,
        spiritual_anchor: spiritualAnchor || null,
        vata_crash: vataCrash || null,
        tweak_plan: tweakPlan || null,
        monthly_reflection: monthlyReflection || null,
        pain_level: painLevel ? parseInt(painLevel) : null,
        emotional_score: emotionalScore ? parseInt(emotionalScore) : null,
        trimester: trimester ? parseInt(trimester) : null,
      });

      if (!validation.success) {
        toast.error((validation as { success: false; error: string }).error);
        return;
      }

      const validatedData = validation.data;

      const entryData = {
        user_id: user.id,
        entry_date: selectedDate,
        cycle_phase: truncateText(cyclePhase, 50),
        trimester: validatedData.trimester,
        pain_level: validatedData.pain_level,
        emotional_score: validatedData.emotional_score,
        spiritual_anchor: validatedData.spiritual_anchor,
        emotional_state: validatedData.emotional_state,
        physical_symptoms: validatedData.physical_symptoms,
        vata_crash: validatedData.vata_crash,
        tweak_plan: validatedData.tweak_plan,
        monthly_reflection: validatedData.monthly_reflection,
        daily_practices: practices,
        pregnancy_tracking: {
          nausea: truncateText(pregnancyNausea, 100),
          fatigue: truncateText(pregnancyFatigue, 100),
          sleep: truncateText(pregnancySleep, 100),
          mood: truncateText(pregnancyMood, 100),
          backPain: truncateText(pregnancyBackPain, 100),
          digestion: truncateText(pregnancyDigestion, 100),
          babyMovement: truncateText(pregnancyBabyMovement, 100),
          notes: truncateText(pregnancyNotes, 500),
        },
        postpartum_tracking: {
          sleep: truncateText(postpartumSleep, 100),
          mood: truncateText(postpartumMood, 100),
          energy: truncateText(postpartumEnergy, 100),
          pain: truncateText(postpartumPain, 100),
          feeding: truncateText(postpartumFeeding, 100),
          notes: truncateText(postpartumNotes, 500),
        },
        menopause_tracking: {
          hotFlashes: truncateText(menopauseHotFlashes, 100),
          nightSweats: truncateText(menopauseNightSweats, 100),
          mood: truncateText(menopauseMood, 100),
          brainFog: truncateText(menopauseBrainFog, 100),
          energy: truncateText(menopauseEnergy, 100),
          sleep: truncateText(menopauseSleep, 100),
          jointPain: truncateText(menopauseJointPain, 100),
          digestion: truncateText(menopauseDigestion, 100),
        },
        yoga_practice: {
          style: truncateText(yogaStyle, 100),
          duration: truncateText(yogaDuration, 50),
          poses: truncateText(yogaPoses, 500),
        },
        nutrition_log: {
          meals: meals.slice(0, 10).map(m => ({
            name: truncateText(m.name, 100),
            time: truncateText(m.time, 20),
            doshaNotes: truncateText(m.doshaNotes, 200),
          })),
        },
        spiritual_practices: {
          fajr: fajr,
          dhuhr: dhuhr,
          asr: asr,
          maghrib: maghrib,
          isha: isha,
          mantras: truncateText(mantras, 500),
          meditationMinutes: truncateText(meditationMinutes, 10),
        },
      };
      
      const { error } = await supabase
        .from('wellness_entries')
        .upsert(entryData, {
          onConflict: 'user_id,entry_date'
        });
      
      if (error) throw error;
      
      toast.success(`Progress saved!`);
      setShowSupportPlan(true);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Error saving data.');
    }
  };

  const clearData = async () => {
    if (!user) return;
    if (!window.confirm(`Clear data for ${selectedDate}?`)) return;
    
    try {
      const { error } = await supabase
        .from('wellness_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('entry_date', selectedDate);
      
      if (error) throw error;
      toast.success(`Cleared!`);
      loadData();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Error clearing data.');
    }
  };

  const getAdjustedPractices = (): DailyPractice[] => {
    if (!isMenstrual) return DAILY_PRACTICES_BASE;
    return DAILY_PRACTICES_BASE.map(practice => {
      const adjusted = MENSTRUAL_ADJUSTMENTS[practice.id as keyof typeof MENSTRUAL_ADJUSTMENTS];
      return adjusted ? { ...practice, label: adjusted } : practice;
    });
  };

  useGlobalLoading(loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-wellness-beige pt-24">
        <Navigation />
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <Card className="animate-pulse h-40 bg-wellness-warm" />
          <Card className="animate-pulse h-20 bg-wellness-warm" />
          <Card className="animate-pulse h-60 bg-wellness-warm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wellness-beige animate-fade-in pb-24 md:pb-0">
      <Navigation />
      
      <GentleSignInPrompt
        open={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        feature="track"
        returnPath="/tracker"
      />
      
      <div className="max-w-2xl mx-auto p-4 pt-24 space-y-6">
        <Card className="mb-6 bg-wellness-warm border-wellness-taupe/20 shadow-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-wellness-taupe mb-4">
              {getTrackerTitle()}
            </CardTitle>
            
            <div className="flex flex-col items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-[240px] justify-start text-left font-normal border-wellness-taupe/30 bg-white/50 hover:bg-white transition-all`}
                  >
                    <Calendar className="mr-2 h-4 w-4 text-wellness-sage" />
                    {selectedDate ? format(new Date(selectedDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate ? new Date(selectedDate) : undefined}
                    onSelect={(date) => date && setSelectedDate(date.toISOString().split('T')[0])}
                    initialFocus
                    className="rounded-md border border-wellness-taupe/20 bg-white shadow-xl"
                  />
                </PopoverContent>
              </Popover>

              {isAdmin && (
                <Button variant="outline" size="sm" asChild className="border-wellness-taupe/30 text-wellness-taupe">
                  <Link to="/admin"><Settings className="w-4 h-4 mr-2" />Admin</Link>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-6 border-wellness-sage/30 bg-wellness-sage/5">
          <CardContent className="py-3 flex items-start gap-3">
            <Info className="h-5 w-5 text-wellness-sage shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Practitioner's Guidance:</strong> This tracker provides wellness suggestions to help you flow with your natural rhythms. It is not medical advice.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="rhythm" className="space-y-6">
          <div className="sticky top-20 z-10 bg-wellness-beige/80 backdrop-blur-md py-4 -mx-4 px-4">
            <TabsList className="flex w-full overflow-x-auto bg-wellness-taupe/10 border border-wellness-taupe/20 h-auto p-1 scrollbar-hide">
              <TabsTrigger value="rhythm" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm">Daily Rhythm</TabsTrigger>
              <TabsTrigger value="journey" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm">My Journey</TabsTrigger>
              <TabsTrigger value="wellness" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm">Wellness Log</TabsTrigger>
              <TabsTrigger value="practices" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm">Practices</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="rhythm" className="space-y-6">
            <DailyRhythm lifeStage={lifeStage} />
            
            <Card className="border-wellness-taupe/20 shadow-sm overflow-hidden">
              <CardHeader className="bg-wellness-warm/30 border-b border-wellness-taupe/10">
                <CardTitle className="text-xl text-wellness-taupe flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-wellness-sage" />
                  Daily Dinacharya
                </CardTitle>
                <CardDescription>Flow with your body's natural clock</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {getAdjustedPractices().map((practice) => (
                  <div key={practice.id} className="flex flex-col gap-2 p-3 bg-wellness-warm/20 rounded-lg border border-wellness-taupe/5">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-wellness-taupe">{practice.label}</Label>
                      {practice.type === 'checkbox' && (
                        <Checkbox
                          checked={practices[practice.id]?.status || false}
                          onCheckedChange={(checked) => setPractices({
                            ...practices,
                            [practice.id]: { ...practices[practice.id], status: checked }
                          })}
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {(practice.type === 'time' || practice.type === 'checkbox') && (
                        <Input
                          type="time"
                          value={practices[practice.id]?.detail || ''}
                          onChange={(e) => setPractices({
                            ...practices,
                            [practice.id]: { ...practices[practice.id], detail: e.target.value }
                          })}
                          className="w-full sm:w-32 bg-white/50 text-xs"
                        />
                      )}
                      {practice.type === 'number' && (
                        <Input
                          type="number"
                          value={practices[practice.id]?.detail || ''}
                          onChange={(e) => setPractices({
                            ...practices,
                            [practice.id]: { ...practices[practice.id], detail: e.target.value }
                          })}
                          placeholder="Amount"
                          className="w-full sm:w-32 bg-white/50 text-xs"
                        />
                      )}
                      {practice.type === 'text' && (
                        <Input
                          type="text"
                          value={practices[practice.id]?.detail || ''}
                          onChange={(e) => setPractices({
                            ...practices,
                            [practice.id]: { ...practices[practice.id], detail: e.target.value }
                          })}
                          placeholder="Details..."
                          className="flex-1 bg-white/50 text-xs"
                        />
                      )}
                    </div>
                    <Input
                      type="text"
                      value={practices[practice.id]?.notes || ''}
                      onChange={(e) => setPractices({
                        ...practices,
                        [practice.id]: { ...practices[practice.id], notes: e.target.value }
                      })}
                      placeholder="Note how this felt..."
                      className="w-full bg-white/50 text-[10px] h-8 italic border-none"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journey" className="space-y-6">
            {lifeStage === 'menstrual_cycle' && (
              <Card className="border-wellness-sage/20 shadow-sm overflow-hidden">
                <CardHeader className="bg-wellness-sage/5 border-b border-wellness-sage/10">
                  <CardTitle className="text-xl text-wellness-taupe flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-wellness-sage" />
                    Cycle Phase Check-In
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {showCycleHelper ? (
                    <CyclePhaseHelper
                      onPhaseSelected={(phase) => {
                        setCyclePhase(phase);
                        setShowCycleHelper(false);
                      }}
                      onCancel={() => setShowCycleHelper(false)}
                    />
                  ) : (
                    <>
                      <div>
                        <Label className="text-wellness-taupe font-medium">Current Phase</Label>
                        <Select value={cyclePhase} onValueChange={(value) => {
                          if (value === "not_sure") setShowCycleHelper(true);
                          else setCyclePhase(value);
                        }}>
                          <SelectTrigger className="mt-2 border-wellness-sage/30 bg-white/50">
                            <SelectValue placeholder="Select phase" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Menstrual">Menstrual</SelectItem>
                            <SelectItem value="Follicular">Follicular</SelectItem>
                            <SelectItem value="Ovulatory">Ovulatory</SelectItem>
                            <SelectItem value="Luteal">Luteal</SelectItem>
                            <SelectItem value="not_sure">Not sure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {cyclePhase && (
                        <CyclePhaseEducation 
                          selectedPhase={cyclePhase} 
                          lifeStage={lifeStage} 
                          isMenarcheJourney={isMenarcheJourney}
                        />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {lifeStage === 'pregnancy' && (
              <Card className="bg-wellness-lilac/5 border-wellness-lilac/20 shadow-sm overflow-hidden">
                <CardHeader className="bg-wellness-lilac/10 border-b border-wellness-lilac/10">
                  <CardTitle className="text-xl text-wellness-taupe flex items-center gap-2">
                    <Baby className="h-5 w-5 text-wellness-lilac" />
                    Pregnancy Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                   {currentWeek !== null && (
                    <div className="bg-wellness-lilac/10 p-4 rounded-lg border border-wellness-lilac/20">
                      <p className="font-semibold text-wellness-taupe text-sm">Week {currentWeek}</p>
                    </div>
                  )}
                  {trimester && <PregnancyEducation trimester={trimester} week={currentWeek} />}
                </CardContent>
              </Card>
            )}

            {(lifeStage === 'perimenopause' || lifeStage === 'menopause' || lifeStage === 'post_menopause') && (
              <MenopauseEducation lifeStage={lifeStage as any} />
            )}
            
            {lifeStage === 'postpartum' && <PostpartumEducation />}
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <Card className="border-wellness-taupe/20 shadow-sm">
              <CardHeader><CardTitle className="text-xl text-wellness-taupe">Holistic Wellbeing</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Emotional Score (1-10)</Label>
                    <Input type="number" min="1" max="10" value={emotionalScore} onChange={(e) => setEmotionalScore(e.target.value)} className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Physical Comfort (1-10)</Label>
                    <Input type="number" min="1" max="10" value={painLevel} onChange={(e) => setPainLevel(e.target.value)} className="bg-white/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="text-xs">Vata Energy Crash?</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-wellness-sage" /></TooltipTrigger>
                        <TooltipContent><p className="max-w-xs text-xs">Vata crash: sudden depletion or anxiety.</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={vataCrash} onValueChange={setVataCrash}>
                    <SelectTrigger className="bg-white/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Daily Reflections</Label>
                  <Textarea value={emotionalState} onChange={(e) => setEmotionalState(e.target.value)} placeholder="Feelings..." className="min-h-[100px] bg-white/50 text-sm" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practices" className="space-y-6">
             <Card className="border-wellness-taupe/20 shadow-sm overflow-hidden text-sm">
                <CardHeader className="bg-wellness-taupe/5 border-b border-wellness-taupe/10">
                  <CardTitle className="text-lg text-wellness-taupe">Spiritual Anchor</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-5 gap-2">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
                      const key = p.toLowerCase() as any;
                      const val = { fajr, dhuhr, asr, maghrib, isha }[key];
                      const setters = { fajr: setFajr, dhuhr: setDhuhr, asr: setAsr, maghrib: setMaghrib, isha: setIsha } as any;
                      return (
                        <button key={p} onClick={() => setters[key](!val)} className={`flex flex-col items-center gap-1 p-2 rounded border ${val ? 'bg-wellness-sage/20 border-wellness-sage' : 'bg-white/50'}`}>
                          <div className={`h-2 w-2 rounded-full ${val ? 'bg-wellness-sage' : 'bg-gray-200'}`} />
                          <span className="text-[10px]">{p}</span>
                        </button>
                      );
                    })}
                  </div>
                  <Textarea value={mantras} onChange={(e) => setMantras(e.target.value)} placeholder="Dhikr..." className="bg-white/50" />
                </CardContent>
             </Card>

             <Card className="border-wellness-taupe/20 shadow-sm">
                <CardHeader><CardTitle className="text-xl text-wellness-taupe">Physical Practice</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input value={yogaStyle} onChange={(e) => setYogaStyle(e.target.value)} placeholder="Style" className="bg-white/50" />
                  <Input value={yogaDuration} onChange={(e) => setYogaDuration(e.target.value)} placeholder="Duration" className="bg-white/50" />
                  <Textarea value={yogaPoses} onChange={(e) => setYogaPoses(e.target.value)} placeholder="Notes..." className="bg-white/50" />
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

        {user && (
          <SupportPlanModal
            open={showSupportPlan}
            onOpenChange={setShowSupportPlan}
            userId={user.id}
            entryDate={selectedDate}
            lifeStage={lifeStage}
            symptoms={[emotionalState, physicalSymptoms, vataCrash === 'Yes' ? 'Vata Crash' : ''].filter(Boolean)}
            dosha={userDosha}
          />
        )}

        <AppCompanionDisclaimer variant="subtle" className="pt-8 pb-32 text-center" />
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur-lg border-t z-30 flex justify-center">
        <div className="max-w-2xl w-full flex gap-3">
          <Button variant="ghost" className="flex-1 h-12" onClick={clearData}><Trash2 className="w-4 h-4 mr-2" />Clear</Button>
          <Button className="flex-[2] h-12 bg-wellness-sage hover:bg-wellness-sage/90 text-white font-bold" onClick={saveData}><Save className="w-5 h-5 mr-2" />Save</Button>
        </div>
      </div>
    </div>
  );
}
