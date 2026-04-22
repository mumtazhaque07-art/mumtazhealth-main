import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Utensils } from 'lucide-react';

export function NutritionPhilosophyCard() {
  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-wellness-sage-light/60 to-wellness-sage/10 rounded-3xl mb-8 relative">
      <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/30 rounded-full blur-3xl pointer-events-none"></div>
      <CardContent className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center shrink-0 shadow-sm border border-white">
            <Utensils className="w-8 h-8 text-wellness-sage" />
          </div>
          
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
              The Energy of Nourishment
              <Sparkles className="w-5 h-5 text-yellow-500/70" />
            </h3>
            
            <p className="text-slate-700 leading-relaxed font-medium">
              Nutrition is not just about the specific food on your plate. It is profoundly about our attitude and the energy we hold when we prepare it.
            </p>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              When we cook for loved ones, children, or guests, we instinctively pour love and attention into the pot. We consider their favorite flavors, and because it is made with love, they taste it as the best food in the world. Think of your mother's food, or your grandmother's food, and how it deeply nourished you.
            </p>

            <div className="bg-white/50 p-4 rounded-2xl border border-white shadow-sm my-2 italic text-slate-700">
              <span className="font-semibold text-wellness-taupe block mb-1">A gentle question for you:</span>
              "Do you put the same beautiful energy into cooking for yourself?"
            </div>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              When we share food with loved ones, digestion accepts it beautifully. But when we eat from a place of anxiety, rushing, or anger, our bodies struggle to digest. As you explore these recipes, I invite you to prepare them from a place of immense self-love. You deserve the same loving energy you give to everyone else.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
