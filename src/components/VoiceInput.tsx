import { useState, useCallback, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "default" | "icon";
}

export function VoiceInput({ onTranscript, className, size = "icon" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
        if ('vibrate' in navigator) navigator.vibrate(50);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'aborted') {
          toast.error("Could not understand. Please try again.");
        }
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.abort();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
        if ('vibrate' in navigator) navigator.vibrate(25);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  }, [recognition, isListening]);

  if (!isSupported) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? "default" : "ghost"}
            size={size}
            onClick={toggleListening}
            className={`rounded-full shrink-0 ${isListening ? "animate-pulse bg-primary ring-2 ring-primary/20" : "text-muted-foreground hover:text-primary"} ${className}`}
          >
            {isListening ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? "Listening..." : "Tap to speak (Voice-to-Text)"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
