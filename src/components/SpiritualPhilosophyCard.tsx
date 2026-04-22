import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Moon, Star } from 'lucide-react';

export function SpiritualPhilosophyCard() {
  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-slate-100 to-slate-50/50 rounded-3xl mb-8 relative">
      <div className="absolute left-0 top-0 w-64 h-64 bg-mumtaz-plum/5 rounded-full blur-3xl pointer-events-none"></div>
      <CardContent className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shrink-0 shadow-sm border border-white">
            <Moon className="w-8 h-8 text-slate-500" />
          </div>
          
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
              The Ebb and Flow of Faith
              <Sparkles className="w-5 h-5 text-slate-400" />
            </h3>
            
            <p className="text-slate-700 leading-relaxed font-medium">
              Whether your journey is rooted in an Islamic tradition or Universal consciousness, nobody can tell you how to believe or how to worship. Just be true to who you are.
            </p>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              I love my belief. I live being Muslim and I see Allah as my best friend—it has carried me through this life. The tools of Yoga and Ayurveda simply help me be the person that I am. I know I am not for everybody, and I deeply accept that. But if I can help you feel even slightly better than you did when we first met, then I am living my true purpose.
            </p>

            <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm my-2 italic text-slate-700">
              <span className="font-semibold text-slate-800 block mb-1">A reminder on your spiritual journey:</span>
              "Faith goes up and down just like everything else. Sometimes we are high on faith, and sometimes we fall a little low. That is completely okay. That is just being beautifully human."
            </div>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed flex items-center gap-2 mt-4">
              <Star className="w-4 h-4 text-wellness-sage" />
              If something here makes you feel good, trust it. Go with it. Be intuitive.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
