import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Sparkles, 
  Leaf, 
  Baby,
  Wind,
  Droplets,
  Mountain,
  Shield,
  MessageCircle,
  Moon,
  Sun,
  Feather,
  HandHeart,
  Flower2,
  CloudSun,
  Stethoscope,
  BookHeart
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { JourneySafetyReminder } from "@/components/journey/JourneySafetyReminder";

// Post-birth phase types
type PostBirthPhase = 
  | "natural_birth"
  | "csection"
  | "postpartum_recovery"
  | "miscarriage_loss"
  | "emotional_support"
  | "not_sure";

interface PostBirthPhaseInfo {
  id: PostBirthPhase;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

const POST_BIRTH_PHASES: PostBirthPhaseInfo[] = [
  {
    id: "natural_birth",
    title: "Recently given birth (natural)",
    subtitle: "Vaginal birth recovery",
    icon: Baby,
    iconColor: "text-wellness-sage",
    bgColor: "bg-wellness-sage/10",
    borderColor: "border-wellness-sage/30"
  },
  {
    id: "csection",
    title: "Recently given birth (C-section)",
    subtitle: "Caesarean recovery",
    icon: Heart,
    iconColor: "text-wellness-lilac",
    bgColor: "bg-wellness-lilac/10",
    borderColor: "border-wellness-lilac/30"
  },
  {
    id: "postpartum_recovery",
    title: "Post-birth recovery",
    subtitle: "Ongoing healing journey",
    icon: Flower2,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    id: "miscarriage_loss",
    title: "Experienced loss",
    subtitle: "Miscarriage or pregnancy loss",
    icon: Feather,
    iconColor: "text-sky-500",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200"
  },
  {
    id: "emotional_support",
    title: "Emotional support needed",
    subtitle: "Processing feelings",
    icon: HandHeart,
    iconColor: "text-rose-400",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200"
  },
  {
    id: "not_sure",
    title: "Not sure / just need gentle guidance",
    subtitle: "Explore all support",
    icon: Moon,
    iconColor: "text-muted-foreground",
    bgColor: "bg-muted/30",
    borderColor: "border-muted/50"
  }
];

// Physical recovery guidance by phase
const PHYSICAL_RECOVERY_GUIDANCE = {
  natural_birth: {
    title: "Gentle recovery after vaginal birth",
    points: [
      "Your body has accomplished something extraordinary. Rest is not a luxury — it's essential.",
      "Pelvic floor awareness can begin gently when you feel ready, with no pressure or timelines.",
      "Gentle breathing and very slow, short walks when appropriate.",
      "Warm, nourishing foods support your body's natural healing process."
    ],
    ayurvedic: "In Ayurveda, the postpartum period is traditionally a time of deep rest — the 'sacred window' of 40 days. Warmth, oiling, and minimal activity honour your body's need to rebuild."
  },
  csection: {
    title: "Gentle recovery after C-section",
    points: [
      "A C-section is major surgery. Your body needs significant time and care to heal.",
      "Focus on gentle breath awareness — reconnecting to your core slowly, without strain.",
      "Nervous system calming practices can support healing. No deep core work or pressure.",
      "Always follow your medical team's guidance. This app offers emotional and lifestyle support only."
    ],
    ayurvedic: "Warmth and grounding are especially important after surgical birth. Warm foods, gentle touch, and rest support your body's natural recovery."
  },
  postpartum_recovery: {
    title: "Ongoing post-birth support",
    points: [
      "Recovery is not linear. Some days will feel harder than others, and that's completely normal.",
      "Listen to your body. There is no rush to 'bounce back' — that phrase has no place here.",
      "Reconnect to gentle movement when it feels right, not when you think you 'should'.",
      "Nourishing yourself is caring for your family. Your wellbeing matters."
    ],
    ayurvedic: "The postpartum period is a time when Vata (air energy) is naturally elevated. Warmth, routine, and grounding foods help restore balance."
  },
  miscarriage_loss: {
    title: "Supporting your body after loss",
    points: [
      "Your body has been through something significant. Physical and emotional rest are both important.",
      "There is no timeline for physical recovery. Listen to what your body needs each day.",
      "Gentle warmth — warm baths, warm drinks, warm foods — can be comforting.",
      "When ready, very gentle breathing or restorative practices may feel supportive."
    ],
    ayurvedic: "Ayurveda recognises grief as a deep Vata imbalance. Warmth, oil massage (when ready), and grounding routines can help soothe the nervous system."
  },
  emotional_support: {
    title: "Gentle physical reconnection",
    points: [
      "When emotions feel heavy, very gentle movement can help — even just stretching.",
      "Breath practices can calm an overwhelmed nervous system.",
      "Restorative yoga positions offer rest without demand.",
      "There is no pressure to move. Rest is a valid choice."
    ],
    ayurvedic: "Supporting the body gently can help process emotions. Warm oil massage, calming routines, and grounding foods offer comfort."
  },
  not_sure: {
    title: "Gentle body awareness",
    points: [
      "You don't need to know exactly what you need right now.",
      "Start with simple awareness — how does your body feel today?",
      "Gentle breathing, slow walks, or simply resting are all valid.",
      "Explore what feels supportive and return to it when needed."
    ],
    ayurvedic: "Ayurveda encourages tuning into your body's natural wisdom. There are no wrong answers — only gentle exploration."
  }
};

// Emotional wellbeing education
const EMOTIONAL_WELLBEING_CONTENT = {
  introduction: "Emotional changes after birth are common and valid. Your body has undergone a profound transformation, and your emotions are adjusting too.",
  experiences: [
    { label: "Emotional overwhelm", description: "Feeling flooded by feelings, whether tears, frustration, or a mix of everything." },
    { label: "Low mood", description: "Feeling flat, sad, or disconnected from joy you expected to feel." },
    { label: "Anxiety or restlessness", description: "Worry that feels hard to settle, racing thoughts, or difficulty relaxing." },
    { label: "Feeling disconnected", description: "Not feeling the instant bond you expected, or feeling distant from yourself." },
    { label: "Exhaustion and fog", description: "Mental cloudiness, difficulty concentrating, or feeling depleted." },
    { label: "Tearfulness", description: "Crying easily or unexpectedly, sometimes without a clear reason." }
  ],
  disclaimer: "This app does not diagnose post-natal depression or replace professional care. If feelings persist, feel overwhelming, or you're worried, please reach out to a healthcare provider.",
  supportMessage: "Recognising when emotions feel heavy or persistent is an act of self-care. Reaching out for professional support is a sign of strength, not failure."
};

// Loss support content
const LOSS_SUPPORT_CONTENT = {
  introduction: "If you've experienced miscarriage or pregnancy loss, please know that your grief is valid. There is no right way to feel, and there is no timeline for healing.",
  points: [
    "Your loss matters. Whatever you are feeling — sadness, anger, numbness, confusion — is valid.",
    "There is no 'moving on' from loss. You may carry this with you, and that is okay.",
    "Grief is not linear. Some days will feel manageable, others impossibly hard.",
    "Self-compassion is essential. Be gentle with yourself in ways you would be gentle with a dear friend.",
    "Rest is important. Your body and heart both need time."
  ],
  practices: [
    "Quiet grounding practices — simply sitting with your feet on the floor, hands on your heart",
    "Gentle breathing — without any goals, just allowing breath to move naturally",
    "Warmth — warm baths, warm drinks, soft blankets",
    "Journaling or reflection if it feels supportive — no pressure to process"
  ],
  spiritualNote: "Some find comfort in prayer, intention, or quiet reflection. Others need space from spiritual practices. Whatever feels right for you is the right approach."
};

// Holistic recommendations
const HOLISTIC_RECOMMENDATIONS = {
  yoga: {
    title: "Gentle Movement",
    icon: Flower2,
    suggestions: [
      "Restorative, grounding practices only",
      "Breath-led movement — no pushing or straining",
      "Supported positions that allow complete rest",
      "Child's pose, gentle hip openers, calming stretches"
    ]
  },
  ayurveda: {
    title: "Ayurvedic Lifestyle",
    icon: Leaf,
    suggestions: [
      "Nourishing daily routines (dinacharya)",
      "Grounding and replenishing practices",
      "Warm oil massage when appropriate",
      "Rest as a non-negotiable priority"
    ]
  },
  nutrition: {
    title: "Nourishing Foods",
    icon: Sun,
    suggestions: [
      "Warm, cooked, easily digestible meals",
      "Regular eating rhythms — nourishment throughout the day",
      "Rebuilding foods: warm soups, stews, gentle spices",
      "No restriction or diet language — this is about nourishing, not depleting"
    ]
  },
  lifestyle: {
    title: "Gentle Living",
    icon: CloudSun,
    suggestions: [
      "Rest as a priority, not an afterthought",
      "Boundaries around visitors, activities, expectations",
      "Reducing overstimulation — screens, noise, demands",
      "Accepting help without guilt"
    ]
  }
};

// Spiritual support options
const SPIRITUAL_SUPPORT = {
  islamic: {
    title: "Islamic Reflections (Optional)",
    icon: Moon,
    practices: [
      "Du'a for patience (sabr) and healing",
      "Dhikr for calm and grounding",
      "Gratitude practice — small moments of shukr",
      "Trusting in Allah's plan through difficulty"
    ]
  },
  universal: {
    title: "Universal Reflections (Optional)",
    icon: Sparkles,
    practices: [
      "Compassion practice — towards yourself",
      "Gratitude reflection — noticing small comforts",
      "Breath awareness as meditation",
      "Intention setting for the day"
    ]
  }
};

// Dosha guidance for post-birth
const DOSHA_POSTBIRTH_GUIDANCE = {
  vata: {
    label: "Vata (Air & Ether)",
    icon: Wind,
    colors: "bg-sky-50 border-sky-200",
    guidance: "Vata is naturally elevated after birth. Prioritise warmth, routine, grounding foods, and calm environments. Avoid cold foods, overstimulation, and irregular schedules."
  },
  pitta: {
    label: "Pitta (Fire & Water)",
    icon: Droplets,
    colors: "bg-amber-50 border-amber-200",
    guidance: "If you're feeling heat, irritation, or inflammation, cooling and calming practices help. Gentle, cooling foods and patience with yourself support balance."
  },
  kapha: {
    label: "Kapha (Earth & Water)",
    icon: Mountain,
    colors: "bg-emerald-50 border-emerald-200",
    guidance: "If you're feeling heavy or stuck, light warm foods and gentle movement when ready can help. Allow yourself deep rest while gradually building energy."
  }
};

// Reflection prompts
const REFLECTION_PROMPTS = [
  "How does my body feel today?",
  "What feels supportive right now?",
  "What do I need more of?",
  "What helped even a little?",
  "What can I let go of today?"
];

export function PostBirthSupportEducation() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<PostBirthPhase | null>(null);
  const [userDosha, setUserDosha] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [reflectionNote, setReflectionNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDosha();
  }, []);

  const fetchUserDosha = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_wellness_profiles')
      .select('primary_dosha, life_stage')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.primary_dosha) {
      setUserDosha(data.primary_dosha.toLowerCase());
    }
    
    // Auto-select phase based on life_stage
    if (data?.life_stage) {
      const stageToPhaseMap: Record<string, PostBirthPhase> = {
        'postpartum': 'postpartum_recovery',
        'postpartum_natural': 'natural_birth',
        'postpartum_csection': 'csection',
        'pregnancy_loss': 'miscarriage_loss',
        'emotional_support': 'emotional_support'
      };
      const mappedPhase = stageToPhaseMap[data.life_stage];
      if (mappedPhase) {
        setSelectedPhase(mappedPhase);
      }
    }
  };

  const handleSaveReflection = async () => {
    if (!reflectionNote.trim()) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to save your reflection");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('wellness_effectiveness')
        .insert({
          user_id: user.id,
          entry_date: new Date().toISOString().split('T')[0],
          reflections: reflectionNote,
          life_stage: 'postbirth',
          practices_tried: [selectedPhase || 'general_support']
        });

      if (error) throw error;
      
      toast.success("Reflection saved");
      setReflectionNote("");
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error("Could not save reflection");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePractitionerClick = () => {
    navigate('/bookings');
  };

  const getDoshaOrder = () => {
    const doshas = ['vata', 'pitta', 'kapha'] as const;
    if (userDosha && doshas.includes(userDosha as typeof doshas[number])) {
      return [userDosha, ...doshas.filter(d => d !== userDosha)] as typeof doshas[number][];
    }
    return doshas;
  };

  const currentPhaseInfo = selectedPhase ? POST_BIRTH_PHASES.find(p => p.id === selectedPhase) : null;
  const physicalGuidance = selectedPhase ? PHYSICAL_RECOVERY_GUIDANCE[selectedPhase] : null;

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-wellness-lilac/10 via-wellness-sage/5 to-wellness-lilac/10 border border-wellness-lilac/20 hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-wellness-lilac/15 text-wellness-lilac">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <span className="font-medium text-foreground text-sm block">
                  Pregnancy, Birth & Post-Birth Support
                </span>
                <span className="text-xs text-muted-foreground">
                  Physical recovery, emotional wellbeing, and loss support
                </span>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-4 space-y-6">
          {/* Safety Reminder */}
          <JourneySafetyReminder 
            journeyType="recovery"
            showPractitionerCTA={true}
            onPractitionerClick={handlePractitionerClick}
            variant="card"
          />

          {/* Reassuring introduction */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-wellness-sage/5 to-wellness-lilac/5 border border-wellness-sage/20">
            <p className="text-sm text-foreground/90 italic leading-relaxed">
              Whether you've recently given birth, are recovering, or processing loss, this space is here to support you with gentleness and without judgement. You can update your journey at any time.
            </p>
          </div>

          {/* Phase Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-wellness-lilac" />
              Where are you in your journey?
            </h4>
            <p className="text-xs text-muted-foreground">
              Select what feels closest to where you are right now. You can change this anytime.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POST_BIRTH_PHASES.map((phase) => {
                const Icon = phase.icon;
                const isSelected = selectedPhase === phase.id;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setSelectedPhase(phase.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? `${phase.bgColor} ${phase.borderColor} ring-2 ring-wellness-lilac/40` 
                        : 'bg-card border-border/50 hover:border-wellness-lilac/30'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-full ${isSelected ? phase.bgColor : 'bg-muted/30'} ${phase.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                          {phase.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{phase.subtitle}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phase-specific content */}
          {selectedPhase && currentPhaseInfo && (
            <div className="space-y-6 pt-2">
              {/* Physical Recovery Section */}
              {physicalGuidance && (
                <Collapsible 
                  open={activeSection === 'physical'} 
                  onOpenChange={(open) => setActiveSection(open ? 'physical' : null)}
                >
                  <CollapsibleTrigger asChild>
                    <button className={`w-full flex items-center justify-between p-3 rounded-lg ${currentPhaseInfo.bgColor} border ${currentPhaseInfo.borderColor} hover:shadow-sm transition-all text-left`}>
                      <div className="flex items-center gap-2">
                        <Flower2 className={`w-4 h-4 ${currentPhaseInfo.iconColor}`} />
                        <span className="font-medium text-foreground text-sm">Physical Recovery</span>
                      </div>
                      {activeSection === 'physical' ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3 space-y-4">
                    <div className="pl-2 space-y-3">
                      <h5 className="text-sm font-medium text-foreground">{physicalGuidance.title}</h5>
                      <ul className="space-y-2">
                        {physicalGuidance.points.map((point, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-wellness-sage mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="p-3 rounded-lg bg-wellness-sage/5 border border-wellness-sage/15 mt-3">
                        <p className="text-xs text-muted-foreground italic">
                          <strong className="text-foreground/80">Ayurvedic wisdom:</strong> {physicalGuidance.ayurvedic}
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Emotional Wellbeing Section */}
              <Collapsible 
                open={activeSection === 'emotional'} 
                onOpenChange={(open) => setActiveSection(open ? 'emotional' : null)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200 hover:shadow-sm transition-all text-left">
                    <div className="flex items-center gap-2">
                      <HandHeart className="w-4 h-4 text-rose-400" />
                      <span className="font-medium text-foreground text-sm">Emotional Wellbeing</span>
                    </div>
                    {activeSection === 'emotional' ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-4">
                  <div className="pl-2 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {EMOTIONAL_WELLBEING_CONTENT.introduction}
                    </p>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-foreground">What you may experience</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {EMOTIONAL_WELLBEING_CONTENT.experiences.map((exp, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100">
                            <p className="text-xs font-medium text-foreground/80">{exp.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Important disclaimer */}
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-start gap-2">
                        <Stethoscope className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-amber-900 font-medium">Important</p>
                          <p className="text-xs text-amber-800/80 mt-1">
                            {EMOTIONAL_WELLBEING_CONTENT.disclaimer}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      {EMOTIONAL_WELLBEING_CONTENT.supportMessage}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Loss Support Section - Only show if relevant */}
              {(selectedPhase === 'miscarriage_loss' || selectedPhase === 'emotional_support') && (
                <Collapsible 
                  open={activeSection === 'loss'} 
                  onOpenChange={(open) => setActiveSection(open ? 'loss' : null)}
                >
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-sky-50 border border-sky-200 hover:shadow-sm transition-all text-left">
                      <div className="flex items-center gap-2">
                        <Feather className="w-4 h-4 text-sky-500" />
                        <span className="font-medium text-foreground text-sm">Loss & Grief Support</span>
                      </div>
                      {activeSection === 'loss' ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3 space-y-4">
                    <div className="pl-2 space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        {LOSS_SUPPORT_CONTENT.introduction}
                      </p>
                      
                      <ul className="space-y-2">
                        {LOSS_SUPPORT_CONTENT.points.map((point, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Heart className="w-3 h-3 text-sky-400 flex-shrink-0 mt-1" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-2 pt-2">
                        <h5 className="text-sm font-medium text-foreground">Gentle practices that may help</h5>
                        <ul className="space-y-1.5">
                          {LOSS_SUPPORT_CONTENT.practices.map((practice, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-sky-400">•</span>
                              <span>{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-xs text-muted-foreground italic p-3 rounded-lg bg-sky-50/50 border border-sky-100">
                        {LOSS_SUPPORT_CONTENT.spiritualNote}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Holistic Support Section */}
              <Collapsible 
                open={activeSection === 'holistic'} 
                onOpenChange={(open) => setActiveSection(open ? 'holistic' : null)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-wellness-sage/10 border border-wellness-sage/20 hover:shadow-sm transition-all text-left">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-wellness-sage" />
                      <span className="font-medium text-foreground text-sm">Holistic Support</span>
                    </div>
                    {activeSection === 'holistic' ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(HOLISTIC_RECOMMENDATIONS).map(([key, rec]) => {
                      const Icon = rec.icon;
                      return (
                        <div key={key} className="p-3 rounded-lg bg-card border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4 text-wellness-sage" />
                            <h5 className="text-sm font-medium text-foreground">{rec.title}</h5>
                          </div>
                          <ul className="space-y-1">
                            {rec.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <span className="text-wellness-sage/70">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Spiritual Support Section */}
              <Collapsible 
                open={activeSection === 'spiritual'} 
                onOpenChange={(open) => setActiveSection(open ? 'spiritual' : null)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-wellness-lilac/10 border border-wellness-lilac/20 hover:shadow-sm transition-all text-left">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-wellness-lilac" />
                      <span className="font-medium text-foreground text-sm">Spiritual & Reflective Support (Optional)</span>
                    </div>
                    {activeSection === 'spiritual' ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-3">
                  <p className="text-xs text-muted-foreground italic pl-2">
                    These are entirely optional. Choose what resonates with you, or skip entirely.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(SPIRITUAL_SUPPORT).map(([key, support]) => {
                      const Icon = support.icon;
                      return (
                        <div key={key} className="p-3 rounded-lg bg-card border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4 text-wellness-lilac" />
                            <h5 className="text-sm font-medium text-foreground">{support.title}</h5>
                          </div>
                          <ul className="space-y-1">
                            {support.practices.map((practice, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <span className="text-wellness-lilac/70">•</span>
                                <span>{practice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Dosha-Aware Guidance */}
              <Collapsible 
                open={activeSection === 'dosha'} 
                onOpenChange={(open) => setActiveSection(open ? 'dosha' : null)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 hover:shadow-sm transition-all text-left">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-amber-500" />
                      <span className="font-medium text-foreground text-sm">Dosha-Aware Guidance</span>
                    </div>
                    {activeSection === 'dosha' ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-3">
                  <p className="text-xs text-muted-foreground italic pl-2">
                    Post-birth, Vata (air energy) is naturally elevated. These insights can help guide supportive choices.
                  </p>
                  <div className="space-y-2">
                    {getDoshaOrder().map((doshaKey) => {
                      const dosha = DOSHA_POSTBIRTH_GUIDANCE[doshaKey as keyof typeof DOSHA_POSTBIRTH_GUIDANCE];
                      const Icon = dosha.icon;
                      const isUserDosha = userDosha === doshaKey;
                      return (
                        <div 
                          key={doshaKey}
                          className={`p-3 rounded-lg border ${dosha.colors} ${isUserDosha ? 'ring-2 ring-wellness-lilac/40' : ''}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4" />
                            <span className="text-xs font-medium text-foreground/80">
                              {dosha.label}
                              {isUserDosha && (
                                <span className="ml-2 text-wellness-lilac">(Your dosha)</span>
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{dosha.guidance}</p>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Reflection & Tracking */}
              <div className="space-y-3 pt-2">
                <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
                  <BookHeart className="w-4 h-4 text-wellness-lilac" />
                  Reflection (Optional)
                </h4>
                <p className="text-xs text-muted-foreground">
                  Save what feels supportive so you can revisit it when needed. No pressure to track or complete anything.
                </p>
                
                {/* Reflection prompts */}
                <div className="flex flex-wrap gap-2">
                  {REFLECTION_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReflectionNote(prev => prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`)}
                      className="text-xs px-3 py-1.5 rounded-full bg-wellness-lilac/10 border border-wellness-lilac/20 text-foreground/80 hover:bg-wellness-lilac/20 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <Textarea
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="What feels true for you today? (Optional)"
                  className="min-h-[80px] text-sm resize-none"
                />
                
                {reflectionNote.trim() && (
                  <Button
                    onClick={handleSaveReflection}
                    disabled={isSaving}
                    variant="outline"
                    size="sm"
                    className="w-full border-wellness-lilac/30 text-foreground hover:bg-wellness-lilac/10"
                  >
                    {isSaving ? 'Saving...' : 'Save Reflection'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* CTA to Content Library */}
          <div className="pt-3 border-t border-border/50">
            <Link 
              to="/content-library?category=Pregnancy"
              className="block"
            >
              <Button 
                variant="outline" 
                className="w-full border-wellness-sage/30 text-foreground hover:bg-wellness-sage/10 hover:border-wellness-sage/50"
              >
                <Leaf className="w-4 h-4 mr-2" />
                Explore supportive practices
              </Button>
            </Link>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default PostBirthSupportEducation;
