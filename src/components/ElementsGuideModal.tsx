import React, { useState } from 'react';
import { X, Wind, Flower2, Leaf, ArrowRight, CheckCircle2 } from 'lucide-react';

export function ElementsGuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const questions = [
    {
      title: "When you feel stressed or overwhelmed, how does your body typically react?",
      options: [
        { id: 'vata', text: "I feel anxious, my mind races, and I lose my appetite or sleep.", icon: <Wind className="w-4 h-4" /> },
        { id: 'pitta', text: "I become irritable, frustrated, or feel a lot of heat/inflammation in my body.", icon: <Flower2 className="w-4 h-4" /> },
        { id: 'kapha', text: "I withdraw, feel sluggish, and just want to sleep or comfort eat.", icon: <Leaf className="w-4 h-4" /> }
      ]
    },
    {
      title: "How would you describe your natural energy levels throughout the day?",
      options: [
        { id: 'vata', text: "Very fluctuating. High bursts of energy followed by sudden exhaustion.", icon: <Wind className="w-4 h-4" /> },
        { id: 'pitta', text: "Strong and consistent, especially if I have a goal. I easily push through.", icon: <Flower2 className="w-4 h-4" /> },
        { id: 'kapha', text: "Slow to start in the morning, but steady endurance once I get going.", icon: <Leaf className="w-4 h-4" /> }
      ]
    },
    {
      title: "How does your digestion usually feel?",
      options: [
        { id: 'vata', text: "Irregular. Sometimes prone to bloating, gas, or constipation.", icon: <Wind className="w-4 h-4" /> },
        { id: 'pitta', text: "Very strong. I get incredibly hungry and might experience heartburn if I wait too long.", icon: <Flower2 className="w-4 h-4" /> },
        { id: 'kapha', text: "A bit slow or sluggish. I often feel full for a very long time after eating.", icon: <Leaf className="w-4 h-4" /> }
      ]
    }
  ];

  const handleAnswer = (doshaId: string) => {
    setAnswers({ ...answers, [currentQuestion]: doshaId });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateDominant = () => {
    const counts = Object.values(answers).reduce((acc: any, dosha) => {
      acc[dosha as string] = (acc[dosha as string] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const resetQuiz = () => {
    setQuizMode(false);
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const dominantDosha = showResult ? calculateDominant() : '';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-slate-800">
            {quizMode ? (showResult ? "Your Current Blueprint" : `Discovery (${currentQuestion + 1}/${questions.length})`) : "Your Elements"}
          </h2>
          <button onClick={() => { onClose(); setTimeout(resetQuiz, 300); }} className="shrink-0 w-8 h-8 md:hover:bg-slate-200 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!quizMode && (
          <div className="animate-in fade-in">
            <div className="space-y-4 mb-6 text-slate-600 text-[15px] leading-relaxed">
              <p>
                When we think of Ayurveda, we usually do a quick online quiz and think, <em>"Okay, I am Pitta. This is exactly what I must do."</em> But we are not using these labels to define you. 
              </p>
              <div className="bg-wellness-sage/10 p-4 rounded-xl border border-wellness-sage/20 text-slate-700 italic">
                "There is only one unique blueprint of yourself. We do not place you in a pigeon hole or a box."
              </div>
              <p>
                Each phase of your life may have a different element struggling for balance. These ancient doshas simply help us identify what you resonate with <strong>right now</strong>. We walk hand in hand, peeling back the layers.
              </p>
            </div>
            
            <button 
              onClick={() => setQuizMode(true)}
              className="w-full mb-8 bg-wellness-sage/20 hover:bg-wellness-sage/30 text-slate-700 py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 border border-wellness-sage/30"
            >
              Take a gentle discovery quiz <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F4F0F8] border border-[#9B8BA7]/20 flex gap-4 items-start">
                <Wind className="w-6 h-6 text-[#9B8BA7] shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-slate-800">Vata (Air & Ether)</h3>
                  <p className="text-sm text-slate-600 mt-1">Energy of movement and creativity. When out of balance, it can feel like anxiety. <br/><em className="text-[#9B8BA7] font-medium text-xs">Balanced by grounding routines.</em></p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFF6ED] border border-[#E8B48F]/20 flex gap-4 items-start">
                <Flower2 className="w-6 h-6 text-[#E8B48F] shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-slate-800">Pitta (Fire & Water)</h3>
                  <p className="text-sm text-slate-600 mt-1">Energy of metabolism and passion. When out of balance, it can feel like inflammation. <br/><em className="text-[#E8B48F] font-medium text-xs">Balanced by cooling practices.</em></p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#EEF3ED] border border-[#7A9684]/20 flex gap-4 items-start">
                <Leaf className="w-6 h-6 text-[#7A9684] shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-slate-800">Kapha (Earth & Water)</h3>
                  <p className="text-sm text-slate-600 mt-1">Energy of structure and deep love. When out of balance, it can feel sluggish. <br/><em className="text-[#7A9684] font-medium text-xs">Balanced by gentle stimulation.</em></p>
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="w-full mt-8 bg-slate-800 text-white py-4 rounded-full font-medium active:scale-95 transition-transform">
              I understand
            </button>
          </div>
        )}

        {quizMode && !showResult && (
          <div className="animate-in slide-in-from-right-10 duration-300">
            <h3 className="text-lg font-medium text-slate-800 mb-6 leading-snug">
              {questions[currentQuestion].title}
            </h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.id)}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-wellness-sage hover:bg-wellness-sage/5 transition-all flex items-start gap-3"
                >
                  <div className="mt-0.5 text-slate-400">{opt.icon}</div>
                  <span className="text-[15px] text-slate-700 leading-relaxed font-medium">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {quizMode && showResult && (
          <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 bg-wellness-sage/20 rounded-full flex items-center justify-center mb-6">
              {dominantDosha === 'vata' && <Wind className="w-8 h-8 text-[#9B8BA7]" />}
              {dominantDosha === 'pitta' && <Flower2 className="w-8 h-8 text-[#E8B48F]" />}
              {dominantDosha === 'kapha' && <Leaf className="w-8 h-8 text-[#7A9684]" />}
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-4">
              Your dominant energy right now leans towards <span className="capitalize">{dominantDosha}</span>.
            </h3>
            <p className="text-slate-600 mb-8 leading-relaxed text-[15px]">
              Remember, this isn't a permanent label—it's just an observation of what your body is currently experiencing.
              Your unique blueprint shifts with the seasons of your life, and we will support you exactly where you are today.
            </p>
            <div className="w-full space-y-3">
              <button onClick={() => { onClose(); setTimeout(resetQuiz, 300); }} className="w-full bg-slate-800 text-white py-4 rounded-full font-medium shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Return to Sanctuary
              </button>
              <button onClick={resetQuiz} className="w-full text-slate-500 py-3 font-medium hover:text-slate-800 transition-colors">
                Back to elements guide
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
