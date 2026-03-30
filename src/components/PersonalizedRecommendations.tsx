import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Lightbulb, BookOpen, Moon, Heart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Map feelings to content search terms and categories
const feelingToContentMap: Record<string, { 
  tags: string[]; 
  types: string[]; 
  description: string;
  spiritualShifa?: string;
  consciousnessPractice?: string;
}> = {
  tired: {
    tags: ["restorative", "gentle", "relaxation", "vata-balance"],
    types: ["yoga", "meditation"],
    description: "Restorative practices to restore your energy",
    spiritualShifa: "Istighfar (Seeking Forgiveness) brings ease and provision.",
    consciousnessPractice: "Nafas (Rhythmic Breath): 4 counts in, 4 counts out."
  },
  pain: {
    tags: ["pain-relief", "gentle", "therapeutic", "chronic-pain"],
    types: ["yoga", "article"],
    description: "Gentle practices for pain relief",
    spiritualShifa: "Recite 'As'alu Allah al-'Azim' 7 times for healing.",
    consciousnessPractice: "Body Scan: Directing awareness to areas of tension."
  },
  exhausted: {
    tags: ["restorative", "vata-balance", "self-care", "relaxation"],
    types: ["yoga", "meditation", "article"],
    description: "Deeply restoring practices for exhaustion",
    spiritualShifa: "Tasbih of Fatima (SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x) for fatigue.",
    consciousnessPractice: "Grounding: Feet flat on earth, sensing the weight of the body."
  },
  hormonal: {
    tags: ["hormone-balance", "cycle", "menstrual", "moon"],
    types: ["yoga", "article", "nutrition"],
    description: "Hormone-balancing support",
    spiritualShifa: "Trust the Divine rhythm. 'Everything has a measure.'",
    consciousnessPractice: "Womb Breathing: Visualizing golden light as you inhale."
  },
  emotional: {
    tags: ["emotional", "heart-opening", "meditation", "breathwork"],
    types: ["meditation", "breathwork"],
    description: "Emotional release and heart-opening practices",
    spiritualShifa: "Ya Wadud (O Most Loving). Repeat to open the heart.",
    consciousnessPractice: "Heart-Centered Awareness: Hand on heart, breathing love."
  },
  restless: {
    tags: ["grounding", "vata-balance", "calm", "evening"],
    types: ["yoga", "meditation"],
    description: "Grounding practices for restlessness",
    spiritualShifa: "Surah An-Nas for protection against restless thoughts.",
    consciousnessPractice: "Weighting: Using a weighted blanket or palm pressure."
  },
  bloated: {
    tags: ["digestion", "twist", "digestive", "nutrition"],
    types: ["yoga", "nutrition", "article"],
    description: "Digestive support and gentle movements",
    spiritualShifa: "Bismillah before eating. Eat with the right hand for blessing.",
    consciousnessPractice: "Savoring: Presence with every sensory detail of a meal."
  },
  "cant-sleep": {
    tags: ["sleep", "evening", "relaxation", "wind-down"],
    types: ["yoga", "meditation"],
    description: "Evening routines for better sleep",
    spiritualShifa: "Ayatul Kursi for a guarded night's sleep.",
    consciousnessPractice: "Sitali Breath (Cooling): Curling tongue or breathing through teeth."
  },
  "hot-flushes": {
    tags: ["menopause", "cooling", "pitta-balance", "perimenopause"],
    types: ["yoga", "article", "breathwork"],
    description: "Cooling practices for hot flushes",
    spiritualShifa: "Cooling Dhikr: 'SubhanAllah' (The Perfection of God).",
    consciousnessPractice: "Lunar Breathing: Inhaling through the left nostril (Ida Nadi)."
  },
  digestive: {
    tags: ["digestion", "nutrition", "ayurveda", "twist"],
    types: ["nutrition", "article", "yoga"],
    description: "Ayurvedic digestive support",
    spiritualShifa: "Sunnah of 1/3 Food, 1/3 Water, 1/3 Breath.",
    consciousnessPractice: "Belly Softening: Relaxing the diaphragm on every exhale."
  },
  "back-ache": {
    tags: ["back", "spine", "mobility", "joint-care", "gentle"],
    types: ["yoga", "article"],
    description: "Spine care and back relief",
    spiritualShifa: "A'udhu bi-izzati-llahi wa qudratihi... 7x over the area.",
    consciousnessPractice: "Spinal Waves: Micro-movements of the vertebrae."
  },
  "neck-shoulder": {
    tags: ["neck", "shoulder", "chair-yoga", "gentle", "tension"],
    types: ["yoga"],
    description: "Neck and shoulder release",
    spiritualShifa: "Shaking off the weight: 'La ilaha illa Allah' (Release).",
    consciousnessPractice: "Eagle Arms Breath: Space between the shoulder blades."
  },
  "period-pain": {
    tags: ["menstrual", "cramp", "cycle", "womb"],
    types: ["yoga", "article"],
    description: "Menstrual comfort practices",
    spiritualShifa: "Divine Sabr (Patience). The body is being cleansed.",
    consciousnessPractice: "Pelvic Rocking: Rhythmic motion for internal flow."
  },
  "joint-stiffness": {
    tags: ["joint-care", "mobility", "arthritis", "gentle", "chair-yoga"],
    types: ["yoga", "article"],
    description: "Joint mobility and care",
    spiritualShifa: "Suppleness: 'O Sustainer, grant me ease in my motion.'",
    consciousnessPractice: "Joint Rotations: Sending light to every articulation."
  },
  "post-surgery": {
    tags: ["rehabilitation", "gentle", "recovery", "cancer_support"],
    types: ["yoga", "article"],
    description: "Gentle recovery practices",
    spiritualShifa: "Healing is with Allah (Ash-Shafi).",
    consciousnessPractice: "Stillness: Witnessing the body heal without interference."
  },
  "low-mood": {
    tags: ["uplifting", "heart-opening", "morning", "energy"],
    types: ["yoga", "meditation"],
    description: "Mood-lifting practices",
    spiritualShifa: "Ya Fattah (The Opener). Open the gates of joy.",
    consciousnessPractice: "Breath of Joy: 3-part inhale, powerful exhale."
  },
  overwhelmed: {
    tags: ["grounding", "calm", "meditation", "breathwork", "stress"],
    types: ["meditation", "breathwork"],
    description: "Calming practices for overwhelm",
    spiritualShifa: "Hasbunallahu wa ni'mal wakil (Allah is enough for us).",
    consciousnessPractice: "4-7-8 Breathing: Regulating the nervous system."
  },
  stressed: {
    tags: ["stress", "relaxation", "breathwork", "calm"],
    types: ["breathwork", "meditation", "yoga"],
    description: "Stress relief and relaxation",
    spiritualShifa: "In the remembrance of Allah do hearts find rest.",
    consciousnessPractice: "Box Breathing: 4 in, 4 hold, 4 out, 4 hold."
  },
  in_pain: {
    tags: ["pain-relief", "gentle", "therapeutic"],
    types: ["yoga", "article"],
    description: "Gentle practices for pain relief",
    spiritualShifa: "Surah Al-Fatiha (The Cure).",
    consciousnessPractice: "Pain Observation: Watching physical sensations as a witness."
  },
  hot_flushes: {
    tags: ["menopause", "cooling", "pitta-balance"],
    types: ["yoga", "article", "breathwork"],
    description: "Cooling practices for hot flushes",
    spiritualShifa: "Cooling Dhikr: 'SubhanAllah'.",
    consciousnessPractice: "Sheetali Breath: Cooling the blood through the tongue."
  },
  cant_sleep: {
    tags: ["sleep", "evening", "relaxation"],
    types: ["yoga", "meditation"],
    description: "Evening routines for better sleep",
    spiritualShifa: "Ayatul Kursi for protection and peace.",
    consciousnessPractice: "Slowing: Lengthening the exhale to 2x the inhale."
  },
  back_ache: {
    tags: ["back", "spine", "mobility", "joint-care"],
    types: ["yoga", "article"],
    description: "Spine care and back relief",
    spiritualShifa: "Healing affirmation: 'Ease is my natural state.'",
    consciousnessPractice: "Spinal Breathing: Inhale up the spine, exhale down."
  },
  neck_shoulder: {
    tags: ["neck", "shoulder", "chair-yoga"],
    types: ["yoga"],
    description: "Neck and shoulder release",
    spiritualShifa: "Release of burdens: 'La ilaha illa Allah'.",
    consciousnessPractice: "Upper Trap Release: Softening the jaw to soften the neck."
  },
  period_pain: {
    tags: ["menstrual", "cramp", "cycle"],
    types: ["yoga", "article"],
    description: "Menstrual comfort practices",
    spiritualShifa: "Honoring the Cycle: Divine Wisdom in flow.",
    consciousnessPractice: "Womb Awareness: Sending gratitude for the body's cycle."
  },
  joint_stiffness: {
    tags: ["joint-care", "mobility", "arthritis"],
    types: ["yoga", "article"],
    description: "Joint mobility and care",
    spiritualShifa: "Suppleness of spirit leads to suppleness of body.",
    consciousnessPractice: "Synovial Breath: Visualizing lubrication in the joints."
  },
  post_surgery: {
    tags: ["rehabilitation", "gentle", "recovery"],
    types: ["yoga", "article"],
    description: "Gentle recovery practices",
    spiritualShifa: "Quietude: Allah is with the patient ones.",
    consciousnessPractice: "Cellular Healing: Blessing every cell as it renews."
  },
  low_mood: {
    tags: ["uplifting", "heart-opening", "morning"],
    types: ["yoga", "meditation"],
    description: "Mood-lifting practices",
    spiritualShifa: "Ya Fattah (The Opener).",
    consciousnessPractice: "Golden Sun Breath: Inhaling light into the heart."
  },
};

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  description: string | null;
  tags: string[] | null;
}

interface TopFeeling {
  feeling_id: string;
  count: number;
}

interface Props {
  hideTitle?: boolean;
  compact?: boolean;
}

export function PersonalizedRecommendations({ hideTitle, compact }: Props = {}) {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
  const [topFeeling, setTopFeeling] = useState<TopFeeling | null>(null);
  const [loading, setLoading] = useState(true);
  const [feelingLabel, setFeelingLabel] = useState("");
  const [userLifeStage, setUserLifeStage] = useState<string | null>(null);
  const [userPregnancyStatus, setUserPregnancyStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchPersonalizedContent();
  }, []);

  const fetchPersonalizedContent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user's wellness profile to know their life stage
      const { data: wellnessProfile } = await supabase
        .from("user_wellness_profiles")
        .select("life_stage, pregnancy_status")
        .eq("user_id", user.id)
        .maybeSingle();

      const lifeStage = wellnessProfile?.life_stage || null;
      const pregnancyStatus = wellnessProfile?.pregnancy_status || null;
      setUserLifeStage(lifeStage);
      setUserPregnancyStatus(pregnancyStatus);

      // Get top feelings from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: checkinLogs, error: logsError } = await supabase
        .from("quick_checkin_logs")
        .select("feeling_id, feeling_label")
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (logsError || !checkinLogs || checkinLogs.length === 0) {
        setLoading(false);
        return;
      }

      // Count occurrences and find top feeling
      const counts: Record<string, { count: number; label: string }> = {};
      checkinLogs.forEach(log => {
        if (!counts[log.feeling_id]) {
          counts[log.feeling_id] = { count: 0, label: log.feeling_label };
        }
        counts[log.feeling_id].count++;
      });

      const sorted = Object.entries(counts)
        .map(([feeling_id, data]) => ({ feeling_id, count: data.count, label: data.label }))
        .sort((a, b) => b.count - a.count);

      if (sorted.length === 0) {
        setLoading(false);
        return;
      }

      const top = sorted[0];
      setTopFeeling({ feeling_id: top.feeling_id, count: top.count });
      setFeelingLabel(top.label);

      // Get content mapping for this feeling
      const mapping = feelingToContentMap[top.feeling_id];
      if (!mapping) {
        setLoading(false);
        return;
      }

      // Fetch relevant content
      const { data: content, error: contentError } = await supabase
        .from("wellness_content")
        .select("id, title, content_type, description, tags, cycle_phases, pregnancy_statuses")
        .eq("is_active", true)
        .in("content_type", mapping.types)
        .limit(40);

      if (contentError || !content) {
        setLoading(false);
        return;
      }

      // Life-stage exclusion tags — exclude content meant for stages the user is NOT in
      const pregnancyRelatedTags = ['pregnancy', 'prenatal', 'trimester', 'pregnant'];
      const postpartumRelatedTags = ['postpartum', 'postnatal', 'post-birth', 'fourth-trimester'];
      const isUserPregnant = pregnancyStatus === 'pregnant' || lifeStage === 'pregnancy';
      const isUserPostpartum = pregnancyStatus === 'postpartum' || lifeStage === 'postpartum';

      // Filter out content from life stages the user is NOT in
      const lifeStageFiltered = content.filter(item => {
        const itemTags = (item.tags || []).map((t: string) => t.toLowerCase());
        const itemTitle = item.title.toLowerCase();
        const itemPhases = ((item as any).cycle_phases || []).map((p: string) => p.toLowerCase());
        const itemPregnancyStatuses = ((item as any).pregnancy_statuses || []).map((p: string) => p.toLowerCase());

        // If user is NOT pregnant, exclude pregnancy-specific content
        if (!isUserPregnant) {
          const isPregnancyContent = 
            pregnancyRelatedTags.some(tag => itemTags.includes(tag)) ||
            pregnancyRelatedTags.some(tag => itemTitle.includes(tag)) ||
            itemPregnancyStatuses.includes('pregnant');
          if (isPregnancyContent && !itemTags.includes('universal')) return false;
        }

        // If user is NOT postpartum, exclude postpartum-specific content
        if (!isUserPostpartum) {
          const isPostpartumContent = 
            postpartumRelatedTags.some(tag => itemTags.includes(tag)) ||
            postpartumRelatedTags.some(tag => itemTitle.includes(tag)) ||
            itemPregnancyStatuses.includes('postpartum');
          if (isPostpartumContent && !itemTags.includes('universal')) return false;
        }

        return true;
      });

      // Score and filter content based on tag matches + life stage relevance
      const scoredContent = lifeStageFiltered.map(item => {
        let score = 0;
        const itemTags = (item.tags || []).map((t: string) => t.toLowerCase());
        mapping.tags.forEach(tag => {
          if (itemTags.some(t => t.includes(tag.toLowerCase()))) {
            score += 2;
          }
          if (item.title.toLowerCase().includes(tag.toLowerCase())) {
            score += 1;
          }
          if (item.description?.toLowerCase().includes(tag.toLowerCase())) {
            score += 1;
          }
        });

        // Boost score for content matching user's life stage
        if (lifeStage) {
          const stageTag = lifeStage.toLowerCase();
          if (itemTags.some(t => t.includes(stageTag))) {
            score += 3;
          }
          if (itemTags.includes('menopause') && (stageTag.includes('menopause') || stageTag.includes('peri'))) {
            score += 4;
          }
        }

        return { ...item, score };
      });

      // Sort by score and take top 3
      const topContent = scoredContent
        .filter(c => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      // If not enough matches, add some from the right content types (still filtered)
      if (topContent.length < 3) {
        const remaining = lifeStageFiltered
          .filter(c => !topContent.find(tc => tc.id === c.id))
          .slice(0, 3 - topContent.length);
        topContent.push(...remaining.map(c => ({ ...c, score: 0 })));
      }

      setRecommendations(topContent);
    } catch (error) {
      console.error("Error fetching personalized content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Don't show loading state, just hide
  }

  if (!topFeeling || recommendations.length === 0) {
    return null; // No data to show
  }

  const mapping = feelingToContentMap[topFeeling.feeling_id];
  const isExhaustedMode = topFeeling.feeling_id === 'exhausted' || topFeeling.feeling_id === 'tired' || topFeeling.feeling_id === 'post_surgery' || topFeeling.feeling_id === 'overwhelmed';

  if (isExhaustedMode) {
    const primaryRec = recommendations[0];
    return (
      <Card className="bg-gradient-to-br from-wellness-lilac/20 via-background to-wellness-sage/10 border-wellness-lilac/40 shadow-xl overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Heart className="w-32 h-32 text-wellness-lilac" />
        </div>
        {!hideTitle && (
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-wellness-lilac/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-wellness-lilac" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-wellness-taupe">Held in Healing</CardTitle>
            </div>
            <CardDescription className="text-wellness-taupe/70 font-medium">
              You logged "{feelingLabel}." We have handled the sifting. This is your one action for this moment.
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={compact ? "p-0 space-y-6 relative z-10" : "space-y-6 relative z-10"}>
          <div className="p-6 rounded-[2rem] bg-white/60 border-2 border-wellness-lilac/30 shadow-sm group hover:border-wellness-lilac transition-all active:scale-[0.98]" 
               onClick={() => navigate(`/content-library?highlight=${primaryRec.id}`)}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-wellness-lilac/10 text-wellness-lilac border-wellness-lilac/20 uppercase tracking-widest text-[10px] px-3 py-1">
                  Primary Shifa: {primaryRec.content_type}
                </Badge>
                <ArrowRight className="w-5 h-5 text-wellness-lilac group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-wellness-taupe leading-tight">{primaryRec.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{primaryRec.description}</p>
              <Button className="w-full bg-wellness-lilac hover:bg-wellness-lilac/90 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-wellness-lilac/20">
                Begin Healing Now
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mapping.spiritualShifa && (
              <div className="p-5 rounded-3xl bg-wellness-lilac/5 border border-wellness-lilac/10 flex items-start gap-4">
                <Moon className="w-6 h-6 text-wellness-lilac flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-wellness-lilac mb-1">Divine Permission</h4>
                  <p className="text-sm font-medium text-wellness-taupe italic leading-relaxed">
                    "{mapping.spiritualShifa}"
                  </p>
                </div>
              </div>
            )}
            {mapping.consciousnessPractice && (
              <div className="p-5 rounded-3xl bg-wellness-sage/5 border border-wellness-sage/10 flex items-start gap-4">
                <Activity className="w-6 h-6 text-wellness-sage flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-wellness-sage mb-1">Gentle Awareness</h4>
                  <p className="text-sm font-medium text-wellness-taupe leading-relaxed">
                    {mapping.consciousnessPractice}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-wellness-lilac/10 via-background to-wellness-sage/10 border-wellness-lilac/30 shadow-lg ${compact ? 'border-none shadow-none bg-none bg-transparent' : ''}`}>
      {!hideTitle && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-wellness-lilac" />
              Recommended For You
            </CardTitle>
            <Badge variant="secondary" className="bg-wellness-lilac/20 text-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              Personalized
            </Badge>
          </div>
          <CardDescription>
            Based on how you've been feeling lately — you've logged "{feelingLabel}" {topFeeling.count} times this month
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-0 space-y-4" : "space-y-4"}>
        {mapping && (
          <p className="text-sm text-muted-foreground italic">
            {mapping.description}
          </p>
        )}

        <div className="grid gap-3">
          {recommendations.map((content) => (
            <button
              key={content.id}
              onClick={() => navigate(`/content-library?highlight=${content.id}`)}
              className="p-4 rounded-xl bg-card border border-border/50 hover:border-wellness-lilac/50 
                hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {content.content_type}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground group-hover:text-wellness-lilac transition-colors text-sm sm:text-base leading-snug break-words hyphens-auto">
                    {content.title}
                  </h4>
                  {content.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      {content.description}
                    </p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-wellness-lilac 
                  group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        {mapping && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-wellness-lilac/20">
            {mapping.spiritualShifa && (
              <div className="p-4 rounded-2xl bg-white/50 border border-wellness-lilac/30 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Moon className="h-12 w-12 text-wellness-lilac" />
                </div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-wellness-lilac mb-2 flex items-center gap-2">
                  <Heart className="h-3 w-3" />
                  Spiritual Shifa
                </h5>
                <p className="text-xs sm:text-sm font-medium text-wellness-taupe leading-relaxed italic">
                  "{mapping.spiritualShifa}"
                </p>
              </div>
            )}
            {mapping.consciousnessPractice && (
              <div className="p-4 rounded-2xl bg-white/50 border border-wellness-sage/30 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="h-12 w-12 text-wellness-sage" />
                </div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-wellness-sage mb-2 flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Consciousness Flow
                </h5>
                <p className="text-xs sm:text-sm font-medium text-wellness-taupe leading-relaxed">
                  {mapping.consciousnessPractice}
                </p>
              </div>
            )}
          </div>
        )}

        {!compact && (
          <Button
            variant="outline"
            className="w-full border-wellness-lilac/50 hover:bg-wellness-lilac/10 mt-6"
            onClick={() => navigate("/content-library")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Explore Full Content Library
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
