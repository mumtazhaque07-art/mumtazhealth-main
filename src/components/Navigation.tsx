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
} from "lucide-react";
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

  const navItems = [
    { label: "Home", icon: Home, href: "/", description: "Your dashboard" },
    { label: "Journal", icon: Heart, href: "/tracker", description: "How are you feeling?" },
    { label: "Library", icon: BookOpen, href: "/content-library", description: "Explore practices" },
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
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIslamicMode(!islamicMode)}
              className="rounded-full border border-border/50 bg-background/50 hover:bg-wellness-lilac/10 h-8 w-8 transition-transform active:scale-95"
            >
              {islamicMode ? (
                <Moon className="h-3.5 w-3.5 text-mumtaz-plum" />
              ) : (
                <Sun className="h-3.5 w-3.5 text-wellness-sage" />
              )}
            </Button>

            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground gap-2"
              >
                <Menu className="h-5 w-5" />
                <span className="text-sm">Menu</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isMenuOpen && "rotate-180"
                )} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-card border-border shadow-lg"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
                return (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => {
                      navigate(item.href);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 py-3 cursor-pointer",
                      isActive && "bg-primary/5"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-primary": "text-accent")} />
                    <div className="flex flex-col">
                      <span className={cn("font-medium", isActive ? "text-primary font-bold": "text-foreground")}>{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/settings");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 py-3 cursor-pointer"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}
