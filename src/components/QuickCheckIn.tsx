import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Sparkles, ArrowRight, Star, StarOff, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CHECKIN_MESSAGES, JOURNEY_MESSAGES } from "@/constants/appMessaging";

const feelingCategories = [
  {
    name: "Physical Home",
    feelings: ["tired", "pain", "exhausted", "post-surgery", "period-pain"]
  },
  {
    name: "Body & Digestion",
    feelings: ["bloated", "digestive", "back-ache", "neck-shoulder", "joint-stiffness", "hot-flushes", "cant-sleep"]
  },
  {
    name: "Mind & Heart",
    feelings: ["hormonal", "emotional", "restless", "low-mood", "overwhelmed", "stressed"]
  }
];

const feelingOptions = [
  { id: "tired", label: "Tired", emoji: "😴", color: "from-blue-50 to-indigo-50 border-blue-100" },
  { id: "pain", label: "In pain", emoji: "😣", color: "from-red-50 to-orange-50 border-red-100" },
  { id: "exhausted", label: "Exhausted", emoji: "😩", color: "from-slate-50 to-zinc-50 border-slate-200" },
  { id: "post-surgery", label: "Post-surgery", emoji: "🏥", color: "from-sky-50 to-cyan-50 border-sky-100" },
  { id: "period-pain", label: "Period pain", emoji: "🩸", color: "from-rose-50 to-red-50 border-rose-100" },
  { id: "hormonal", label: "Hormonal", emoji: "🌙", color: "from-purple-50 to-pink-50 border-purple-100" },
  { id: "emotional", label: "Emotional", emoji: "💧", color: "from-cyan-50 to-blue-50 border-cyan-100" },
  { id: "restless", label: "Restless", emoji: "🦋", color: "from-teal-50 to-emerald-50 border-teal-100" },
  { id: "bloated", label: "Bloated", emoji: "🎈", color: "from-amber-50 to-yellow-50 border-amber-100" },
  { id: "cant-sleep", label: "Can't sleep", emoji: "🌃", color: "from-indigo-50 to-violet-50 border-indigo-100" },
  { id: "hot-flushes", label: "Hot flushes", emoji: "🔥", color: "from-orange-50 to-red-50 border-orange-100" },
  { id: "digestive", label: "Digestive", emoji: "🍵", color: "from-green-50 to-lime-50 border-green-100" },
  { id: "back-ache", label: "Back ache", emoji: "🧘", color: "from-stone-50 to-orange-50 border-stone-100" },
  { id: "neck-shoulder", label: "Neck/shoulder", emoji: "💆", color: "from-fuchsia-50 to-purple-50 border-fuchsia-100" },
  { id: "joint-stiffness", label: "Joint stiffness", emoji: "🦴", color: "from-zinc-50 to-slate-50 border-zinc-100" },
  { id: "low-mood", label: "Low mood", emoji: "😢", color: "from-gray-50 to-slate-50 border-gray-100" },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "😵", color: "from-violet-50 to-indigo-50 border-violet-100" },
  { id: "stressed", label: "Stressed", emoji: "😰", color: "from-orange-50 to-amber-50 border-orange-100" },
];

const suggestions: Record<string, { tips: string[]; explore: string }> = {
  tired: {
    tips: [
      "Try 5 slow, deep belly breaths to restore energy",
      "Sip warm water with lemon to gently awaken the body",
      "A short 5-minute legs-up-the-wall pose can help"
    ],
    explore: "Explore restorative poses in Content Library"
  },
  pain: {
    tips: [
      "Apply gentle warmth to the area of discomfort",
      "Try cat-cow stretches to release tension",
      "Turmeric golden milk can support natural relief"
    ],
    explore: "Track your pain patterns in Symptom Tracker"
  },
  exhausted: {
    tips: [
      "Honor your body with rest — even 10 minutes",
      "Warm sesame oil self-massage (Abhyanga) can restore",
      "Avoid stimulants and choose nourishing warm foods"
    ],
    explore: "Discover Vata-balancing practices"
  },
  hormonal: {
    tips: [
      "Cooling breathwork (Sitali) can help balance heat",
      "Include healthy fats like ghee and avocado today",
      "Moon salutations can honor your hormonal rhythm"
    ],
    explore: "View cycle-phase content in Library"
  },
  emotional: {
    tips: [
      "Place your hand on your heart and breathe slowly",
      "Journaling can help release emotional weight",
      "A warm bath with lavender supports emotional release"
    ],
    explore: "Explore meditation and breathwork"
  },
  restless: {
    tips: [
      "Try a grounding standing pose like Mountain Pose",
      "Avoid caffeine and opt for chamomile or warm milk",
      "Focus on slow exhales to activate your calm response"
    ],
    explore: "Find Vata-calming practices"
  },
  bloated: {
    tips: [
      "Gentle knee-to-chest pose (Apanasana) aids digestion",
      "Sip warm ginger tea after meals",
      "Avoid raw, cold foods — choose warm, cooked meals"
    ],
    explore: "View digestion-friendly nutrition tips"
  },
  "cant-sleep": {
    tips: [
      "Try alternate nostril breathing before bed",
      "Warm milk with nutmeg supports restful sleep",
      "Gentle forward folds help calm the nervous system"
    ],
    explore: "Discover evening wind-down routines"
  },
  "hot-flushes": {
    tips: [
      "Cooling breathwork (Sheetali) can bring relief",
      "Avoid spicy foods and opt for cooling foods",
      "Aloe vera juice can help balance internal heat"
    ],
    explore: "Explore menopause support content"
  },
  digestive: {
    tips: [
      "Chew food slowly and eat in a calm environment",
      "Fennel or cumin tea after meals aids digestion",
      "Gentle twists help stimulate digestive fire"
    ],
    explore: "View Ayurvedic nutrition guidance"
  },
  "back-ache": {
    tips: [
      "Cat-cow stretches gently mobilize the spine",
      "Warm compress on lower back can ease tension",
      "Supported bridge pose with a block may help"
    ],
    explore: "Explore mobility and joint care content"
  },
  "neck-shoulder": {
    tips: [
      "Gentle neck rolls and shoulder shrugs release tension",
      "Eagle arms stretch opens the upper back",
      "Warm oil massage on shoulders before bed helps"
    ],
    explore: "View chair yoga and gentle stretches"
  },
  "period-pain": {
    tips: [
      "Gentle heat on your lower belly can ease cramps",
      "Reclining bound angle pose opens the pelvis gently",
      "Chamomile or raspberry leaf tea may help"
    ],
    explore: "Explore menstrual cycle support"
  },
  "joint-stiffness": {
    tips: [
      "Gentle morning stretches before getting out of bed",
      "Warm sesame oil massage supports joint mobility",
      "Anti-inflammatory foods like turmeric and ginger help"
    ],
    explore: "View joint care and mobility content"
  },
  "post-surgery": {
    tips: [
      "Honor your recovery — rest is healing",
      "Gentle breathwork supports circulation",
      "Warm, nourishing soups support tissue repair"
    ],
    explore: "Explore rehabilitation guidance"
  },
  "low-mood": {
    tips: [
      "Be gentle with yourself today",
      "Even a short walk outside can lift your spirits",
      "Reach out to someone who cares about you"
    ],
    explore: "Discover mood-lifting practices"
  },
  overwhelmed: {
    tips: [
      "You don't have to do everything today",
      "Focus on just one small thing at a time",
      "Three slow breaths can reset your nervous system"
    ],
    explore: "Find grounding meditations"
  },
  stressed: {
    tips: [
      "Take three slow, deep breaths right now",
      "Step outside for fresh air if possible",
      "Box breathing (4-4-4-4) calms the mind quickly"
    ],
    explore: "Explore stress-relief breathwork"
  },
};

interface QuickCheckInProps {
  username?: string;
}

interface FavoriteFeeling {
  id: string;
  feeling_id: string;
  feeling_label: string;
}

export function QuickCheckIn({ username }: QuickCheckInProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteFeeling[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [topFeelings, setTopFeelings] = useState<{feeling_id: string; count: number}[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      fetchFavorites(user.id);
      fetchTopFeelings(user.id);
    }
  };

  const fetchFavorites = async (uid: string) => {
    const { data, error } = await supabase
      .from("user_favorite_feelings")
      .select("id, feeling_id, feeling_label")
      .eq("user_id", uid);
    
    if (!error && data) {
      setFavorites(data);
    }
  };

  const fetchTopFeelings = async (uid: string) => {
    // Get feeling counts from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from("quick_checkin_logs")
      .select("feeling_id")
      .eq("user_id", uid)
      .gte("created_at", thirtyDaysAgo.toISOString());
    
    if (!error && data) {
      // Count occurrences
      const counts: Record<string, number> = {};
      data.forEach(log => {
        counts[log.feeling_id] = (counts[log.feeling_id] || 0) + 1;
      });
      
      // Sort by count and take top 3
      const sorted = Object.entries(counts)
        .map(([feeling_id, count]) => ({ feeling_id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      
      setTopFeelings(sorted);
    }
  };

  const handleFeelingSelect = async (feelingId: string) => {
    setSelectedFeeling(feelingId);
    
    // Log the check-in to database
    if (userId) {
      const feeling = feelingOptions.find(f => f.id === feelingId);
      if (feeling) {
        await supabase.from("quick_checkin_logs").insert({
          user_id: userId,
          feeling_id: feelingId,
          feeling_label: feeling.label
        });
      }
    }
  };

  const toggleFavorite = async (feelingId: string) => {
    if (!userId) {
      toast.error("Please log in to save favorites");
      return;
    }

    setLoading(true);
    const feeling = feelingOptions.find(f => f.id === feelingId);
    const isFavorite = favorites.some(f => f.feeling_id === feelingId);

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from("user_favorite_feelings")
          .delete()
          .eq("user_id", userId)
          .eq("feeling_id", feelingId);
        
        setFavorites(prev => prev.filter(f => f.feeling_id !== feelingId));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from("user_favorite_feelings")
          .insert({
            user_id: userId,
            feeling_id: feelingId,
            feeling_label: feeling?.label || feelingId
          })
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          setFavorites(prev => [...prev, data]);
          toast.success("Added to favorites");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  };

  const currentSuggestions = selectedFeeling ? suggestions[selectedFeeling] : null;
  const isFavorite = (feelingId: string) => favorites.some(f => f.feeling_id === feelingId);

  // Sort feelings: favorites first, then others
  const sortedFeelings = [...feelingOptions].sort((a, b) => {
    const aIsFav = isFavorite(a.id);
    const bIsFav = isFavorite(b.id);
    if (aIsFav && !bIsFav) return -1;
    if (!aIsFav && bIsFav) return 1;
    return 0;
  });

  return (
    <Card className="bg-gradient-to-br from-mumtaz-lilac/20 to-mumtaz-sage/10 border-mumtaz-lilac/40 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-mumtaz-lilac/10 rounded-full blur-3xl -mr-32 -mt-32 mix-blend-multiply border-none pointer-events-none z-0"></div>
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="h-5 w-5 text-mumtaz-lilac" />
            Check-In
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Select what resonates with you right now
          {favorites.length > 0 && " • Your favorites appear first"}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {/* Top Feelings Insight */}
        {topFeelings.length > 0 && !selectedFeeling && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-wellness-lilac/10 to-wellness-sage/10 border border-wellness-lilac/20">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
              <TrendingUp className="h-3 w-3 text-wellness-sage" /> Your patterns this month
            </p>
            <div className="flex flex-wrap gap-2">
              {topFeelings.map(({ feeling_id, count }) => {
                const feeling = feelingOptions.find(f => f.id === feeling_id);
                if (!feeling) return null;
                return (
                  <span key={feeling_id} className="text-xs text-muted-foreground">
                    {feeling.emoji} {feeling.label} ({count}x)
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {!selectedFeeling ? (
          <div className="space-y-6">
            {favorites.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> Your Favorites
                </p>
                <div className="flex flex-wrap gap-2">
                  {feelingOptions.filter(f => isFavorite(f.id)).map((feeling) => (
                    <button
                      key={feeling.id}
                      onClick={() => handleFeelingSelect(feeling.id)}
                      className={`px-4 py-2.5 rounded-2xl text-sm font-bold cursor-pointer 
                        bg-gradient-to-br ${feeling.color} 
                        border-2 border-yellow-300
                        shadow-sm hover:shadow-md hover:scale-105 
                        transition-all duration-200 ease-out
                        flex items-center gap-2`}
                    >
                      <span className="text-xl">{feeling.emoji}</span>
                      <span className="text-wellness-taupe">{feeling.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {feelingCategories.map((category) => (
               <div key={category.name} className="space-y-3">
                 <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{category.name}</p>
                 <div className="flex flex-wrap gap-2">
                   {category.feelings.map(id => {
                     const feeling = feelingOptions.find(f => f.id === id);
                     if (!feeling || (isFavorite(id) && favorites.length > 0)) return null;
                     return (
                      <button
                        key={feeling.id}
                        onClick={() => handleFeelingSelect(feeling.id)}
                        className={`px-4 py-3 rounded-2xl text-sm font-semibold cursor-pointer 
                          bg-gradient-to-br ${feeling.color} 
                          border border-border/40 hover:border-wellness-lilac/50
                          shadow-sm hover:shadow-md hover:scale-[1.02] 
                          transition-all duration-200 ease-out
                          flex items-center gap-2`}
                      >
                        <span className="text-xl">{feeling.emoji}</span>
                        <span className="text-wellness-taupe">{feeling.label}</span>
                      </button>
                     );
                   })}
                 </div>
               </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-mumtaz-lilac/20">
                {feelingOptions.find(f => f.id === selectedFeeling)?.emoji}{" "}
                {feelingOptions.find(f => f.id === selectedFeeling)?.label}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedFeeling(null)}
                className="text-xs"
              >
                Change
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(selectedFeeling)}
                disabled={loading}
                className="text-xs ml-auto"
              >
                {isFavorite(selectedFeeling) ? (
                  <>
                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                    Favorited
                  </>
                ) : (
                  <>
                    <StarOff className="h-3 w-3 mr-1" />
                    Add to Favorites
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-mumtaz-lilac" />
                Here's what might help:
              </h4>
              <ul className="space-y-2">
                {currentSuggestions?.tips.map((tip, index) => (
                  <li 
                    key={index} 
                    className="text-sm text-muted-foreground pl-4 border-l-2 border-mumtaz-lilac/40 py-1"
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border/50 space-y-3">
              <p className="text-sm text-muted-foreground">
                Want to explore more?
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/content-library")}
                  className="text-sm"
                >
                  {currentSuggestions?.explore}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/tracker")}
                  className="text-sm"
                >
                  Log in Daily Tracker
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/insights")}
                  className="text-sm"
                >
                  View Dosha Insights
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
