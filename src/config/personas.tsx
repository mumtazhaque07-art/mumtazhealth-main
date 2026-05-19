import React from 'react';
import { Moon, HeartPulse, Droplet, Wind, Activity, Flower2 } from 'lucide-react';

export const PERSONA_CONFIG: Record<string, any> = {
  menarche: {
    id: 'menarche',
    title: 'First Cycles', 
    color: 'bg-[#F2EDF0]', accent: 'text-[#5B3E52]', accentBg: 'bg-[#5B3E52]', border: 'border-[#5B3E52]/30',
    icon: <Moon className="w-8 h-8" />, remedy: 'Cycle Harmonization', action: 'Explore Practices', metric: 'Energy Flow',
    wisdom: 'Your cycle is a vital sign. Listen to the soft rhythm of your body as it learns this new flow.'
  },
  fertility: {
    id: 'fertility',
    title: 'Fertility & TTC', 
    color: 'bg-[#EBF1EF]', accent: 'text-[#2D5A46]', accentBg: 'bg-[#2D5A46]', border: 'border-[#2D5A46]/30',
    icon: <Flower2 className="w-8 h-8" />, remedy: 'Pitta Dosha Detox & Prophetic Duas', action: 'View Guidance', metric: 'Basal Body Temp',
    wisdom: 'Fertility is a state of deep nourishment. Focus on warm, grounding foods to build your vital essence (Ojas).'
  },
  pregnancy: {
    id: 'pregnancy',
    title: 'Pregnancy', 
    color: 'bg-[#F3EBE9]', accent: 'text-[#A05A4A]', accentBg: 'bg-[#A05A4A]', border: 'border-[#A05A4A]/30',
    icon: <HeartPulse className="w-8 h-8" />, remedy: 'Gentle Yoga Biomechanics', action: 'Discover Flows', metric: 'Vitals & Hydration',
    wisdom: 'You are currently growing life. Rest is not a luxury, it is a biological requirement. Surrender to the softness.'
  },
  postpartum: {
    id: 'postpartum',
    title: 'Postpartum', 
    color: 'bg-[#EBF1F5]', accent: 'text-[#3E657A]', accentBg: 'bg-[#3E657A]', border: 'border-[#3E657A]/30',
    icon: <Droplet className="w-8 h-8" />, remedy: 'Rasayana Therapies & Core Healing', action: 'Read Protocol', metric: 'Pelvic Floor',
    wisdom: 'The sacred 40 days. Let others hold the physical space while you do the spiritual work of bonding and healing.'
  },
  menopause: {
    id: 'menopause',
    title: 'Peri & Menopause', 
    color: 'bg-[#F5F1E8]', accent: 'text-[#B8860B]', accentBg: 'bg-[#B8860B]', border: 'border-[#B8860B]/30',
    icon: <Wind className="w-8 h-8" />, remedy: 'Gentle Strength Flow', action: 'Explore in Library', metric: 'Thermoregulation',
    wisdom: 'This is not an ending, but an initiation into your wisdom years. Embrace the cooling breath to soothe the internal fire.'
  },
  mobility: {
    id: 'mobility',
    title: 'Mobility & Aging', 
    color: 'bg-[#F0F0F7]', accent: 'text-[#3B3A68]', accentBg: 'bg-[#3B3A68]', border: 'border-[#3B3A68]/30',
    icon: <Activity className="w-8 h-8" />, remedy: 'Joint Stability Flow', action: 'View Practices', metric: 'Joint Fluidity',
    wisdom: 'Mobility is freedom. Gentle, intentional movement lubricates the joints and releases stagnant Vata energy.'
  }
};
