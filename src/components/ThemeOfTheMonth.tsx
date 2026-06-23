import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, PlayCircle, BookOpen, Utensils } from "lucide-react";

interface ThemeOfTheMonthProps {
  stageId: string;
}

export const ThemeOfTheMonth: React.FC<ThemeOfTheMonthProps> = ({ stageId }) => {
  // Mock data for the monthly theme based on the stage
  const getMonthlyTheme = (stage: string) => {
    switch (stage) {
      case 'stage5': // Perimenopause
      case 'stage6': // Menopause
        return {
          title: "The Month of Grounding",
          description: "This month, we are focusing on cooling excess heat and grounding the nervous system through specific Yin postures and cooling recipes.",
          posture: "Supported Supta Baddha Konasana",
          recipe: "Cooling Mint & Coriander Chutney",
          videoUrl: "https://example.com/video1"
        };
      case 'stage3': // Pregnancy
      case 'stage4': // Postpartum
        return {
          title: "The Month of Deep Nourishment",
          description: "This month is about rebuilding your deepest energy reserves (Ojas) with gentle hip openers and deeply restorative broths.",
          posture: "Supported Pigeon Pose",
          recipe: "Bone Broth with Ashwagandha",
          videoUrl: "https://example.com/video2"
        };
      default:
        return {
          title: "The Month of Balance",
          description: "Our global focus this month is nervous system regulation. Learn how to breathe effectively and use food to stabilize your blood sugar.",
          posture: "Legs Up The Wall (Viparita Karani)",
          recipe: "Balancing Golden Milk",
          videoUrl: "https://example.com/video3"
        };
    }
  };

  const theme = getMonthlyTheme(stageId);

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold font-serif text-gray-900">Focus of the Month</h2>
        <Badge variant="outline" className="ml-2 bg-primary/5 border-primary/20 text-primary">
          June 2026
        </Badge>
      </div>

      <Card className="bg-gradient-to-br from-wellness-sand/40 to-wellness-sage/10 border-wellness-sage/20 overflow-hidden shadow-md">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 flex flex-col justify-center">
            <Badge className="w-fit mb-4 bg-wellness-plum hover:bg-wellness-plum">Premium & VIP</Badge>
            <h3 className="text-3xl font-bold font-serif text-gray-900 mb-3">{theme.title}</h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{theme.description}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-wellness-sage">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Posture of the Month</p>
                  <p className="font-semibold text-gray-900">{theme.posture}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-orange-500">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Recipe of the Month</p>
                  <p className="font-semibold text-gray-900">{theme.recipe}</p>
                </div>
              </div>
            </div>

            <Button className="w-full sm:w-fit bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg">
              Start This Month's Journey
            </Button>
          </div>
          
          <div className="bg-gray-200 relative min-h-[300px]">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" 
              alt="Yoga practice" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-wellness-sand/80 to-transparent md:hidden" />
          </div>
        </div>
      </Card>
    </div>
  );
};
