import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
import { LogOut, Save, Trash2, UserCog, BarChart3, Plus, X, Calendar, BookOpen, Sparkles, Settings, Menu, Info, Baby, HelpCircle, Flower2, Activity, ArrowUp, ArrowDown, Sun, Moon, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useFiqhStatus } from "@/hooks/useFiqhStatus";
import { FiqhCycleStatus } from "@/components/FiqhCycleStatus";
import { CheckInReminder } from "@/components/CheckInReminder";
import { useLifeMap } from "@/contexts/LifeMapContext";
import { LifeStage } from "@/types/lifemap";
import { Wind, Droplets } from "lucide-react";
import { VoiceInput } from "@/components/VoiceInput";

const AyurvedicTooltip = ({ term }: { term: string }) => {
  const dictionary: Record<string, string> = {
    "Abhyanga (Self-Massage)": "Abhyanga is a warm oil massage that grounds the nervous system and improves circulation.",
    "Shatavari Protocol (Warm Milk)": "Shatavari is a powerful Ayurvedic rejuvenative herb for female reproductive health.",
    "Snehana (Oil Massage) Log": "Snehana is an Ayurvedic oil therapy, essential for postpartum tissue recovery and nervous system grounding.",
    "Syam": "Islamic fasting, which provides physical detox and deep spiritual discipline.",
    "Syam (Fasting) Manager": "Islamic fasting, which provides physical detox and deep spiritual discipline.",
    "Total Tawakkul": "Complete reliance and trust in God's plan, bringing profound peace to the heart.",
    "Dinacharya": "Ayurvedic daily routine that aligns your body with nature's rhythms."
  };

  const text = dictionary[term];
  if (!text) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-3.5 w-3.5 text-wellness-sage/70 hover:text-wellness-sage inline-block ml-1.5 mb-0.5 cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="max-w-xs text-xs font-normal text-left">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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
  { id: 'breathing', label: 'Mindful Breathing', type: 'checkbox' },
  { id: 'tawakkul', label: 'Spiritual Anchor', type: 'checkbox' },
  { id: 'curfew', label: 'Device Curfew', type: 'checkbox' },
  { id: 'sleep', label: 'Total Sleep Achieved (Hours)', type: 'number' },
];

const MENSTRUAL_ADJUSTMENTS: Record<string, string> = {
  'abhyanga': 'Passive Oil Application (Pelvic Area Only)',
  'breathing': 'Gentle Restorative Pranayama',
  'wake': 'Wake at Natural Time (REST)',
  'water': 'Warm Ginger Tea (No Milk)',
};

const PHASE_SPECIFIC_PRACTICES: Record<LifeStage, DailyPractice[]> = {
  menarche: [
    { id: 'cycle_track', label: 'Cycle Awareness / Mapping', type: 'checkbox' },
    { id: 'iron_shifa', label: 'Iron-Rich Shifa (Beet/Dates)', type: 'checkbox' },
    { id: 'emotional_journal', label: 'Emotional Resilience Journal', type: 'checkbox' },
  ],
  fertility: [
    { id: 'cervical_mucus', label: 'Al-Fitra (Cervical Mucus)', type: 'checkbox' },
    { id: 'shatavari', label: 'Shatavari Protocol (Warm Milk)', type: 'checkbox' },
    { id: 'sunnah_morning', label: 'Ajwa & Honey (Sunnah Morning)', type: 'checkbox' },
    { id: 'temp', label: 'Basal Body Temperature (Agni)', type: 'number' },
  ],
  pregnancy: [
    { id: 'fetal_movement', label: 'Fetal Movement / Soul Bonding', type: 'checkbox' },
    { id: 'quran_bonding', label: 'Quranic Recitation for Baby', type: 'checkbox' },
    { id: 'trimester_shifa', label: 'Trimester Shifa (Ajwa/Talbina)', type: 'checkbox' },
    { id: 'hydration_plus', label: 'Hydration+ (Copper Vessel Water)', type: 'checkbox' },
  ],
  postpartum: [
    { id: 'snehana', label: 'Snehana (Oil Massage) Log', type: 'checkbox' },
    { id: 'warming_soups', label: 'Warming Sunnah Soups', type: 'checkbox' },
    { id: 'pelvic_rest', label: 'Sacred 40 Pelvic Restoration', type: 'checkbox' },
  ],
  post_surgical: [
    { id: 'wound_care', label: 'Wound Care / Healing Sabr', type: 'checkbox' },
    { id: 'anti_inflam_tonic', label: 'Anti-Inflammatory Shifa Tonic', type: 'checkbox' },
    { id: 'sabr_check', label: 'Sabr (Patience) Level', type: 'number' },
  ],
  perimenopause: [
    { id: 'cooling_practice', label: 'Cooling Practice (Sitali)', type: 'checkbox' },
    { id: 'strength', label: 'Bone Density Resistance Work', type: 'checkbox' },
    { id: 'phyto_shifa', label: 'Phytoestrogen Shifa (Flax/Soy)', type: 'checkbox' },
  ],
  menopause: [
    { id: 'stillness', label: 'Second Spring Stillness Mins', type: 'number' },
    { id: 'heart_health', label: 'Heart-Focused Moon Breathing', type: 'checkbox' },
    { id: 'ghee_moisture', label: 'Internal Moisture (Ghee)', type: 'checkbox' },
  ],
  golden_years: [
    { id: 'joint_mobility', label: 'Joint Mobility / Tejas Sequence', type: 'checkbox' },
    { id: 'antioxidant_shifa', label: 'Antioxidant Shifa Tonic', type: 'checkbox' },
    { id: 'legacy_dhikr', label: 'Legacy Dhikr / Reflection', type: 'checkbox' },
  ],
};

const ISLAMIC_PRACTICES: DailyPractice[] = [
  { id: 'prayer_sync', label: 'Prayer/Dhikr Consistency', type: 'checkbox' },
  { id: 'quran_read', label: 'Quranic Connection (Reading/Listening)', type: 'checkbox' },
];

export default function Tracker() {
  const navigate = useNavigate();
  const { lifeStage: currentLifeStage, config, islamicMode } = useLifeMap();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [cyclePhase, setCyclePhase] = useState('');
  const [isMenstrual, setIsMenstrual] = useState(false);
  const [lifeStage, setLifeStage] = useState<string>(currentLifeStage);
  const [trimester, setTrimester] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [showCycleHelper, setShowCycleHelper] = useState(false);
  const [isMenarcheJourney, setIsMenarcheJourney] = useState(false);
  
  // Red Day Protocol fields
  const [painLevel, setPainLevel] = useState('');
  const [emotionalScore, setEmotionalScore] = useState('');
  const [spiritualAnchor, setSpiritualAnchor] = useState('Istighfar');
  
  // Fertility specific state
  const [fertilityMode, setFertilityMode] = useState<'prep' | 'active'>('prep');
  const [trustInQadr, setTrustInQadr] = useState(5);
  const [cervicalMucus, setCervicalMucus] = useState('');
  
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
  
  // Syam tracking state
  const [missedFasts, setMissedFasts] = useState('');
  const [fidyaPaid, setFidyaPaid] = useState('');
  const [syamType, setSyamType] = useState('None');
  const [syamNotes, setSyamNotes] = useState('');
  
  // Support Plan modal state
  const [showSupportPlan, setShowSupportPlan] = useState(false);
  const [userDosha, setUserDosha] = useState<string | undefined>();
  const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save logic
  useEffect(() => {
    if (loading || !user) return;
    
    const timer = setTimeout(() => {
      setIsAutoSaving(true);
      saveData(false).finally(() => {
        setIsAutoSaving(false);
        setLastSaved(new Date());
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    selectedDate, cyclePhase, trimester, painLevel, emotionalScore,
    spiritualAnchor, emotionalState, physicalSymptoms, vataCrash,
    tweakPlan, monthlyReflection, practices,
    pregnancyNausea, pregnancyFatigue, pregnancySleep, pregnancyMood, pregnancyBackPain, pregnancyDigestion, pregnancyBabyMovement, pregnancyNotes,
    postpartumSleep, postpartumMood, postpartumEnergy, postpartumPain, postpartumFeeding, postpartumNotes,
    menopauseHotFlashes, menopauseNightSweats, menopauseMood, menopauseBrainFog, menopauseEnergy, menopauseSleep, menopauseJointPain, menopauseDigestion,
    yogaStyle, yogaDuration, yogaPoses, meals,
    fajr, dhuhr, asr, maghrib, isha, mantras, meditationMinutes,
    missedFasts, fidyaPaid, syamType, syamNotes
  ]);

  // DYNAMIC PRACTICES LOGIC
  const getDailyPractices = () => {
    // Check if we are in a 'Safe/Recovery' mode
    const isSafeMode = lifeStage === 'post_surgical' || lifeStage === 'postpartum' || lifeStage === 'pregnancy';
    
    if (isSafeMode) {
      // Minimum Viable Dinacharya (MVD) - Only the essentials for recovery
      return [
        { id: 'water', label: 'Warm Water / Shifa Tonic', type: 'checkbox' as const },
        { id: 'tawakkul', label: 'Spiritual Anchor / Dhikr', type: 'checkbox' as const },
        { id: 'rest', label: 'Sacred Rest / Stillness', type: 'checkbox' as const },
        { id: 'sleep', label: 'Total Sleep Achieved (Hours)', type: 'number' as const },
      ];
    }

    let practicesList = [...DAILY_PRACTICES_BASE];
    const phasePractices = PHASE_SPECIFIC_PRACTICES[lifeStage as LifeStage] || [];
    practicesList = [...practicesList, ...phasePractices];
    if (islamicMode) {
      practicesList = [...practicesList, ...ISLAMIC_PRACTICES];
    }
    return practicesList;
  };

  const [dailyPractices, setDailyPractices] = useState<DailyPractice[]>(getDailyPractices());

  useEffect(() => {
    setDailyPractices(getDailyPractices());
  }, [lifeStage, islamicMode]);


  // Fiqh Status
  const { 
    status: fiqhStatus, 
    dayOfStatus, 
    recommendations: fiqhRecommendations 
  } = useFiqhStatus(user?.id, new Date(selectedDate));

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

    if (data) {
      setLifeStage(data.life_stage || currentLifeStage);
      setIsMenarcheJourney(data.is_menarche_journey || false);
      // Sync other fields if needed
    }
    
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
      setMantras(spiritualData.mantras || '');
      setMeditationMinutes(spiritualData.meditationMinutes || '');
      
      // Load Syam data from spiritual_practices JSON
      setMissedFasts(spiritualData.missedFasts || '');
      setFidyaPaid(spiritualData.fidyaPaid || '');
      setSyamType(spiritualData.syamType || 'None');
      setSyamNotes(spiritualData.syamNotes || '');
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

  const saveData = async (showToast = true) => {
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
          // Save Syam data into spiritual_practices JSON
          missedFasts: missedFasts,
          fidyaPaid: fidyaPaid,
          syamType: syamType,
          syamNotes: truncateText(syamNotes, 500),
        },
      };
      
      const { error } = await supabase
        .from('wellness_entries')
        .upsert(entryData, {
          onConflict: 'user_id,entry_date'
        });
      
      if (error) throw error;
      
      if (showToast) {
        if ('vibrate' in navigator) navigator.vibrate([10, 30, 10]);
        toast.success(`Progress saved!`);
        setShowSupportPlan(true);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      if (showToast) toast.error('Error saving data.');
    }
  };

  const clearData = async () => {
    if (!user) return;

    
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
        <Card className={`mb-6 border-${config.theme.primary}/20 shadow-sm overflow-hidden relative group`}>
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${config.theme.gradient}`}></div>
          <CardHeader className="text-center pb-8 pt-10">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full bg-gradient-to-br ${config.theme.gradient} shadow-lg ring-4 ring-white dark:ring-black animate-pulse-gentle`}>
                <config.icon className={`w-8 h-8 text-${config.theme.primary}`} />
              </div>
            </div>
            <CardTitle className={`text-3xl font-bold text-foreground mb-4`}>
              {config.title} Journal
            </CardTitle>
            
            <div className="flex flex-col items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`min-w-[240px] justify-start text-left font-normal border-${config.theme.primary}/20 bg-white/50 backdrop-blur-sm hover:bg-white transition-all rounded-2xl shadow-sm`}
                  >
                    <Calendar className={`mr-2 h-4 w-4 text-${config.theme.primary}`} />
                    {selectedDate ? format(new Date(selectedDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate ? new Date(selectedDate) : undefined}
                    onSelect={(date) => date && setSelectedDate(date.toISOString().split('T')[0])}
                    initialFocus
                    className="rounded-2xl bg-white dark:bg-slate-900"
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-2">
                {islamicMode && (
                  <Badge variant="outline" className="bg-mumtaz-lilac/20 border-mumtaz-lilac/30 text-mumtaz-plum animate-fade-in">
                    <Moon className="w-3 h-3 mr-1" />
                    Islamic Mode
                  </Badge>
                )}
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link to="/admin"><Settings className="w-4 h-4 mr-2" />Admin</Link>
                  </Button>
                )}
              </div>
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

        <Tabs defaultValue="rhythm" className="space-y-6" onValueChange={() => saveData(false)}>
          <div className="sticky top-20 z-10 bg-wellness-beige/80 backdrop-blur-md py-4 -mx-4 px-4">
            <TabsList className="flex w-full overflow-x-auto bg-wellness-taupe/10 border border-wellness-taupe/20 h-auto p-1 scrollbar-hide">
              <TabsTrigger value="rhythm" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm">Daily Rhythm</TabsTrigger>
              <TabsTrigger value="journey" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm">My Journey</TabsTrigger>
              {islamicMode && <TabsTrigger value="syam" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm flex items-center justify-center gap-1">Syam <AyurvedicTooltip term="Syam" /></TabsTrigger>}
              <TabsTrigger value="wellness" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm">Wellness Log</TabsTrigger>
              <TabsTrigger value="practices" className="flex-1 px-4 py-2.5 data-[state=active]:bg-wellness-warm text-xs sm:text-sm">Practices</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="rhythm" className="space-y-6">
            <DailyRhythm lifeStage={lifeStage} />
            
            <Card className={`border-${config.theme.primary}/20 shadow-sm overflow-hidden rounded-3xl`}>
              <CardHeader className={`bg-gradient-to-r ${config.theme.gradient} border-b border-${config.theme.primary}/10`}>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className={`h-5 w-5 text-${config.theme.primary}`} />
                  Daily Rhythm
                </CardTitle>
                <CardDescription>Flow with your body's natural clock</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                {/* Spacious Grid for Checkbox Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dailyPractices.filter(p => p.type === 'checkbox').map((practice) => (
                    <div key={practice.id} className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all hover:shadow-md ${practices[practice.id]?.status ? 'bg-wellness-sage/20 border-wellness-sage/30' : 'bg-muted/10 border-transparent hover:border-muted-foreground/10'}`}>
                      <Label 
                        htmlFor={practice.id}
                        className={`text-lg font-medium leading-relaxed cursor-pointer pr-4 ${practices[practice.id]?.status ? 'text-muted-foreground line-through opacity-70' : 'text-foreground'}`}
                      >
                        {isMenstrual && MENSTRUAL_ADJUSTMENTS[practice.id] 
                          ? MENSTRUAL_ADJUSTMENTS[practice.id] 
                          : practice.label}
                      </Label>
                      <Checkbox
                        id={practice.id}
                        checked={practices[practice.id]?.status || false}
                        onCheckedChange={(checked) => setPractices({
                          ...practices,
                          [practice.id]: { ...practices[practice.id], status: checked }
                        })}
                        className={`w-8 h-8 rounded-full flex-shrink-0 shadow-sm data-[state=checked]:bg-${config.theme.primary} data-[state=checked]:text-white data-[state=checked]:border-${config.theme.primary}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Vertical Layout for Input Items (Time/Number) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-muted-foreground/10">
                  {dailyPractices.filter(p => p.type !== 'checkbox').map((practice) => (
                    <div key={practice.id} className="flex flex-col gap-4 p-5 bg-white/40 backdrop-blur-md rounded-3xl border border-muted-foreground/10 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {practice.id === 'wake' ? (
                            <div className={`p-3 rounded-xl bg-${config.theme.primary}/10`}>
                              <Sun className={`h-6 w-6 text-${config.theme.primary}`} />
                            </div>
                          ) : practice.id === 'sleep' ? (
                            <div className={`p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20`}>
                              <Moon className={`h-6 w-6 text-indigo-500`} />
                            </div>
                          ) : (
                            <div className={`p-3 rounded-xl bg-muted/50`}>
                              <Activity className={`h-6 w-6 text-muted-foreground`} />
                            </div>
                          )}
                          <Label className="text-lg font-medium flex items-center">
                            {practice.label}
                            <AyurvedicTooltip term={practice.label} />
                          </Label>
                        </div>

                        {practice.type === 'time' && (
                          <Input
                            type="time"
                            value={practices[practice.id]?.detail || ''}
                            onChange={(e) => setPractices({
                              ...practices,
                              [practice.id]: { ...practices[practice.id], detail: e.target.value }
                            })}
                            className="w-32 h-12 text-lg rounded-2xl border-muted-foreground/20 focus:ring-2 focus:ring-primary text-center"
                          />
                        )}
                        {practice.type === 'number' && (
                          <div className="flex items-center gap-2 bg-white/50 rounded-2xl border border-muted-foreground/20 px-3 h-12">
                            <Input
                              type="number"
                              step="0.1"
                              value={practices[practice.id]?.detail || ''}
                              onChange={(e) => setPractices({
                                ...practices,
                                [practice.id]: { ...practices[practice.id], detail: e.target.value }
                              })}
                              className="w-16 border-none bg-transparent h-10 text-lg font-medium p-0 text-center"
                            />
                            <span className="text-xs text-muted-foreground font-bold uppercase pr-2">
                              {practice.id === 'sleep' ? 'hrs' : practice.id === 'temp' ? '°C' : 'min'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Global Notes Section - One field instead of many */}
                <div className="pt-4 border-t border-muted-foreground/10">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Daily Reflections & Notes</Label>
                    <div className="relative group">
                      <Textarea
                        placeholder="How did you feel today? Any wins or challenges..."
                        value={monthlyReflection}
                        onChange={(e) => setMonthlyReflection(e.target.value)}
                        className="bg-white/40 backdrop-blur-sm border-dashed border-muted-foreground/20 rounded-2xl min-h-[100px] text-sm italic pr-12"
                      />
                      <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity">
                        <VoiceInput onTranscript={(t) => setMonthlyReflection(prev => prev ? `${prev} ${t}` : t)} />
                      </div>
                    </div>
                </div>
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
                      <div className="mb-6">
                        <FiqhCycleStatus 
                          status={fiqhStatus} 
                          dayOfStatus={dayOfStatus} 
                          recommendations={fiqhRecommendations} 
                        />
                      </div>
                      
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

          {islamicMode && (
            <TabsContent value="syam" className="space-y-6">
            <Card className="border-wellness-taupe/20 shadow-sm overflow-hidden bg-gradient-to-br from-white to-wellness-sage/5">
              <CardHeader className="bg-wellness-sage/10 border-b border-wellness-sage/10">
                <CardTitle className="text-xl text-wellness-taupe flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-wellness-sage" />
                  <span className="flex items-center">Syam (Fasting) Manager <AyurvedicTooltip term="Syam (Fasting) Manager" /></span>
                </CardTitle>
                <CardDescription>Track missed fasts and recovery</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-wellness-sage/20 space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Missed Ramadan Fasts</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="number" 
                        value={missedFasts}
                        onChange={(e) => setMissedFasts(e.target.value)}
                        placeholder="0" 
                        className="w-20 text-center text-lg font-bold" 
                      />
                      <span className="text-sm text-wellness-taupe">days to recover</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-wellness-sage/20 space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Fidya (Recovery Payment)</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="number" 
                        value={fidyaPaid}
                        onChange={(e) => setFidyaPaid(e.target.value)}
                        placeholder="0" 
                        className="w-20 text-center text-lg font-bold" 
                      />
                      <span className="text-sm text-wellness-taupe">days fulfilled</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-wellness-warm/30 border border-wellness-taupe/10">
                  <p className="text-sm text-wellness-taupe mb-3 font-medium">Spiritual Intent today:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Nafl (Voluntary)', 'Qada (Recovery)', 'None'].map((type) => (
                      <Badge 
                        key={type} 
                        variant={syamType === type ? 'default' : 'secondary'}
                        onClick={() => setSyamType(type)}
                        className={`cursor-pointer py-2 px-4 transition-all ${syamType === type ? 'bg-wellness-sage text-white' : 'hover:bg-wellness-sage/20'}`}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Syam Notes</Label>
                  <div className="relative group">
                    <Textarea 
                      value={syamNotes}
                      onChange={(e) => setSyamNotes(e.target.value)}
                      placeholder="Intentions or reflections on your fast..." 
                      className="bg-white/50 text-sm pr-12" 
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <VoiceInput onTranscript={(t) => setSyamNotes(prev => prev ? `${prev} ${t}` : t)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </TabsContent>
          )}

          <TabsContent value="wellness" className="space-y-6">
            <Card className="border-wellness-taupe/20 shadow-sm">
              <CardHeader><CardTitle className="text-xl text-wellness-taupe">Holistic Wellbeing</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-4 bg-muted/30 p-6 rounded-2xl border border-muted-foreground/10">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-bold uppercase tracking-wider">Emotional State</Label>
                      <Badge variant="outline" className={`bg-white font-mono text-lg px-3 py-1 border-${config.theme.primary}/30 text-${config.theme.primary}`}>
                        {emotionalScore || '5'}
                      </Badge>
                    </div>
                    <div className="px-2 pt-2">
                      <Slider
                        value={[parseInt(emotionalScore) || 5]}
                        max={10}
                        step={1}
                        onValueChange={(vals) => setEmotionalScore(vals[0].toString())}
                        className="py-4"
                      />
                      <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                        <span className="flex items-center gap-1"><ArrowDown className="w-3 h-3" /> Low Energy / Heavy</span>
                        <span className="flex items-center gap-1">Optimal / Radiant <ArrowUp className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 bg-muted/30 p-6 rounded-2xl border border-muted-foreground/10">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-bold uppercase tracking-wider">Physical Comfort</Label>
                      <Badge variant="outline" className={`bg-white font-mono text-lg px-3 py-1 border-${config.theme.primary}/30 text-${config.theme.primary}`}>
                        {painLevel || '5'}
                      </Badge>
                    </div>
                    <div className="px-2 pt-2">
                      <Slider
                        value={[parseInt(painLevel) || 5]}
                        max={10}
                        step={1}
                        onValueChange={(vals) => setPainLevel(vals[0].toString())}
                        className="py-4"
                      />
                      <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                        <span className="flex items-center gap-1"><ArrowDown className="w-3 h-3" /> High Pain / Tension</span>
                        <span className="flex items-center gap-1">Comfortable / Ease <ArrowUp className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </div>
                </div>

                {lifeStage === 'fertility' && (
                  <div className="space-y-6 pt-6 border-t border-wellness-taupe/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-wellness-taupe uppercase tracking-tight">Fertility Focus</h4>
                        <p className="text-[10px] text-wellness-taupe/60">Current path: <span className="text-wellness-sage font-semibold uppercase">{fertilityMode === 'prep' ? 'Prep Phase' : 'Active Window'}</span></p>
                      </div>
                      <div className="flex gap-1 p-1 bg-wellness-warm/50 rounded-lg border border-wellness-taupe/10">
                        {['prep', 'active'].map((mode) => (
                          <Button
                            key={mode}
                            size="sm"
                            type="button"
                            variant={fertilityMode === mode ? 'default' : 'ghost'}
                            onClick={() => setFertilityMode(mode as any)}
                            className={`text-[10px] uppercase font-bold h-7 px-3 rounded-md transition-all ${
                              fertilityMode === mode 
                                ? 'bg-wellness-sage text-white shadow-sm' 
                                : 'text-wellness-taupe/60 hover:text-wellness-taupe'
                            }`}
                          >
                            {mode === 'prep' ? 'Prep' : 'Active'}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 bg-wellness-sage/5 p-5 rounded-2xl border border-wellness-sage/20">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-wellness-sage" />
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-wellness-taupe">Fertile Signs (Al-Fitra)</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {['Dry', 'Sticky', 'Creamy', 'Egg White'].map((sign) => (
                            <Button
                              key={sign}
                              size="sm"
                              type="button"
                              variant={cervicalMucus === sign ? 'default' : 'outline'}
                              onClick={() => setCervicalMucus(sign)}
                              className={`text-[9px] uppercase h-8 rounded-lg border-wellness-taupe/10 ${
                                cervicalMucus === sign 
                                  ? 'bg-wellness-sage text-white border-transparent' 
                                  : 'text-wellness-taupe/70 hover:bg-wellness-sage/10 bg-white/50'
                              }`}
                            >
                              {sign}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 bg-wellness-sage/5 p-5 rounded-2xl border border-wellness-sage/20">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-wellness-sage" />
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-wellness-taupe">Trust in Decree (Qadr)</Label>
                          </div>
                          <Badge variant="outline" className="bg-white font-mono text-xs border-wellness-sage/30 text-wellness-sage">
                            {trustInQadr}
                          </Badge>
                        </div>
                        <div className="px-1">
                          <Slider
                            value={[trustInQadr]}
                            max={10}
                            step={1}
                            onValueChange={(vals) => setTrustInQadr(vals[0])}
                            className="py-2"
                          />
                          <div className="flex justify-between mt-2 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">
                            <span>Anxiety / Doubt</span>
                            <span className="flex items-center">Total Tawakkul <AyurvedicTooltip term="Total Tawakkul" /></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-wellness-warm/30 border border-wellness-taupe/10">
                      <p className="text-[11px] leading-relaxed text-wellness-taupe italic">
                        {fertilityMode === 'prep' 
                          ? "Focus: Detox and Istighfar. Cleansing the 'spiritual soil' through seeking forgiveness." 
                          : "Focus: High Ojas and Dua. Shifting from 'doing' to 'receiving' in total trust."}
                      </p>
                    </div>
                  </div>
                )}

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

                <div className="space-y-1 pb-2">
                  <Label className="text-xs font-semibold text-wellness-taupe uppercase tracking-wider">Daily Reflections</Label>
                  <div className="relative group">
                    <Textarea 
                      value={emotionalState} 
                      onChange={(e) => setEmotionalState(e.target.value)} 
                      placeholder="Reflect on your mood, energy, or any specific feelings..." 
                      className="min-h-[120px] bg-white/50 text-sm border-wellness-taupe/10 focus:border-wellness-taupe/30 pr-12" 
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <VoiceInput onTranscript={(t) => setEmotionalState(prev => prev ? `${prev} ${t}` : t)} />
                    </div>
                  </div>
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
                  <div className="relative group">
                    <Textarea 
                      value={mantras} 
                      onChange={(e) => setMantras(e.target.value)} 
                      placeholder="Dhikr..." 
                      className="bg-white/50 pr-12" 
                    />
                    <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity">
                      <VoiceInput onTranscript={(t) => setMantras(prev => prev ? `${prev} ${t}` : t)} />
                    </div>
                  </div>
                </CardContent>
             </Card>

             <Card className="border-wellness-taupe/20 shadow-sm">
                <CardHeader><CardTitle className="text-xl text-wellness-taupe">Physical Practice</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input value={yogaStyle} onChange={(e) => setYogaStyle(e.target.value)} placeholder="Style" className="bg-white/50" />
                  <Input value={yogaDuration} onChange={(e) => setYogaDuration(e.target.value)} placeholder="Duration" className="bg-white/50" />
                  <div className="relative group">
                    <Textarea 
                      value={yogaPoses} 
                      onChange={(e) => setYogaPoses(e.target.value)} 
                      placeholder="Notes..." 
                      className="bg-white/50 pr-12" 
                    />
                    <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity">
                      <VoiceInput onTranscript={(t) => setYogaPoses(prev => prev ? `${prev} ${t}` : t)} />
                    </div>
                  </div>
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
          <Button variant="ghost" className="flex-1 h-12" onClick={() => setIsClearDataOpen(true)}><Trash2 className="w-4 h-4 mr-2" />Clear</Button>
          <div className="flex-[2] flex items-center justify-end gap-3">
            {lastSaved && !isAutoSaving && (
              <span className="text-xs font-medium text-wellness-sage flex items-center bg-wellness-sage/10 px-3 py-1.5 rounded-full animate-fade-in shadow-sm border border-wellness-sage/20">
                <Check className="w-3.5 h-3.5 mr-1" />
                Saved
              </span>
            )}
            <Button className="flex-1 h-12 bg-wellness-sage hover:bg-wellness-sage/90 text-white font-bold transition-all relative overflow-hidden group" onClick={() => saveData(true)}>
              <div className="absolute inset-0 bg-white/30 blur-md opacity-0 group-active:opacity-100 group-active:scale-110 transition-all duration-300 pointer-events-none" />
              {isAutoSaving ? <span className="animate-pulse">Saving...</span> : <><Save className="w-5 h-5 mr-2" />Save</>}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isClearDataOpen} onOpenChange={setIsClearDataOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear your data for {format(new Date(selectedDate), "PPP")}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearData} className="bg-red-500 hover:bg-red-600">Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
