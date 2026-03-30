import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Flame, Info, Heart } from "lucide-react";

interface Ingredient {
  item: string;
  amount: string;
  shifaBenefit?: string;
}

interface RecipeProps {
  title: string;
  description: string;
  prepTime: string;
  servings: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  ingredients: Ingredient[];
  steps: string[];
  sunnahInsight?: string;
  ayurvedicInsight?: string;
  doshaSuitability: string[];
}

export function RecipeCard({
  title,
  description,
  prepTime,
  servings,
  difficulty,
  ingredients,
  steps,
  sunnahInsight,
  ayurvedicInsight,
  doshaSuitability
}: RecipeProps) {
  return (
    <Card className="overflow-hidden border-wellness-sage/30 bg-gradient-to-br from-white to-wellness-sage/5 shadow-lg max-w-2xl mx-auto">
      <CardHeader className="pb-4 bg-wellness-sage/10">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-white/50 text-wellness-sage border-wellness-sage/30 uppercase tracking-tighter text-[10px]">
            Shifa Kitchen
          </Badge>
          <div className="flex gap-2">
            {doshaSuitability.map(dosha => (
              <Badge key={dosha} className="bg-wellness-taupe/10 text-wellness-taupe border-none text-[9px] uppercase">
                {dosha}
              </Badge>
            ))}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-wellness-taupe">{title}</CardTitle>
        <CardDescription className="italic text-muted-foreground">{description}</CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Meta Stats */}
        <div className="flex justify-around py-3 border-y border-wellness-sage/10 bg-white/30 rounded-lg">
          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-wellness-sage mb-1" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Time</span>
            <span className="text-xs font-semibold">{prepTime}</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-4 h-4 text-wellness-sage mb-1" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Serves</span>
            <span className="text-xs font-semibold">{servings}</span>
          </div>
          <div className="flex flex-col items-center">
            <Flame className="w-4 h-4 text-wellness-sage mb-1" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Level</span>
            <span className="text-xs font-semibold">{difficulty}</span>
          </div>
        </div>

        {/* Holistic Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sunnahInsight && (
            <div className="p-3 bg-wellness-lilac/5 border border-wellness-lilac/20 rounded-xl">
              <h5 className="text-[10px] font-bold text-wellness-lilac uppercase mb-1 flex items-center gap-1">
                <Heart className="w-3 h-3" /> Sunnah Insight
              </h5>
              <p className="text-[11px] leading-relaxed text-wellness-taupe">{sunnahInsight}</p>
            </div>
          )}
          {ayurvedicInsight && (
            <div className="p-3 bg-wellness-sage/5 border border-wellness-sage/20 rounded-xl">
              <h5 className="text-[10px] font-bold text-wellness-sage uppercase mb-1 flex items-center gap-1">
                <Info className="w-3 h-3" /> Ayurvedic Flow
              </h5>
              <p className="text-[11px] leading-relaxed text-wellness-taupe">{ayurvedicInsight}</p>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <h4 className="text-sm font-bold text-wellness-taupe mb-3 uppercase tracking-widest">Ingredients</h4>
          <ul className="space-y-2">
            {ingredients.map((ing, idx) => (
              <li key={idx} className="flex justify-between items-start text-sm border-b border-wellness-sage/5 pb-2">
                <div>
                  <span className="font-medium">{ing.item}</span>
                  {ing.shifaBenefit && (
                    <span className="block text-[10px] text-wellness-sage italic">{ing.shifaBenefit}</span>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h4 className="text-sm font-bold text-wellness-taupe mb-3 uppercase tracking-widest">Preparation</h4>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm text-wellness-taupe leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
