import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bookmark, Play, Plus, Sparkles, Moon, Leaf, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  duration?: string;
  tags?: string[];
  mumtaz_thought_process?: string;
  anatomical_benefit?: string;
  modifications?: string;
}

interface SupportPlanRecommendationsProps {
  userId: string;
  lifeStage: string;
  symptoms: string[];
  dosha?: string;
  onTryNow: (recommendation: Recommendation, type: string) => void;
  onAddToPlan: (recommendation: Recommendation, type: string) => void;
}

// Generate personalized recommendations based on life stage and symptoms
const getYogaRecommendations = (lifeStage: string, symptoms: string[]): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Mumtaz's customized Yoga Posology
  if (lifeStage === 'pregnancy') {
    recommendations.push(
      { 
        id: 'prenatal-baddha-konasana', 
        title: 'Baddha Konasana (Bound Angle)', 
        description: 'Soft hip-opening movement to ease tension and create space for baby.', 
        duration: '5 min', 
        tags: ['pregnancy', 'gentle'],
        mumtaz_thought_process: "We want to create space and softness. This isn't about pushing your knees to the floor; it's about feeling grounded and connected to the life growing inside you.",
        anatomical_benefit: "Opens the inner thighs, hips, and groin. Encourages downward blood flow to the pelvic floor.",
        modifications: "Place pillows or bolsters under each knee to support the weight of your legs so you can truly surrender."
      },
      { 
        id: 'prenatal-cat-cow', 
        title: 'Marjaryasana-Bitilasana (Gentle Cat-Cow)', 
        description: 'Soothing spinal waves to release lower back pressure.', 
        duration: '5 min', 
        tags: ['pregnancy', 'breathwork'],
        mumtaz_thought_process: "As the belly grows, the lower back takes on so much pressure. Move slowly with the breath to release the sacrum without overstretching the abdomen.",
        anatomical_benefit: "Increases spinal mobility, relieves lower back tension, and shifts the weight of the baby off the spine.",
        modifications: "If wrists hurt, lower onto the forearms, or do this seated on a birthing ball."
      }
    );
  } else if (lifeStage === 'postpartum') {
    recommendations.push(
      { 
        id: 'postpartum-supta-baddha', 
        title: 'Supta Baddha Konasana (Reclined Rest)', 
        description: 'Deep, restoring rest to support profound healing.', 
        duration: '15 min', 
        tags: ['postpartum', 'recovery'],
        mumtaz_thought_process: "Your body just performed a miracle and needs profound rest. Lie down completely supported. Do nothing but let gravity hold you unconditionally.",
        anatomical_benefit: "Gently stretches the groin and inner thighs while relaxing the pelvic floor and calming the nervous system.",
        modifications: "Must use a bolster under the spine and blocks under the knees. If healing from a Cesarean, do NOT stretch the belly—stay elevated."
      },
      { 
        id: 'postpartum-legs-up', 
        title: 'Viparita Karani (Legs Up The Wall)', 
        description: 'A soothing structural reset for exhausted legs and nervous system.', 
        duration: '10 min', 
        tags: ['postpartum', 'core'],
        mumtaz_thought_process: "When you are constantly holding a baby, your energy pools downward. This pose safely returns energy and blood flow back to your heart.",
        anatomical_benefit: "Drains lymphatic fluid from the legs, relieves lower back tension, and shifts the nervous system into rest-and-digest.",
        modifications: "If the wall feels too intense on your hamstrings, simply rest your calves on a chair or the sofa."
      }
    );
  } else if (['perimenopause', 'menopause', 'post_menopause'].includes(lifeStage)) {
    recommendations.push(
      { 
        id: 'meno-sitali', 
        title: 'Sitali Pranayama (Cooling Breath)', 
        description: 'A specific breathing pattern to cool the physical and emotional body.', 
        duration: '5 min', 
        tags: ['menopause', 'cooling'],
        mumtaz_thought_process: "When the heat rises—whether as a hot flush or emotional frustration—this magical breath acts as an internal air conditioner.",
        anatomical_benefit: "Physiologically cools the body temperature and activates the parasympathetic nervous system.",
        modifications: "If you cannot roll your tongue, simply breathe in through pursed lips like you are drinking from a straw."
      },
      { 
        id: 'meno-joints', 
        title: 'Pawanmuktasana (Joint Freeing)', 
        description: 'Gentle, isolated movements to lubricate the joints.', 
        duration: '10 min', 
        tags: ['menopause', 'mobility'],
        mumtaz_thought_process: "As estrogen levels shift, joints can feel incredibly stiff. Our goal here isn't a 'workout', but to intentionally send lubricating fluid to every creaky joint.",
        anatomical_benefit: "Stimulates synovial fluid in the joints, improving mobility and reducing stiffness.",
        modifications: "Can be done entirely seated in a chair or even lying in bed."
      }
    );
  } else {
    recommendations.push(
      { 
        id: 'cycle-balasana', 
        title: 'Balasana (Child’s Pose)', 
        description: 'Movements that honor the inward pull of your cycle.', 
        duration: '10 min', 
        tags: ['cycle', 'gentle'],
        mumtaz_thought_process: "We are cyclic beings. When you feel tired or are menstruating, it is not a weakness to rest—it is a biological requirement. Surrender to the ground.",
        anatomical_benefit: "Gently elongates the lower back, massages the reproductive organs, and signals the brain to rest.",
        modifications: "Keep knees wide to make space for the belly. Place a thick bolster under your torso if the floor feels too far away."
      }
    );
  }
  
  // Symptom-based additions
  if (symptoms.includes('tired') || symptoms.includes('fatigue')) {
    recommendations.push({ 
      id: 'energy-savasana', 
      title: 'Supported Savasana (Corpse Pose)', 
      description: 'The ultimate posture of integration and rest.', 
      duration: '15 min', 
      tags: ['energy', 'restorative'],
      mumtaz_thought_process: "True exhaustion cannot be pushed through. Stop trying to 'fix' it with movement today. Just lie down, close your eyes, and let yourself be held.",
      anatomical_benefit: "Drops brainwaves into alpha/theta states, allowing deep cellular repair and metabolic reset.",
      modifications: "Use an eye pillow to block out light and place a blanket over yourself for warmth and grounding weight."
    });
  }
  if (symptoms.includes('pain') || symptoms.includes('aches')) {
    recommendations.push({ 
      id: 'pain-supta-matsyendrasana', 
      title: 'Supta Matsyendrasana (Supine Twist)', 
      description: 'A gentle, wringing out of the spine.', 
      duration: '8 min', 
      tags: ['pain', 'stretch'],
      mumtaz_thought_process: "When the body aches, the fascia becomes rigid. We gently twist to ring out tension like a sponge, allowing fresh, oxygenated blood to rush back in upon release.",
      anatomical_benefit: "Hydrates the spinal discs, stretches the glutes/outer hips, and massages abdominal organs.",
      modifications: "Do not force the knees to the floor. Place a block or pillow under the knees so they have something to rest on."
    });
  }
  
  return recommendations.slice(0, 5);
};

const getNutritionRecommendations = (lifeStage: string, symptoms: string[], dosha?: string): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Dosha-based recommendations
  if (dosha === 'vata' || symptoms.includes('anxious') || symptoms.includes('cold')) {
    recommendations.push(
      { id: 'vata-warm', title: 'Warm, Nourishing Bowl', description: 'Grounding foods that may help calm Vata energy', tags: ['vata', 'warming'] },
      { id: 'vata-tea', title: 'Calming Ginger Tea', description: 'A soothing warm drink to support digestion and warmth', tags: ['vata', 'tea'] },
    );
  }
  if (dosha === 'pitta' || symptoms.includes('hot') || symptoms.includes('irritable')) {
    recommendations.push(
      { id: 'pitta-cool', title: 'Cooling Cucumber Salad', description: 'Refreshing foods that may help balance heat', tags: ['pitta', 'cooling'] },
      { id: 'pitta-milk', title: 'Rose & Cardamom Milk', description: 'A calming evening drink to support rest', tags: ['pitta', 'calming'] },
    );
  }
  if (dosha === 'kapha' || symptoms.includes('sluggish') || symptoms.includes('heavy')) {
    recommendations.push(
      { id: 'kapha-light', title: 'Light & Spiced Meal', description: 'Energizing foods that may help lift heaviness', tags: ['kapha', 'energizing'] },
    );
  }
  
  // Life stage additions
  if (lifeStage === 'pregnancy') {
    recommendations.push({ id: 'preg-nourish', title: 'Iron-Rich Nourishment', description: 'Foods to support you and baby during this time', tags: ['pregnancy', 'nourishing'] });
  }
  if (lifeStage === 'postpartum') {
    recommendations.push({ id: 'post-rebuild', title: 'Ojas-Building Foods', description: 'Traditional postpartum nourishment for recovery', tags: ['postpartum', 'rebuilding'] });
  }
  if (['perimenopause', 'menopause'].includes(lifeStage)) {
    recommendations.push({ id: 'meno-bone', title: 'Bone-Supportive Nutrition', description: 'Foods rich in nutrients for bone health', tags: ['menopause', 'bones'] });
  }
  
  // Symptom additions
  if (symptoms.includes('bloated')) {
    recommendations.push({ id: 'digest-ease', title: 'Digestive-Friendly Meal', description: 'Simple foods that are gentle on digestion', tags: ['digestion', 'gentle'] });
  }
  
  return recommendations.slice(0, 5);
};

const getLifestyleRecommendations = (lifeStage: string, symptoms: string[]): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Sleep support
  if (symptoms.includes('tired') || symptoms.includes('insomnia')) {
    recommendations.push(
      { id: 'sleep-routine', title: 'Evening Wind-Down Ritual', description: 'A gentle routine to prepare your body for rest', duration: '15 min', tags: ['sleep', 'evening'] },
    );
  }
  
  // Stress support
  if (symptoms.includes('anxious') || symptoms.includes('stressed')) {
    recommendations.push(
      { id: 'stress-pause', title: 'Midday Pause Practice', description: 'A brief reset to support your nervous system', duration: '5 min', tags: ['stress', 'reset'] },
    );
  }
  
  // Energy support
  if (symptoms.includes('tired') || symptoms.includes('fatigue')) {
    recommendations.push(
      { id: 'energy-morning', title: 'Gentle Morning Awakening', description: 'Start your day with care, not rush', duration: '10 min', tags: ['energy', 'morning'] },
    );
  }
  
  // Life stage specific
  if (lifeStage === 'pregnancy') {
    recommendations.push({ id: 'preg-rest', title: 'Sacred Rest Moments', description: 'Permission to pause throughout your day', duration: 'As needed', tags: ['pregnancy', 'rest'] });
  }
  if (lifeStage === 'postpartum') {
    recommendations.push({ id: 'post-grace', title: 'Self-Compassion Practice', description: 'Gentle reminders that you are doing enough', duration: '5 min', tags: ['postpartum', 'self-care'] });
  }
  if (['perimenopause', 'menopause'].includes(lifeStage)) {
    recommendations.push({ id: 'meno-cool', title: 'Cooling Environment Tips', description: 'Simple ways to manage temperature changes', tags: ['menopause', 'comfort'] });
  }
  
  // Default additions
  recommendations.push(
    { id: 'nature-connection', title: 'Nature Connection', description: 'A few minutes outdoors can support wellbeing', duration: '10 min', tags: ['grounding', 'nature'] },
    { id: 'gratitude-moment', title: 'Gratitude Moment', description: 'Noticing small blessings in your day', duration: '3 min', tags: ['mindset', 'gratitude'] },
  );
  
  return recommendations.slice(0, 5);
};

const getSpiritualRecommendations = (lifeStage: string, symptoms: string[], isIslamic: boolean): Recommendation[] => {
  if (isIslamic) {
    return [
      { id: 'dhikr', title: 'Dhikr for Peace', description: 'Simple remembrance phrases to calm the heart', duration: '5 min', tags: ['islamic', 'peace'] },
      { id: 'dua', title: 'Du\'a for Wellbeing', description: 'Prayers for health, patience, and gratitude', duration: '3 min', tags: ['islamic', 'prayer'] },
      { id: 'gratitude-islamic', title: 'Shukr Practice', description: 'Reflecting on blessings with intention', duration: '5 min', tags: ['islamic', 'gratitude'] },
      { id: 'intention', title: 'Morning Intention Setting', description: 'Beginning your day with niyyah and purpose', duration: '3 min', tags: ['islamic', 'intention'] },
      { id: 'quran-reflection', title: 'Quranic Reflection', description: 'A verse to carry with you through the day', duration: '5 min', tags: ['islamic', 'quran'] },
    ];
  } else {
    return [
      { id: 'breath-prayer', title: 'Breath Prayer', description: 'Using breath as a gentle anchor for stillness', duration: '5 min', tags: ['universal', 'breath'] },
      { id: 'grounding', title: 'Grounding Meditation', description: 'Connecting with the earth and present moment', duration: '7 min', tags: ['universal', 'grounding'] },
      { id: 'compassion', title: 'Self-Compassion Practice', description: 'Offering yourself kindness and understanding', duration: '5 min', tags: ['universal', 'compassion'] },
      { id: 'gratitude-universal', title: 'Gratitude Reflection', description: 'Noticing and appreciating what supports you', duration: '5 min', tags: ['universal', 'gratitude'] },
      { id: 'body-awareness', title: 'Body Awareness Check-In', description: 'Listening to what your body is telling you', duration: '5 min', tags: ['universal', 'awareness'] },
    ];
  }
};

export function SupportPlanRecommendations({ 
  userId, 
  lifeStage, 
  symptoms, 
  dosha,
  onTryNow,
  onAddToPlan 
}: SupportPlanRecommendationsProps) {
  const [spiritualPreference, setSpiritualPreference] = useState<'islamic' | 'universal'>('universal');
  const [savingId, setSavingId] = useState<string | null>(null);

  const yogaRecs = getYogaRecommendations(lifeStage, symptoms);
  const nutritionRecs = getNutritionRecommendations(lifeStage, symptoms, dosha);
  const lifestyleRecs = getLifestyleRecommendations(lifeStage, symptoms);
  const spiritualRecs = getSpiritualRecommendations(lifeStage, symptoms, spiritualPreference === 'islamic');

  const handleSave = async (rec: Recommendation, type: string) => {
    setSavingId(rec.id);
    try {
      const { error } = await supabase
        .from('saved_practices')
        .upsert({
          user_id: userId,
          practice_type: type,
          practice_title: rec.title,
          practice_description: rec.description,
          practice_data: { duration: rec.duration, tags: rec.tags },
          is_favorite: true,
        }, { onConflict: 'user_id,practice_type,practice_title' });

      if (error) throw error;
      toast.success('Saved to your practices');
    } catch (error) {
      console.error('Error saving practice:', error);
      toast.error('Could not save. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const RecommendationCard = ({ rec, type }: { rec: Recommendation; type: string }) => (
    <Card className="bg-card border-wellness-sage/20 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-foreground text-base tracking-tight">{rec.title}</h4>
          {rec.duration && (
            <span className="text-xs text-wellness-sage-dark dark:text-wellness-sage-light bg-wellness-sage/10 dark:bg-wellness-sage/20 px-2 py-1 rounded-full font-medium">
              {rec.duration}
            </span>
          )}
        </div>
        <p className="text-sm text-foreground mb-4 font-medium">{rec.description}</p>
        
        {rec.mumtaz_thought_process && (
          <div className="mb-4 space-y-3 bg-muted/50 dark:bg-slate-800/50 p-4 rounded-xl border border-muted">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 opacity-80">
                <Sparkles className="w-3 h-3" /> Mumtaz's Guidance
              </span>
              <p className="text-sm italic text-foreground opacity-90">"{rec.mumtaz_thought_process}"</p>
            </div>
            
            {rec.anatomical_benefit && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block opacity-70">Anatomical Benefit</span>
                <p className="text-sm text-foreground opacity-80">{rec.anatomical_benefit}</p>
              </div>
            )}
            
            {rec.modifications && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block opacity-70">Modifications</span>
                <p className="text-sm text-foreground opacity-80 bg-background p-2 rounded-md border border-border/50">{rec.modifications}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 flex-wrap mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSave(rec, type)}
            disabled={savingId === rec.id}
            className="text-xs"
          >
            <Bookmark className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onTryNow(rec, type)}
            className="text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            Try Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddToPlan(rec, type)}
            className="text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add to Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-foreground opacity-80" />
          <CardTitle className="text-xl text-foreground">Your Support Plan</CardTitle>
        </div>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          Based on how you're feeling today, here are some gentle suggestions. 
          There's no pressure — explore what feels right for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="yoga" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="yoga" className="text-xs sm:text-sm">
              <Heart className="w-4 h-4 mr-1 hidden sm:inline" />
              Movement
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="text-xs sm:text-sm">
              <UtensilsCrossed className="w-4 h-4 mr-1 hidden sm:inline" />
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="text-xs sm:text-sm">
              <Leaf className="w-4 h-4 mr-1 hidden sm:inline" />
              Lifestyle
            </TabsTrigger>
            <TabsTrigger value="spiritual" className="text-xs sm:text-sm">
              <Moon className="w-4 h-4 mr-1 hidden sm:inline" />
              Spiritual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yoga" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Movement suggestions that may support your body today:
            </p>
            {yogaRecs.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} type="yoga" />
            ))}
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Nourishment ideas based on your current state:
            </p>
            {nutritionRecs.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} type="nutrition" />
            ))}
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Small adjustments that may help you feel more supported:
            </p>
            {lifestyleRecs.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} type="lifestyle" />
            ))}
          </TabsContent>

          <TabsContent value="spiritual" className="space-y-3">
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                variant={spiritualPreference === 'islamic' ? 'default' : 'outline'}
                onClick={() => setSpiritualPreference('islamic')}
                className="text-xs"
              >
                Islamic Practices
              </Button>
              <Button
                size="sm"
                variant={spiritualPreference === 'universal' ? 'default' : 'outline'}
                onClick={() => setSpiritualPreference('universal')}
                className="text-xs"
              >
                Universal Practices
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {spiritualPreference === 'islamic' 
                ? 'Islamic spiritual practices for peace and connection:'
                : 'Universal mindfulness practices for grounding and calm:'}
            </p>
            {spiritualRecs.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} type="spiritual" />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
