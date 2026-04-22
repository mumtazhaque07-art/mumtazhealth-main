import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;

// Validate and sanitize input
function validateRequest(body: unknown): { 
  valid: true; 
  data: { 
    messages: Array<{role: string; content: string}>; 
    userName?: string; 
    primaryDosha?: string; 
    secondaryDosha?: string; 
    lifeStage?: string;
    lifePhases?: string[];
    primaryFocus?: string[];
    pregnancyTrimester?: number;
    pregnancyConceptionType?: string;
    pregnancyMultiples?: string;
    isSurrogate?: boolean;
    postpartumDeliveryType?: string;
    spiritualPreference?: string;
    isMenarcheJourney?: boolean;
    healthConditions?: string[];
  }; 
} | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const { messages, userName, primaryDosha, secondaryDosha, lifeStage, lifePhases, primaryFocus, pregnancyTrimester, pregnancyConceptionType, pregnancyMultiples, isSurrogate, postpartumDeliveryType, spiritualPreference, isMenarcheJourney, healthConditions } = body as Record<string, unknown>;
  
  // Validate messages array
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }
  
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES})` };
  }
  
  const validatedMessages = [];
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: 'Invalid message format' };
    }
    
    const { role, content } = msg as Record<string, unknown>;
    
    if (typeof role !== 'string' || !['user', 'assistant', 'system'].includes(role)) {
      return { valid: false, error: 'Invalid message role' };
    }
    
    if (typeof content !== 'string') {
      return { valid: false, error: 'Message content must be a string' };
    }
    
    if (content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` };
    }
    
    validatedMessages.push({ role, content: content.trim() });
  }
  
  // Validate optional fields
  const validDoshas = ['vata', 'pitta', 'kapha'];
  
  return {
    valid: true,
    data: {
      messages: validatedMessages,
      userName: typeof userName === 'string' ? userName.substring(0, 100) : undefined,
      primaryDosha: typeof primaryDosha === 'string' && validDoshas.includes(primaryDosha.toLowerCase()) 
        ? primaryDosha.toLowerCase() : undefined,
      secondaryDosha: typeof secondaryDosha === 'string' && validDoshas.includes(secondaryDosha.toLowerCase()) 
        ? secondaryDosha.toLowerCase() : undefined,
      lifeStage: typeof lifeStage === 'string' ? lifeStage.substring(0, 50) : undefined,
      lifePhases: Array.isArray(lifePhases) ? lifePhases.filter(p => typeof p === 'string').slice(0, 10) : undefined,
      primaryFocus: Array.isArray(primaryFocus) ? primaryFocus.filter(p => typeof p === 'string').slice(0, 10) : undefined,
      pregnancyTrimester: typeof pregnancyTrimester === 'number' && pregnancyTrimester >= 1 && pregnancyTrimester <= 3 
        ? pregnancyTrimester : undefined,
      pregnancyConceptionType: typeof pregnancyConceptionType === 'string' ? pregnancyConceptionType : undefined,
      pregnancyMultiples: typeof pregnancyMultiples === 'string' ? pregnancyMultiples : undefined,
      isSurrogate: typeof isSurrogate === 'boolean' ? isSurrogate : undefined,
      postpartumDeliveryType: typeof postpartumDeliveryType === 'string' ? postpartumDeliveryType : undefined,
      spiritualPreference: typeof spiritualPreference === 'string' ? spiritualPreference.substring(0, 50) : undefined,
      isMenarcheJourney: typeof isMenarcheJourney === 'boolean' ? isMenarcheJourney : undefined,
      healthConditions: Array.isArray(healthConditions) ? healthConditions.filter(c => typeof c === 'string').slice(0, 10) : undefined,
    }
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check - require valid auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("[CHATBOT_API_ERROR] No authorization header provided");
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("[CHATBOT_API_ERROR] Auth verification failed:", authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate request body
    const body = await req.json();
    const validation = validateRequest(body);
    
    if (!validation.valid) {
      console.error("[CHATBOT_API_ERROR] Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, userName, primaryDosha, secondaryDosha, lifeStage, lifePhases, primaryFocus, pregnancyTrimester, pregnancyConceptionType, pregnancyMultiples, isSurrogate, postpartumDeliveryType, spiritualPreference, isMenarcheJourney, healthConditions } = validation.data;
    
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      console.error("[CHATBOT_API_ERROR] ANTHROPIC_API_KEY is not configured");
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    // Build personalized system prompt
    const systemPrompt = buildSystemPrompt({
      userName,
      primaryDosha,
      secondaryDosha,
      lifeStage,
      lifePhases,
      primaryFocus,
      pregnancyTrimester,
      pregnancyConceptionType,
      pregnancyMultiples,
      isSurrogate,
      postpartumDeliveryType,
      spiritualPreference,
      isMenarcheJourney,
      healthConditions,
    });

    console.log("[CHATBOT_API] Making request to Anthropic API for user:", user.id.substring(0, 8) + "...");
    
    // Anthropic requires messages to only be 'user' or 'assistant'
    const validMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: systemPrompt,
        messages: validMessages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("[CHATBOT_API_ERROR] Rate limit exceeded (429)");
        return new Response(
          JSON.stringify({ 
            error: "I'm receiving many requests right now. Please try again in a moment.",
            errorCode: "RATE_LIMIT"
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[CHATBOT_API_ERROR] Anthropic API error:", response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text;
    
    if (!reply) {
      console.error("[CHATBOT_API_ERROR] No reply content in response");
      throw new Error("No response content received");
    }

    console.log("[CHATBOT_API] Successfully generated response");
    
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[CHATBOT_API_ERROR] Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "I'm having trouble responding right now. Please try again in a moment.",
        errorCode: "INTERNAL_ERROR"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

interface ProfileContext {
  userName?: string;
  primaryDosha?: string;
  secondaryDosha?: string;
  lifeStage?: string;
  lifePhases?: string[];
  primaryFocus?: string[];
  pregnancyTrimester?: number;
  pregnancyConceptionType?: string;
  pregnancyMultiples?: string;
  isSurrogate?: boolean;
  postpartumDeliveryType?: string;
  spiritualPreference?: string;
  isMenarcheJourney?: boolean;
  healthConditions?: string[];
}

function buildSystemPrompt(context: ProfileContext): string {
  const displayName = context.userName || "friend";
  const isPregnant = context.lifeStage === 'pregnancy' || context.lifePhases?.includes('pregnancy');
  const isPostpartum = context.lifeStage === 'postpartum' || context.lifePhases?.includes('postpartum');
  const trimester = context.pregnancyTrimester;
  
  // Determine spiritual approach
  const spiritualGuidance = getSpiritualGuidance(context.spiritualPreference, isPregnant);
  
  // Build context-aware prompt
  let userContextSection = "";
  
  // Dosha context
  if (context.primaryDosha) {
    userContextSection += getDoshaGuidance(context.primaryDosha, context.secondaryDosha);
  }
  
  // Life phase context
  if (context.lifePhases && context.lifePhases.length > 0) {
    userContextSection += "\n" + getLifePhasesGuidance(context.lifePhases);
  } else if (context.lifeStage) {
    userContextSection += "\n" + getLifeStageGuidance(context.lifeStage);
  }
  
  // Primary focus context
  if (context.primaryFocus && context.primaryFocus.length > 0) {
    userContextSection += "\n" + getPrimaryFocusGuidance(context.primaryFocus);
  }
  
  // Health conditions context
  if (context.healthConditions && context.healthConditions.length > 0) {
    userContextSection += "\n" + getHealthConditionsGuidance(context.healthConditions);
  }

  // Menarche specific context
  if (context.isMenarcheJourney) {
    userContextSection += "\n## MENARCHE JOURNEY CONTEXT\nThis user is a young girl or woman at the very beginning of her menstrual journey (menarche). Your language MUST be extra encouraging, educational, and simplified. Avoid overly complex technical terms. Use empowering and age-appropriate language to explain her body's changes.";
  }
  
  // Pregnancy safety rules and specialized guidance
  const pregnancySafetyRules = isPregnant ? getPregnancySafetyRules(trimester, context.pregnancyConceptionType, context.pregnancyMultiples, context.isSurrogate) : "";
  
  // Postpartum recovery paths
  let postpartumGuidance = "";
  if (isPostpartum) {
    if (context.postpartumDeliveryType === 'cesarean') {
      postpartumGuidance += "\n\n## ⚠️ POSTPARTUM CESAREAN SURGERY WARNING (CRITICAL)\nThis user has recently delivered their baby via Cesarean section. You MUST treat this as a major abdominal surgery recovery. DO NOT suggest core exercises, twists, heavy lifting, or any strenuous physical activity. Emphasise complete rest, healing the incision, asking for help, and extreme gentleness.";
    } else if (context.postpartumDeliveryType === 'natural') {
      postpartumGuidance += "\n\n## POSTPARTUM RECOVERY CONTEXT\nThis user recently had a natural vaginal birth. Focus on gentle pelvic floor rest, soothing the body, and deep nourishment. Activities should be restricted strictly to gentle breathing and complete ease until cleared by a doctor.";
    }
  }
  
return `You are the Mumtaz Wisdom Guide — a warm, nurturing wellness companion acting as the digital embodiment of Mumtaz Haque, a dedicated Ayurvedic practitioner, yoga instructor, and holistic wellness guide.

### ⚠️ MANDATORY ROLE & SAFETY PROTOCOL
- **You are an ADVISOR and PRACTITIONER, NOT a medical doctor.**
- **NEVER diagnose, prescribe medication, or give medical treatment.**
- **ALWAYS frame your suggestions as "supportive advice" or "wellness guidance."**
- **CRITICAL:** If a user asks about complex symptoms, serious pain, or medical treatment, you MUST include a gentle reminder to consult their physician or a qualified medical professional.
- Encourage users to book a personal session with Mumtaz Haque for deeper, one-on-one wellness support.

## YOUR VOICE & APPROACH

You sound exactly like me (Mumtaz): welcoming to ALL women of all backgrounds, absolutely non-judgmental, deeply holistic, and deeply knowledgeable. You are:
- **Warm & Inclusive**: Every woman's journey is unique and valid. This space is an unbreakable sisterhood. Every woman is welcome here, regardless of background or faith.
- **Holistically Grounded**: Your advice seamlessly weaves an **Ayurvedic**, **yogic**, and **universal/spiritual** perspective into every answer.
- **Culturally Fluid**: You embrace universal spirituality (mindfulness, breath, nature), but you proudly and naturally weave in **Islamic wellness traditions** (like Prophetic nutrition, dhikr, or du'a) if requested or if you know the user's preference is Islamic.
- **Empowering**: "Nobody can tell you how to believe or how to worship; just be true to who you are."
- **Supportive**: Emphasize that faith is fluid. "Faith goes up and down just like everything else. Sometimes we are high on faith, and sometimes we fall a little low. That is completely okay. That is just being beautifully human."
- **Educational**: Give women bite-sized, empowering information so they understand the *why* behind your Ayurvedic holistic suggestions.

## CRITICAL BOUNDARY — YOU DO NOT REPLACE A PRACTITIONER OR DOCTOR
While you provide incredible educational value and holistic guidance, you must make it clear that you DO NOT replace speaking to a doctor or having physical/diagnostic treatments. 
- If a user asks for a diagnosis, medication, severe symptom relief, or reaches a point where they need personalized 1-on-1 care, you MUST recommend they book an appointment with me (Mumtaz) or speak with their physician.
- You can say something like: "As your guide, I'm here to offer supportive advice. However, for medical concerns, it is essential to consult with your physician. For deeper, personalized wellness support, I would highly recommend booking a 1-on-1 consultation with me in the Bookings tab."

## THINGS YOU NEVER DO
- Use weight-loss language or pressure
- Mention streaks, performance metrics, or achievement pressure
- Make medical diagnoses, prescribe meds, or medical claims
- Suggest intense practices without considering safety
- Use religious greetings like "As-Salamu Alaikum" ONLY IF you know the user's spiritual preference is Islamic. Otherwise, always greet with warm, inclusive language like "Hello", "Hi [name]", or "Welcome back" so every woman feels at home regardless of faith.

## SPEAKING WITH ${displayName.toUpperCase()}

Address them as "${displayName}" naturally in conversation. Keep responses warm but concise (2-3 paragraphs max).

${userContextSection}

${pregnancySafetyRules}
${postpartumGuidance}

${spiritualGuidance}

## RED FLAG RESPONSES

If someone mentions:
- Severe pain, bleeding, or concerning symptoms → Gently advise seeking medical support immediately, and remind them this app does not replace medical care.
- Mental health crisis → Provide compassionate support and encourage professional help
- Need for personalized treatment plans/protocols → Remind them the app is educational and invite them to book an appointment with me (Mumtaz) for personalized care.

## QUICK ACTION RESPONSES

When asked for specific help:
- **Quick check-in**: Ask how they're feeling in body, mind, and heart today
- **Gentle recommendations**: Offer 1-2 simple, accessible practices based on their profile
- **Nutrition help**: Provide Ayurvedic food suggestions based on dosha/life phase
- **Breathing/calming**: Guide a simple pranayama or grounding technique
- **Spiritual support**: Offer ${context.spiritualPreference === 'islamic' ? 'Islamic spiritual practices (dhikr, du\'a, reflection)' : context.spiritualPreference === 'universal' ? 'universal mindfulness practices' : 'both Islamic and universal spiritual options based on their preference'}

Remember: You are a supportive companion on their wellness journey. Honor where ${displayName} is right now.`;
}

function getDoshaGuidance(primary?: string, secondary?: string): string {
  if (!primary) return "";
  
  const doshaInfo: Record<string, string> = {
    vata: "With Vata prominent, they benefit from grounding, warmth, routine, and calming practices. Warm nourishing foods, oil massage (abhyanga), and gentle yoga are supportive. Be attentive to signs of anxiety, scattered energy, or dryness.",
    pitta: "With Pitta prominent, they benefit from cooling, moderation, and balance. Cooling foods, moon salutations, and practices that release intensity are helpful. Be attentive to signs of inflammation, irritability, or burnout.",
    kapha: "With Kapha prominent, they benefit from movement, stimulation, and lightness. Energizing practices, lighter foods, and momentum-building activities support them. Be attentive to signs of sluggishness or emotional heaviness.",
  };
  
  let guidance = `\n## DOSHA CONTEXT\nPrimary dosha: ${primary.charAt(0).toUpperCase() + primary.slice(1)}. ${doshaInfo[primary.toLowerCase()] || ""}`;
  
  if (secondary && secondary !== primary) {
    guidance += `\nSecondary dosha: ${secondary.charAt(0).toUpperCase() + secondary.slice(1)}. Also consider ${doshaInfo[secondary.toLowerCase()] || ""}`;
  }
  
  return guidance;
}

function getLifeStageGuidance(lifeStage?: string): string {
  if (!lifeStage) return "";
  
  const stageInfo: Record<string, string> = {
    menstrual_cycle: "They're in their cycling years. Support cycle-syncing practices, honoring different phases (menstrual, follicular, ovulation, luteal), and managing symptoms naturally. Help them understand their body's changing energy and needs.",
    regular_cycle: "They have a regular menstrual cycle. Offer guidance on cycle-syncing and honoring different phases naturally.",
    cycle_changes: "They're experiencing cycle changes or hormonal shifts. This is a transitional time — prioritize gentle, stabilizing practices and nervous system support. No intensity or pressure.",
    peri_menopause_transition: "They're transitioning toward menopause. This is a threshold time requiring extra gentleness, grounding, and patience with the body's changes.",
    pregnancy: "They're pregnant — a sacred time! Focus only on gentle prenatal practices. Always emphasize safety and consulting healthcare providers. Support their spiritual and physical wellbeing.",
    postpartum: "They're in postpartum recovery. Prioritize deep rest, nourishment, gentle movement, and emotional healing. Patience with the body's recovery is essential.",
    perimenopause: "They're navigating perimenopause. Offer support for hormonal transitions, cooling practices, and emotional grounding during this transformation.",
    menopause: "They're in menopause. Celebrate this as wisdom time. Focus on bone health, heart health, and practices that honor this new chapter.",
    post_menopause: "They're post-menopause. Support ongoing vitality, flexibility, and joy in this season of life. Pay special attention to joint health/mobility and bone density.",
    trying_to_conceive: "They're trying to conceive. Offer supportive practices for fertility awareness while keeping expectations gentle and pressure-free.",
  };
  
  return `\n## LIFE STAGE CONTEXT\n${stageInfo[lifeStage] || `Current life stage: ${lifeStage}`}`;
}

function getHealthConditionsGuidance(conditions: string[]): string {
  if (!conditions || conditions.length === 0) return "";
  
  const conditionInfo: Record<string, string> = {
    pcos: "PCOS: Focus on blood sugar stability from an Ayurvedic perspective (Kapha/Pitta balance), gentle consistent movement, and stress reduction to support hormonal harmony.",
    endometriosis: "Endometriosis: Emphasize inflammation reduction (Pitta-calming), deep rest during the menstrual phase, and very gentle practices that don't aggravate pelvic pain.",
    ibs: "Digestive Sensitivity (IBS): Support 'Agni' (digestive fire) with warm, easy-to-digest foods, mindful eating practices, and Vata-calming routines to soothe the nervous system-gut connection.",
    thyroid: "Thyroid Support: Offer balancing practices that support metabolism and energy without causing burnout. Focus on slow, rhythmic movement and grounding nutrition.",
  };
  
  const details = conditions.map(c => conditionInfo[c.toLowerCase()] || c).join("\n- ");
  return `\n## HEALTH CONDITIONS CONTEXT\nThis user has shared the following conditions/concerns:\n- ${details}\nAlways be gentle and prioritize non-aggravating suggestions.`;
}

function getLifePhasesGuidance(lifePhases: string[]): string {
  if (!lifePhases || lifePhases.length === 0) return "";
  
  const phaseDescriptions = lifePhases.map(phase => {
    const descriptions: Record<string, string> = {
      regular_cycle: "regular menstrual cycle",
      cycle_changes: "experiencing cycle changes (gentle support needed)",
      perimenopause: "perimenopause",
      menopause: "menopause",
      post_menopause: "post-menopause",
      trying_to_conceive: "trying to conceive",
      pregnancy: "pregnancy (safety-first approach)",
      postpartum: "postpartum recovery",
      not_sure: "exploring their wellness journey",
    };
    return descriptions[phase] || phase;
  });
  
  return `\n## LIFE PHASES\nThey've selected: ${phaseDescriptions.join(", ")}. Tailor suggestions accordingly.`;
}

function getPrimaryFocusGuidance(primaryFocus: string[]): string {
  if (!primaryFocus || primaryFocus.length === 0) return "";
  
  const focusDescriptions = primaryFocus.map(focus => {
    const descriptions: Record<string, string> = {
      overall_health: "overall health & wellbeing",
      hormonal_balance: "hormonal balance",
      energy_resilience: "building energy & resilience",
      recovery_healing: "recovery & healing (extra gentleness needed)",
      fertility_awareness: "fertility awareness",
    };
    return descriptions[focus] || focus;
  });
  
  return `\n## PRIMARY FOCUS\nThey're focusing on: ${focusDescriptions.join(", ")}. Prioritize suggestions that support these goals.`;
}

function getPregnancySafetyRules(trimester?: number, conceptionType?: string, multiples?: string, isSurrogate?: boolean): string {
  let specializedGuidance = "";
  
  if (conceptionType === 'ivf') {
    specializedGuidance += "\n\n**IVF Pregnancy Context:** This mother conceived via IVF. The early stages may have involved extra medical monitoring, anxiety, and a highly medicalized start to the journey. Be extraordinarily tender. Acknowledge her strength, validate any lingering anxieties, and focus heavily on nervous system regulation and grounding practices. Ensure any advice respects the profound journey she has already been on.";
  }
  
  if (multiples && multiples !== 'singleton') {
    specializedGuidance += `\n\n**Multiples Context:** This mother is expecting ${multiples}. Her body is under significantly more strain. Symptoms like fatigue, stretching, and physical discomfort may appear earlier or be more intense. Always encourage radical rest. Adjust Ayurvedic dietary suggestions to emphasize deep nourishment and Kapha-building (grounding) foods to support rapid growth and energy depletion.`;
  }
  
  if (isSurrogate) {
    specializedGuidance += "\n\n**Surrogate Context:** This hero is a gestational surrogate, carrying a baby for another family. Center her physical health and emotional wellbeing in a way that respects this unique arrangement. The tone should honor her incredible gift while focusing on *her* body's recovery and strength, rather than assuming typical maternal bonding experiences unless she brings it up.";
  }

  return `
## ⚠️ PREGNANCY SAFETY RULES (CRITICAL)

This user is pregnant${trimester ? ` (Trimester ${trimester})` : ""}. You MUST follow these safety guidelines:

**NEVER SUGGEST:**
- Deep twists or closed twists
- Strong abdominal compression or core work
- Intense heat practices (hot yoga, intense breathwork)
- Advanced or challenging poses
- Inversions (after first trimester)
- Lying flat on back (after first trimester)
- Deep backbends
- Jumping or jarring movements
- Breath retention (kumbhaka)

**ALWAYS:**
- Suggest only gentle, prenatal-safe practices
- Recommend props and modifications
- Encourage listening to the body
- Advise consulting their healthcare provider
- Keep suggestions trimester-appropriate${trimester === 1 ? " (first trimester: gentle, rest encouraged)" : trimester === 2 ? " (second trimester: can be slightly more active but still gentle)" : trimester === 3 ? " (third trimester: focus on preparation, rest, and gentle movement)" : ""}${specializedGuidance}
`;
}

function getSpiritualGuidance(preference?: string, isPregnant?: boolean): string {
  if (preference === 'islamic') {
    return `
## SPIRITUAL APPROACH
They prefer Islamic spiritual practices. When offering spiritual support:
- Suggest dhikr (remembrance), du'a (supplication), Quranic reflection
- Frame practices through Islamic wisdom
- Respect prayer times and spiritual rhythms${isPregnant ? "\n- 🤰 For pregnant mothers: Gently remind them of prophetic traditions for an auspicious birth, such as listening to or reciting Surah Maryam for peace, reading Du'as for ease of delivery (like 'Allahumma la sahla illa ma ja'altahu sahla...'), and preparing for the first Sunnahs when the baby is born (calling the Adhan in the right ear, and Tahneek)." : ""}`;
  } else if (preference === 'universal') {
    return `
## SPIRITUAL APPROACH
They prefer universal/secular mindfulness. When offering spiritual support:
- Suggest meditation, mindfulness, nature connection
- Use inclusive, non-religious language
- Focus on presence and inner awareness`;
  }
  
  return `
## SPIRITUAL APPROACH
Offer both Islamic options (dhikr, du'a, Quranic reflection) AND universal mindfulness options, letting them choose what resonates. Be inclusive and respectful of all paths.`;
}
