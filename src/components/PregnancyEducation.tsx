import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Leaf, 
  Baby, 
  Heart,
  Droplets,
  Wind,
  Mountain,
  Moon,
  Sun,
  CloudSun,
  Flower2,
  TreeDeciduous,
  Shield,
  CircleDot
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AppCompanionDisclaimer } from "@/components/AppCompanionDisclaimer";
import { PractitionerSupportCTA } from "@/components/PractitionerSupportCTA";
import { 
  JourneyTimeline, 
  JourneyPhaseCard, 
  PregnancySafePoseGrid,
  ConnectWithBabyMeditation,
  JourneySafetyReminder 
} from "@/components/journey";

interface PregnancyEducationProps {
  trimester: string;
  week?: number | null;
}

interface TrimesterInfo {
  title: string;
  subtitle: string;
  meaning: string;
  energyMood: string;
  bodyResponse: string;
  babySize: {
    metaphor: string;
    description: string;
  };
  visualTheme: {
    gradient: string;
    borderColor: string;
    iconBg: string;
    accentColor: string;
  };
  doshaGuidance: {
    vata: { text: string; suggestions: string[] };
    pitta: { text: string; suggestions: string[] };
    kapha: { text: string; suggestions: string[] };
  };
  lifestyleSuggestions: {
    yoga: string;
    rhythm: string;
    breath: string;
  };
  libraryTags: string[];
}

const TRIMESTER_EDUCATION: Record<string, TrimesterInfo> = {
  "1": {
    title: "First Trimester",
    subtitle: "A time of quiet beginnings",
    meaning: "Your body is doing remarkable, invisible work right now. The first weeks are a time of profound creation, even when it doesn't feel like much is happening outwardly.",
    energyMood: "Fatigue is very common — your body is using tremendous energy for growth. Emotions may feel heightened as hormones shift. Be gentle with yourself.",
    bodyResponse: "Nausea, breast tenderness, and digestive changes are all normal responses. Rest when you need to. Your appetite may fluctuate, and that's perfectly okay.",
    babySize: {
      metaphor: "From a tiny seed to a sweet raspberry",
      description: "In these early weeks, your little one grows from a single cell to about the size of a raspberry. A beautiful beginning."
    },
    visualTheme: {
      gradient: "from-wellness-sage/10 via-wellness-lilac/5 to-wellness-sage/10",
      borderColor: "border-wellness-sage/30",
      iconBg: "bg-wellness-sage/15",
      accentColor: "text-wellness-sage"
    },
    doshaGuidance: {
      vata: { 
        text: "Warmth and grounding are essential now. Focus on regular, small meals and calming routines. Avoid cold foods and overstimulation.",
        suggestions: ["Warm, nourishing soups", "Gentle walking", "Early bedtime"]
      },
      pitta: { 
        text: "Cooling, nourishing foods help balance any heat or intensity. Gentle movement and calming practices support your wellbeing.",
        suggestions: ["Cool, sweet foods", "Time in nature", "Calming breathwork"]
      },
      kapha: { 
        text: "Light, easily digestible meals may feel most supportive. Gentle movement helps with any heaviness or sluggishness.",
        suggestions: ["Light, warm meals", "Morning walks", "Gentle stretching"]
      },
    },
    lifestyleSuggestions: {
      yoga: "Restorative and gentle floor-based practices. Supported poses help conserve energy while maintaining connection to your body.",
      rhythm: "Rest is your priority. Honor afternoon naps, early evenings, and slow mornings. Your body is working hard.",
      breath: "Gentle belly breathing and calming exhales. No breath holds. Simply observe and soften."
    },
    libraryTags: ["pregnancy", "first-trimester", "gentle"],
  },
  "2": {
    title: "Second Trimester",
    subtitle: "Finding your rhythm",
    meaning: "Often called the 'golden trimester,' many women find renewed energy during this time. Your baby is growing rapidly, and you may start to feel those first precious movements.",
    energyMood: "Energy often returns, and many women feel more balanced emotionally. You may feel a beautiful sense of connection as your bump becomes visible.",
    bodyResponse: "Your body is adapting beautifully. Back discomfort may begin, and your center of gravity shifts. Gentle movement and stretching can be very supportive.",
    babySize: {
      metaphor: "From a lemon to a mango",
      description: "Your baby grows from about the size of a lemon to a lovely mango. You may start feeling those first gentle flutters."
    },
    visualTheme: {
      gradient: "from-wellness-lilac/10 via-amber-50/30 to-wellness-lilac/10",
      borderColor: "border-wellness-lilac/30",
      iconBg: "bg-wellness-lilac/15",
      accentColor: "text-wellness-lilac"
    },
    doshaGuidance: {
      vata: { 
        text: "Continue with grounding practices. Warm oil massage (avoiding the belly) and regular routines support your growing body.",
        suggestions: ["Warm oil self-massage", "Steady daily routines", "Grounding foods"]
      },
      pitta: { 
        text: "Stay cool and avoid overheating. Gentle swimming or walking in nature can be wonderfully balancing.",
        suggestions: ["Swimming or water time", "Shade and cool spaces", "Cooling coconut oil"]
      },
      kapha: { 
        text: "This is a lovely time for gentle, invigorating movement. Keep meals light and warming to support digestion.",
        suggestions: ["Daily gentle walks", "Light, spiced meals", "Morning movement"]
      },
    },
    lifestyleSuggestions: {
      yoga: "Modified standing poses and hip-openers. Gentle strength-building to support your changing center of gravity.",
      rhythm: "A balanced pace — gentle activity paired with rest. Connect with your baby through quiet moments.",
      breath: "Cooling breaths if feeling warm, grounding breaths for stability. Always gentle, never forced."
    },
    libraryTags: ["pregnancy", "second-trimester", "energising"],
  },
  "3": {
    title: "Third Trimester",
    subtitle: "Preparing for arrival",
    meaning: "The final stretch of your pregnancy journey. Your body is preparing for birth, and your baby is getting ready to meet you. This is a sacred time of anticipation.",
    energyMood: "Energy may dip again as your body works hard. Rest becomes increasingly important. Emotions may include excitement, anxiety, and nesting instincts.",
    bodyResponse: "Discomfort may increase as baby grows. Sleep can be challenging. Focus on rest, gentle stretches, and preparing your body and mind for birth.",
    babySize: {
      metaphor: "From a papaya to a watermelon",
      description: "Your baby grows from about the size of a papaya to a full watermelon. They're getting ready to meet you, practicing breathing and moving."
    },
    visualTheme: {
      gradient: "from-mumtaz-plum/5 via-wellness-lilac/10 to-mumtaz-plum/5",
      borderColor: "border-mumtaz-plum/20",
      iconBg: "bg-mumtaz-plum/10",
      accentColor: "text-mumtaz-plum"
    },
    doshaGuidance: {
      vata: { 
        text: "Extra rest, warmth, and grounding are vital now. Calm environments and gentle breathing practices prepare you for birth.",
        suggestions: ["Warm baths", "Soft music and calm spaces", "Nurturing support"]
      },
      pitta: { 
        text: "Stay cool and patient. Avoid pushing yourself. Cooling foods and calming practices help maintain balance.",
        suggestions: ["Cool compresses", "Patience with yourself", "Release perfectionism"]
      },
      kapha: { 
        text: "Light movement prevents stagnation. Gentle walking and breathing practices support your energy and prepare you for birth.",
        suggestions: ["Short, gentle walks", "Uplifting essential oils", "Light, warm meals"]
      },
    },
    lifestyleSuggestions: {
      yoga: "Supported yin and restorative practices. Focus on hip-openers and relaxation to prepare body and mind for birth.",
      rhythm: "Prioritize rest and nesting. Create calm, supportive spaces. This is a time for gentleness and preparation.",
      breath: "Birth-preparation breathing — long, slow exhales. Practice relaxing your body with each breath."
    },
    libraryTags: ["pregnancy", "third-trimester", "restorative"],
  },
};

// Trimester-specific visual icons
const TrimesterIcon = ({ trimester }: { trimester: string }) => {
  switch (trimester) {
    case "1":
      return <Leaf className="w-5 h-5" />;
    case "2":
      return <Sun className="w-5 h-5" />;
    case "3":
      return <Moon className="w-5 h-5" />;
    default:
      return <Baby className="w-5 h-5" />;
  }
};

// Dosha visual cues
const DoshaVisual = ({ dosha, isUserDosha }: { dosha: string; isUserDosha: boolean }) => {
  const config = {
    vata: {
      icon: Wind,
      colors: "bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-800",
      iconColor: "text-sky-500",
      label: "Vata (Air & Ether)",
      visualCue: "Grounding • Stillness • Warmth"
    },
    pitta: {
      icon: Droplets,
      colors: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
      iconColor: "text-amber-500",
      label: "Pitta (Fire & Water)",
      visualCue: "Cooling • Soothing • Patience"
    },
    kapha: {
      icon: Mountain,
      colors: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
      iconColor: "text-emerald-600",
      label: "Kapha (Earth & Water)",
      visualCue: "Lightness • Movement • Energy"
    }
  };

  const { icon: Icon, colors, iconColor, label, visualCue } = config[dosha as keyof typeof config];

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${colors} ${isUserDosha ? 'ring-2 ring-wellness-lilac/40' : ''}`}>
      <div className={`p-1.5 rounded-full bg-white/50 dark:bg-black/20 ${iconColor}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-foreground/80 truncate">
            {label}
          </span>
          {isUserDosha && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-wellness-lilac/20 text-wellness-lilac whitespace-nowrap">
              Your dosha
            </span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">{visualCue}</p>
      </div>
    </div>
  );
};

// Get exact baby size based on week
const getBabySizeForWeek = (week: number | null | undefined, trimester: string) => {
  if (!week || week < 4 || week > 42) {
    // Fall back to general trimester descriptions if week is missing or out of range
    if (trimester === "1") return { metaphor: "From a tiny seed to a sweet peach", description: "Your baby is undertaking the most rapid and miraculous growth phase right now.", emoji: "🫘" };
    if (trimester === "2") return { metaphor: "From a lemon to a grapefruit", description: "Your baby is growing stronger and you may soon feel those beautiful first flutters.", emoji: "🍋" };
    if (trimester === "3") return { metaphor: "From a squash to a watermelon", description: "Your baby is plumping up, practicing breathing, and preparing to meet you.", emoji: "🍉" };
    return { metaphor: "Growing every day", description: "Your baby is growing beautifully.", emoji: "🌱" };
  }

  const sizes: Record<number, { metaphor: string; description: string; emoji: string }> = {
    4: { metaphor: "The size of a poppy seed", description: "Your baby is tiny but already deeply anchored in their new home.", emoji: "🌱" },
    5: { metaphor: "The size of an apple seed", description: "The foundation for their tiny heart and nervous system is forming.", emoji: "🍎" },
    6: { metaphor: "The size of a sweet pea", description: "That tiny heart is beating! A miracle unfolding minute by minute.", emoji: "🫛" },
    7: { metaphor: "The size of a blueberry", description: "Arm and leg buds are starting to emerge. Growth is proceeding rapidly.", emoji: "🫐" },
    8: { metaphor: "The size of a raspberry", description: "Fingers and toes are lightly webbed and beginning to form.", emoji: "🍓" },
    9: { metaphor: "The size of an olive", description: "Tiny joints are developing, and your baby is starting to make small movements.", emoji: "🫒" },
    10: { metaphor: "The size of a prune", description: "Bones are beginning to harden. The vital organs are all in place.", emoji: "🫐" },
    11: { metaphor: "The size of a strawberry", description: "Your baby is starting to stretch and kick, though you can't feel it just yet.", emoji: "🍓" },
    12: { metaphor: "The size of a plum", description: "Reflexes are developing! Your baby might be opening and closing their tiny fingers.", emoji: "🍑" },
    13: { metaphor: "The size of a peach", description: "Vocal cords are forming. You are officially entering the second trimester!", emoji: "🍑" },
    14: { metaphor: "The size of a lemon", description: "Your baby can squint, frown, and make tiny facial expressions.", emoji: "🍋" },
    15: { metaphor: "The size of an apple", description: "Skin is forming, though it is still incredibly thin and translucent.", emoji: "🍎" },
    16: { metaphor: "The size of an avocado", description: "Your baby's hearing is developing. They may soon be able to hear your voice.", emoji: "🥑" },
    17: { metaphor: "The size of a pear", description: "The umbilical cord is growing thicker and stronger to nourish your growing baby.", emoji: "🍐" },
    18: { metaphor: "The size of a bell pepper", description: "If you haven't yet, you may soon feel those first gentle flutters (quickening).", emoji: "🫑" },
    19: { metaphor: "The size of a large tomato", description: "A protective coating called vernix is forming over their delicate skin.", emoji: "🍅" },
    20: { metaphor: "The size of a banana", description: "Halfway there! Your baby is practicing swallowing and growing stronger every day.", emoji: "🍌" },
    21: { metaphor: "The size of a carrot", description: "Your baby's sleep and wake cycles are becoming more established.", emoji: "🥕" },
    22: { metaphor: "The size of a papaya", description: "Their grip is becoming quite strong, and they may hold onto their umbilical cord.", emoji: "🍈" },
    23: { metaphor: "The size of a grapefruit", description: "Billions of brain cells are developing. They are increasingly aware of their environment.", emoji: "🍊" },
    24: { metaphor: "The size of an ear of corn", description: "Lungs are developing the branches of the respiratory tree.", emoji: "🌽" },
    25: { metaphor: "The size of a rutabaga", description: "Fat is starting to build up, helping to smooth out their skin.", emoji: "🧅" },
    26: { metaphor: "The size of a zucchini", description: "They submerge themselves in amniotic fluid, taking tiny 'practice breaths'.", emoji: "🥒" },
    27: { metaphor: "The size of a cauliflower", description: "Your baby can recognize your voice clearly now. Talk and sing to them!", emoji: "🥦" },
    28: { metaphor: "The size of an eggplant", description: "Welcome to the third trimester! Their eyes can now open and close.", emoji: "🍆" },
    29: { metaphor: "The size of a butternut squash", description: "Muscles and lungs are maturing rapidly to prepare for the outside world.", emoji: "🫑" },
    30: { metaphor: "The size of a large cabbage", description: "Amniotic fluid begins to decrease as your baby takes up more and more room.", emoji: "🥬" },
    31: { metaphor: "The size of a coconut", description: "Your baby is putting on healthy weight, getting plumper and rounder.", emoji: "🥥" },
    32: { metaphor: "The size of an acorn squash", description: "Almost all major organs are fully formed, except the lungs which are still maturing.", emoji: "🎃" },
    33: { metaphor: "The size of a pineapple", description: "Your baby's skull bones are still separate and flexible to allow for delivery.", emoji: "🍍" },
    34: { metaphor: "The size of a cantaloupe", description: "Their central nervous system is maturing and their lungs are nearly fully developed.", emoji: "🍈" },
    35: { metaphor: "The size of a honeydew", description: "Kidneys are fully developed, and the liver can process some waste products.", emoji: "🍈" },
    36: { metaphor: "The size of a romaine lettuce", description: "Your baby is getting ready to drop lower into your pelvis as birth approaches.", emoji: "🥬" },
    37: { metaphor: "The size of a winter melon", description: "Your baby is considered 'early term' and is practicing all the skills needed for birth.", emoji: "🍈" },
    38: { metaphor: "The size of a small pumpkin", description: "Organ function continues to refine. Your little one is nearly ready to meet you.", emoji: "🎃" },
    39: { metaphor: "The size of a mini-watermelon", description: "Your baby is considered 'full term' and is waiting for the perfect moment to arrive.", emoji: "🍉" },
    40: { metaphor: "The size of a jackfruit", description: "Your due date is here! Remember, babies arrive on their own beautiful timeline.", emoji: "🍉" },
    41: { metaphor: "Still growing safely", description: "Your baby is just perfectly cozy and taking a little extra time to prepare for the world.", emoji: "🍉" },
    42: { metaphor: "Any day now", description: "Your baby is fully cooked and ready to go. Hang in there!", emoji: "🍉" },
  };

  return sizes[week] || sizes[40];
};

// Baby size visual with gentle fruit/nature metaphor
const BabySizeVisual = ({ trimester, week }: { trimester: string; week?: number | null }) => {
  const dynamicSize = getBabySizeForWeek(week, trimester);

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-wellness-lilac/5 to-wellness-sage/5 border border-wellness-lilac/15">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-card flex items-center justify-center text-2xl shadow-sm">
        {dynamicSize.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground/90 mb-1">
          {dynamicSize.metaphor}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {dynamicSize.description}
        </p>
      </div>
    </div>
  );
};

// Lifestyle suggestion card with icon
const LifestyleSuggestionCard = ({ 
  type, 
  suggestion 
}: { 
  type: "yoga" | "rhythm" | "breath"; 
  suggestion: string;
}) => {
  const config = {
    yoga: {
      icon: Flower2,
      title: "Gentle yoga",
      bgColor: "bg-wellness-sage/10",
      borderColor: "border-wellness-sage/20",
      iconColor: "text-wellness-sage"
    },
    rhythm: {
      icon: CloudSun,
      title: "Daily rhythm",
      bgColor: "bg-wellness-lilac/10",
      borderColor: "border-wellness-lilac/20",
      iconColor: "text-wellness-lilac"
    },
    breath: {
      icon: Wind,
      title: "Breath practice",
      bgColor: "bg-sky-50 dark:bg-sky-900/20",
      borderColor: "border-sky-200 dark:border-sky-800",
      iconColor: "text-sky-500"
    }
  };

  const { icon: Icon, title, bgColor, borderColor, iconColor } = config[type];

  return (
    <div className={`p-3 rounded-lg ${bgColor} border ${borderColor}`}>
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded-full bg-white/50 dark:bg-black/20 ${iconColor} flex-shrink-0 mt-0.5`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground/80 mb-1">{title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{suggestion}</p>
        </div>
      </div>
    </div>
  );
};

export function PregnancyEducation({ trimester, week }: PregnancyEducationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userDosha, setUserDosha] = useState<string | null>(null);
  const [userSpiritualPreference, setUserSpiritualPreference] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDosha();
  }, []);

  const fetchUserDosha = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_wellness_profiles')
      .select('primary_dosha, spiritual_preference')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.primary_dosha) {
      setUserDosha(data.primary_dosha.toLowerCase());
    }
    if (data?.spiritual_preference) {
      setUserSpiritualPreference(data.spiritual_preference);
    }
  };

  const trimesterInfo = TRIMESTER_EDUCATION[trimester];
  
  if (!trimesterInfo) return null;

  const getDoshaOrder = () => {
    const doshas = ['vata', 'pitta', 'kapha'];
    if (userDosha && doshas.includes(userDosha)) {
      return [userDosha, ...doshas.filter(d => d !== userDosha)];
    }
    return doshas;
  };

  const handlePractitionerAction = () => {
    navigate('/bookings');
  };

  // Define journey phases for timeline
  const journeyPhases = [
    { id: "1", label: "First Trimester", subtitle: "Quiet beginnings", isActive: trimester === "1" },
    { id: "2", label: "Second Trimester", subtitle: "Finding rhythm", isActive: trimester === "2" },
    { id: "3", label: "Third Trimester", subtitle: "Preparing", isActive: trimester === "3" },
  ];

  // Phase card data for current trimester
  const phaseCardData = {
    phaseId: trimester,
    title: `This phase of your pregnancy`,
    subtitle: trimesterInfo.subtitle,
    description: trimesterInfo.meaning,
    babySize: getBabySizeForWeek(week, trimester),
    whatYouMayNotice: [
      trimesterInfo.energyMood,
      trimesterInfo.bodyResponse,
    ],
    holisticNote: userDosha ? trimesterInfo.doshaGuidance[userDosha as keyof typeof trimesterInfo.doshaGuidance]?.text : undefined,
    visualTheme: trimesterInfo.visualTheme,
  };

  return (
    <div className="space-y-6">
      {/* Safety Reminder - Always visible */}
      <JourneySafetyReminder 
        journeyType="pregnancy" 
        showPractitionerCTA={false}
        variant="compact"
      />

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className={`w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${trimesterInfo.visualTheme.gradient} border ${trimesterInfo.visualTheme.borderColor} hover:shadow-md transition-all text-left`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${trimesterInfo.visualTheme.iconBg} ${trimesterInfo.visualTheme.accentColor}`}>
                <TrimesterIcon trimester={trimester} />
              </div>
              <div>
                <span className="font-medium text-foreground text-sm block">
                  {trimesterInfo.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {trimesterInfo.subtitle}
                </span>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-4 space-y-6">
          {/* Visual Timeline */}
          <JourneyTimeline 
            phases={journeyPhases}
            currentPhase={trimester}
            journeyType="pregnancy"
          />

          {/* Phase Card with reflection */}
          <JourneyPhaseCard 
            phaseData={phaseCardData}
            journeyType="pregnancy"
            userDosha={userDosha}
          />

          {/* Where you are in your journey */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
              <CircleDot className="w-4 h-4 text-wellness-lilac" />
              Where you are in your journey
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {trimesterInfo.meaning}
            </p>
          </div>

          {/* Energy & Mood */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm">How energy and mood may feel</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {trimesterInfo.energyMood}
            </p>
          </div>

          {/* Body Response */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm">How your body may respond</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {trimesterInfo.bodyResponse}
            </p>
          </div>

          {/* Lifestyle Suggestions with visuals */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TreeDeciduous className="w-4 h-4 text-wellness-sage" />
              <h4 className="font-medium text-foreground text-sm">Gentle support suggestions</h4>
            </div>
            <p className="text-xs text-muted-foreground italic">
              These are optional ideas — always listen to your body first.
            </p>
            <div className="grid gap-2">
              <LifestyleSuggestionCard type="yoga" suggestion={trimesterInfo.lifestyleSuggestions.yoga} />
              <LifestyleSuggestionCard type="rhythm" suggestion={trimesterInfo.lifestyleSuggestions.rhythm} />
              <LifestyleSuggestionCard type="breath" suggestion={trimesterInfo.lifestyleSuggestions.breath} />
            </div>
          </div>

          {/* Ayurvedic/Dosha Insight with visual cues */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-wellness-lilac" />
              <h4 className="font-medium text-foreground text-sm">Holistic insight by dosha</h4>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Each body is unique. These are gentle suggestions based on Ayurvedic wisdom for pregnancy.
            </p>
            
            {/* Dosha visual indicators */}
            <div className="flex flex-wrap gap-2 pb-2">
              {getDoshaOrder().map((dosha) => (
                <DoshaVisual 
                  key={dosha} 
                  dosha={dosha} 
                  isUserDosha={userDosha === dosha} 
                />
              ))}
            </div>
            
            {/* Detailed dosha guidance */}
            <div className="space-y-3">
              {getDoshaOrder().map((dosha) => {
                const guidance = trimesterInfo.doshaGuidance[dosha as keyof typeof trimesterInfo.doshaGuidance];
                const isUser = userDosha === dosha;
                
                return (
                  <div 
                    key={dosha}
                    className={`p-4 rounded-xl border transition-all ${
                      dosha === 'vata' ? 'bg-sky-50/50 border-sky-200 dark:bg-sky-900/10 dark:border-sky-800' :
                      dosha === 'pitta' ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800' :
                      'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800'
                    } ${isUser ? 'ring-2 ring-wellness-lilac/40 shadow-sm' : ''}`}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {guidance.text}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {guidance.suggestions.map((suggestion, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] px-2 py-1 rounded-full bg-white/60 dark:bg-black/20 text-foreground/70 border border-black/5"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Islamic Pre-birth Traditions (Third Trimester only) */}
          {trimester === "3" && userSpiritualPreference === "islamic" && (
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-mumtaz-plum" />
                <h4 className="font-semibold text-foreground text-base text-mumtaz-plum">Prophetic Traditions for Birth</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As you near delivery, these beautiful Islamic practices can help bring spiritual ease and blessings to you and your baby.
              </p>
              <div className="space-y-3">
                <div className="bg-mumtaz-plum/5 border border-mumtaz-plum/10 p-4 rounded-xl">
                  <h5 className="font-medium text-foreground text-sm mb-1">1. Reciting Surah Maryam</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    It is highly recommended to recite or listen to Surah Maryam during the later stages of pregnancy and labor. It reminds us of Maryam (Mary)'s strength and faith during her miraculous birth, bringing profound peace.
                  </p>
                </div>
                <div className="bg-wellness-sage/5 border border-wellness-sage/20 p-4 rounded-xl">
                  <h5 className="font-medium text-foreground text-sm mb-1">2. Du'as for Ease</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Make abundant Du'a for an easy delivery. A powerful prophetic du'a is: <br/><br/>
                    <em className="text-foreground/80 font-medium">"Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'alul-hazna idha shi'ta sahla."</em><br/><br/>
                    (O Allah, there is no ease except in that which You have made easy, and You make the difficulty, if You wish, easy.)
                  </p>
                </div>
                <div className="bg-wellness-lilac/10 border border-wellness-lilac/20 p-4 rounded-xl">
                  <h5 className="font-medium text-foreground text-sm mb-1">3. Preparing for Adhan & Tahneek</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When the baby arrives, it is a Sunnah to gently recite the **Adhan** in their right ear and the **Iqamah** in their left. Another beautiful tradition is **Tahneek**: gently rubbing a softened piece of date on the baby's upper palate before their first feed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pregnancy-safe pose cards */}
          <PregnancySafePoseGrid 
            trimester={parseInt(trimester)} 
            maxPoses={4} 
          />

          {/* Connect with baby meditation */}
          <ConnectWithBabyMeditation />

          {/* CTA to Content Library */}
          <div className="pt-3 border-t border-border/50">
            <Link 
              to={`/content-library?category=Pregnancy&trimester=${trimester}`}
              className="block"
            >
              <Button 
                variant="outline" 
                className="w-full border-wellness-lilac/30 text-foreground hover:bg-wellness-lilac/10 hover:border-wellness-lilac/50"
              >
                <Leaf className="w-4 h-4 mr-2" />
                Explore practices that support you right now
              </Button>
            </Link>
          </div>

          {/* Full safety reminder with practitioner CTA */}
          <JourneySafetyReminder 
            journeyType="pregnancy" 
            showPractitionerCTA={true}
            onPractitionerClick={handlePractitionerAction}
            variant="card"
          />

          {/* App Companion Disclaimer */}
          <AppCompanionDisclaimer variant="subtle" className="pt-2" />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
