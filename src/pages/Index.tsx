import React, { useState } from "react";
import { HeartPulse, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PERSONA_CONFIG } from "@/config/personas";
import { useLifeMap } from "@/contexts/LifeMapContext";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Logo } from "@/components/Logo";

/** Map home persona ids → Content Library ?stage= aliases */
const STAGE_LIBRARY_PARAM: Record<string, string> = {
  menarche: "menstrual",
  fertility: "fertility",
  pregnancy: "pregnancy",
  postpartum: "postpartum",
  perimenopause: "perimenopause",
  menopause: "menopause",
  mobility: "wise-woman",
};

export default function Index() {
  const navigate = useNavigate();
  const { lifeStage } = useLifeMap();
  
  const [persona, setPersona] = useState<string>(lifeStage || "menarche");


  const openLibraryForPersona = (id: string) => {
    const stage = STAGE_LIBRARY_PARAM[id] || id;
    navigate(`/content-library?stage=${stage}`);
  };

  const wisdom =
    (persona && PERSONA_CONFIG[persona]?.wisdom) || "Your body has a rhythm.";

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[#FDFBF7] relative overflow-hidden">
      <Navigation />
      
      <div className="flex-1 overflow-y-auto pb-32 pt-16">
        {/* Centred official logo — no HTML wordmark */}
        <div className="flex justify-center px-6 pt-4 pb-2">
          <Logo size="lg" showText={false} className="max-w-[220px]" />
        </div>

        <header className="px-6 pt-2 pb-4 relative text-center">
          <p className="text-[15px] text-slate-800 font-semibold">Where are you today?</p>
        </header>

        {/* Stage chips — horizontal scroll, nowrap, min 44px */}
        <div className="px-6 pb-5 w-full">
          <div className="flex overflow-x-auto scrollbar-hide gap-2.5 -mx-6 px-6 pb-1 flex-nowrap">
            {Object.keys(PERSONA_CONFIG).map((p) => {
              const isSelected = persona === p;
              const pConfig = PERSONA_CONFIG[p];
              return (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`flex-shrink-0 px-5 min-h-[44px] rounded-full text-[14px] font-semibold transition-all duration-300 border whitespace-nowrap ${
                    isSelected
                      ? "bg-mumtaz-plum text-white border-mumtaz-plum shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {pConfig.title}
                </button>
              );
            })}
          </div>
        </div>

        <main className="px-6 flex flex-col gap-4">
          {/* TODAY card */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-mumtaz-plum mb-2">
              Today
            </p>
            <p className="text-[17px] font-medium text-slate-800 leading-snug mb-5">
              {wisdom}
            </p>
            <Button
              className="w-full max-w-[240px] bg-mumtaz-plum hover:bg-mumtaz-plum/90 text-white rounded-full h-12 text-[15px] font-semibold shadow-md"
              onClick={() => openLibraryForPersona(persona)}
            >
              View practices
            </Button>
          </div>

          {/* Quiet list rows — not 2-col grid */}
          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={() => navigate("/tracker")}
              className="flex items-center gap-4 w-full rounded-2xl bg-white/80 border border-slate-100 px-4 py-3.5 text-left hover:bg-white transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2EDF0] text-mumtaz-plum shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-slate-800">Check-in</p>
                <p className="text-[13px] text-slate-500 truncate">Tune in to how you feel</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </button>

            <button
              onClick={() => navigate("/bookings")}
              className="flex items-center gap-4 w-full rounded-2xl bg-white/80 border border-slate-100 px-4 py-3.5 text-left hover:bg-white transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2EDF0] text-mumtaz-plum shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-slate-800">Connect</p>
                <p className="text-[13px] text-slate-500 truncate">Resources and community</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
