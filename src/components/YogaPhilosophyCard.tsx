import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Flower2 } from 'lucide-react';

export function YogaPhilosophyCard() {
  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-wellness-lilac-light/60 to-wellness-lilac/10 rounded-3xl mb-8 relative">
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-white/30 rounded-full blur-3xl pointer-events-none"></div>
      <CardContent className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center shrink-0 shadow-sm border border-white">
            <Flower2 className="w-8 h-8 text-mumtaz-plum" />
          </div>
          
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
              The Union of Your Current State
              <Sparkles className="w-5 h-5 text-mumtaz-plum/70" />
            </h3>
            
            <p className="text-slate-700 leading-relaxed font-medium">
              We often think about yoga as flexibility, touching the toes, or forcing ourselves into high-pressure positions. But true Yoga is simply the union of your mind, body, and soul exactly as they are right now.
            </p>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              What Dosha is currently at play? What phase of life are you traversing? Are you menstruating, pregnant, postpartum, or recovering from surgery? Have you slept well? Are you in a wheelchair, or is your neck aching? All of these factors completely rewrite what "good" movement looks like for you today.
            </p>

            <div className="bg-white/50 p-4 rounded-2xl border border-white shadow-sm my-2 italic text-slate-700">
              <span className="font-semibold text-mumtaz-plum block mb-1">A gentle reminder:</span>
              "I want you to look at what you can do and how it makes you feel. Not what it looks like. Your body is carrying you through this life; let's start with gratitude for where it's brought you."
            </div>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              My goal is to empower you, never to disempower you. Yoga is about finding where you are at and meeting you right there. A practice for Vata looks completely different than one for Kapha or Pitta—and even those shift depending on your unique life season. Know that you are enough just as you are, and your body is incredibly beautiful just as it is in this phase.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
