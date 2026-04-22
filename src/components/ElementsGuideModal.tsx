import React from 'react';
import { X, Wind, Flower2, Leaf } from 'lucide-react';

export function ElementsGuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-slate-800">Your Elements</h2>
          <button onClick={onClose} className="w-8 h-8 md:hover:bg-slate-200 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 mb-6 text-slate-600 text-sm leading-relaxed">
          <p>
            When we think of Ayurveda, we might do a simple online quiz and think, <em>"Okay, I am Pitta. This is exactly what I must do."</em> But we are not using these labels to define you. 
          </p>
          <div className="bg-wellness-sage/10 p-3 rounded-xl border border-wellness-sage/20 text-slate-700 italic">
            "There is only one unique blueprint of yourself. We do not place you in a pigeon hole or a box."
          </div>
          <p>
            Each phase of your life may have a different element struggling for balance. These ancient doshas simply help us identify what you resonate with <strong>right now</strong>. We can walk through this journey hand in hand, slowly peeling back the layers. 
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F4F0F8] border border-[#9B8BA7]/20 flex gap-4 items-start">
            <Wind className="w-6 h-6 text-[#9B8BA7] shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-slate-800">Vata (Air & Ether)</h3>
              <p className="text-xs text-slate-600 mt-1">Energy of movement and creativity. When out of balance, it can feel like anxiety. <em>Balanced by grounding routines.</em></p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFF6ED] border border-[#E8B48F]/20 flex gap-4 items-start">
            <Flower2 className="w-6 h-6 text-[#E8B48F] shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-slate-800">Pitta (Fire & Water)</h3>
              <p className="text-xs text-slate-600 mt-1">Energy of metabolism and passion. When out of balance, it can feel like inflammation. <em>Balanced by cooling practices.</em></p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#EEF3ED] border border-[#7A9684]/20 flex gap-4 items-start">
            <Leaf className="w-6 h-6 text-[#7A9684] shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-slate-800">Kapha (Earth & Water)</h3>
              <p className="text-xs text-slate-600 mt-1">Energy of structure and deep love. When out of balance, it can feel sluggish. <em>Balanced by gentle stimulation.</em></p>
            </div>
          </div>
        </div>
        
        <button onClick={onClose} className="w-full mt-8 bg-slate-800 text-white py-4 rounded-full font-medium active:scale-95 transition-transform">
          I understand
        </button>
      </div>
    </div>
  );
}
