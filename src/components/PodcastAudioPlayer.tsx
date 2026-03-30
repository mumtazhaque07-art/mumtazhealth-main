import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, X } from "lucide-react";
import { PodcastEpisode } from "@/utils/rssUtils";

interface PodcastAudioPlayerProps {
  episode: PodcastEpisode;
  startTime?: number; // seconds to start playing from
  onClose?: () => void;
}

export function PodcastAudioPlayer({ episode, startTime = 0, onClose }: PodcastAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      
      // Attempt to play on mount (browsers might block this without prior interaction)
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Autoplay prevented by browser:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [startTime]);

  useEffect(() => {
    // Setup MediaSession API so playback controls show up on mobile lock screen
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: episode.title,
        artist: "Mumtaz Health",
        album: "Sanctuary Podcast",
        // We omit artwork intentionally to keep the phone screen dark/uncluttered during the night
        artwork: [], 
      });

      navigator.mediaSession.setActionHandler("play", () => togglePlayStatus(true));
      navigator.mediaSession.setActionHandler("pause", () => togglePlayStatus(false));
    }
    
    return () => {
      // Cleanup media session handlers
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
      }
    };
  }, [episode, isPlaying]); // Added isPlaying to ref changes accurately

  const togglePlayStatus = (shouldPlay?: boolean) => {
    if (!audioRef.current) return;
    
    const willPlay = shouldPlay !== undefined ? shouldPlay : !isPlaying;
    
    if (willPlay) {
      audioRef.current.play().catch(e => setError("Failed to play audio."));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border z-[150] p-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.2)] animate-fade-in-up">
      <audio 
        ref={audioRef} 
        src={episode.audioUrl} 
        onEnded={() => setIsPlaying(false)}
        onError={() => setError("Unable to load audio.")}
        // Allows background playback on mobile when wrapped in native or configured correctly as PWA
        playsInline 
      />
      
      <div className="flex-1 pr-4">
        <h4 className="text-foreground font-bold tracking-wide text-sm leading-tight">{episode.title}</h4>
        {error ? (
          <span className="text-destructive text-xs">{error}</span>
        ) : (
          <span className="text-muted-foreground text-xs">{isPlaying ? "Playing..." : "Paused"}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => togglePlayStatus()}
          className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        
        {onClose && (
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
