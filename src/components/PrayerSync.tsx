import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Moon, Sun, Heart, Sparkles, MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface SacredRhythmProps {
  className?: string;
}

export function PrayerSync({ className = "" }: SacredRhythmProps) {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [city, setCity] = useState<string>("Local");

  useEffect(() => {
    // In a real production app, we would use geolocation. 
    // For the Mastery MVP, we'll default to London or fetch if permission is given.
    const fetchPrayerTimes = async () => {
      try {
        // Aladhan API is free and robust
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=London&country=UK&method=2`);
        const data = await res.json();
        if (data.code === 200) {
          const timings = data.data.timings;
          setTimes({
            Fajr: timings.Fajr,
            Dhuhr: timings.Dhuhr,
            Asr: timings.Asr,
            Maghrib: timings.Maghrib,
            Isha: timings.Isha,
          });
          calculateCurrentAndNext(timings);
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      }
    };

    const calculateCurrentAndNext = (timings: any) => {
      const now = new Date();
      const formatTime = (t: string) => {
        const [h, m] = t.split(":");
        const d = new Date();
        d.setHours(parseInt(h), parseInt(m), 0);
        return d;
      };

      const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      let currentIdx = -1;

      for (let i = 0; i < prayerOrder.length; i++) {
        const prayerTime = formatTime(timings[prayerOrder[i]]);
        if (now >= prayerTime) {
          currentIdx = i;
        } else {
          break;
        }
      }

      const current = currentIdx === -1 ? "Night" : prayerOrder[currentIdx];
      const nextIdx = (currentIdx + 1) % prayerOrder.length;
      const next = prayerOrder[nextIdx];

      setCurrentPrayer(current);
      setNextPrayer({ name: next, time: timings[next] });
    };

    fetchPrayerTimes();
    const interval = setInterval(fetchPrayerTimes, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getSacredInsight = (prayer: string) => {
    switch (prayer) {
      case "Fajr": return "Early Morning Sanctuary: A time of quietude and new beginnings.";
      case "Dhuhr": return "Mid-Day Stillness: Pause and recenter your intention.";
      case "Asr": return "Afternoon Vitality: Harness the grounding energy of the day.";
      case "Maghrib": return "Gratitude & Sunset: Reflect on the blessings of the daylight.";
      case "Isha": return "Nightly Peace: Restoring the spirit for deep recovery.";
      default: return "The Third Watch: Divine proximity and deep meditation.";
    }
  };

  const getDhikrRecommendation = (prayer: string) => {
    switch (prayer) {
      case "Fajr": return "SubhanAllah wal-Hamdulillah (100x)";
      case "Dhuhr": return "Salawat upon the Prophet (SAW)";
      case "Asr": return "Istighfar (Seeking Clarity)";
      case "Maghrib": return "Alhamdulillah (Deep Gratitude)";
      case "Isha": return "Ayatul Kursi (Protection)";
      default: return "Ya Nur (O Light of the Heavens)";
    }
  };

  if (!times) return null;

  return (
    <TooltipProvider>
      <div className={`p-4 rounded-3xl bg-white/40 border border-wellness-lilac/20 backdrop-blur-md shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-wellness-lilac/10 text-wellness-lilac">
              {currentPrayer === "Fajr" || currentPrayer === "Dhuhr" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-wellness-taupe">
              {currentPrayer} Window
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] border-wellness-sage/30 text-wellness-sage bg-wellness-sage/5">
              <MapPin className="w-2.5 h-2.5 mr-1" /> {city}
            </Badge>
            <button 
              onClick={() => window.location.reload()} 
              className="p-1 rounded-full hover:bg-wellness-lilac/10 text-wellness-lilac/40 hover:text-wellness-lilac transition-colors"
              title="Refresh timings"
            >
              <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Current Insight</span>
            <p className="text-xs font-medium text-wellness-taupe leading-relaxed italic">
              "{getSacredInsight(currentPrayer)}"
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-3 rounded-2xl bg-wellness-lilac/5 border border-wellness-lilac/20 flex items-center justify-between cursor-help group transition-all hover:bg-wellness-lilac/10">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-wellness-lilac" />
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-wellness-lilac tracking-tighter">Window Dhikr</span>
                    <span className="text-xs font-semibold text-wellness-taupe">{getDhikrRecommendation(currentPrayer)}</span>
                  </div>
                </div>
                <Sparkles className="w-3 h-3 text-wellness-sage opacity-40 group-hover:opacity-100" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-wellness-taupe text-white border-none rounded-xl p-3 max-w-[200px]">
              <p className="text-[10px] leading-relaxed">
                Practicing Dhikr during its allocated window deepens the spiritual resonance with your circadian rhythm.
              </p>
            </TooltipContent>
          </Tooltip>

          {nextPrayer && (
            <div className="flex items-center justify-between pt-2 border-t border-wellness-lilac/10">
              <span className="text-[9px] uppercase font-bold text-muted-foreground">Next: {nextPrayer.name}</span>
              <div className="flex items-center gap-1 text-wellness-taupe">
                <Clock className="w-3 h-3 opacity-50" />
                <span className="text-xs font-bold">{nextPrayer.time}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
