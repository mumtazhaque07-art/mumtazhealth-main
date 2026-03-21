import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Calendar, GraduationCap, Users, Flower2 } from "lucide-react";

type ServiceType = "consultation" | "workshop" | "retreat" | "training" | "general";

interface PractitionerSupportCTAProps {
  variant?: "card" | "inline" | "banner";
  serviceType?: ServiceType;
  lifeStage?: string;
  className?: string;
  onAction?: () => void;
}

const SERVICE_CONTENT: Record<ServiceType, {
  title: string;
  description: string;
  icon: React.ElementType;
  ctaText: string;
}> = {
  consultation: {
    title: "Request a Consultation",
    description: "Work with Mumtaz directly for personalised Ayurvedic guidance and holistic support tailored to your journey.",
    icon: Heart,
    ctaText: "Book with Mumtaz",
  },
  workshop: {
    title: "Join Mumtaz's Circle",
    description: "Deepen your understanding through expert-led sessions covering Ayurveda, yoga, and holistic wellbeing.",
    icon: Users,
    ctaText: "Inquire about workshops",
  },
  retreat: {
    title: "Wellness & Healing",
    description: "Immerse yourself in transformative experiences that nourish body, mind, and spirit under Mumtaz's guidance.",
    icon: Flower2,
    ctaText: "Request details",
  },
  training: {
    title: "Teacher Mentorship",
    description: "Deepen your practice and learn to guide others with International Teacher Trainer mentorship.",
    icon: GraduationCap,
    ctaText: "Inquire about training",
  },
  general: {
    title: "Personalised Support",
    description: "When you're ready for deeper guidance, Mumtaz offers private consultations and expert-led programs.",
    icon: Sparkles,
    ctaText: "Book with Mumtaz",
  },
};

export function PractitionerSupportCTA({ 
  variant = "card",
  serviceType = "general",
  lifeStage,
  className = "",
  onAction
}: PractitionerSupportCTAProps) {
  const content = SERVICE_CONTENT[serviceType];
  const Icon = content.icon;

  // Customize message based on life stage
  const getLifeStageMessage = () => {
    if (!lifeStage) return null;
    const messages: Record<string, string> = {
      perimenopause: "Navigating perimenopause can feel complex — personalised support can make this transition gentler.",
      menopause: "Menopause is a profound life shift. Tailored guidance can help you thrive through this transformation.",
      post_menopause: "Post-menopause brings new rhythms. Practitioner-led care can support your continued vitality.",
      pregnancy: "Every pregnancy is unique. Personalised Ayurvedic support can complement your prenatal care.",
      postpartum: "The postpartum period deserves sacred attention. One-to-one guidance honours your recovery journey.",
      pcos: "PCOS often benefits from a holistic, individualised approach. Working with a practitioner can provide deeper insight.",
      endometriosis: "Endometriosis management is deeply personal. Tailored support addresses your specific experience.",
      cancer_support: "During and after treatment, compassionate practitioner care can offer holistic support alongside your medical team.",
    };
    return messages[lifeStage];
  };

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Icon className="w-4 h-4 text-wellness-lilac flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          {content.description.split('.')[0]}.{' '}
          <button 
            onClick={onAction}
            className="text-wellness-lilac hover:underline underline-offset-2 font-medium"
          >
            {content.ctaText}
          </button>
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`p-4 rounded-lg bg-gradient-to-r from-wellness-lilac/10 to-mumtaz-plum/10 border border-wellness-lilac/20 ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-wellness-lilac/20">
              <Icon className="w-5 h-5 text-wellness-lilac" />
            </div>
            <div>
              <p className="font-medium text-wellness-taupe">{content.title}</p>
              <p className="text-sm text-muted-foreground">{content.description.split('.')[0]}.</p>
            </div>
          </div>
          <Button 
            onClick={onAction}
            variant="outline"
            className="border-wellness-lilac/30 text-wellness-lilac hover:bg-wellness-lilac/10 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {content.ctaText}
          </Button>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br from-wellness-lilac/5 to-mumtaz-plum/5 border border-wellness-lilac/20 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-wellness-lilac/15">
            <Icon className="w-5 h-5 text-wellness-lilac" />
          </div>
          <h4 className="font-semibold text-wellness-taupe">{content.title}</h4>
        </div>

        {getLifeStageMessage() && (
          <p className="text-sm text-wellness-taupe/90 italic bg-wellness-sage/10 p-3 rounded-lg">
            {getLifeStageMessage()}
          </p>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          {content.description}
        </p>

        <div className="pt-2">
          <Button 
            onClick={onAction}
            className="w-full bg-wellness-lilac hover:bg-wellness-lilac/90 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {content.ctaText}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground italic">
          Built on 30+ years of holistic expertise
        </p>
      </div>
    </div>
  );
}

export default PractitionerSupportCTA;
