import React, { useState, useEffect } from "react";
import { Leaf, HeartPulse, Video, Moon, BookOpen, Users, MessageCircle, Play, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { PERSONA_CONFIG } from "@/config/personas";
import { ElementsGuideModal } from "@/components/ElementsGuideModal";
import { useLifeMap } from "@/contexts/LifeMapContext";
import { supabase } from "@/integrations/supabase/client";
import { SanctuaryManifesto } from "@/components/SanctuaryManifesto";

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lifeStage } = useLifeMap();
  
  // Default to fertility if not set, else use the mapped life stage
  const mappedPersona = Object.keys(PERSONA_CONFIG).includes(lifeStage || '') ? lifeStage : 'fertility';
  const [persona, setPersona] = useState<string>(mappedPersona || 'fertility');
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

  const config = PERSONA_CONFIG[persona];
  const activeTab = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[#FDFBF7] relative overflow-hidden">
      
      <div className="flex-1 overflow-y-auto pb-24">
        <header className="px-6 pt-12 pb-4">
          <h1 className="text-3xl font-light tracking-tight text-[#1D1C1C]">Welcome {username}, <br/>to your sanctuary.</h1>
          <p className="text-sm text-[#1D1C1C]/60 mt-2">A safe space with zero judgment.</p>
        </header>

        <div className="px-6 pb-6">
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 -mx-6 px-6 snap-x">
            {Object.keys(PERSONA_CONFIG).map((p) => {
              const isSelected = persona === p;
              const pConfig = PERSONA_CONFIG[p];
              return (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`snap-center flex-shrink-0 w-28 h-32 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 border ${
                    isSelected ? `${pConfig.color} ${pConfig.border} shadow-sm scale-105 ring-4 ring-[#FDFBF7]` : 'bg-transparent border-slate-200 hover:bg-slate-50 opacity-70 grayscale-[30%]'
                  }`}
                >
                  <div className={`mb-3 ${isSelected ? pConfig.accent : 'text-slate-400'}`}>
                    {React.cloneElement(pConfig.icon as React.ReactElement, { className: 'w-10 h-10 stroke-[1.5]' })}
                  </div>
                  <span className={`text-xs font-medium ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>{pConfig.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <main className="px-6">
          {/* SANCTUARY GUIDE (NEW FEATURED SECTION) */}
          <section className="mb-6">
            <div className={`relative w-full rounded-[2rem] overflow-hidden ${config.color} border ${config.border} p-6 transition-all duration-500 shadow-md`}>
              <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[40px] opacity-40 ${config.accentBg}`}></div>
              <div className={`absolute -left-8 -bottom-8 w-32 h-32 rounded-full blur-[30px] opacity-30 ${config.accentBg}`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ${config.accent}`}>
                    {React.cloneElement(config.icon as React.ReactElement, { className: 'w-6 h-6' })}
                  </div>
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm uppercase tracking-widest border border-white/20">
                    Today's Wisdom
                  </span>
                </div>
                
                <div>
                  <h2 className={`text-xl font-medium text-slate-900 mb-3 leading-tight pr-4`}>
                    "{config.wisdom || config.remedy}"
                  </h2>
                  <div className="w-12 h-[2px] rounded-full bg-slate-900/20 mb-4"></div>
                  
                  <div className="flex items-center justify-between cursor-pointer group" onClick={() => navigate(`/content-library?stage=${config.id === 'menarche' ? 'menstrual' : config.id}`)}>
                    <span className="text-sm font-semibold text-[#1D1C1C] group-hover:underline underline-offset-4 decoration-2">{config.action}</span>
                    <button className={`w-12 h-12 rounded-full ${config.accentBg} text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/10`}>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Non-Judgmental "Optional" Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button onClick={() => navigate('/tracker')} className="flex flex-col items-center justify-center p-5 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group text-center">
              <HeartPulse className={`w-7 h-7 mb-2 ${config.accent} transition-transform group-hover:scale-110`} />
              <span className="text-xs font-medium text-slate-800 mb-0.5">Gentle Check-in</span>
              <span className="text-[10px] text-slate-400 font-medium">({config.metric} • Optional)</span>
            </button>
            
            <button onClick={() => setShowElementsGuide(true)} className="flex flex-col items-center justify-center p-5 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group text-center">
              <Leaf className={`w-7 h-7 mb-2 ${config.accent} transition-transform group-hover:scale-110`} />
              <span className="text-xs font-medium text-slate-800 mb-0.5">Learn Your Elements</span>
              <span className="text-[10px] text-slate-400 font-medium">(Dosha Guide)</span>
            </button>
          </div>

          {/* Letter from Mumtaz - The Deep Context */}
          <section className="mb-6">
            <SanctuaryManifesto />
          </section>

          {/* Direct Connection to Practitioner / Q&A */}
          <section className="mb-6">
            <div className="bg-mumtaz-plum rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 mb-4">
                <h3 className="text-white font-medium text-xl tracking-tight">Connect with Mumtaz</h3>
                <p className="text-white/90 text-sm mt-2 leading-relaxed pr-6">
                  This sanctuary is just a companion. Join our live Q&A circles or book a private session for true practitioner guidance.
                </p>
              </div>
              <button onClick={() => navigate('/bookings')} className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 w-full py-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
                <Video className="w-4 h-4" /> Book a Consultation
              </button>
            </div>
          </section>
        </main>
      </div>

      <ElementsGuideModal isOpen={showElementsGuide} onClose={() => setShowElementsGuide(false)} />

      {/* Visual Bottom Navigation */}
      <nav className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-8 py-5 flex justify-between items-center pb-safe-offset-8 z-40">
        {[
          { id: 'home', icon: <Leaf />, path: '/' },
          { id: 'journal', icon: <BookOpen />, path: '/tracker' },
          { id: 'bookings', icon: <Users />, path: '/bookings' },
          { id: 'chat', icon: <MessageCircle />, path: '/chat' },
        ].map((item) => {
          const isActive = activeTab === item.id || (item.id === 'home' && activeTab === '');
          return (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              aria-label={item.id}
              className={`transition-all duration-300 relative min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full ${
                isActive ? `${config.accent} scale-110` : 'text-slate-300 hover:text-slate-400'
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement, { className: 'w-7 h-7 stroke-[1.5]' })}
              {isActive && (
                <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${config.accentBg}`} />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  );
}
