import React from 'react';
import { Moon, HeartPulse, Droplet, Wind, Activity, Flower2 } from 'lucide-react';

export const PERSONA_CONFIG: Record<string, any> = {
  menarche: {
    id: 'menarche',
    title: 'First Time & Cycle Health', 
    color: 'bg-[#F2EDF0]', accent: 'text-[#5B3E52]', accentBg: 'bg-[#5B3E52]', border: 'border-[#5B3E52]/30',
    icon: <Moon className="w-8 h-8" />, remedy: 'Cycle Education & Hormonal Rhythm', action: 'Explore Practices', metric: 'Energy Flow',
    wisdom: 'General maintenance and cycle health. Understanding your body''s rhythm, hormones, and aligning yoga and foods to your cycle stages.'
  },
  fertility: {
    id: 'fertility',
    title: 'Fertility & TTC', 
    color: 'bg-[#EBF1EF]', accent: 'text-[#2D5A46]', accentBg: 'bg-[#2D5A46]', border: 'border-[#2D5A46]/30',
    icon: <Flower2 className="w-8 h-8" />, remedy: 'Vessel Preparation & Stress Reduction', action: 'View Guidance', metric: 'Basal Body Temp',
    wisdom: 'Understanding biologically what is going on. Preparing the mind and vessel to open up, reduce stress, and welcome new life.'
  },
  pregnancy: {
    id: 'pregnancy',
    title: 'Pregnancy', 
    color: 'bg-[#F3EBE9]', accent: 'text-[#A05A4A]', accentBg: 'bg-[#A05A4A]', border: 'border-[#A05A4A]/30',
    icon: <HeartPulse className="w-8 h-8" />, remedy: 'Trimester-Specific Safety & Surrender', action: 'Discover Flows', metric: 'Vitals & Hydration',
    wisdom: 'Navigating the 1st, 2nd, and 3rd trimesters with gentle yoga, meditation, and safety. A time for surrender and spiritual connection.'
  },
  postpartum: {
    id: 'postpartum',
    title: 'Postpartum', 
    color: 'bg-[#EBF1F5]', accent: 'text-[#3E657A]', accentBg: 'bg-[#3E657A]', border: 'border-[#3E657A]/30',
    icon: <Droplet className="w-8 h-8" />, remedy: 'Pelvic Healing & Emotional Support', action: 'Read Protocol', metric: 'Pelvic Floor',
    wisdom: 'Your body has gone through immense labor. Focus on breast nourishment, pelvic healing, and not rushing the process.'
  },
  perimenopause: {
    id: 'perimenopause',
    title: 'Perimenopause', 
    color: 'bg-[#F5E6E8]', accent: 'text-[#8B4513]', accentBg: 'bg-[#8B4513]', border: 'border-[#8B4513]/30',
    icon: <Wind className="w-8 h-8" />, remedy: 'Hormone Disruption & Heat Regulation', action: 'Find Balance', metric: 'Temperature',
    wisdom: 'Identifying doshic imbalances causing disruptions. Addressing symptoms early with targeted yoga, food, and spirituality.'
  },
  menopause: {
    id: 'menopause',
    title: 'Menopause & Beyond', 
    color: 'bg-[#F5F1E8]', accent: 'text-[#B8860B]', accentBg: 'bg-[#B8860B]', border: 'border-[#B8860B]/30',
    icon: <Moon className="w-8 h-8" />, remedy: 'Bone Health & Transition Support', action: 'Explore in Library', metric: 'Bone Density',
    wisdom: 'Navigating the transition of natural or surgical menopause. Focusing on bone health, joint lubrication, and dietary shifts.'
  },
  mobility: {
    id: 'mobility',
    title: 'The Wise Woman', 
    color: 'bg-[#F0F0F7]', accent: 'text-[#3B3A68]', accentBg: 'bg-[#3B3A68]', border: 'border-[#3B3A68]/30',
    icon: <Activity className="w-8 h-8" />, remedy: 'Relevance, Mobility & Chair Yoga', action: 'View Practices', metric: 'Joint Fluidity',
    wisdom: 'For women 70+ who want to remain relevant and empowered. Encompassing all women with chair yoga and gentle mobility.'
  }
};
