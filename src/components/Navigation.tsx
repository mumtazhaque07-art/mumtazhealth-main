import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { GlobalLoadingIndicator } from "@/components/GlobalLoadingIndicator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Heart,
  BookOpen,
  Settings,
  BarChart3,
  Clock,
  ChevronDown,
  Home,
  Moon,
  Sun,
  Users,
  BookMarked,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const navItems = [
    { label: "Home", icon: Home, href: "/", description: "Your dashboard" },
    { label: "Journal", icon: Heart, href: "/tracker", description: "How are you feeling?" },
    { label: "Library", icon: BookOpen, href: "/content-library", description: "Explore practices" },
    { label: "Sanctuary", icon: Users, href: "/sanctuary", description: "Sisterhood community" },
    { label: "Bookings", icon: Clock, href: "/bookings", description: "Consult with Mumtaz" },
    { label: "Insights", icon: BarChart3, href: "/insights", description: "Your patterns" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50",
      className
    )}>
      {/* Global Loading Indicator */}
      <GlobalLoadingIndicator />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:opacity-80"
        >
          <Logo size="md" showText={false} />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-mumtaz-plum text-2xl sm:text-3xl tracking-tight font-accent">Mumtaz Health</span>
            <span className="text-muted-foreground text-[10px] sm:text-xs hidden sm:block tracking-wide uppercase">Empowering Your Journey</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
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

        {/* Mobile Top Navigation (Logo only) */}
        {isMobile && (
          <div className="flex items-center gap-2">
            {/* The bottom nav handles the rest. Just logo at the top. */}
          </div>
        )}
      </div>
    </nav>
    
    {/* Mobile Bottom Tab Bar */}
    {isMobile && (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
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
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => navigate("/settings")}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1",
              location.pathname.startsWith("/settings") ? "text-mumtaz-plum" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Settings className={cn("h-6 w-6 transition-transform duration-200", location.pathname.startsWith("/settings") && "scale-110")} />
            <span className="text-[10px] font-medium tracking-wide">Settings</span>
          </button>
        </div>
      </div>
    )}
    </>
  );
}
