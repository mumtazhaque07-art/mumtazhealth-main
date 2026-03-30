import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Sparkles, Leaf, Utensils, Wind } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BREATHWORK_TECHNIQUES } from "@/constants/appMessaging";

interface CyclePhaseEducationProps {
  selectedPhase: string;
  lifeStage?: string;
  isMenarcheJourney?: boolean;
}

interface YogaPose {
  name: string;
  translation: string;
  duration: string;
  why: string;
}

interface PhaseInfo {
  meaning: string;
  energyMood: string;
  bodyResponse: string;
  yogaPoses?: YogaPose[];
  nutritionNote?: string;
  breathworkKey?: keyof typeof BREATHWORK_TECHNIQUES;
  doshaGuidance: {
    vata: string;
    pitta: string;
    kapha: string;
  };
  libraryTags: string[];
}

const PHASE_EDUCATION: Record<string, PhaseInfo> = {
  Menstrual: {
    meaning: "Your body is gently releasing and renewing. In Ayurveda, this is called 'Apana Vata' time — a downward-moving energy meant for shedding, not doing. This is nature's invitation to slow down and honour your need for rest.",
    energyMood: "Energy naturally moves inward. The brain actually becomes more right-hemisphere dominant during menstruation — you may feel more intuitive, emotionally perceptive, and creative. This is a feature, not a flaw.",
    bodyResponse: "Your uterus is contracting to shed its lining. Prostaglandins (natural pain messengers) are highest now, which is why warmth helps so much. Your digestive fire (Agni) is lower — cooked, warm foods are far easier to process than raw or cold.",
    yogaPoses: [
      { name: "Supta Baddha Konasana", translation: "Reclining Butterfly", duration: "5–10 min", why: "Opens the pelvis gently, drains pelvic congestion, and deeply calms the nervous system. Use a bolster under the spine for full restoration." },
      { name: "Viparita Karani", translation: "Legs Up the Wall", duration: "5–15 min", why: "Reverses blood pooling, relieves lower back pressure, and is the single most effective restorative pose for menstruation. Simply lie and receive." },
      { name: "Balasana", translation: "Child's Pose", duration: "3–5 min", why: "Compresses the lower abdomen gently, which eases cramping. Place a folded blanket under the belly for extra comfort." }
    ],
    nutritionNote: "Iron is being lost. Prioritise dates (high iron + natural sugars), black sesame seeds, warm ghee rice, and pomegranate juice. Avoid cold drinks — they constrict blood vessels and worsen cramps. Raspberry leaf tea soothes uterine muscles.",
    breathworkKey: "deepBelly",
    doshaGuidance: {
      vata: "Warmth and grounding are essential. Warm broths, gentle self-massage with sesame oil, and cosy rest will help you feel anchored. Avoid cold drinks and exposing yourself to wind or cold air.",
      pitta: "Allow yourself to step back completely from intensity — your body is doing enough. Cooling, calming foods like pomegranate and coconut water soothe any heat or inflammation.",
      kapha: "Gentle movement prevents heaviness and sluggishness, but keep it very light — a slow walk or gentle stretching only. Ginger tea and light, warm kitchari support your digestion.",
    },
    libraryTags: ["menstrual", "restorative", "gentle"],
  },
  Follicular: {
    meaning: "Follicle-stimulating hormone (FSH) is rising, triggering your follicles to produce estrogen. Estrogen rebuilds the uterine lining and begins signalling the brain to prepare for ovulation. You are literally rebuilding — and it shows in your energy.",
    energyMood: "Estrogen rises steadily, which correlates with increased serotonin and dopamine. You may feel more optimistic, motivated, and socially open. Your verbal and communication skills are at their sharpest — a wonderful time for important conversations.",
    bodyResponse: "Your body is building and strengthening. Metabolism is slightly faster. Digestion is improving. This is the best phase to introduce new foods, new routines, or new forms of movement — your body is ready to adapt and grow.",
    yogaPoses: [
      { name: "Surya Namaskar", translation: "Sun Salutations (slow)", duration: "5–10 rounds", why: "Stimulates the liver — critical for estrogen clearance. Builds strength and flexibility. Begin gently and let energy build naturally over the week." },
      { name: "Virabhadrasana I & II", translation: "Warrior I & II", duration: "Hold 5–8 breaths", why: "Builds the inner warrior energy of this phase. Strengthens legs and opens the chest. Embody the growing power of this phase." },
      { name: "Utthita Parsvakonasana", translation: "Extended Side Angle", duration: "Hold 5 breaths each side", why: "Deep lateral stretch stimulates liver and spleen meridian lines. Builds stamina." }
    ],
    nutritionNote: "Estrogen is building — support its healthy metabolism through the liver. Include beets, leafy greens, and cruciferous vegetables (broccoli, cauliflower) which contain DIM — a natural estrogen-balancing compound. Sprouted legumes and seeds are excellent now.",
    breathworkKey: "nadiShodhana",
    doshaGuidance: {
      vata: "Channel rising energy with intention — enthusiasm without grounding can lead to doing too much. Maintain your morning routine and warm, regular meals to stay steady.",
      pitta: "A wonderful time to focus your natural drive and leadership. Balance activity with cooling moments — avoid pushing competitively, as Pitta can overheat even in building phases.",
      kapha: "Embrace the natural lift in energy — this is your golden window for invigorating movement. Sun salutations, brisk walking, and stimulating breathwork (Kapalabhati) will feel wonderful now.",
    },
    libraryTags: ["follicular", "energising", "building"],
  },
  Ovulatory: {
    meaning: "A surge of luteinising hormone (LH) triggers the release of a mature egg. Estrogen peaks, and a pulse of testosterone lifts confidence, libido, and boldness. Brain research shows you are most verbally fluent and socially capable during this window. Your body is celebrating.",
    energyMood: "You may feel a natural magnetic quality — others are drawn to you, and you feel drawn toward the world. Confidence, expressiveness, and generosity are natural here. Your creativity is at its most outward and collaborative.",
    bodyResponse: "Cervical fluid becomes clear and stretchy (like egg white) — a natural sign of peak fertility. Digestion is strong. Your body can handle more activity, richer foods, and social stimulation now. Enjoy it without guilt.",
    yogaPoses: [
      { name: "Natarajasana", translation: "Dancer's Pose", duration: "5–8 breaths each side", why: "Celebrates peak vitality and balance. Opens the heart and hip flexors. Embodies the beauty and power of this phase." },
      { name: "Ustrasana", translation: "Camel Pose", duration: "3–5 breaths", why: "Supported backbend opens the heart space and chest. Mirrors the outward, generous energy of ovulation. Never force — go as far as feels open." },
      { name: "Anjaneyasana", translation: "Low Lunge / Crescent Pose", duration: "Hold 8–10 breaths", why: "Opens hip flexors, releases stored tension, and builds the grounded strength to match your peak energy." }
    ],
    nutritionNote: "Your digestion is at its peak — you can eat a wider variety and handle lighter, more raw foods in moderation. Include zinc-rich foods (pumpkin seeds, chickpeas) which support healthy ovulation. Rose water in drinks and saffron in warm milk honor this peak phase beautifully.",
    breathworkKey: "sitali",
    doshaGuidance: {
      vata: "Stay grounded amidst the heightened energy — it can feel exciting but also unrooting. Enjoy connection while maintaining your routines and regular meals. Sesame and ghee remain your friends.",
      pitta: "Your natural warmth is amplified — be mindful of over-scheduling and burning out in productivity. Prioritise cooling foods like cucumber and mint. Use this peak wisely, not exhaustingly.",
      kapha: "Embrace this natural vitality fully — it is one of your most energised phases. Allow yourself to be social, to move more, and to shine. This is your window for inspired action.",
    },
    libraryTags: ["ovulatory", "dynamic", "confident"],
  },
  Luteal: {
    meaning: "After ovulation, the empty follicle becomes the corpus luteum, producing progesterone. Progesterone is calming, sleep-inducing, and inward-moving. Your brain becomes more right-hemisphere dominant again — detail-oriented, quality-focused, and less interested in performance. This is a time to complete, not begin.",
    energyMood: "Energy begins its graceful descent. This is not a problem — it is intelligence. Your body is assessing whether to support a pregnancy or prepare to release. Emotions may be closer to the surface, offering you valuable information about what is and isn't working in your life.",
    bodyResponse: "Progesterone increases core body temperature slightly (this is why you can feel warmer). Appetite often increases — especially for sweet and salty foods — because your body is genuinely expending more energy. Blood sugar is less stable; regular warm meals prevent the drops that cause PMS.",
    yogaPoses: [
      { name: "Eka Pada Rajakapotasana", translation: "Pigeon Pose", duration: "3–5 min each side", why: "The hip area stores emotional and muscular tension. Pigeon creates a deep, slow release that mirrors the inward energy of this phase. Never rush it." },
      { name: "Janu Sirsasana", translation: "Head-to-Knee Pose", duration: "3 min each side", why: "A calming forward fold that activates the parasympathetic (rest-and-digest) nervous system. Also stretches the hamstrings which tighten as progesterone rises." },
      { name: "Supta Matsyendrasana", translation: "Supine Spinal Twist", duration: "2–3 min each side", why: "Gently massages abdominal organs, stimulates lymphatic drainage, and relieves the heaviness or bloating common in the luteal phase." }
    ],
    nutritionNote: "Progesterone requires zinc and magnesium to be produced. Include pumpkin seeds, dark chocolate (70%+), leafy greens, and sesame in every meal. Reduce caffeine — it spikes cortisol, which competes directly with progesterone. Regular warm meals every 3–4 hours prevent blood sugar drops that trigger mood swings.",
    breathworkKey: "boxBreath",
    doshaGuidance: {
      vata: "Extra warmth, routine and nourishment are key — Vata rises in the late luteal phase which can amplify anxiety or insomnia. Warm sesame oil abhyanga before bed is deeply stabilising. Establish calm bedtime rituals.",
      pitta: "Allow intensity to soften. The luteal phase calls for surrender, not achievement. Cooling foods and calming practices help maintain balance. Journaling rather than discussing can channel emotional depth productively.",
      kapha: "Light, warming movement prevents stagnation. Gentle yoga and warming spices (cinnamon, cardamom) in your meals move energy without depleting reserves. Morning movement is more effective than evening for Kapha.",
    },
    libraryTags: ["luteal", "grounding", "restorative"],
  },
};


const MENARCHE_EDUCATION: Record<string, Partial<PhaseInfo>> = {
  Menstrual: {
    meaning: "Your body is taking a quiet break. It's totally normal to feel a bit more tired or want to stay in your comfy clothes. This is a special time to be extra kind to yourself.",
    energyMood: "You might feel like staying in or being quiet today. It's okay if you feel a little more emotional or just want some 'me time'.",
    bodyResponse: "Your body is doing some amazing work! Drinking warm water, eating cozy foods, and using a hot water bottle for any tummy 'tightness' can feel really good.",
  },
  Follicular: {
    meaning: "You're entering a 'fresh start' phase. Most girls start to feel their energy coming back little by little. It's like the beginning of springtime for your body.",
    energyMood: "You might notice you're feeling more cheerful or excited to try new things. It's a great time for hobbies or hanging out with friends.",
    bodyResponse: "Your body is getting stronger and more ready for activity. It's a fun time to be active and eat fresh, colorful foods.",
  },
  Ovulatory: {
    meaning: "This is when you're likely feeling the most 'super-powered'! Your energy is at its highest, and you might feel extra confident.",
    energyMood: "You might feel very social and happy. It's usually the time of the month when you feel most like yourself.",
    bodyResponse: "You have plenty of energy for sports, dancing, or whatever you love to do. Your skin and hair might even look extra sparkly too!",
  },
  Luteal: {
    meaning: "Your body is starting to slow down and get ready for your next period. It's like the sun is starting to set on this cycle.",
    energyMood: "You might feel a bit more sensitive or 'cranky' than usual - that's just your hormones talking! Be extra patient with yourself.",
    bodyResponse: "You might notice your tummy feels a bit full (bloating) or your skin has a few breakouts. Warm baths and extra sleep are your best friends right now.",
  },
};

export function CyclePhaseEducation({ selectedPhase, lifeStage, isMenarcheJourney }: CyclePhaseEducationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userDosha, setUserDosha] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDosha();
  }, []);

  const fetchUserDosha = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_wellness_profiles')
      .select('primary_dosha')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.primary_dosha) {
      setUserDosha(data.primary_dosha.toLowerCase());
    }
  };

  const phaseInfo = PHASE_EDUCATION[selectedPhase];
  
  if (!phaseInfo) return null;

  // Check if user is in a non-cycling life stage
  const isNonCycling = ['perimenopause', 'menopause', 'post_menopause', 'pregnancy', 'postpartum'].includes(lifeStage || '');

  const getDoshaOrder = () => {
    const doshas = ['vata', 'pitta', 'kapha'];
    if (userDosha && doshas.includes(userDosha)) {
      return [userDosha, ...doshas.filter(d => d !== userDosha)];
    }
    return doshas;
  };

  const doshaLabels: Record<string, string> = {
    vata: 'Vata (Air & Ether)',
    pitta: 'Pitta (Fire & Water)',
    kapha: 'Kapha (Earth & Water)',
  };

  const doshaColors: Record<string, string> = {
    vata: 'bg-sky-50 border-sky-200',
    pitta: 'bg-amber-50 border-amber-200',
    kapha: 'bg-emerald-50 border-emerald-200',
  };

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-wellness-lilac/10 border border-wellness-lilac/20 hover:bg-wellness-lilac/15 transition-colors text-left">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-wellness-sage" />
              <span className="font-medium text-wellness-taupe text-sm">
                Learn about this phase
              </span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-wellness-taupe/70" />
            ) : (
              <ChevronDown className="w-4 h-4 text-wellness-taupe/70" />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-4 space-y-5">
          {/* Non-cycling life stage message */}
          {isNonCycling && (
            <div className="p-4 rounded-lg bg-wellness-sage/10 border border-wellness-sage/20">
              <p className="text-sm text-wellness-taupe/90 italic">
                Even without a monthly cycle, your body still moves through natural energetic rhythms. 
                These insights can help you tune into what feels supportive right now.
              </p>
            </div>
          )}

          {/* What this phase means */}
          <div className="space-y-2">
            <h4 className="font-medium text-wellness-taupe text-sm">What this phase means</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isMenarcheJourney ? (MENARCHE_EDUCATION[selectedPhase]?.meaning || phaseInfo.meaning) : phaseInfo.meaning}
            </p>
          </div>

          {/* Energy & Mood */}
          <div className="space-y-2">
            <h4 className="font-medium text-wellness-taupe text-sm">How energy and mood may feel</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isMenarcheJourney ? (MENARCHE_EDUCATION[selectedPhase]?.energyMood || phaseInfo.energyMood) : phaseInfo.energyMood}
            </p>
          </div>

          {/* Body Response */}
          <div className="space-y-2">
            <h4 className="font-medium text-wellness-taupe text-sm">How your body may respond</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isMenarcheJourney ? (MENARCHE_EDUCATION[selectedPhase]?.bodyResponse || phaseInfo.bodyResponse) : phaseInfo.bodyResponse}
            </p>
          </div>

          {/* Yoga Poses for this phase */}
          {!isMenarcheJourney && phaseInfo.yogaPoses && phaseInfo.yogaPoses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-wellness-sage" />
                <h4 className="font-medium text-wellness-taupe text-sm">Yoga for this phase</h4>
              </div>
              <p className="text-xs text-muted-foreground italic">These poses are specifically chosen for where you are right now.</p>
              <div className="space-y-2">
                {phaseInfo.yogaPoses.map((pose) => (
                  <div key={pose.name} className="p-3 rounded-xl bg-wellness-sage/8 border border-wellness-sage/20">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-wellness-taupe">{pose.name}</p>
                        <p className="text-xs text-wellness-sage font-medium">{pose.translation} · {pose.duration}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{pose.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Note */}
          {!isMenarcheJourney && phaseInfo.nutritionNote && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="w-4 h-4 text-amber-600" />
                <h4 className="font-medium text-amber-900 text-sm">Nourishment for this phase</h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">{phaseInfo.nutritionNote}</p>
            </div>
          )}

          {/* Breathwork Spotlight */}
          {!isMenarcheJourney && phaseInfo.breathworkKey && (
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-sky-600" />
                <div>
                  <h4 className="font-medium text-sky-900 text-sm">{BREATHWORK_TECHNIQUES[phaseInfo.breathworkKey].name}</h4>
                  <p className="text-[10px] text-sky-600">{BREATHWORK_TECHNIQUES[phaseInfo.breathworkKey].use}</p>
                </div>
              </div>
              <ol className="list-decimal list-inside space-y-1">
                {BREATHWORK_TECHNIQUES[phaseInfo.breathworkKey].steps.map((step, i) => (
                  <li key={i} className="text-xs text-sky-800 leading-relaxed">{step}</li>
                ))}
              </ol>
              <p className="text-[10px] text-sky-600 italic mt-2">⚠ {BREATHWORK_TECHNIQUES[phaseInfo.breathworkKey].caution}</p>
            </div>
          )}

          {/* Ayurvedic Insight */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-wellness-lilac" />
              <h4 className="font-medium text-wellness-taupe text-sm">Ayurvedic insight</h4>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Each body is unique. These are gentle suggestions based on Ayurvedic wisdom.
            </p>
            
            <div className="space-y-2">
              {getDoshaOrder().map((dosha) => (
                <div 
                  key={dosha}
                  className={`p-3 rounded-lg border ${doshaColors[dosha]} ${
                    userDosha === dosha ? 'ring-2 ring-wellness-lilac/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium text-wellness-taupe/80">
                      {doshaLabels[dosha]}
                      {userDosha === dosha && (
                        <span className="ml-2 text-wellness-lilac">(Your dosha)</span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {phaseInfo.doshaGuidance[dosha as keyof typeof phaseInfo.doshaGuidance]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA to Content Library */}
          <div className="pt-3 border-t border-wellness-sage/20">
            <Link 
              to={`/content-library?phase=${selectedPhase.toLowerCase()}`}
              className="block"
            >
              <Button 
                variant="outline" 
                className="w-full border-wellness-sage/30 text-wellness-taupe hover:bg-wellness-sage/10 hover:border-wellness-sage/50"
              >
                <Leaf className="w-4 h-4 mr-2" />
                Explore practices that support you right now
              </Button>
            </Link>
          </div>
        </CollapsibleContent>

      </Collapsible>
    </div>
  );
}