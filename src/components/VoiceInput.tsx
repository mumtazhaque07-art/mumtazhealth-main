import { useState, useCallback, useEffect, useRef } from "react";
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
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcriptChunk = event.results[event.results.length - 1][0].transcript;
        onTranscript(transcriptChunk);
        
        if ('vibrate' in navigator) navigator.vibrate(50);
        toast.success("Captured!", { duration: 2000 });
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'aborted') {
          toast.error("I didn't quite catch that. Try speaking closer to the mic.");
        }
        setIsListening(false);
        if (toastIdRef.current) toast.dismiss(toastIdRef.current.toString());
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (toastIdRef.current) toast.dismiss(toastIdRef.current.toString());
      };

      setRecognition(recognitionInstance);
    }
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      if (toastIdRef.current) toast.dismiss(toastIdRef.current.toString());
      toast.info("Microphone paused.");
    } else {
      try {
        recognition.start();
        setIsListening(true);
        if ('vibrate' in navigator) navigator.vibrate([25, 50, 25]);
        toastIdRef.current = toast.loading("I'm listening. Take your time speaking... (Tap mic again to stop)", {
          duration: 60000,
        });
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
