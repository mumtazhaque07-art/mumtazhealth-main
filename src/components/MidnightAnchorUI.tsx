import React, { useState, useEffect } from "react";
import { Moon, Flame, Wind, Shield, CircleOff, X, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PodcastAudioPlayer } from "@/components/PodcastAudioPlayer";
import { mockPodcastEpisodes } from "@/utils/rssUtils";
import { DuaReader } from "@/components/DuaReader";

export function MidnightAnchorUI() {
  const [isNightMode, setIsNightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<"none" | "void" | "fire" | "shield">("none");
  const navigate = useNavigate();

  useEffect(() => {
    // Rely on the body class set by DynamicBackground
    const checkNightMode = () => {
      setIsNightMode(document.body.classList.contains("night-mode-active"));
    };
    checkNightMode();
    
    // Observer to watch class changes on body
    const observer = new MutationObserver(checkNightMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  if (!isNightMode) return null;

  if (activeOverlay === "shield") {
    return <DuaReader onClose={() => setActiveOverlay("none")} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl animate-fade-in p-6">
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-md max-h-md bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)}
          className="relative group flex flex-col items-center justify-center focus:outline-none"
        >
          <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700" />
          <div className="relative w-56 h-56 rounded-full border border-foreground/10 bg-foreground/5 shadow-[0_0_50px_rgba(255,255,255,0.02)] flex flex-col items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all duration-500">
            <Moon className="w-14 h-14 text-foreground/80" />
            <span className="text-3xl font-bold text-foreground tracking-widest font-accent px-4 text-center leading-snug">
              Mumtaz<br/>Help
            </span>
          </div>
        </button>
      ) : (
        <div className="w-full max-w-lg relative animate-fade-in-up">
          <button 
            onClick={() => setIsExpanded(false)}
            className="absolute -top-16 right-0 p-2 text-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="grid grid-cols-2 gap-4 h-[65vh] max-h-[600px]">
            {/* Quadrant 1: FIRE */}
            <button 
              onClick={() => setActiveOverlay("fire")}
              className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 rounded-[2rem] flex flex-col items-center justify-center gap-6 transition-colors p-4 group"
            >
              <Flame className="w-16 h-16 text-red-400 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-200 tracking-widest uppercase mb-1">Fire</h3>
                <span className="text-red-300/60 text-lg">Heat / Flashes</span>
              </div>
            </button>

            {/* Quadrant 2: NOISE */}
            <button 
              onClick={() => navigate("/content-library?highlight=noise")}
              className="bg-orange-950/40 hover:bg-orange-900/60 border border-orange-900/50 rounded-[2rem] flex flex-col items-center justify-center gap-6 transition-colors p-4 group"
            >
              <Wind className="w-16 h-16 text-orange-400 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-200 tracking-widest uppercase mb-1">Noise</h3>
                <span className="text-orange-300/60 text-lg">Anxiety</span>
              </div>
            </button>

            {/* Quadrant 3: SHIELD (Replaced WEIGHT for Phase 2 Spec) */}
            <button 
              onClick={() => setActiveOverlay("shield")}
              className="bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 rounded-[2rem] flex flex-col items-center justify-center gap-6 transition-colors p-4 group"
            >
              <Shield className="w-16 h-16 text-stone-400 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-stone-200 tracking-widest uppercase mb-1">Shield</h3>
                <span className="text-stone-400/60 text-lg">Protection</span>
              </div>
            </button>

            {/* Quadrant 4: VOID */}
            <button 
              onClick={() => setActiveOverlay("void")}
              className="bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-900/50 rounded-[2rem] flex flex-col items-center justify-center gap-6 transition-colors p-4 group"
            >
              <CircleOff className="w-16 h-16 text-indigo-400 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-indigo-200 tracking-widest uppercase mb-1">Void</h3>
                <span className="text-indigo-300/60 text-lg">Insomnia</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* OVERLAYS */}
      
      {/* 1. Fire Modal: Sitali Breath text */}
      {activeOverlay === "fire" && (
        <div className="fixed inset-0 z-[150] bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 animate-fade-in touch-none">
          <button 
            onClick={() => setActiveOverlay("none")}
            className="absolute top-8 right-8 p-3 text-muted-foreground hover:text-foreground transition-colors bg-white/5 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="text-center max-w-lg space-y-10">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-red-900/20 border border-red-500/20 flex items-center justify-center animate-pulse-gentle">
                <Wind className="w-12 h-12 text-red-300" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-red-200 font-accent tracking-wide">Sitali Breath</h2>
            
            <div className="space-y-8 text-2xl text-red-100/80 font-medium leading-relaxed">
              <p>Curl your tongue into a <br/>tube (or purse your lips).</p>
              <p>Inhale deeply, drawing <br/>the cool air in.</p>
              <p>Close your mouth.</p>
              <p>Exhale slowly <br/>through your nose.</p>
            </div>
            
            <div className="pt-12">
              <button onClick={() => setActiveOverlay("none")} className="px-10 py-5 bg-red-900/30 hover:bg-red-800/40 text-red-200 rounded-full font-bold tracking-widest uppercase transition-colors">
                I am cool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Void Audio Layer */}
      {activeOverlay === "void" && (
        <PodcastAudioPlayer 
          episode={mockPodcastEpisodes[0]} 
          startTime={45} 
          onClose={() => setActiveOverlay("none")} 
        />
      )}
    </div>
  );
}
