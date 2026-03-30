import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, BookOpen, BarChart3, User, Sparkles, TrendingUp, Users, Flower2, Activity, Clock, ArrowRight, Waves, Moon, Baby, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import founderPortrait from "@/assets/founder-portrait.jpeg";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { OnboardingTour } from "@/components/OnboardingTour";
import { QuickCheckIn } from "@/components/QuickCheckIn";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { PoseOfTheDay } from "@/components/PoseOfTheDay";
import { ReturningUserWelcome } from "@/components/ReturningUserWelcome";
import { FavoritesQuickAccess } from "@/components/FavoritesQuickAccess";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { ConfidenceJourney } from "@/components/ConfidenceJourney";
import { ConfidenceMilestones } from "@/components/ConfidenceMilestones";
import { InstallPromptBanner } from "@/components/InstallPromptBanner";
import { LifeStageCheckInPrompt } from "@/components/LifeStageCheckInPrompt";
import { WelcomeEntryDialog } from "@/components/WelcomeEntryDialog";
import { InBetweenPhaseBanner } from "@/components/InBetweenPhaseBanner";
import { WellnessCheckIn } from "@/components/WellnessCheckIn";
import { MidnightAnchorUI } from "@/components/MidnightAnchorUI";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { LunarIndicator } from "@/components/LunarIndicator";
import { PrayerSync } from "@/components/PrayerSync";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DailyPractice } from "@/components/DailyPractice";
import { useLifeMap } from "@/contexts/LifeMapContext";
import { Switch } from "@/components/ui/switch";
import { Label as UILabel } from "@/components/ui/label";

interface UserProfile {
  username: string;
}

interface WellnessProfile {
  life_stage: string | null;
  primary_dosha: string | null;
  secondary_dosha: string | null;
  onboarding_completed: boolean | null;
  pregnancy_status: string | null;
  spiritual_preference: string | null;
  primary_focus: string[] | null;
  life_phases: string[] | null;
}

interface WellnessEntry {
  id: string;
  entry_date: string;
  emotional_score: number | null;
  emotional_state: string | null;
  pain_level: number | null;
  cycle_phase: string | null;
  daily_practices: any;
}

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wellnessProfile, setWellnessProfile] = useState<WellnessProfile | null>(null);
  const [recentEntries, setRecentEntries] = useState<WellnessEntry[]>([]);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [showEntryDialog, setShowEntryDialog] = useState(false);
  const [activePracticeType, setActivePracticeType] = useState<"yoga" | "meditation" | "emotional" | null>(null);
  const { lifeStage, config, islamicMode, setIslamicMode } = useLifeMap();
  const [showAllTools, setShowAllTools] = useState(false);

  useEffect(() => {
    checkUserProfile();
    
    // Check if tour was triggered from Settings
    const triggerTour = localStorage.getItem('mumtaz_trigger_tour');
    if (triggerTour === 'true') {
      localStorage.removeItem('mumtaz_trigger_tour');
      setTimeout(() => setShowTour(true), 500);
    }
    
    // Check if returning user should see welcome dialog
    const lastVisit = localStorage.getItem('mumtaz_last_visit');
    const welcomeShownToday = localStorage.getItem('mumtaz_welcome_shown_today');
    const today = new Date().toDateString();
    
    if (lastVisit && welcomeShownToday !== today) {
      // User has visited before and hasn't seen welcome today
      setIsReturningUser(true);
      // Show welcome dialog after a short delay
      setTimeout(() => setShowWelcomeDialog(true), 800);
      localStorage.setItem('mumtaz_welcome_shown_today', today);
    }
    
    // Update last visit
    localStorage.setItem('mumtaz_last_visit', new Date().toISOString());
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('mumtaz_tour_completed', 'true');
  };

  const calculateTotals = (entries: WellnessEntry[]) => {
    if (entries.length === 0) return { checkIns: 0, visits: 0 };

    // Total check-ins is simply the count of all entries
    const checkIns = entries.length;

    // Total visits is the count of unique dates
    const uniqueDates = new Set(entries.map(entry => entry.entry_date));
    const visits = uniqueDates.size;

    return { checkIns, visits };
  };

  const checkUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch wellness profile including new multi-select fields
      const { data: wellness } = await supabase
        .from("user_wellness_profiles")
        .select("life_stage, primary_dosha, secondary_dosha, onboarding_completed, pregnancy_status, spiritual_preference, primary_focus, life_phases")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch ALL wellness entries for streak calculation
      const { data: allEntries } = await supabase
        .from("wellness_entries")
        .select("id, entry_date, emotional_score, emotional_state, pain_level, cycle_phase, daily_practices")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      // Calculate totals
      if (allEntries && allEntries.length > 0) {
        const totals = calculateTotals(allEntries);
        setTotalCheckIns(totals.checkIns);
        setTotalVisits(totals.visits);
        setRecentEntries(allEntries.slice(0, 5));
      }

      setUserProfile(profile);
      setWellnessProfile(wellness);

      // If the user is logged in but hasn't completed onboarding
      // and hasn't done a quick check-in, send them to onboarding.
      // This handles new Google Sign-In users and any returning user
      // who hasn't finished setting up their profile.
      const quickCheckInDone = localStorage.getItem('mumtaz_quick_checkin_completed') === 'true';
      if (!wellness?.onboarding_completed && !quickCheckInDone) {
        navigate("/onboarding");
        return;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLifeStageDisplay = (stage: string | null) => {
    if (!stage) return "Not set";
    const stages: Record<string, string> = {
      menstrual_cycle: "Regular Menstrual Cycle",
      cycle_changes: "Cycle Changes / Hormonal Shifts",
      perimenopause: "Perimenopause",
      peri_menopause_transition: "Peri → Menopause Transition",
      menopause: "Menopause",
      post_menopause: "Post-Menopause",
      pregnancy: "Pregnancy",
      postpartum: "Postpartum",
      not_sure: "Exploring",
    };
    return stages[stage] || stage;
  };

  const getDoshaDisplay = (dosha: string | null) => {
    if (!dosha) return "Not assessed";
    return dosha.charAt(0).toUpperCase() + dosha.slice(1);
  };

  const getEmotionalScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-orange-600";
  };

  const getPainLevelColor = (level: number | null) => {
    if (!level) return "text-muted-foreground";
    if (level <= 3) return "text-green-600";
    if (level <= 6) return "text-yellow-600";
    return "text-red-600";
  };


  // Check if user did quick check-in
  const didQuickCheckIn = typeof window !== 'undefined' && localStorage.getItem('mumtaz_quick_checkin_completed') === 'true';
  const showDashboard = wellnessProfile?.onboarding_completed || (userProfile && didQuickCheckIn);

  // Anti-Gravity: Safe Mode Identification
  const isSafeMode = wellnessProfile?.life_stage === 'post_surgical' || wellnessProfile?.life_stage === 'postpartum';

  // Integrate with global loading indicator
  useGlobalLoading(loading);

  // Show loading skeleton while fetching data
  if (loading) {
    return <PageLoadingSkeleton variant="dashboard" />;
  }

  // If user has completed onboarding OR quick check-in, show dashboard
  if (showDashboard) {
    return (
      <div className={`min-h-screen bg-background animate-fade-in ${isSafeMode ? 'safe-mode-active' : ''}`}>
        <MidnightAnchorUI />
        <Navigation />
        <OnboardingTour run={showTour} onComplete={handleTourComplete} />
        
        {/* Returning User Welcome Dialog */}
        {showWelcomeDialog && isReturningUser && (
          <ReturningUserWelcome onClose={() => setShowWelcomeDialog(false)} />
        )}
        
        {/* Favorites Quick Access Button */}
        <FavoritesQuickAccess />
        
        {/* Watermark */}
        <div className="watermark-lotus">
          <Logo size="xl" showText={false} />
        </div>
        
        <div className="container mx-auto px-6 py-12 pt-24 space-y-12">
          {/* THE DYNAMIC COMPASS HUB (NON-SAFE MODE) */}
          {!isSafeMode && (
            <div className="flex flex-col items-center justify-center space-y-10 max-w-4xl mx-auto pb-12">
              
              {/* Compass Center (The Bubble) */}
              <div className={`relative w-full max-w-3xl p-8 md:p-12 glass-panel border-${config.theme.primary}/30 text-center animate-fade-in transition-all duration-700`}>
                {/* Animated aura */}
                <div className={`absolute inset-0 bg-gradient-to-b ${config.theme.gradient} opacity-40 rounded-3xl pointer-events-none`} />
                <div className={`absolute -inset-4 bg-${config.theme.primary}/10 blur-3xl opacity-60 rounded-full pointer-events-none animate-pulse-gentle`} />
                
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`bg-white/50 backdrop-blur-md text-${config.theme.primary} border-${config.theme.primary}/20 px-4 py-1.5 rounded-full border shadow-sm`}>
                      <config.icon className="w-4 h-4 mr-2" />
                      <span className="font-bold tracking-widest uppercase text-[10px]">{config.title}</span>
                    </Badge>
                    {islamicMode && (
                      <Badge variant="outline" className="bg-mumtaz-lilac/20 text-mumtaz-plum border-mumtaz-lilac/30 px-4 py-1.5 rounded-full border shadow-sm">
                        <Moon className="w-4 h-4 mr-2" />
                        <span className="font-bold tracking-widest uppercase text-[10px]">Islamic Shifa</span>
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                      Hello, {userProfile?.username || "Friend"}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-accent max-w-xl mx-auto mt-4 leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md mx-auto my-2">
                    <div className="flex flex-col items-center gap-2 w-full">
                      <LunarIndicator />
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                      <PrayerSync />
                    </div>
                  </div>

                  {/* The Daily Remedy built directly into the center orb for the zero-work 2-tap rule */}
                  <div className="w-full mt-4 bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/40 shadow-inner">
                     <div className="flex items-center justify-center gap-2 mb-4">
                       <Zap className="w-5 h-5 text-yellow-500 border-yellow-500 fill-yellow-500" />
                       <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Today's Remedy</h3>
                     </div>
                     <PersonalizedRecommendations hideTitle={true} compact={true} />
                  </div>
                </div>
              </div>

              {/* Compass Nodes (Quick Access Radiating from Center) */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full px-4 relative z-20">
                <button 
                  onClick={() => navigate("/tracker")} 
                  className="group flex flex-col items-center justify-center gap-3 w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] glass-panel bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center shadow-sm group-hover:-rotate-12 transition-transform duration-500">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Journal</span>
                </button>
                
                <button 
                  onClick={() => navigate("/my-daily-practice")} 
                  className="group flex flex-col items-center justify-center gap-3 w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] glass-panel bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-500">
                    <Flower2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Practice</span>
                </button>
                
                <button 
                  onClick={() => navigate("/content-library")} 
                  className="group flex flex-col items-center justify-center gap-3 w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] glass-panel bg-wellness-lilac/10 text-wellness-lilac border-wellness-lilac/20 hover:bg-wellness-lilac/20 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-6 h-6 text-wellness-lilac" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Library</span>
                </button>
                
                <button 
                  onClick={() => navigate("/bookings")} 
                  className="group flex flex-col items-center justify-center gap-3 w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] glass-panel bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center shadow-sm group-hover:-rotate-6 transition-transform duration-500">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Support</span>
                </button>
              </div>

            </div>
          )}

          {isSafeMode && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
              {/* DIVINE PERMISSION TO REST */}
              <div className="p-8 rounded-[3rem] bg-gradient-to-br from-wellness-lilac/20 to-wellness-sage/10 border-wellness-lilac/30 shadow-xl text-center relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-wellness-lilac/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 space-y-4">
                  <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Moon className="w-8 h-8 text-wellness-lilac animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-bold text-wellness-taupe tracking-tight">Divine Permission to Rest</h2>
                  <p className="text-xl text-muted-foreground font-accent italic max-w-2xl mx-auto leading-relaxed">
                    "Your body is in a state of sacred recovery. The Creator has granted you permission to pause. You are held, you are seen, and you are healing."
                  </p>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-wellness-lilac text-wellness-lilac hover:bg-wellness-lilac/10 px-8 h-12 text-lg font-bold"
                      onClick={() => navigate("/content-library?tag=restorative")}
                    >
                      Enter Gentle Sanctuary
                    </Button>
                  </div>
                </div>
              </div>

              {/* SINGLE POINT OF ACTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="border-none bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="px-0">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-wellness-sage" />
                        Quick Recovery Check
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 space-y-4">
                        <p className="text-sm text-muted-foreground italic mb-4">No scales, no work. Just a pulse-check for your recovery.</p>
                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline" className="rounded-2xl border-wellness-sage/30 hover:bg-wellness-sage/10 text-wellness-taupe px-6">Healing Well</Button>
                          <Button variant="outline" className="rounded-2xl border-orange-200 hover:bg-orange-50 text-orange-700 px-6">Tired / Resting</Button>
                          <Button variant="outline" className="rounded-2xl border-red-200 hover:bg-red-50 text-red-700 px-6">Manage Discomfort</Button>
                        </div>
                    </CardContent>
                 </Card>

                 <Card className="border-none bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="px-0">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Heart className="w-5 h-5 text-wellness-lilac" />
                        Hold Me Now
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">A one-minute practice to ground your nervous system.</p>
                        <Button 
                          className="w-full h-14 bg-wellness-lilac hover:bg-wellness-lilac/90 rounded-2xl text-lg font-bold shadow-lg"
                          onClick={() => navigate("/content-library?highlight=breath-of-sakinah")}
                        >
                          Listen to Sakinah Breath
                        </Button>
                    </CardContent>
                 </Card>
              </div>
            </div>
          )}

          {/* ANTI-GRAVITY: RECOVERY FOCUS (SAFE MODE ONLY) */}
          {isSafeMode && (
             <div className="max-w-5xl mx-auto py-8">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="px-0">
                    <CardTitle className="text-lg font-bold">Suggested for your Recovery</CardTitle>
                    <CardDescription>Gentle, restorative practices for {getLifeStageDisplay(wellnessProfile?.life_stage)} phase.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <RecentlyViewed />
                  </CardContent>
                </Card>
             </div>
          )}

          {/* Hormonal Transition Quick Access - for in-between phase users */}
          {(wellnessProfile?.life_stage === 'cycle_changes' || 
            wellnessProfile?.life_stage === 'peri_menopause_transition' ||
            wellnessProfile?.life_phases?.includes('cycle_changes') ||
            wellnessProfile?.life_phases?.includes('peri_menopause_transition')) && (
            <Card 
              className="max-w-3xl mx-auto bg-gradient-to-br from-teal-50/60 to-teal-100/30 dark:from-teal-900/20 dark:to-teal-800/10 border-teal-200/50 dark:border-teal-800/50 hover:shadow-lg hover:border-teal-300/60 transition-all cursor-pointer group active:scale-[0.99]"
              onClick={() => navigate("/hormonal-transition")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate("/hormonal-transition")}
            >
              <CardContent className="py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Waves className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Your Transition Tracker
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Gently observe your hormonal journey with supportive tools
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-teal-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Explore More Toggle */}
          <div className="flex justify-center pt-4 pb-8">
            <Button 
              variant="outline" 
              className="rounded-full px-8 hover:bg-muted/50 transition-colors"
              onClick={() => setShowAllTools(!showAllTools)}
            >
              {showAllTools ? "Hide Additional Tools" : "Explore More Tools"}
            </Button>
          </div>

          {showAllTools && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Phase-Specific North Star Anchors */}
              {lifeStage === 'fertility' && (
            <div className="max-w-3xl mx-auto mb-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-wellness-sage/10 to-transparent border-wellness-sage/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-12 h-12 text-wellness-sage" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-accent text-lg font-bold text-wellness-sage-dark mb-2 flex items-center gap-2">
                       The Golden Vessel
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Visualize your womb as a <span className="text-wellness-sage font-semibold font-accent italic">Golden Vessel</span>—pure, radiant, and ready to hold life in its most sacred form.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-wellness-lilac/10 to-transparent border-wellness-lilac/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Heart className="w-12 h-12 text-wellness-lilac-dark" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-accent text-lg font-bold text-wellness-lilac-dark mb-2 flex items-center gap-2">
                      Miracles of the Prophets
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Remember Maryam (AS) who conceived through a Divine Word, and Sarah (AS) who was blessed in her old age. <span className="italic font-medium">Nothing is impossible for the Creator.</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-wellness-warm/30 rounded-2xl p-5 border border-wellness-taupe/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-wellness-sage/20 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-wellness-sage" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-wellness-taupe uppercase tracking-tight mb-1">
                    Today's Al-Fitra Guidance
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    Focus on <span className="font-semibold">Istighfar</span> and detox. We are cleansing the soil. The rain follows forgiveness (Surah Nuh).
                  </p>
                </div>
              </div>
            </div>
          )}

          {lifeStage === 'pregnancy' && (
            <div className="max-w-3xl mx-auto mb-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Baby className="w-12 h-12 text-pink-500" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-accent text-lg font-bold text-pink-700 mb-2">
                       The Sacred Carry
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You are a <span className="text-pink-600 font-semibold italic">Portal for a Soul</span>. Every breath you take in remembrance nourishes the light within you.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Moon className="w-12 h-12 text-blue-500" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-accent text-lg font-bold text-blue-700 mb-2">
                      Quranic Bonding
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Reciting <span className="italic font-medium text-blue-600">Surah Maryam</span> brings ease and sakinah. Your baby hears the melody of the Creator's words through you.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {lifeStage === 'postpartum' && (
            <div className="max-w-3xl mx-auto mb-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Heart className="w-12 h-12 text-orange-500" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-accent text-lg font-bold text-orange-700 mb-2">
                       The Sacred 40
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This is the time of <span className="text-orange-600 font-semibold italic">Deep Rebuilding</span>. Honour the transition from 'Woman' to 'Mother' with gentleness and warmth.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-12 h-12 text-amber-500" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-accent text-lg font-bold text-amber-700 mb-2">
                      Snehana (Oil) Shifa
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Warm oil on your skin is a <span className="italic font-medium text-amber-600">Shield against Vata</span>. It grounds your nervous system and seals the energy of birth.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {lifeStage === 'menarche' && (
            <div className="max-w-3xl mx-auto mb-10 space-y-6 text-center">
              <Card className="bg-gradient-to-br from-wellness-lilac/10 to-transparent border-wellness-lilac/20 shadow-sm p-8">
                <div className="w-16 h-16 rounded-full bg-wellness-lilac/20 flex items-center justify-center mx-auto mb-4">
                  <Flower2 className="w-8 h-8 text-wellness-lilac-dark" />
                </div>
                <h3 className="font-accent text-2xl font-bold text-wellness-lilac-dark mb-3">
                  The Awakening
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Welcome to the <span className="italic font-medium">Sacred Cycle</span>. You are now a carrier of life and a repository of Divine Wisdom. Your cycle is a sign of your strength, not your weakness.
                </p>
              </Card>
            </div>
          )}

          {lifeStage === 'menopause' && (
            <div className="max-w-3xl mx-auto mb-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Moon className="w-12 h-12 text-indigo-500" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-accent text-lg font-bold text-indigo-700 mb-2">
                       The Second Spring
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      As the monthly rain stops, the <span className="text-indigo-600 font-semibold italic">Deep Well of Wisdom</span> opens. Focus on the stillness within.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-12 h-12 text-violet-500" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-accent text-lg font-bold text-violet-700 mb-2">
                      The Wise Woman
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your energy is no longer directed outward; it is <span className="italic font-medium text-violet-600">Sealed Within</span> for your own spiritual ascent.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* The Unified "Today" Action Block */}
          <div className="max-w-3xl mx-auto space-y-6" data-tour="entry-cards">
            
            <h2 className="text-xl font-semibold text-foreground/80 pl-2">What does your body need today?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Yoga Practice */}
              <Card 
                className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden relative"
                onClick={() => setActivePracticeType("yoga")}
                role="button"
                tabIndex={0}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/20"></div>
                <CardContent className="pt-8 pb-8 relative z-10">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/60 dark:bg-black/20 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                      <Flower2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        Yoga Practice
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Move your body gently
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Breathwork & Calm */}
              <Card 
                className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border-teal-500/30 hover:shadow-xl hover:-translate-y-1 hover:border-teal-500/50 transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden relative"
                onClick={() => setActivePracticeType("meditation")}
                role="button"
                tabIndex={0}
              >
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -ml-16 -mb-16 transition-all group-hover:bg-teal-500/20"></div>
                <CardContent className="pt-8 pb-8 relative z-10">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/60 dark:bg-black/20 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
                      <Waves className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-teal-600 transition-colors">
                        Breathwork
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Find stillness & peace
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Spiritual Uplift */}
              <Card 
                className={`bg-gradient-to-br ${islamicMode ? 'from-mumtaz-lilac/20 to-mumtaz-lilac/5 border-mumtaz-lilac/30' : 'from-accent/20 to-accent/5 border-accent/20'} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden relative`}
                onClick={() => setActivePracticeType("emotional")}
                role="button"
                tabIndex={0}
              >
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${islamicMode ? 'bg-mumtaz-lilac/10' : 'bg-accent/10'} rounded-full blur-3xl transition-all group-hover:bg-opacity-20`}></div>
                <CardContent className="pt-8 pb-8 relative z-10">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/60 dark:bg-black/20 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {islamicMode ? <Moon className="w-8 h-8 text-mumtaz-plum" /> : <Sparkles className="w-8 h-8 text-accent" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                        {islamicMode ? 'Daily Dhikr' : 'Spiritual Uplift'}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {islamicMode ? 'Connection to Creator' : 'Nourish your soul'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Check-In prominent inline block */}

          {/* Wellness Check-In: Energy / Mood / Comfort Sliders */}
          <div className="max-w-xl mx-auto">
            <WellnessCheckIn />
          </div>

          {/* Complete Onboarding Prompt - Gentle, non-pressuring */}
          {!wellnessProfile?.onboarding_completed && didQuickCheckIn && (
            <Card className="max-w-3xl mx-auto bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
              <CardContent className="py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-foreground mb-1">Would you like deeper guidance?</h3>
                    <p className="text-sm text-muted-foreground">
                      When you're ready, share a bit more about yourself for personalized recommendations.
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate("/onboarding?full=true")}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent/10 whitespace-nowrap"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Tell me more
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show More / Show Less Toggle for secondary sections */}
          <div className="flex flex-col gap-12">
            {!showAllTools ? (
              <div className="flex justify-center">
                <Button 
                  onClick={() => setShowAllTools(true)}
                  variant="ghost"
                  className="group text-muted-foreground hover:text-primary gap-2 text-base font-semibold"
                >
                  Explore More Journey Tools
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="animate-fade-in space-y-12">
                {/* Monthly Life Stage Check-In Prompt */}
                {wellnessProfile?.life_stage && (
                  <div className="max-w-3xl mx-auto">
                    <LifeStageCheckInPrompt currentStage={wellnessProfile.life_stage} />
                  </div>
                )}

                {/* In-Between Phase Support Banner */}
                {wellnessProfile?.life_stage && (
                  <div className="max-w-3xl mx-auto">
                    <InBetweenPhaseBanner lifeStage={wellnessProfile.life_stage} />
                  </div>
                )}

                {/* Confidence Journey - for users building confidence */}
                <div className="max-w-5xl mx-auto">
                  <ConfidenceJourney />
                </div>

                {/* Confidence Milestones - weekly progress */}
                <div className="max-w-5xl mx-auto">
                  <ConfidenceMilestones />
                </div>

                {/* Pose of the Day */}
                <div className="max-w-5xl mx-auto" data-tour="pose-of-day">
                  <PoseOfTheDay />
                </div>

                {/* Recently Viewed */}
                <div className="max-w-5xl mx-auto">
                  <RecentlyViewed />
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => {
                        setShowAllTools(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    variant="outline"
                    className="rounded-full px-8"
                  >
                    Show Less
                  </Button>
                </div>
              </div>
            )}
          </div>


          {/* Your Wellness Space - Gentle, non-pressure language */}
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-accent/5 to-primary/5 border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-center flex items-center justify-center gap-3 text-xl">
                <Flower2 className="h-6 w-6 text-accent" />
                Your Wellness Space
              </CardTitle>
              <CardDescription className="text-center">
                A gentle reflection of your journey — no pressure, just awareness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Calendar className="h-5 w-5 text-primary" />
                    <p className="text-3xl font-bold text-foreground">{totalCheckIns}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Check-ins</p>
                </div>
                
                <div className="h-12 w-px bg-border/50" />
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-accent" />
                    <p className="text-3xl font-bold text-foreground">{totalVisits}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Days visited</p>
                </div>
              </div>

              {totalCheckIns === 0 && (
                <div className="text-center pt-4 mt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground mb-3">
                    When you're ready, your first check-in is waiting.
                  </p>
                  <Button
                    onClick={() => navigate("/tracker")}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent/10"
                    size="sm"
                  >
                    Start when ready
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Tools - Compact row */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => navigate("/condition-tracker")}
                variant="outline"
                size="sm"
                className="border-primary/30 text-foreground hover:bg-primary/10 gap-2"
              >
                <Activity className="h-4 w-4 text-primary" />
                Symptom Tracker
              </Button>
              <Button
                onClick={() => navigate("/insights")}
                variant="outline"
                size="sm"
                className="border-accent/30 text-foreground hover:bg-accent/10 gap-2"
              >
                <BarChart3 className="h-4 w-4 text-accent" />
                View Insights
              </Button>
              <Button
                onClick={() => navigate("/bookings")}
                variant="outline"
                size="sm"
                className="border-primary/30 text-foreground hover:bg-primary/10 gap-2"
              >
                <Calendar className="h-4 w-4 text-primary" />
                Book a Session
              </Button>
            </div>
          </div>

          {/* Recent Wellness Entries */}
          {recentEntries.length > 0 && (
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  Recent Wellness Entries
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/insights")}
                  className="text-accent border-accent hover:bg-accent/10"
                >
                  View All
                </Button>
              </div>
              <div className="grid gap-4">
                {recentEntries.map((entry) => (
                  <Card key={entry.id} className="bg-card/95 backdrop-blur-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">
                              {format(new Date(entry.entry_date), "EEEE, MMMM d, yyyy")}
                            </span>
                            {entry.cycle_phase && (
                              <Badge variant="secondary" className="capitalize">
                                {entry.cycle_phase.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Emotional Score</p>
                              <p className={`text-2xl font-bold ${getEmotionalScoreColor(entry.emotional_score)}`}>
                                {entry.emotional_score ? `${entry.emotional_score}/10` : "N/A"}
                              </p>
                            </div>
                            {entry.emotional_state && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Emotional State</p>
                                <p className="text-sm font-medium text-foreground capitalize">
                                  {entry.emotional_state}
                                </p>
                              </div>
                            )}
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Pain Level</p>
                              <p className={`text-2xl font-bold ${getPainLevelColor(entry.pain_level)}`}>
                                {entry.pain_level ? `${entry.pain_level}/10` : "N/A"}
                              </p>
                            </div>
                            {entry.daily_practices && Object.keys(entry.daily_practices).length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Daily Practices</p>
                                <p className="text-sm font-medium text-foreground">
                                  {Object.values(entry.daily_practices).filter((p: any) => p?.status).length} completed
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Daily Inspiration / Ayah / Hadith */}
          <Card className={`max-w-3xl mx-auto bg-gradient-to-r ${config.theme.gradient} border-${config.theme.primary}/20 shadow-sm overflow-hidden relative`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-${config.theme.primary}`}></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-center flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                {islamicMode ? <Moon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                {islamicMode ? 'Spiritual Shifa' : 'Today\'s Intention'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-8">
              <p className="text-center text-xl text-foreground font-accent italic leading-relaxed px-4">
                {islamicMode 
                  ? '"Verily, in the remembrance of Allah do hearts find rest." (13:28)'
                  : `"Honor your body's wisdom and embrace each ${config.id.replace('_', ' ')} phase with grace."`}
              </p>
            </CardContent>
          </Card>
            </div>
          )}
        </div>
        <Sheet open={activePracticeType !== null} onOpenChange={(open) => !open && setActivePracticeType(null)}>
          <SheetContent side="bottom" className="h-[85vh] sm:h-[600px] sm:max-w-md sm:mx-auto sm:right-0 sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-l-2xl border-t-2 sm:border-t-0 p-0 flex flex-col overflow-hidden bg-background">
            <div className="overflow-y-auto p-6 flex-1">
              <SheetHeader className="mb-6 relative">
                <div className="absolute top-0 right-[-10px] w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                <SheetTitle className="text-3xl font-bold font-accent text-foreground mt-2">
                  {activePracticeType === 'yoga' ? 'Your Daily Flow' : 
                   activePracticeType === 'meditation' ? 'Find Stillness' : 
                   'Spiritual Wisdom'}
                </SheetTitle>
                <SheetDescription className="text-base text-muted-foreground">
                  Perfectly curated for your body and mind today.
                </SheetDescription>
              </SheetHeader>
              
              {activePracticeType && (
                <DailyPractice 
                  type={activePracticeType} 
                  lifeStage={wellnessProfile?.life_stage || null} 
                  spiritualPreference={wellnessProfile?.spiritual_preference || null} 
                />
              )}
              
              <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
                <p className="text-sm text-muted-foreground text-center">Want more options?</p>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (activePracticeType === "emotional") params.set("category", "emotional");
                    else params.set("type", activePracticeType!);
                    navigate(`/content-library?${params.toString()}`);
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore Content Library
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Show welcome screen for non-authenticated or non-onboarded users

  const openEntryDialog = () => setShowEntryDialog(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Install to Home Screen prompt — appears when browser detects app is installable */}
      <InstallPromptBanner />

      {/* Welcome Entry Dialog */}
      <WelcomeEntryDialog open={showEntryDialog} onOpenChange={setShowEntryDialog} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wellness-sage-light via-background to-wellness-lilac-light py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
            {/* Left: Logo + Copy - order-1 on mobile */}
            <div className="text-center lg:text-left order-1 flex flex-col gap-6">
              {/* Logo — branded lockup with name visible */}
              <div className="flex flex-col lg:items-start items-center gap-4">
                <Logo size="xl" showText={false} className="opacity-100" />
                <div className="flex flex-col leading-tight text-center lg:text-left">
                  <span className="font-bold text-mumtaz-plum text-3xl sm:text-4xl tracking-tight font-accent">Mumtaz Health</span>
                  <span className="text-muted-foreground text-sm sm:text-base tracking-wide">Empowering Your Journey</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Body. Your Phase.<br />Your Journey.
              </h1>
              <p className="text-xl md:text-2xl text-wellness-sage-dark font-accent italic leading-relaxed font-semibold">
                "I'm here to support, not judge. Your journey is yours—and you are not alone."
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                As the founder of Mumtaz Health, I bring 30+ years of Ayurvedic wisdom and lived experience to honor your recovery. No pressure, just a gentle sanctuary for wherever you are right now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={openEntryDialog}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="border-2 border-primary/50 text-foreground hover:bg-primary/10 text-lg px-8 py-6"
                >
                  Sign In
                </Button>
              </div>
              {/* Credential badges — builds trust at a glance */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1">
                <span className="text-xs text-muted-foreground bg-primary/5 border border-primary/15 rounded-full px-3 py-1.5">Ayurvedic Practitioner & Guide</span>
                <span className="text-xs text-muted-foreground bg-primary/5 border border-primary/15 rounded-full px-3 py-1.5">International Yoga Teacher Trainer</span>
                <span className="text-xs text-muted-foreground bg-primary/5 border border-primary/15 rounded-full px-3 py-1.5">30+ Years Wisdom</span>
              </div>
            </div>

            {/* Right: Founder Portrait - order-2 on mobile */}
            <div className="flex justify-center lg:justify-end order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-3xl"></div>
                <img
                  src={founderPortrait}
                  alt="Founder portrait - A warm, welcoming guide on your wellness journey"
                  className="relative rounded-3xl shadow-2xl w-full max-w-md object-cover aspect-[3/4]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              From Mumtaz, With Love
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              I am here to walk alongside you as an advisor and practitioner. This space is designed for supportive guidance—please always consult with your physician for medical concerns. You are also welcome to book a personal session with me for deeper, one-on-one wellness support.
            </p>
            <div className="mt-12 opacity-80 transition-opacity hover:opacity-100">
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                The content provided by Mumtaz Health is a supportive wellness tool. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician regarding any medical conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof — Women's Voices */}
      {/* REPLACE THESE QUOTES with real testimonials from women you have supported */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-wellness-sage-light/40 to-wellness-lilac-light/40">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm uppercase tracking-widest text-muted-foreground/60 mb-10 font-medium">
              What women are saying
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-4">
                <p className="text-foreground/80 leading-relaxed italic">
                  "For the first time I feel like something was designed for me — not just for anyone. It actually gets where I am in life."
                </p>
                <p className="text-sm text-muted-foreground font-medium">— Fatima, 42, perimenopause</p>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-4">
                <p className="text-foreground/80 leading-relaxed italic">
                  "I came back from my mat after two years postpartum. Mumtaz's guidance made it feel safe, not scary."
                </p>
                <p className="text-sm text-muted-foreground font-medium">— Sarah, 34, postpartum recovery</p>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-4">
                <p className="text-foreground/80 leading-relaxed italic">
                  "I didn't know how much I needed someone to say 'this phase is real' — and actually explain why my body feels this way."
                </p>
                <p className="text-sm text-muted-foreground font-medium">— Amina, 49, menopause journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background to-wellness-lilac-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              An App That Evolves With You
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The more you engage, the more you unlock tailored guidance suited to your current needs. 
              Changing phases is natural — this app is designed to support you without pressure or comparison.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: Life-Phase Tracker */}
            <Card 
              className="bg-card/90 backdrop-blur-sm border-border hover:shadow-xl transition-all group cursor-pointer active:scale-[0.98] hover:border-primary/30"
              onClick={openEntryDialog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openEntryDialog()}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">Life-Phase Tracker</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Track symptoms, mood, and wellness goals specific to your current phase — fertility, 
                  pregnancy, postpartum, menopause, recovery, and more. Understand your patterns and 
                  unlock insights that grow with you.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2: Holistic Guidance */}
            <Card 
              className="bg-card/90 backdrop-blur-sm border-border hover:shadow-xl transition-all group cursor-pointer active:scale-[0.98] hover:border-accent/30"
              onClick={openEntryDialog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openEntryDialog()}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Flower2 className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl mb-3 group-hover:text-accent transition-colors">Holistic Guidance</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Explore curated guidance across Yoga, Ayurveda-inspired nutrition, and spiritual wellness — 
                  at your own pace, with no pressure. The more you explore, the more personalized it becomes.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3: Movement & Rehab */}
            <Card 
              className="bg-card/90 backdrop-blur-sm border-border hover:shadow-xl transition-all group cursor-pointer active:scale-[0.98] hover:border-primary/30"
              onClick={openEntryDialog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openEntryDialog()}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">Movement & Recovery</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Access gentle movement flows and supportive practices designed for sensitive life moments — 
                  whether you're building confidence, recovering, or simply seeking nurturing movement.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4: The Mumtaz Community */}
            <Card 
              className="bg-card/90 backdrop-blur-sm border-border hover:shadow-xl transition-all group cursor-pointer active:scale-[0.98] hover:border-accent/30"
              onClick={openEntryDialog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openEntryDialog()}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl mb-3 group-hover:text-accent transition-colors">A Supportive Community</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Connect with like-minded women in a safe, non-judgmental space. Share, learn, and 
                  feel supported — without comparison or pressure. Everyone's path is unique.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready when you are.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              No rush. No comparison. Just a gentle space to start — at whatever pace feels right for you today.
            </p>
            <Button
              size="lg"
              onClick={openEntryDialog}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Begin Your Journey
            </Button>
            <p className="text-base text-foreground/70 italic">
              "Your journey is unique and worthy of celebration. I'm here to walk alongside you."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
