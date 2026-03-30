import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";

interface Dua {
  id: string;
  arabicSnippet: string;
  transliteration: string;
  translation: string;
}

const mockDuas: Dua[] = [
  {
    id: "ayatul-kursi-1",
    arabicSnippet: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ",
    transliteration: "Allahu la ilaha illa Huwa",
    translation: "Allah! There is no deity except Him,",
  },
  {
    id: "ayatul-kursi-2",
    arabicSnippet: "ٱلْحَىُّ ٱلْقَيُّومُ",
    transliteration: "Al-Hayyul-Qayyum",
    translation: "the Ever-Living, the Sustainer of existence.",
  },
  {
    id: "ayatul-kursi-3",
    arabicSnippet: "لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ",
    transliteration: "La ta'khudhuhu sinatun wa la nawm",
    translation: "Neither drowsiness overtakes Him nor sleep.",
  },
  {
    id: "ayatul-kursi-4",
    arabicSnippet: "لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ",
    transliteration: "Lahu ma fis-samawati wa ma fil-'ard",
    translation: "To Him belongs whatever is in the heavens and whatever is on the earth.",
  },
  {
    id: "ayatul-kursi-5",
    arabicSnippet: "مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ",
    transliteration: "Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih",
    translation: "Who is it that can intercede with Him except by His permission?",
  },
  {
    id: "ayatul-kursi-6",
    arabicSnippet: "يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ",
    transliteration: "Ya'lamu ma bayna aydihim wa ma khalfahum",
    translation: "He knows what is [presently] before them and what will be after them.",
  },
  {
    id: "ayatul-kursi-7",
    arabicSnippet: "وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ",
    transliteration: "Wa la yuheetoona bishay'im-min 'ilmihi illa bima shaa'",
    translation: "And they encompass not a thing of His knowledge except for what He wills.",
  },
  {
    id: "ayatul-kursi-8",
    arabicSnippet: "وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ",
    transliteration: "Wasi'a kursiyyuhus-samawati wal-'ard",
    translation: "His Kursi extends over the heavens and the earth.",
  },
  {
    id: "ayatul-kursi-9",
    arabicSnippet: "وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ",
    transliteration: "Wa la ya'ooduhu hifdhuhuma",
    translation: "And their preservation tires Him not.",
  },
  {
    id: "ayatul-kursi-10",
    arabicSnippet: "وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
    transliteration: "Wa Huwal-'Aliyyul-'Adheem",
    translation: "And He is the Most High, the Most Great.",
  }
];

interface DuaReaderProps {
  onClose: () => void;
}

export function DuaReader({ onClose }: DuaReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < mockDuas.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose(); // Auto-close at the end? Or stay? We'll stay for now.
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentDua = mockDuas[currentIndex];

  return (
    <div className="fixed inset-0 z-[200] bg-background text-foreground flex flex-col justify-between animate-fade-in touch-none overflow-hidden pb-safe">
      <div className="flex justify-between items-center p-6 mt-4">
        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {currentIndex + 1} / {mockDuas.length}
        </span>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-white/5 rounded-full">
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 space-y-12 max-w-2xl mx-auto w-full">
        {/* Tier 1: Arabic (Large font) */}
        <div className="text-center">
          <p 
            className="text-4xl md:text-5xl font-bold leading-relaxed text-indigo-300 dark:text-indigo-200 font-arabic" 
            style={{ lineHeight: '1.6' }}
            dir="rtl"
          >
            {currentDua.arabicSnippet}
          </p>
        </div>

        {/* Tier 2: Transliteration */}
        <div className="text-center pt-8 border-t border-border/50">
          <p className="text-2xl md:text-3xl font-semibold mb-6 tracking-wide text-foreground">
            {currentDua.transliteration}
          </p>
        </div>

        {/* Tier 3: Translation */}
        <div className="text-center">
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed italic">
            "{currentDua.translation}"
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center p-8 mb-4 max-w-2xl mx-auto w-full">
        <Button 
          variant="ghost" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded-full w-16 h-16 flex items-center justify-center p-0 disabled:opacity-20 hover:bg-muted/20 text-foreground"
        >
          <ChevronLeft className="w-10 h-10" />
        </Button>
        
        <Button 
          variant={currentIndex === mockDuas.length - 1 ? "default" : "ghost"}
          onClick={handleNext}
          className={`rounded-full flex items-center justify-center p-0 text-foreground transition-all ${
            currentIndex === mockDuas.length - 1 
              ? "px-8 h-16 bg-wellness-sage hover:bg-wellness-sage/90 text-white font-bold tracking-widest uppercase" 
              : "w-16 h-16 hover:bg-muted/20"
          }`}
        >
          {currentIndex === mockDuas.length - 1 ? "Done" : <ChevronRight className="w-10 h-10" />}
        </Button>
      </div>
    </div>
  );
}
