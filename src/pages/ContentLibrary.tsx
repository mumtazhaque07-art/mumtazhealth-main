import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, BookOpen, Heart, Sparkles, Apple, Filter, CheckCircle2, Circle, Flame, Wind, Mountain, Flower2, Leaf, Calendar, Users, Lightbulb, Info, HelpCircle, Lock, Crown, Bell, Droplet, AlertTriangle, Search, X, Baby, Salad, Brain, Activity, ChevronDown, ExternalLink } from "lucide-react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { shifaRecipes } from "@/data/recipes";
import { ThemeOfTheMonth } from "@/components/ThemeOfTheMonth";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { InteractiveJournal } from "@/components/InteractiveJournal";
import { builtInContent } from "@/config/builtInContent";

// Standardize Ayurvedic Terms
// moving formatAyurvedic below imports

import yogaImage from "@/assets/wellness-yoga.jpg";
import { HerbalGate, containsHerbalContent } from "@/components/HerbalGate";
import meditationImage from "@/assets/wellness-meditation.jpg";
import nutritionImage from "@/assets/wellness-nutrition.jpg";
import articleImage from "@/assets/wellness-article.jpg";
import lockedImage from "@/assets/locked-content.jpg";
import jointCareChairYoga from "@/assets/joint-care-chair-yoga.jpg";
import jointCareWallYoga from "@/assets/joint-care-wall-yoga.jpg";
import jointCareBedMobility from "@/assets/joint-care-bed-mobility.jpg";
import jointCareAbhyanga from "@/assets/joint-care-abhyanga.jpg";
import jointCareGoldenMilk from "@/assets/joint-care-golden-milk.jpg";
import jointCareKitchari from "@/assets/joint-care-kitchari.jpg";
import jointCareBoneSoup from "@/assets/joint-care-bone-soup.jpg";
import jointCareBreathwork from "@/assets/joint-care-breathwork.jpg";
import jointCareFunctional from "@/assets/joint-care-functional.jpg";
import bloodSugarEnergySupport from "@/assets/blood-sugar-energy-support.jpg";
// Mumtaz brand images
import { 
  brandImages, 
  getBrandImage,
  mumtazYoga1, 
  mumtazYoga2, 
  mumtazYoga3, 
  mumtazYoga4, 
  mumtazYoga5, 
  mumtazYoga6, 
  mumtazYoga7, 
  mumtazYoga8, 
  mumtazYoga9, 
  mumtazYoga10 
} from "@/assets/brandImages";
// New pose images
import seatedMeditation from "@/assets/poses/seated-meditation.jpeg";
import seatedSideStretch from "@/assets/poses/seated-side-stretch.jpeg";
import headToKnee from "@/assets/poses/head-to-knee.jpeg";
import neckShoulderStretch from "@/assets/poses/neck-shoulder-stretch.jpeg";
import prayerPose from "@/assets/poses/prayer-pose.jpeg";
import pyramidPoseBlocks from "@/assets/poses/pyramid-pose-blocks.jpeg";
import camelPose from "@/assets/poses/camel-pose.jpeg";
import lowLungeBlock from "@/assets/poses/low-lunge-block.jpeg";
import seatedWelcome from "@/assets/poses/seated-welcome.jpeg";
import downwardDogBlocks from "@/assets/poses/downward-dog-blocks.jpeg";
// Additional pose images
import lizardPose from "@/assets/poses/lizard-pose.jpg";
import highCobraBlocks from "@/assets/poses/high-cobra-blocks.jpeg";
import trianglePose from "@/assets/poses/triangle-pose.jpeg";
import bridgeLegLift from "@/assets/poses/bridge-leg-lift.jpeg";
import lowLungeHip from "@/assets/poses/low-lunge-hip.jpeg";
import modifiedChaturanga from "@/assets/poses/modified-chaturanga.jpeg";
import threeLegPlank from "@/assets/poses/three-leg-plank.jpeg";
import highLungeTwist from "@/assets/poses/high-lunge-twist.jpeg";
import babyCobraBlocks from "@/assets/poses/baby-cobra-blocks.jpeg";
import birdDogStretch from "@/assets/poses/bird-dog-stretch.jpeg";
// Additional pose images (pregnancy, postpartum, menstrual, recovery phases)
import eagleArmsSeated from "@/assets/poses/eagle-arms-seated.jpeg";
import recliningFigureFour from "@/assets/poses/reclined-figure-four.jpeg";
import supportedFishPose from "@/assets/poses/supported-fish-pose.jpeg";
import halfMoonPose from "@/assets/poses/half-moon-pose.jpeg";
import warriorThree from "@/assets/poses/warrior-three.jpeg";
import locustPose from "@/assets/poses/locust-pose.jpeg";
import fishPoseLegsUp from "@/assets/poses/fish-pose-legs-up.jpeg";
// Additional poses for universal + restorative content
import forearmReclinedHero from "@/assets/poses/forearm-reclined-hero.jpeg";
import compassPose from "@/assets/poses/compass-pose.jpeg";
import revolvedHeadToKnee from "@/assets/poses/revolved-head-to-knee.jpeg";
import legsUpTheWall from "@/assets/poses/legs-up-the-wall.png";
import { Navigation } from "@/components/Navigation";
import { ContentGridSkeleton } from "@/components/ContentSkeleton";
import { DailyReminderButton } from "@/components/DailyReminderButton";
import { PoseSequenceGuide } from "@/components/PoseSequenceGuide";
import { PoseImageSequence } from "@/components/PoseImageSequence";
import { FavoritesQuickAccess } from "@/components/FavoritesQuickAccess";
import { SessionCrossroads } from "@/components/SessionCrossroads";
import { RecipeCard } from "@/components/RecipeCard";
import { trackLastActivity } from "@/components/ReturningUserWelcome";
import { trackRecentActivity } from "@/components/RecentlyViewed";
import { usePregnancySafeMode } from "@/hooks/usePregnancySafeMode";
import { PregnancySafetyIndicator, PregnancySafetyBadge, getContentPregnancySafety } from "@/components/PregnancySafetyIndicator";
import { TrimesterPoseRecommendations } from "@/components/TrimesterPoseRecommendations";
import { AppCompanionDisclaimer } from "@/components/AppCompanionDisclaimer";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { NutritionPhilosophyCard } from "@/components/NutritionPhilosophyCard";
import { YogaPhilosophyCard } from "@/components/YogaPhilosophyCard";
import { SpiritualPhilosophyCard } from "@/components/SpiritualPhilosophyCard";

// Standardize Ayurvedic Terms
const formatAyurvedic = (text?: string) => {
  if (!text) return '';
  const terms = ['dosha', 'vata', 'pitta', 'kapha', 'pranayama', 'yoga', 'ayurveda', 'ayurvedic'];
  let formatted = text;
  terms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    formatted = formatted.replace(regex, (match) => {
      // Don't modify if it's already properly capitalized
      if (match.charAt(0) === match.charAt(0).toUpperCase()) return match;
      return match.charAt(0).toUpperCase() + match.slice(1);
    });
  });
  return formatted;
};
interface WellnessContent {
  id: string;
  title: string;
  description: string;
  detailed_guidance: string;
  content_type: string;
  doshas: string[];
  cycle_phases: string[];
  pregnancy_statuses: string[];
  pregnancy_trimesters: number[];
  benefits: string[];
  tags: string[];
  difficulty_level: string;
  duration_minutes: number;
  image_url: string;
  video_url: string;
  animation_url: string; // Animated instructional videos (available to all tiers)
  audio_url: string;
  tier_requirement: string;
  is_premium: boolean;
  preview_content: string;
  unlock_after_completions: number;
  recommendationReason?: string;
  primary_dosha?: string; // For internal UI matching
}

// Map movement preferences to content tags
const movementToTagsMap: Record<string, string[]> = {
  gentle: ["gentle", "restorative", "relaxation", "calming", "grounding", "slow", "beginner"],
  stretchy: ["stretchy", "fluid", "flow", "vinyasa", "flexibility", "opening", "yin"],
  strong: ["strong", "energising", "dynamic", "power", "strength", "active", "challenging"],
  seated: ["chair-yoga", "seated", "senior-friendly", "accessible", "bed-yoga", "mobility"],
  confidence: ["beginner", "gentle", "grounding", "chair-yoga", "restorative", "accessible", "calming", "slow", "confidence", "rehabilitation", "recovery"],
  recommend: [], // Will be handled based on dosha
};

const getDoshaMovementTags = (primaryDosha: string | null): string[] => {
  switch (primaryDosha) {
    case "vata":
      return ["grounding", "slow", "stability", "gentle", "calming", "restorative"];
    case "pitta":
      return ["cooling", "fluid", "stretchy", "yin", "relaxation", "flow"];
    case "kapha":
      return ["energising", "uplifting", "dynamic", "strong", "active", "power"];
    default:
      return ["gentle", "beginner"];
  }
};



const libraryStages = [
  { id: 'stage1', label: '1. Cycle Health', icon: Flower2, match: ['menstrual', 'follicular', 'ovulatory', 'luteal', 'cycle-health'] },
  { id: 'stage2', label: '2. Fertility', icon: Heart, match: ['fertility', 'pre-conception'] },
  { id: 'stage3', label: '3. Pregnancy', icon: Baby, match: ['pregnancy', 'pregnant', 'trimester-1', 'trimester-2', 'trimester-3'] },
  { id: 'stage4', label: '4. Postpartum', icon: Activity, match: ['postpartum'] },
  { id: 'stage5', label: '5. Perimenopause', icon: Sparkles, match: ['perimenopause'] },
  { id: 'stage6', label: '6. Menopause', icon: Flame, match: ['menopause'] },
  { id: 'stage7', label: '7. Wise Woman', icon: Crown, match: ['post-menopause', 'wise-woman'] },
];

const ContentLibrary = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [userTier, setUserTier] = useState<string>("free");
  const [content, setContent] = useState<WellnessContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeDosha, setActiveDosha] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('tag') || '');
  const [savedContentIds, setSavedContentIds] = useState<Set<string>>(new Set());
  
  // Dialog state
  const [selectedContent, setSelectedContent] = useState<WellnessContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isCrossroadsOpen, setIsCrossroadsOpen] = useState(false);

  const { isPregnancySafeMode, trimester } = usePregnancySafeMode();
  useGlobalLoading(loading);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadContent();
    if (user) {
      loadUserProfile();
      loadSavedContent();
    }
  }, [user]);

  // Handle URL stage param
  useEffect(() => {
    const stageParam = searchParams.get('stage');
    if (stageParam) {
      // Map legacy stage strings to new stage IDs if needed
      const mapping: Record<string, string> = {
        'menopause': 'stage6',
        'perimenopause': 'stage5',
        'pregnancy': 'stage3',
        'fertility': 'stage2',
        'postpartum': 'stage4'
      };
      if (mapping[stageParam]) {
        setActiveTab(mapping[stageParam]);
      } else {
        const found = libraryStages.find(s => s.id === stageParam);
        if (found) setActiveTab(stageParam);
      }
    }
    
    const searchOrTagParam = searchParams.get('search') || searchParams.get('tag');
    if (searchOrTagParam) {
      setSearchQuery(searchOrTagParam);
    }
  }, [searchParams]);

  const loadUserProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_wellness_profiles')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .maybeSingle();
    setUserTier(data?.subscription_tier || 'free');
  };

  const loadContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wellness_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mappedData = data.map(item => ({
        ...item,
        doshas: item.doshas || [],
        benefits: item.benefits || [],
        cycle_phases: item.cycle_phases || [],
        pregnancy_statuses: item.pregnancy_statuses || [],
        tags: item.tags || []
      }));
      setContent([...mappedData, ...builtInContent]);
    } else {
      setContent(builtInContent);
    }
    setLoading(false);
  };

  const loadSavedContent = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_saved_content').select('content_id').eq('user_id', user.id);
    if (data) setSavedContentIds(new Set(data.map(item => item.content_id)));
  };

  const toggleSaveContent = async (contentId: string) => {
    if (!user) {
      toast.error('Please log in to save content');
      return;
    }
    const isSaved = savedContentIds.has(contentId);
    if (isSaved) {
      await supabase.from('user_saved_content').delete().eq('user_id', user.id).eq('content_id', contentId);
      const newSaved = new Set(savedContentIds);
      newSaved.delete(contentId);
      setSavedContentIds(newSaved);
      toast.success('Removed from saved');
    } else {
      await supabase.from('user_saved_content').insert({ user_id: user.id, content_id: contentId });
      const newSaved = new Set(savedContentIds);
      newSaved.add(contentId);
      setSavedContentIds(newSaved);
      toast.success('Saved to your library');
    }
  };

  const getFilteredContent = () => {
    let filtered = content;
    
    if (activeTab === 'favorites') {
      filtered = filtered.filter(c => savedContentIds.has(c.id));
    } else if (activeTab !== 'all') {
      const stage = libraryStages.find(s => s.id === activeTab);
      if (stage) {
        filtered = filtered.filter(item => {
          const itemPhases = Array.isArray(item.cycle_phases) ? item.cycle_phases : [];
          const itemTags = Array.isArray(item.tags) ? item.tags : [];
          
          const hasPhaseMatch = itemPhases.some(p => stage.match.includes(p.toLowerCase()));
          const hasTagMatch = itemTags.some(t => stage.match.includes(t.toLowerCase()));
          
          return hasPhaseMatch || hasTagMatch;
        });
      }
    }
    
    if (activeDosha !== 'all') {
      filtered = filtered.filter(item => {
        const itemDoshas = Array.isArray(item.doshas) ? item.doshas : [];
        return itemDoshas.length === 0 || itemDoshas.includes(activeDosha);
      });
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const itemTags = Array.isArray(item.tags) ? item.tags : [];
        const inTitle = item.title.toLowerCase().includes(query);
        const inDesc = item.description?.toLowerCase().includes(query);
        const inTags = itemTags.some(t => t.toLowerCase().includes(query));
        return inTitle || inDesc || inTags;
      });
    }
    
    return filtered;
  };

  // Maps database image URLs to imports (extracted from original file)
  const resolveImageUrl = (imageUrl: string | null | undefined): string | null => {
    if (!imageUrl) return null;
    const imageUrlMap: Record<string, string> = {
      '/src/assets/poses/seated-meditation.jpeg': seatedMeditation,
      '/src/assets/poses/seated-side-stretch.jpeg': seatedSideStretch,
      '/src/assets/poses/head-to-knee.jpeg': headToKnee,
      '/src/assets/poses/neck-shoulder-stretch.jpeg': neckShoulderStretch,
      '/src/assets/poses/prayer-pose.jpeg': prayerPose,
      '/src/assets/poses/pyramid-pose-blocks.jpeg': pyramidPoseBlocks,
      '/src/assets/poses/camel-pose.jpeg': camelPose,
      '/src/assets/poses/low-lunge-block.jpeg': lowLungeBlock,
      '/src/assets/poses/seated-welcome.jpeg': seatedWelcome,
      '/src/assets/poses/downward-dog-blocks.jpeg': downwardDogBlocks,
      '/src/assets/poses/lizard-pose.jpg': lizardPose,
      '/src/assets/poses/high-cobra-blocks.jpeg': highCobraBlocks,
      '/src/assets/poses/triangle-pose.jpeg': trianglePose,
      '/src/assets/poses/bridge-leg-lift.jpeg': bridgeLegLift,
      '/src/assets/poses/low-lunge-hip.jpeg': lowLungeHip,
      '/src/assets/poses/modified-chaturanga.jpeg': modifiedChaturanga,
      '/src/assets/poses/three-leg-plank.jpeg': threeLegPlank,
      '/src/assets/poses/high-lunge-twist.jpeg': highLungeTwist,
      '/src/assets/poses/baby-cobra-blocks.jpeg': babyCobraBlocks,
      '/src/assets/poses/bird-dog-stretch.jpeg': birdDogStretch,
      '/src/assets/joint-care-chair-yoga.jpg': jointCareChairYoga,
      '/src/assets/joint-care-wall-yoga.jpg': jointCareWallYoga,
      '/src/assets/joint-care-bed-mobility.jpg': jointCareBedMobility,
      '/src/assets/joint-care-abhyanga.jpg': jointCareAbhyanga,
      '/src/assets/joint-care-golden-milk.jpg': jointCareGoldenMilk,
      '/src/assets/joint-care-kitchari.jpg': jointCareKitchari,
      '/src/assets/joint-care-bone-soup.jpg': jointCareBoneSoup,
      '/src/assets/joint-care-breathwork.jpg': jointCareBreathwork,
      '/src/assets/joint-care-functional.jpg': jointCareFunctional,
      '/src/assets/blood-sugar-energy-support.jpg': bloodSugarEnergySupport,
      '/src/assets/poses/eagle-arms-seated.jpeg': eagleArmsSeated,
      '/src/assets/poses/reclined-figure-four.jpeg': recliningFigureFour,
      '/src/assets/poses/supported-fish-pose.jpeg': supportedFishPose,
      '/src/assets/poses/half-moon-pose.jpeg': halfMoonPose,
      '/src/assets/poses/warrior-three.jpeg': warriorThree,
      '/src/assets/poses/locust-pose.jpeg': locustPose,
      '/src/assets/poses/fish-pose-legs-up.jpeg': fishPoseLegsUp,
      '/src/assets/poses/forearm-reclined-hero.jpeg': forearmReclinedHero,
      '/src/assets/poses/compass-pose.jpeg': compassPose,
      '/src/assets/poses/revolved-head-to-knee.jpeg': revolvedHeadToKnee,
      '/src/assets/poses/legs-up-the-wall.png': legsUpTheWall,
    };
    return imageUrlMap[imageUrl] || null;
  };

  const getContentImage = (type: string, tags?: string[], imageUrl?: string, title: string = '') => {
    if (title && title.toLowerCase().includes('legs up')) return legsUpTheWall;
    if (imageUrl) {
      const resolved = resolveImageUrl(imageUrl);
      if (resolved) return resolved;
    }
    // Simple fallback
    switch (type) {
      case 'yoga': return mumtazYoga6;
      case 'meditation': return mumtazYoga8;
      case 'nutrition': return nutritionImage;
      default: return mumtazYoga6;
    }
  };

  const renderContentCard = (item: WellnessContent) => {
    const isLocked = userTier === 'free' && (item.tier_requirement === 'standard' || item.tier_requirement === 'premium' || item.tier_requirement === 'vip');
    
    return (
      <Card key={item.id} className={`overflow-hidden transition-shadow relative ${isLocked ? 'opacity-90' : 'hover:shadow-lg'}`}>
        <div className="h-40 overflow-hidden bg-muted relative group">
          <img 
            src={getContentImage(item.content_type, item.tags, item.image_url, item.title)}
            alt={item.title}
            className={`w-full h-full object-cover ${isLocked ? 'blur-[2px] grayscale-[30%]' : 'transition-transform duration-500 group-hover:scale-105'}`}
          />
          {isLocked && (
            <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center backdrop-blur-[1px]">
              <div className="bg-background/90 p-3 rounded-full mb-2 shadow-sm">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground px-3 py-1 bg-background/80 rounded-full">Premium Content</span>
            </div>
          )}
          <Badge className="absolute top-2 left-2 capitalize text-xs">
            {item.content_type}
          </Badge>
          <Badge className={`absolute top-2 right-2 capitalize text-xs ${item.tier_requirement === 'premium' ? 'bg-amber-500 hover:bg-amber-600 text-white' : item.tier_requirement === 'standard' ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-black/60 text-white'}`}>
            {item.tier_requirement === 'free' ? 'Foundational' : item.tier_requirement === 'standard' ? 'Premium' : item.tier_requirement === 'premium' ? 'VIP' : 'Premium'}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
            <Button
              variant={savedContentIds.has(item.id) ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 text-xs ${savedContentIds.has(item.id) ? 'bg-primary/90 hover:bg-primary' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleSaveContent(item.id); }}
            >
              <Heart className={`h-3.5 w-3.5 mr-1.5 ${savedContentIds.has(item.id) ? 'fill-white' : ''}`} />
              {savedContentIds.has(item.id) ? 'Saved' : 'Save'}
            </Button>
          </div>
          <CardDescription className="line-clamp-2 text-sm">{item.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <Button 
            className={`w-full ${isLocked ? 'bg-muted text-muted-foreground hover:bg-muted' : ''}`}
            variant={isLocked ? 'secondary' : 'default'}
            size="sm"
            onClick={() => {
              if (isLocked) {
                toast("This content requires a premium subscription", {
                  description: "Upgrade your membership to access this entire library.",
                  action: {
                    label: "Upgrade",
                    onClick: () => navigate('/settings')
                  }
                });
              } else {
                setSelectedContent(item); 
                setIsDialogOpen(true);
              }
            }}
          >
            {isLocked ? 'Unlock Access' : 'View Details'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderTierGroup = (tierValue: string, title: string, items: WellnessContent[]) => {
    let tierItems = items.filter(item => item.tier_requirement === tierValue || (!item.tier_requirement && tierValue === 'free'));
    
    // Temporary visual demonstration: If no standard items exist, borrow half from premium so the user can see the 3-tier journey
    const actualStandardCount = items.filter(item => item.tier_requirement === 'standard').length;
    if (tierValue === 'standard' && actualStandardCount === 0) {
      const premiumItems = items.filter(item => item.tier_requirement === 'premium');
      tierItems = premiumItems.slice(0, Math.ceil(premiumItems.length / 2));
    }
    if (tierValue === 'premium' && actualStandardCount === 0) {
      const premiumItems = items.filter(item => item.tier_requirement === 'premium');
      tierItems = premiumItems.slice(Math.ceil(premiumItems.length / 2));
    }

    if (tierItems.length === 0) return null;
    
    return (
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
          {tierValue === 'premium' ? <Crown className="h-5 w-5 text-amber-500" /> : 
           tierValue === 'standard' ? <Sparkles className="h-5 w-5 text-purple-500" /> : 
           <Leaf className="h-5 w-5 text-green-500" />}
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tierItems.map(renderContentCard)}
        </div>
      </div>
    );
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="min-h-screen bg-wellness-sand/30 pb-20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 font-serif">
            The Content Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A simplified, 7-stage holistic journey. Select your current life stage below.
          </p>
        </div>

        {/* Display Theme of the Month for the selected stage (or skip if 'all'/'favorites') */}
        {activeTab !== 'all' && activeTab !== 'favorites' && (
          <ThemeOfTheMonth stageId={activeTab} />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full border-b pb-4 mb-8">
            <TabsList className="w-full justify-start h-auto bg-transparent p-0 flex flex-wrap gap-y-3 gap-x-2">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2"
              >
                All Content
              </TabsTrigger>
              <TabsTrigger 
                value="favorites"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2"
              >
                <Heart className="w-4 h-4 mr-2" /> Favorites
              </TabsTrigger>
              
              <div className="w-px h-8 bg-border mx-2" />
              
              {libraryStages.map(stage => (
                <TabsTrigger 
                  key={stage.id}
                  value={stage.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2"
                >
                  <stage.icon className="w-4 h-4 mr-2" /> {stage.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by keyword, dosha, or issue..." 
                className="pl-9 w-full bg-white/50 backdrop-blur-sm border-wellness-sage/20 rounded-xl focus-visible:ring-wellness-sage"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dosha Filter Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/50 backdrop-blur-sm p-1 rounded-full border border-wellness-sage/20 shadow-sm">
              <button 
                onClick={() => setActiveDosha('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDosha === 'all' ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                All Doshas
              </button>
              <button 
                onClick={() => setActiveDosha('vata')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDosha === 'vata' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Vata
              </button>
              <button 
                onClick={() => setActiveDosha('pitta')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDosha === 'pitta' ? 'bg-red-500 text-white shadow' : 'text-gray-600 hover:text-red-600'}`}
              >
                Pitta
              </button>
              <button 
                onClick={() => setActiveDosha('kapha')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDosha === 'kapha' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:text-green-700'}`}
              >
                Kapha
              </button>
            </div>
          </div>

          {loading ? (
            <ContentGridSkeleton count={6} />
          ) : filteredContent.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Content Yet</h3>
              <p className="text-muted-foreground">Content for this stage is currently being prepared.</p>
            </Card>
          ) : (
            <div>
              {renderTierGroup('free', 'Foundational Journey (Free)', filteredContent)}
              {renderTierGroup('standard', 'Premium Journey (Standard)', filteredContent)}
              {renderTierGroup('premium', 'VIP Journey (Premium)', filteredContent)}
            </div>
          )}
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          {selectedContent && (
            <div className="bg-wellness-sand/10">
              <DialogHeader className="px-6 pt-6 pb-2 border-b bg-background/50 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-2">
                  <DialogTitle className="flex items-center gap-2 flex-1 text-2xl font-serif text-foreground">
                    <span className="line-clamp-2">{selectedContent.title}</span>
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base text-muted-foreground mt-2 font-medium">
                  {selectedContent.description}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] px-6">
                <div className="space-y-6 pt-6 pb-12">
                  
                  {/* Hero Audio/Video Area */}
                  <div className="bg-white rounded-2xl shadow-sm border border-wellness-sage/20 overflow-hidden mb-6">
                    <PoseImageSequence
                      contentId={selectedContent.id}
                      videoUrl={selectedContent.video_url}
                      isPremiumUser={userTier === 'premium'}
                      isPremiumContent={selectedContent.tier_requirement === 'premium'}
                    />
                  </div>

                  {/* The Intention & Practice Sections parsed nicely */}
                  <div className="bg-card text-card-foreground p-6 md:p-8 rounded-2xl shadow-sm border border-border">
                    <div className="prose prose-wellness max-w-none dark:prose-invert">
                      <MarkdownRenderer content={selectedContent.detailed_guidance || "Please follow along with the video/audio."} />
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-border flex flex-col items-center justify-center text-center bg-wellness-sage/10 rounded-3xl p-8">
                    <div className="bg-background p-3 rounded-full shadow-sm mb-4">
                      <BookOpen className="w-8 h-8 text-wellness-sage" />
                    </div>
                    <h4 className="font-serif text-2xl text-foreground mb-3">How did this practice feel?</h4>
                    <p className="text-base text-muted-foreground mb-6 max-w-md leading-relaxed">
                      Your journey is entirely unique. Take a moment to pause, log your reflections, and track your healing over time.
                    </p>
                    <Button 
                      onClick={() => setIsJournalOpen(true)}
                      className="bg-wellness-sage hover:bg-wellness-sage/90 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      Log My Journey
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {selectedContent && (
        <InteractiveJournal 
          contentTitle={selectedContent.title}
          isOpen={isJournalOpen}
          onClose={() => setIsJournalOpen(false)}
        />
      )}
    </div>
  );
};

export default ContentLibrary;
