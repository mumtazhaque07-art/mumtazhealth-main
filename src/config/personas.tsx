import React from 'react';
import { Moon, HeartPulse, Droplet, Wind, Activity, Flower2 } from 'lucide-react';

export const PERSONA_CONFIG: Record<string, any> = {
  menarche: {
    id: 'menarche',
    title: 'First Cycles', color: 'bg-[#F4F0F8]', accent: 'text-[#9B8BA7]', accentBg: 'bg-[#9B8BA7]', border: 'border-[#9B8BA7]/20',
    icon: <Moon className="w-8 h-8" />, remedy: 'Cycle Harmonization', action: 'Watch Guide', metric: 'Energy Flow'
  },
  fertility: {
    id: 'fertility',
    title: 'Fertility & TTC', color: 'bg-[#EEF3ED]', accent: 'text-[#7A9684]', accentBg: 'bg-[#7A9684]', border: 'border-[#7A9684]/20',
    icon: <Flower2 className="w-8 h-8" />, remedy: 'Pitta Dosha Detox & Prophetic Duas', action: 'Play Audio', metric: 'Basal Body Temp'
  },
  pregnancy: {
    id: 'pregnancy',
    title: 'Pregnancy', color: 'bg-[#F4F0F8]', accent: 'text-[#9B8BA7]', accentBg: 'bg-[#9B8BA7]', border: 'border-[#9B8BA7]/20',
    icon: <HeartPulse className="w-8 h-8" />, remedy: 'Gentle Yoga Biomechanics', action: 'Start Video', metric: 'Vitals & Hydration'
  },
  postpartum: {
    id: 'postpartum',
    title: 'Postpartum', color: 'bg-[#EEF3ED]', accent: 'text-[#7A9684]', accentBg: 'bg-[#7A9684]', border: 'border-[#7A9684]/20',
    icon: <Droplet className="w-8 h-8" />, remedy: 'Rasayana Therapies & Core Healing', action: 'View Protocol', metric: 'Pelvic Floor'
  },
  menopause: {
    id: 'menopause',
    title: 'Peri & Menopause', color: 'bg-[#F4F0F8]', accent: 'text-[#9B8BA7]', accentBg: 'bg-[#9B8BA7]', border: 'border-[#9B8BA7]/20',
    icon: <Wind className="w-8 h-8" />, remedy: 'Gentle Strength Flow', action: 'Start Session', metric: 'Thermoregulation'
  },
  mobility: {
    id: 'mobility',
    title: 'Mobility & Aging', color: 'bg-[#EEF3ED]', accent: 'text-[#7A9684]', accentBg: 'bg-[#7A9684]', border: 'border-[#7A9684]/20',
    icon: <Activity className="w-8 h-8" />, remedy: 'Joint Stability Flow', action: 'Begin Movement', metric: 'Joint Fluidity'
  }
};
