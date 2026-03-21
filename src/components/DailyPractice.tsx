import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlayCircle, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DailyPracticeProps {
  type: "yoga" | "meditation" | "emotional";
  lifeStage: string | null;
  spiritualPreference: string | null;
}

export function DailyPractice({ type, lifeStage, spiritualPreference }: DailyPracticeProps) {
  const navigate = useNavigate();
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyPractice();
  }, [type, lifeStage]);

  const fetchDailyPractice = async () => {
    setLoading(true);
    try {
      let query = supabase.from("wellness_content").select("*");

      // Filter by type
      if (type === "emotional") {
        query = query.in("content_type", ["meditation", "education", "spiritual", "article"]);
      } else {
        query = query.eq("content_type", type);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        // Simple scoring algorithm to find the single best match
        const scoredContent = data.map((item) => {
          let score = 0;
          const tags = item.tags || [];

          // Boost if it matches life stage
          if (lifeStage && tags.includes(lifeStage)) score += 5;
          
          // Emotional/Spiritual logic crossover
          if (type === "emotional") {
            if (spiritualPreference === "islamic" && tags.includes("islamic")) score += 3;
          }

          // Penalize irrelevant life stages
          if (lifeStage !== "pregnancy" && tags.some(t => t.includes("pregnan") || t.includes("prenatal"))) score -= 10;
          if (lifeStage !== "postpartum" && tags.some(t => t.includes("postpartum") || t.includes("postnatal"))) score -= 10;
          
          return { ...item, score };
        });

        // Sort by score
        scoredContent.sort((a, b) => b.score - a.score);
        setContent(scoredContent[0]);
      }
    } catch (e) {
      console.error("Error fetching daily practice:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        We couldn't find a perfect practice for today. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-accent text-foreground">{content.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{content.description}</p>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
        <img 
          src={content.thumbnail_url || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"} 
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full bg-white/20 border-white/50 text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all border-2"
            onClick={() => navigate(`/content-library?highlight=${content.id}`)}
          >
            <PlayCircle className="w-6 h-6 mr-2" />
            Start Practice
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {content.duration_minutes} mins
        </Badge>
        <Badge variant="outline" className="capitalize">
          {content.difficulty_level || "All Levels"}
        </Badge>
        {content.tags?.slice(0, 3).map((tag: string) => (
          <Badge key={tag} variant="secondary" className="opacity-70">
            {tag.replace("-", " ")}
          </Badge>
        ))}
      </div>
    </div>
  );
}
