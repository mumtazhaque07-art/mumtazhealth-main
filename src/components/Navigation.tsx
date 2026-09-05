import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { GlobalLoadingIndicator } from "@/components/GlobalLoadingIndicator";
import { Button } from "@/components/ui/button";
import {
  Heart,
  BookOpen,
  Settings,
  BarChart3,
  Clock,
  Home,
  Moon,
  Sun,
  Users,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLifeMap } from "@/contexts/LifeMapContext";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { islamicMode, setIslamicMode } = useLifeMap();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
      toast.success("Successfully signed out");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Desktop and Mobile now align on the core four-tab model to reduce clutter
  const coreNavItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Library", icon: BookOpen, href: "/content-library" },
    { label: "Journal", icon: Heart, href: "/tracker" },
    { label: "Chat", icon: MessageCircle, href: "/chat" },
  ];

  const hideTopLogoOnMobile =
    isMobile && (location.pathname === "/" || location.pathname === "/content-library");

  return (
    <>
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50",
      className
    )}>
      <GlobalLoadingIndicator />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo — minimized/hidden on Home + Library mobile so page-centred logo wins */}
        <Link
          to="/"
          className={cn(
            "flex items-center transition-all duration-300 hover:scale-105 hover:opacity-80",
            hideTopLogoOnMobile && "opacity-0 pointer-events-none w-0 overflow-hidden"
          )}
          aria-hidden={hideTopLogoOnMobile}
          tabIndex={hideTopLogoOnMobile ? -1 : undefined}
        >
          <Logo size="nav" showText={false} />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-1">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "gap-2",
                    isActive 
                      ? "text-primary font-bold bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  {item.label}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIslamicMode(!islamicMode)}
              className="group mx-2 rounded-full border border-border/50 hover:bg-wellness-lilac/10 hover:border-wellness-lilac/30 transition-all duration-300"
              title={islamicMode ? "Switch to Universal Mode" : "Switch to Islamic Shifa Mode"}
            >
              {islamicMode ? (
                <Moon className="h-4 w-4 text-mumtaz-plum group-hover:scale-110 transition-transform" />
              ) : (
                <Sun className="h-4 w-4 text-wellness-sage group-hover:scale-110 transition-transform" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 ml-1"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isMobile && (
          <div className="flex items-center gap-2" />
        )}
      </div>
    </nav>
    
    {/* Mobile Bottom Tab Bar — Home / Library / Journal / Chat only */}
    {isMobile && (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16 px-2">
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1",
                  isActive ? "text-mumtaz-plum" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon className={cn("h-6 w-6 transition-transform duration-200", isActive && "scale-110")} />
                <span className={cn("text-[10px] font-medium tracking-wide", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    )}
    </>
  );
}
