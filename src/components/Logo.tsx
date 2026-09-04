import logo from "@/assets/mumtaz-health-logo-official.jpg";

interface LogoProps {
  size?: "sm" | "nav" | "md" | "lg" | "xl" | "2xl";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = false, className = "" }: LogoProps) {
  // Official JPG already includes icon + wordmark + tagline — never add HTML wordmark/tagline beside it.
  void showText;

  const sizeClasses = {
    sm: "h-12 sm:h-14",
    nav: "h-10 sm:h-12",
    md: "h-16 sm:h-20",
    lg: "h-24 sm:h-28",
    xl: "h-28 sm:h-32 md:h-36",
    "2xl": "h-32 sm:h-36 md:h-44",
  };

  return (
    <img
      src={logo}
      alt="Mumtaz Health"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
}
