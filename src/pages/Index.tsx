import React, { useState, useEffect } from "react";
import { Leaf, HeartPulse, Video, Moon, BookOpen, Users, MessageCircle, Play, ArrowRight, Settings, LogOut, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { PERSONA_CONFIG } from "@/config/personas";
import { ElementsGuideModal } from "@/components/ElementsGuideModal";
import { useLifeMap } from "@/contexts/LifeMapContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Navigation } from "@/components/Navigation";

export default function Index() {
  const navigate = useNavigate();
  const { lifeStage } = useLifeMap();
  
  const [persona, setPersona] = useState<string>(lifeStage || '');
  const [showElementsGuide, setShowElementsGuide] = useState(false);
  const [username, setUsername] = useState<string>("there");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('profiles').select('username').eq('user_id', data.user.id).single()
          .then(({ data: profile }) => {
            if (profile?.username) setUsername(profile.username);
          });
      }
    });
  }, []);

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <Navigation />
      
      <div className="flex-1 overflow-y-auto pb-32 pt-16">
        <header className="px-6 pt-6 pb-6 relative">
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900 leading-tight">Welcome, {username}</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">A safe space. No judgement.</p>
          <p className="text-[15px] text-slate-800 font-semibold mt-8">Where are you today?</p>
        </header>

        <div className="px-6 pb-6 w-full">
          <div className="flex overflow-x-auto scrollbar-hide gap-3 -mx-6 px-6 pb-2">
            {Object.keys(PERSONA_CONFIG).map((p) => {
              const isSelected = persona === p;
              const pConfig = PERSONA_CONFIG[p];
              return (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-300 border ${
                    isSelected ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pConfig.title}
                </button>
              );
            })}
          </div>
        </div>

        <main className="px-6 flex flex-col gap-4">
          {!persona ? (
            <div className="bg-white rounded-[32px] p-10 flex flex-col items-center text-center shadow-sm border border-slate-100 min-h-[220px] justify-center">
               <h2 className="text-xl font-bold text-slate-800 mb-6">Choose a stage to begin.</h2>
            </div>
          ) : (
            <div className="bg-secondary/40 rounded-[32px] p-8 flex flex-col items-center text-center shadow-sm border border-slate-100 min-h-[220px] justify-center">
               <h2 className="text-[22px] font-bold text-slate-900 mb-2 font-accent">Stay in your strength.</h2>
               <p className="text-sm text-slate-600 mb-8 font-medium">{PERSONA_CONFIG[persona].title}</p>
               
               <Drawer>
                 <DrawerTrigger asChild>
                   <Button className="w-full max-w-[220px] bg-primary hover:bg-primary/90 text-white rounded-full h-14 text-base font-semibold shadow-md">
                     View practices
                   </Button>
                 </DrawerTrigger>
                 <DrawerContent className="px-4 pb-12 pt-2 rounded-t-[32px]">
                   <DrawerHeader className="text-left px-2 mb-4">
                     <DrawerTitle className="text-[22px] font-bold text-primary">{PERSONA_CONFIG[persona].title}</DrawerTitle>
                     <p className="text-sm text-slate-500 mt-1 font-medium">Practices for the body you have today.</p>
                   </DrawerHeader>
                   <div className="flex flex-col gap-4 px-2">
                     <div onClick={() => navigate(`/content-library?stage=${PERSONA_CONFIG[persona].id}`)} className="bg-primary/5 border border-primary/10 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors">
                       <div>
                         <h4 className="font-bold text-slate-900 text-[17px]">The Crown of Wisdom</h4>
                         <p className="text-[13px] text-slate-600 mt-1 font-medium">Honoring your phase.</p>
                       </div>
                       <Button size="sm" className="bg-primary text-white rounded-full px-5">Start</Button>
                     </div>
                     <div onClick={() => navigate(`/content-library?stage=${PERSONA_CONFIG[persona].id}`)} className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between cursor-pointer shadow-sm hover:border-slate-200 transition-colors">
                       <div>
                         <h4 className="font-bold text-slate-900 text-[17px]">Gentle Movement</h4>
                         <p className="text-[13px] text-slate-600 mt-1 font-medium">Strength, stability, and care.</p>
                       </div>
                       <Button variant="outline" size="sm" className="rounded-full border-slate-300 text-slate-700 px-5">Start</Button>
                     </div>
                   </div>
                 </DrawerContent>
               </Drawer>
            </div>
          )}

          {/* Action cards row */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <button onClick={() => navigate('/tracker')} className="flex flex-col items-center justify-center p-6 rounded-[28px] bg-white border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
              <HeartPulse className="w-7 h-7 mb-3 text-slate-700" />
              <span className="text-[15px] font-semibold text-slate-800">Check in</span>
            </button>
            <button onClick={() => setShowElementsGuide(true)} className="flex flex-col items-center justify-center p-6 rounded-[28px] bg-white border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
              <Leaf className="w-7 h-7 mb-3 text-slate-700" />
              <span className="text-[15px] font-semibold text-slate-800">Your elements</span>
            </button>
          </div>
        </main>
      </div>

      <ElementsGuideModal isOpen={showElementsGuide} onClose={() => setShowElementsGuide(false)} />
    </div>
  );
}
