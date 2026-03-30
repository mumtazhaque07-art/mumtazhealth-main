import React, { useState, useEffect } from "react";
import { useLifeMap } from "@/contexts/LifeMapContext";
import { LifeStage } from "@/types/lifemap";

/**
 * Dynamic Background Wrapper
 * Subtly shifts the Sage/Lilac gradient based on the user's current "Season" (life stage).
 * - Deeper Lilac for rest phases (Menstrual/Post-Op/Postpartum)
 * - Brighter Sage for energy phases (Ovulatory/Fertility)
 * - Warm neutrals for transitional phases
 */

const stageGradients: Record<LifeStage, string> = {
  // Rest/Recovery phases — deeper Lilac tones
  postpartum:     "from-orange-50/60 via-amber-50/30 to-background",
  post_surgical:  "from-blue-50/60 via-cyan-50/30 to-background",

  // Energy/Growth phases — brighter Sage tones
  menarche:       "from-wellness-lilac/10 via-rose-50/20 to-background",
  fertility:      "from-wellness-sage/10 via-wellness-warm/20 to-background",

  // Pregnancy — Warm pink glow
  pregnancy:      "from-pink-50/60 via-rose-50/30 to-background",

  // Transition phases — Amber warmth
  perimenopause:  "from-amber-50/60 via-yellow-50/30 to-background",

  // Wisdom phases — Deep indigo/violet calm
  menopause:      "from-indigo-50/60 via-violet-50/30 to-background",
  golden_years:   "from-yellow-50/60 via-stone-50/30 to-background",
};

interface DynamicBackgroundProps {
  children: React.ReactNode;
}

export function DynamicBackground({ children }: DynamicBackgroundProps) {
  const { lifeStage } = useLifeMap();
  const baseGradient = stageGradients[lifeStage] || stageGradients.fertility;

  const [isNightMode, setIsNightMode] = useState(false);
  const [overrideNightMode, setOverrideNightMode] = useState<boolean | null>(null);

  useEffect(() => {
    // Check time periodically
    const checkTime = () => {
      if (overrideNightMode !== null) {
        setIsNightMode(overrideNightMode);
        return;
      }
      const hour = new Date().getHours();
      // Between 22:00 and 06:00 (inclusive of 22, 23, 0, 1, 2, 3, 4, 5)
      setIsNightMode(hour >= 22 || hour < 6);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [overrideNightMode]);

  useEffect(() => {
    if (isNightMode) {
      document.documentElement.classList.add("dark");
      // Add a specific night-mode class to body for additional CSS targeting if needed
      document.body.classList.add("night-mode-active");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("night-mode-active");
    }
  }, [isNightMode]);

  // If NightMode is active, use a starker gradient or just rely on dark mode's var(--background).
  // PRD: "Deep Midnight (#1A2B3C): Primary Background (Night/Crisis)."
  const backgroundClass = isNightMode 
    ? "bg-background" // which is Midnight in dark mode
    : `bg-gradient-to-b ${baseGradient}`;

  return (
    <div className={`min-h-[100dvh] ${backgroundClass} transition-colors duration-1000 w-full`}>
      {/* Hidden toggle for testing */}
      <div className="fixed top-2 left-2 z-[9999] flex items-center gap-2 opacity-10 hover:opacity-100 transition-opacity">
         <button 
           onClick={() => setOverrideNightMode(prev => prev === true ? false : true)}
           className="px-2 py-1 bg-black/40 text-white text-xs rounded shadow backdrop-blur-sm"
         >
           Toggle 3AM (Night: {isNightMode ? 'ON' : 'OFF'})
         </button>
         {overrideNightMode !== null && (
           <button 
             onClick={() => setOverrideNightMode(null)}
             className="px-2 py-1 bg-black/40 text-white text-xs rounded shadow backdrop-blur-sm"
           >
             Auto Time
           </button>
         )}
      </div>
      {children}
    </div>
  );
}
