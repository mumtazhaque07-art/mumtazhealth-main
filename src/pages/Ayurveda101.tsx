import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Wind, Flame, Mountain, Sparkles, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: "welcome",
    title: "Welcome to Your True Nature",
    content: "Ayurveda is the world's oldest instruction manual for the human body. It believes that you are not broken—you are just unique. What heals one person might harm another.",
    icon: <Sparkles className="w-16 h-16 text-wellness-plum" />,
    color: "from-wellness-sand/40 to-white/60"
  },
  {
    id: "elements",
    title: "The Elements of You",
    content: "Just like the universe, your body and mind are made up of five elements: Space, Air, Fire, Water, and Earth. How these elements combine within you creates your unique blueprint, known as your Dosha.",
    icon: <Leaf className="w-16 h-16 text-wellness-sage" />,
    color: "from-wellness-sage/20 to-white/60"
  },
  {
    id: "vata",
    title: "Vata: The Energy of Movement",
    content: "Made of Air & Space. When balanced, you are creative, energetic, and quick-thinking. When imbalanced, you may feel anxious, experience cold hands and feet, or suffer from insomnia and dry skin.",
    icon: <Wind className="w-16 h-16 text-blue-400" />,
    color: "from-blue-50 to-white/60"
  },
  {
    id: "pitta",
    title: "Pitta: The Energy of Transformation",
    content: "Made of Fire & Water. When balanced, you are focused, passionate, and a natural leader. When imbalanced, you might feel irritable, prone to inflammation, acid reflux, or burnout.",
    icon: <Flame className="w-16 h-16 text-orange-400" />,
    color: "from-orange-50 to-white/60"
  },
  {
    id: "kapha",
    title: "Kapha: The Energy of Structure",
    content: "Made of Earth & Water. When balanced, you are grounded, deeply loving, strong, and patient. When imbalanced, you may feel sluggish, heavy, or physically and emotionally stuck.",
    icon: <Mountain className="w-16 h-16 text-green-500" />,
    color: "from-green-50 to-white/60"
  },
  {
    id: "promise",
    title: "Why This Matters",
    content: "When you know your Dosha, everything starts to make sense. You'll understand why you crave certain foods, why you wake up at 3 AM, and why certain workouts exhaust you. Let's discover your unique blueprint.",
    icon: <Sparkles className="w-16 h-16 text-wellness-plum" />,
    color: "from-wellness-lilac/20 to-white/60"
  }
];

export default function Ayurveda101() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Done with onboarding 101, route to actual assessment
      navigate("/onboarding");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      // If they came from Dashboard to re-read, this takes them back safely
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-wellness-sand to-white overflow-hidden relative">
      {/* Background Animated Blobs for Softness */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-wellness-sage/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-wellness-lilac/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-wellness-plum/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-lg z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`glass-panel p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br ${steps[currentStep].color}`}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 p-6 bg-white/50 rounded-full shadow-sm backdrop-blur-md"
            >
              {steps[currentStep].icon}
            </motion.div>
            
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-serif font-bold text-gray-900 mb-6"
            >
              {steps[currentStep].title}
            </motion.h1>
            
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-gray-700 leading-relaxed max-w-md"
            >
              {steps[currentStep].content}
            </motion.p>
            
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between px-4">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
          </Button>
          
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === currentStep ? 'w-6 bg-wellness-plum' : 'w-2 bg-wellness-plum/20'
                }`}
              />
            ))}
          </div>

          <Button 
            onClick={handleNext}
            className="bg-wellness-plum hover:bg-wellness-plum/90 text-white rounded-full px-6 shadow-md transition-transform hover:scale-105"
          >
            {currentStep === steps.length - 1 ? "Discover My Dosha" : "Next"} <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
