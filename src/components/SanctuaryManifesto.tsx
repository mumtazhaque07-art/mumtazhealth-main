import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, Headphones, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { mumtazYoga8 } from '@/assets/brandImages'; // Using a warm image
import { useNavigate } from 'react-router-dom';

export function SanctuaryManifesto() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-wellness-sage/10 via-wellness-beige to-wellness-lilac/10 rounded-[2rem] relative group">
      <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
      <CardContent className="p-6 md:p-8 relative z-10">
        
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-white/50">
            <img src={mumtazYoga8} alt="Mumtaz Haque" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">A Letter from Mumtaz</h3>
            <p className="text-wellness-taupe text-sm font-medium">To whatever phase you are in...</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">A Letter from Mumtaz</h3>
            <p className="text-wellness-taupe dark:text-wellness-taupe/80 text-sm font-medium">To whatever phase you are in...</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
          <p className="font-medium text-slate-800 dark:text-slate-200 text-lg">You are not alone, and this moment too shall pass.</p>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            This space is for you to be heard and to understand your body and your unique makeup deeper than perhaps has ever been explained to you. Each season of our lives impacts us biologically, mentally, and spiritually. Every season possesses its own beauty, even when it feels unbearably heavy in the moment.
          </p>

          <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-2xl border border-white/60 dark:border-slate-700/50 shadow-sm my-5 text-center relative">
            <span className="absolute text-5xl text-wellness-sage/20 font-serif leading-none -top-2 left-2">"</span>
            <p className="italic text-slate-700 dark:text-slate-200">
              "Watch your thoughts, for they become your words. Watch your words, for they become your actions. Watch your actions, for they become your consequences."
            </p>
            <span className="text-sm font-semibold mt-2 block text-slate-500 dark:text-slate-400">— Rumi</span>
          </div>

          {!isExpanded && (
            <Button 
              variant="ghost" 
              onClick={() => setIsExpanded(true)} 
              className="w-full text-wellness-taupe hover:text-slate-800 hover:bg-white/40 flex items-center gap-2 mt-2 h-12 rounded-xl"
            >
              Read my full message <ChevronDown className="w-4 h-4" />
            </Button>
          )}

          {isExpanded && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
              <p>
                No two women are exactly the same. Our unique journeys forge what happens to us physically and emotionally. We must give ourselves the space and grace to navigate this. Sometimes we simply need a reminder: <strong>Are you relentlessly pushing when your body is begging for rest?</strong> Be as kind to yourself internally as you would be to a beloved friend. Every word we use towards ourselves has a deep biological and spiritual impact.
              </p>

              <p>
                The aches, the sluggish digestion, the inflamed skin—these can ultimately be traced back to imbalances. My mission here is to demystify this for you. We will break down what Yoga truly is, what Ayurveda offers, and how we can intertwine them with spirituality—whether you walk a Universal path or use our Islamic mode. The foods we eat, how we prepare them, and how we consume them are all deeply connected. We cannot just look at one isolated symptom; we must look at the whole history that brought you to this exact point today.
              </p>

              <div className="bg-white/60 rounded-2xl p-5 border border-white/80 shadow-sm mt-6">
                <h4 className="font-bold text-slate-800 mb-2">Our Ecosystem of Support</h4>
                <p className="text-sm mb-4">
                  I will do my absolute best to guide you, but remember: this app is simply the beginning layer. True healing stripping back layer by layer to reach the root cause requires deeper work. You are a part of an ecosystem here:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://open.spotify.com/show/3qCEEaIjqUm5E9cvWicdeD?si=74329d4acbb04db3', '_blank')}
                    className="justify-start gap-3 bg-white hover:bg-slate-50 border-slate-100 text-slate-700 h-14 rounded-xl"
                  >
                    <Headphones className="w-5 h-5 text-wellness-sage" />
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-semibold text-sm">Listen to the Podcast</span>
                      <span className="text-slate-400">Deep dive audio</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start gap-3 bg-white hover:bg-slate-50 border-slate-100 text-slate-700 h-14 rounded-xl">
                    <BookOpen className="w-5 h-5 text-wellness-taupe" />
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-semibold text-sm">The Upcoming Book</span>
                      <span className="text-slate-400">Join the waitlist</span>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start gap-3 bg-white hover:bg-slate-50 border-slate-100 text-slate-700 h-14 rounded-xl">
                    <Users className="w-5 h-5 text-mumtaz-plum" />
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-semibold text-sm">Community Circles</span>
                      <span className="text-slate-400">Monthly live catch-ups</span>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => navigate('/bookings')}
                    className="justify-start gap-3 bg-wellness-sage text-white hover:bg-wellness-sage/90 shadow-md shadow-wellness-sage/20 h-14 rounded-xl"
                  >
                    <Heart className="w-5 h-5" />
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-semibold text-sm">1-to-1 Booking</span>
                      <span className="text-white/80">Begin the deeper work</span>
                    </div>
                  </Button>
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setIsExpanded(false)} 
                className="w-full text-slate-500 hover:text-slate-800 hover:bg-white/40 flex items-center gap-2 mt-4"
              >
                Close <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
