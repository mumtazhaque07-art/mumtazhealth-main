import { useState, useEffect } from "react";
import { Moon, Sun, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LunarIndicator() {
  const [phase, setPhase] = useState<{ name: string; icon: any; illumination: number; isWhiteDay: boolean }>({
    name: "New Moon",
    icon: Moon,
    illumination: 0,
    isWhiteDay: false,
  });

  useEffect(() => {
    // Simple mathematical approximation of the moon phase
    // Days since a known New Moon (Jan 6, 2000)
    const knownNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
    const now = new Date().getTime();
    const cycleDays = 29.530588853; // Average synodic month
    const diff = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
    const phaseValue = (diff % cycleDays) / cycleDays;
    
    // 0 = New Moon, 0.5 = Full Moon
    let name = "New Moon";
    let illumination = 0;
    
    if (phaseValue < 0.05 || phaseValue > 0.95) name = "New Moon";
    else if (phaseValue < 0.25) name = "Waxing Crescent";
    else if (phaseValue < 0.30) name = "First Quarter";
    else if (phaseValue < 0.45) name = "Waxing Gibbous";
    else if (phaseValue < 0.55) name = "Full Moon";
    else if (phaseValue < 0.75) name = "Waning Gibbous";
    else if (phaseValue < 0.80) name = "Last Quarter";
    else name = "Waning Crescent";

    // Illumination approximation
    illumination = Math.abs(phaseValue - 0.5) * 2;
    illumination = (1 - illumination) * 100;

    // "White Days" (Ayyam al-Bid) are 13, 14, 15 of the Lunar month
    const dayOfCycle = Math.floor(phaseValue * 30); // Approximate lunar day
    const isWhiteDay = dayOfCycle >= 12 && dayOfCycle <= 14;

    setPhase({ name, icon: Moon, illumination: Math.round(illumination), isWhiteDay });
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-inner group cursor-help transition-all hover:bg-white/60">
            <div className="w-10 h-10 rounded-full bg-wellness-lilac/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Moon className={`w-5 h-5 ${phase.isWhiteDay ? 'text-wellness-lilac fill-wellness-lilac animate-pulse' : 'text-wellness-taupe'}`} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lunar Phase</span>
                {phase.isWhiteDay && (
                  <Badge className="h-4 text-[8px] bg-wellness-lilac text-white border-none animate-bounce">White Day</Badge>
                )}
              </div>
              <span className="text-xs font-bold text-wellness-taupe">{phase.name}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs p-4 space-y-2">
          <p className="font-bold text-sm">Cosmic Alignment</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The moon is currently <strong>{phase.illumination}% illuminated</strong>. 
            {phase.isWhiteDay 
              ? " It's a 'White Day'—a time of detox, fasting, and spiritual clarity according to the Sunnah." 
              : " Use this phase to align your biological rhythm with the cosmic flow."}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
