import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Web Speech API interface definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceNavigation = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening for your command...", { duration: 3000 });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Voice command received:", transcript);
      handleCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        toast.error(`Voice recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [navigate]);

  const handleCommand = (command: string) => {
    if (command.includes("home") || command.includes("dashboard")) {
      navigate("/");
      toast.success("Navigating to Home");
    } else if (command.includes("tracker") || command.includes("track") || command.includes("journal")) {
      navigate("/tracker");
      toast.success("Navigating to Journal");
    } else if (command.includes("book") || command.includes("consultation")) {
      navigate("/bookings");
      toast.success("Navigating to Bookings");
    } else if (command.includes("library") || command.includes("content") || command.includes("read") || command.includes("explore")) {
      navigate("/content-library");
      toast.success("Navigating to Content Library");
    } else if (command.includes("insight")) {
      navigate("/insights");
      toast.success("Navigating to Insights");
    } else if (command.includes("setting") || command.includes("profile")) {
      navigate("/settings");
      toast.success("Navigating to Settings");
    } else if (command.includes("practice") || command.includes("yoga")) {
      navigate("/my-daily-practice");
      toast.success("Navigating to Daily Practice");
    } else {
      toast.error(`Command not recognized: "${command}". Try saying "Go to tracker".`);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col md:flex-row items-end md:items-center gap-3">
      <div 
        className={`transition-all duration-500 bg-white/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-lg border border-wellness-sage/20 text-sm font-medium text-foreground 
        ${isListening ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'} animate-pulse`}
      >
        Tap to use Voice Navigation
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleListening}
              size="icon"
              className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-300 ${
                isListening 
                  ? "bg-destructive hover:bg-destructive/90 animate-pulse ring-8 ring-destructive/30" 
                  : "bg-wellness-sage hover:bg-wellness-sage/90 text-white"
              }`}
            >
              {isListening ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <Mic className="h-7 w-7" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-medium bg-background text-foreground border border-border p-3 text-sm rounded-xl">
            <p>{isListening ? "Listening... Try saying 'Go to Journal'" : "Voice Navigation"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
