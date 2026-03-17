import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { ArrowLeft, KeyRound, Mail, RefreshCw, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Star, Quote, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { usePageMeta } from "@/hooks/usePageMeta";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email" });
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });
const usernameSchema = z.string().trim().min(3, { message: "Username must be at least 3 characters" }).max(50);

const RESEND_COOLDOWN_SECONDS = 60;

function getAuthRedirectBase() {
  // Use the canonical domain for production, or current origin for local dev
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocal ? window.location.origin : 'https://mumtazhealth.app';
}

interface FieldError {
  field: string;
  message: string;
}

// ─── Testimonials data ──────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "Mumtaz's yoga offerings are truly unique, as is she! I completed my 200hr training with her and it was one of the best decisions I've ever made — it really did transform my life. She exudes love, knowledge and strength. I cannot recommend her highly enough!",
    name: "Tamsin Johnson",
    role: "200-Hour Teacher Training Graduate",
  },
  {
    quote:
      "Mumtaz has been a life saver for me with her healing hands and the ultimate experience of care — from her one to one sessions to the group yoga classes. A 5 star review doesn't do her justice.",
    name: "Aneela Asim",
    role: "Student",
  },
  {
    quote:
      "Mumtaz is one of the kindest & most talented people I know. Totally inspiring, tailored to all abilities and any limitations — I came away feeling like a new man. Truly a master in her craft.",
    name: "Joe Atherlay",
    role: "Workshop Attendee",
  },
  {
    quote:
      "Just finished the yoga power module with Mumtaz — it was fun and increased my knowledge. Mumtaz is a great mentor and I strongly recommend her school of yoga.",
    name: "Seyna Drame",
    role: "Training Graduate",
  },
];

// ─── Credentials strip ──────────────────────────────────────────────────────
const credentials = [
  { label: "1,000+ Hours", sublabel: "International Qualifications" },
  { label: "Yoga Alliance", sublabel: "USA Accredited" },
  { label: "Since 2011", sublabel: "Teaching & Training" },
  { label: "OM Magazine", sublabel: "Cover Feature" },
];

// ─── Rotating testimonial hook ──────────────────────────────────────────────
function useRotatingTestimonial(interval = 5000) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);
  return { current: testimonials[index], index, total: testimonials.length, setIndex };
}

// ─── Five-star row ──────────────────────────────────────────────────────────
function FiveStars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ─── Desktop credibility panel ───────────────────────────────────────────────
function CredibilityPanel() {
  const { current, index, total, setIndex } = useRotatingTestimonial(6000);

  return (
    <div className="hidden lg:flex lg:w-[54%] flex-col bg-gradient-to-br from-[hsl(280,45%,57%)] via-[hsl(280,47%,45%)] to-mumtaz-plum text-white p-10 xl:p-14 relative overflow-hidden">

      {/* Soft decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-60 h-60 rounded-full bg-white/8 pointer-events-none" />

      {/* Logo & tagline */}
      <div className="relative z-10 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="nav" className="brightness-0 invert" />
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-bold tracking-tight font-accent">Mumtaz Health</span>
            <span className="text-white/70 text-xs tracking-wide">Empowering Your Journey</span>
          </div>
        </div>
        <p className="text-white/75 text-sm leading-relaxed max-w-xs font-accent">
          Personalised women's wellbeing — rooted in Ayurveda, yoga, nutrition &amp; Islamic wellness.
        </p>
      </div>

      {/* Press badge — OM Yoga Magazine */}
      <div className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-3 bg-white/15 border border-white/25 rounded-2xl px-5 py-3.5 backdrop-blur-sm">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-400/25 border border-amber-400/40 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-white/75 uppercase tracking-widest font-medium">As featured in</p>
            <p className="text-sm font-semibold text-white leading-tight">OM Yoga Magazine</p>
            <p className="text-xs text-white/80 leading-tight">First hijab-wearing Muslim woman on the cover</p>
          </div>
        </div>
      </div>

      {/* Google reviews badge */}
      <div className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-3 bg-white/15 border border-white/25 rounded-2xl px-5 py-3.5 backdrop-blur-sm">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-white/75 uppercase tracking-widest font-medium">School of Mumtaz Yoga</p>
            <div className="flex items-center gap-2">
              <FiveStars />
              <span className="text-sm font-semibold text-white">5.0 on Google</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rotating testimonial */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="bg-white/15 border border-white/25 rounded-2xl p-6 xl:p-7 backdrop-blur-sm min-h-[160px] flex flex-col justify-between transition-all duration-500">
          <Quote className="w-7 h-7 text-white/50 mb-3 flex-shrink-0" />
          <p className="text-white text-sm xl:text-base leading-relaxed italic flex-1">
            "{current.quote}"
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">{current.name}</p>
              <p className="text-white/75 text-xs">{current.role}</p>
            </div>
            <FiveStars />
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-4 justify-center">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-white w-5" : "bg-white/35"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Credentials strip */}
      <div className="relative z-10 mt-8 grid grid-cols-4 gap-2">
        {credentials.map((c) => (
          <div key={c.label} className="bg-white/12 border border-white/25 rounded-xl p-3 text-center">
            <p className="text-white font-bold text-sm leading-tight">{c.label}</p>
            <p className="text-white/80 text-xs leading-tight mt-0.5">{c.sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile credibility strip ────────────────────────────────────────────────
function MobileCredibilityStrip() {
  return (
    <div className="lg:hidden mb-6">
      {/* Press badge */}
      <div className="bg-mumtaz-plum/8 border border-mumtaz-plum/15 rounded-2xl px-4 py-3 mb-3 flex items-center gap-3">
        <Star className="w-5 h-5 fill-amber-400 text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">As featured in OM Yoga Magazine</p>
          <p className="text-xs text-mumtaz-plum font-semibold">First hijab-wearing Muslim woman on the cover</p>
        </div>
      </div>

      {/* Google stars */}
      <div className="bg-mumtaz-plum/8 border border-mumtaz-plum/15 rounded-2xl px-4 py-3 mb-3 flex items-center gap-3">
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <div className="flex items-center gap-2">
          <FiveStars />
          <span className="text-xs font-semibold text-mumtaz-plum">5.0 — School of Mumtaz Yoga on Google</span>
        </div>
      </div>

      {/* Credentials row */}
      <div className="grid grid-cols-4 gap-2">
        {credentials.map((c) => (
          <div key={c.label} className="bg-mumtaz-plum/6 border border-mumtaz-plum/12 rounded-xl p-2 text-center">
            <p className="text-mumtaz-plum font-bold text-xs leading-tight">{c.label}</p>
            <p className="text-muted-foreground text-[10px] leading-tight mt-0.5">{c.sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Auth page ───────────────────────────────────────────────────────────
export default function Auth() {
  usePageMeta({
    title: "Sign in | Mumtaz Health",
    description: "Sign in to Mumtaz Health to access your wellness tracker, daily practices, and insights.",
    canonicalPath: "/auth",
  });

  const [searchParams] = useSearchParams();
  const fromQuickCheckIn = searchParams.get("from") === "quick-checkin";
  const showAdminOption = searchParams.get("admin") === "true";
  const redirectTarget = searchParams.get("redirect"); // e.g. "content-library"

  const [isLogin, setIsLogin] = useState(!fromQuickCheckIn); // auto-switch to sign-up if from quick check-in
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isAdminSetupMode, setIsAdminSetupMode] = useState(searchParams.get("setup_admin") === "true");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Watch for session changes to help with admin setup flow
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validateField = (field: string, value: string): string | null => {
    try {
      switch (field) {
        case 'email':
          emailSchema.parse(value);
          break;
        case 'password':
          passwordSchema.parse(value);
          break;
        case 'username':
          usernameSchema.parse(value);
          break;
      }
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || "Please check this field";
      }
      return "Please check this field";
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return fieldErrors.find(e => e.field === field)?.message;
  };

  const handleFieldBlur = (field: string, value: string) => {
    if (!value.trim()) return;
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, value);
    setFieldErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      if (error) return [...filtered, { field, message: error }];
      return filtered;
    });
  };

  const handleFieldChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (touchedFields.has(field) && value.length > 0) {
      const error = validateField(field, value);
      setFieldErrors(prev => {
        const filtered = prev.filter(e => e.field !== field);
        if (error) return [...filtered, { field, message: error }];
        return filtered;
      });
    }
  };

  const isFormValid = (): boolean => {
    if (isResetPassword) {
      return email.trim().length > 0 && !validateField('email', email);
    }
    if (isLogin) {
      return email.trim().length > 0 &&
             password.length > 0 &&
             !validateField('email', email) &&
             !validateField('password', password);
    }
    return email.trim().length > 0 &&
           password.length > 0 &&
           username.trim().length > 0 &&
           !validateField('email', email) &&
           !validateField('password', password) &&
           !validateField('username', username);
  };

  const isFieldValid = (field: string, value: string): boolean => {
    return value.trim().length > 0 && !validateField(field, value);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const authBase = getAuthRedirectBase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${authBase}/` },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Unable to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetEmail = useCallback(async () => {
    if (resendCooldown > 0 || !email) return;
    setLoading(true);
    try {
      emailSchema.parse(email);
      const authBase = getAuthRedirectBase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${authBase}/reset-password`,
      });
      if (error) throw error;
      toast.success("Reset link sent! Check your inbox.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Unable to resend. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [email, resendCooldown]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedFields(new Set(['email', 'password', 'username']));
    const errors: FieldError[] = [];
    const emailError = validateField('email', email);
    if (emailError) errors.push({ field: 'email', message: emailError });
    if (!isResetPassword) {
      const passwordError = validateField('password', password);
      if (passwordError) errors.push({ field: 'password', message: passwordError });
    }
    if (!isLogin && !isResetPassword) {
      const usernameError = validateField('username', username);
      if (usernameError) errors.push({ field: 'username', message: usernameError });
    }
    if (errors.length > 0) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const authBase = getAuthRedirectBase();
      if (isResetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${authBase}/reset-password`,
        });
        if (error) throw error;
        toast.success("If this email exists, we've sent a reset link.");
        setResetEmailSent(true);
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      } else if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("The email or password doesn't seem right. Please try again.");
          }
          throw error;
        }
        if (data.user) {
          toast.success("Welcome back!");
          const returnPath = localStorage.getItem('mumtaz_return_path');
          const pendingOnboarding = localStorage.getItem('mumtaz_pending_onboarding');
          if (pendingOnboarding) {
            navigate("/onboarding?step=complete");
          } else if (redirectTarget) {
            navigate(`/${redirectTarget}`);
          } else if (returnPath) {
            localStorage.removeItem('mumtaz_return_path');
            navigate(returnPath);
          } else {
            navigate("/");
          }
        }
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${authBase}/auth`,
          },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("This email is already registered. Try signing in instead.");
          }
          throw error;
        }
        if (data.user) {
          toast.success("Account created! Welcome to Mumtaz Health.");
          const pendingOnboarding = localStorage.getItem('mumtaz_pending_onboarding');
          const returnPath = localStorage.getItem('mumtaz_return_path');
          if (pendingOnboarding) {
            navigate("/onboarding?step=complete");
          } else if (redirectTarget) {
            navigate(`/${redirectTarget}`);
          } else if (returnPath) {
            localStorage.removeItem('mumtaz_return_path');
            navigate(returnPath);
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      if (isResetPassword) {
        if (error instanceof z.ZodError) {
          toast.error(error.errors[0].message);
        } else {
          toast.error("We couldn't send the reset link. Please try again.");
        }
        return;
      }
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminEscalation = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in first to setup admin privileges.");
        setIsLogin(true);
        return;
      }

      // Check if already admin
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (existingRole) {
        toast.success("You already have admin privileges!");
        navigate("/admin");
        return;
      }

      // Grant admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'admin' });

      if (error) throw error;

      toast.success("Admin privileges granted! Welcome, Mumtaz.");
      navigate("/admin");
    } catch (error) {
      console.error("Admin setup error:", error);
      toast.error("Unable to setup admin. Please check if your user exists.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFieldErrors([]);
    setTouchedFields(new Set());
  };

  const getButtonLabel = () => {
    if (isResetPassword) return "Send Reset Link";
    if (isAdminLogin) return "Admin Sign In";
    return isLogin ? "Sign In" : "Create Account";
  };

  return (
    <div className="min-h-screen lg:flex">

      {/* ── Left panel: credibility (desktop) ── */}
      <CredibilityPanel />

      {/* ── Right panel: auth form ── */}
      <div className="flex-1 flex flex-col items-center justify-start sm:justify-center bg-gradient-to-b from-mumtaz-lilac/8 via-background to-wellness-sage/6 px-4 pt-6 pb-40 sm:py-8">
        <div className="w-full max-w-md">

          {/* Logo — mobile only (desktop left panel has it) */}
          <div className="lg:hidden flex flex-col items-center mb-6">
            <Logo size="lg" className="mx-auto" />
          </div>

          {/* Mobile credibility strip */}
          <MobileCredibilityStrip />

          {/* Banner shown when arriving from quick check-in */}
          {fromQuickCheckIn && (
            <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-mumtaz-lilac/20 to-mumtaz-sage/20 border border-mumtaz-lilac/30 text-center">
              <p className="text-sm font-semibold text-mumtaz-plum mb-1">✨ Save your check-in progress</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create a free account to save today's guidance, track your journey, and get personalised recommendations every day.
              </p>
            </div>
          )}

          <Card className="w-full border-mumtaz-lilac/20 shadow-xl overflow-hidden">
            {/* Brand accent stripe across top of card */}
            <div className="h-1 w-full bg-gradient-to-r from-mumtaz-lilac via-mumtaz-plum to-wellness-sage" />
            <CardHeader className="space-y-3 text-center pt-6 sm:pt-8">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-mumtaz-plum">
                {isResetPassword ? "Reset Password" : isAdminLogin ? "Admin Access" : isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="font-accent text-sm sm:text-base">
                {isResetPassword
                  ? "Enter your email to receive a password reset link"
                  : isAdminLogin
                    ? "Administrator login"
                    : isLogin
                      ? "Enter your credentials to access your wellness tracker"
                      : "Join us to start your holistic wellness journey"}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleAuth}>
              <CardContent className="space-y-4 px-4 sm:px-6">

                {/* Username — signup only */}
                {!isLogin && !isResetPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => handleFieldChange('username', e.target.value, setUsername)}
                        onBlur={() => handleFieldBlur('username', username)}
                        required={!isLogin}
                        disabled={loading}
                        className={`h-12 text-base pr-10 ${
                          touchedFields.has('username') && getFieldError('username')
                            ? 'border-destructive focus-visible:ring-destructive'
                            : touchedFields.has('username') && isFieldValid('username', username)
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : ''
                        }`}
                        autoComplete="username"
                      />
                      {touchedFields.has('username') && username && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          {getFieldError('username') ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </span>
                      )}
                    </div>
                    {touchedFields.has('username') && getFieldError('username') && (
                      <p className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                        {getFieldError('username')}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                      onBlur={() => handleFieldBlur('email', email)}
                      required
                      disabled={loading}
                      className={`h-12 text-base pr-10 ${
                        touchedFields.has('email') && getFieldError('email')
                          ? 'border-destructive focus-visible:ring-destructive'
                          : touchedFields.has('email') && isFieldValid('email', email)
                          ? 'border-green-500 focus-visible:ring-green-500'
                          : ''
                      }`}
                      autoComplete="email"
                    />
                    {touchedFields.has('email') && email && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {getFieldError('email') ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {touchedFields.has('email') && getFieldError('email') && (
                    <p className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                      {getFieldError('email')}
                    </p>
                  )}
                </div>

                {/* Password */}
                {!isResetPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isLogin ? "Enter your password" : "Create a password (6+ characters)"}
                        value={password}
                        onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                        onBlur={() => handleFieldBlur('password', password)}
                        required
                        disabled={loading}
                        className={`h-12 text-base pr-20 ${
                          touchedFields.has('password') && getFieldError('password')
                            ? 'border-destructive focus-visible:ring-destructive'
                            : touchedFields.has('password') && isFieldValid('password', password)
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : ''
                        }`}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {touchedFields.has('password') && password && (
                          <span className="pointer-events-none">
                            {getFieldError('password') ? (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            ) : (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded focus:outline-none focus:ring-2 focus:ring-ring"
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    {touchedFields.has('password') && getFieldError('password') && (
                      <p className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                        {getFieldError('password')}
                      </p>
                    )}

                    {/* Remember Me & Forgot Password */}
                    {isLogin && !isAdminLogin && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="rememberMe"
                              checked={rememberMe}
                              onCheckedChange={(checked) => setRememberMe(checked === true)}
                              disabled={loading}
                              className="border-mumtaz-lilac/50 data-[state=checked]:bg-mumtaz-lilac data-[state=checked]:border-mumtaz-lilac"
                            />
                            <Label htmlFor="rememberMe" className="text-sm font-normal text-muted-foreground cursor-pointer">
                              Remember me
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-sm text-mumtaz-lilac hover:text-mumtaz-plum font-medium"
                            onClick={() => { setIsResetPassword(true); resetForm(); }}
                            disabled={loading}
                          >
                            <KeyRound className="w-3.5 h-3.5 mr-1" />
                            Forgot password?
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary CTA */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className={`w-full h-14 text-base font-semibold transition-all duration-200 ${
                      isAdminLogin
                        ? "bg-destructive hover:bg-destructive/90"
                        : "bg-mumtaz-lilac hover:bg-mumtaz-lilac/90 hover:shadow-md"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={loading || !isFormValid()}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait...</>
                    ) : (
                      getButtonLabel()
                    )}
                  </Button>
                </div>

                {/* Admin Setup Helper */}
                {isAdminSetupMode && (
                  <div className="pt-4 border-t border-wellness-taupe/10 mt-4">
                    {session ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                          <p className="text-sm font-medium text-green-800">You are signed in as {session.user.email}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-12 border-destructive text-destructive hover:bg-destructive/10 shadow-sm"
                          onClick={handleAdminEscalation}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
                          Yes, Make Me Admin Now
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                        <p className="text-sm font-medium text-amber-800 mb-1">Step 1: Sign in above first</p>
                        <p className="text-xs text-amber-700">Once signed in, this button will activate to grant your admin rights.</p>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full mt-2 h-10 border border-dashed border-amber-300 opacity-50 cursor-not-allowed"
                          disabled
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Waiting for Sign-in...
                        </Button>
                      </div>
                    )}
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                      Admin setup mode is active. This is only for the Mumtaz Health founding team.
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 px-4 sm:px-6 pb-6 sm:pb-8">
                {!isResetPassword && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 gap-2 border-mumtaz-lilac/30 hover:bg-mumtaz-lilac/10"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </Button>

                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-wellness-taupe/20" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">or email</span>
                      </div>
                    </div>

                    {!isAdminLogin && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-11"
                        onClick={() => { setIsLogin(!isLogin); resetForm(); }}
                        disabled={loading}
                      >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                      </Button>
                    )}

                    {showAdminOption && (
                      <>
                        <div className="relative w-full">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-wellness-taupe/20" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">{isAdminLogin ? "or" : "admin"}</span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant={isAdminLogin ? "outline" : "secondary"}
                          className="w-full h-10"
                          onClick={() => { setIsAdminLogin(!isAdminLogin); setIsLogin(true); resetForm(); }}
                          disabled={loading}
                        >
                          {isAdminLogin ? "Back to User Login" : "Admin Login"}
                        </Button>
                      </>
                    )}
                  </>
                )}

                {isResetPassword && (
                  <div className="space-y-4 w-full">
                    <div className="p-4 bg-mumtaz-lilac/10 border border-mumtaz-lilac/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-mumtaz-lilac mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          {resetEmailSent
                            ? "Check your inbox and spam folder for the reset link."
                            : "If this email exists in our system, we'll send you a password reset link."}
                        </p>
                      </div>
                    </div>
                    {resetEmailSent && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 gap-2 border-mumtaz-lilac/30 hover:bg-mumtaz-lilac/10"
                        onClick={handleResendResetEmail}
                        disabled={loading || resendCooldown > 0}
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Reset Email"}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 gap-2 border-mumtaz-lilac/30 hover:bg-mumtaz-lilac/10"
                      onClick={() => { setIsResetPassword(false); setResetEmailSent(false); resetForm(); }}
                      disabled={loading}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Sign In
                    </Button>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>

          {/* Mobile testimonial (shown below form on small screens) */}
          <div className="lg:hidden mt-6 bg-gradient-to-br from-mumtaz-lilac/10 to-wellness-sage/8 border border-mumtaz-lilac/20 rounded-2xl p-5">
            <Quote className="w-5 h-5 text-mumtaz-lilac mb-2" />
            <p className="text-sm text-foreground/80 italic leading-relaxed">
              "Mumtaz's yoga offerings are truly unique, as is she! I completed my 200hr training with her and it was one of the best decisions I've ever made — it really did transform my life."
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-mumtaz-plum font-semibold text-sm">Tamsin Johnson</p>
                <p className="text-muted-foreground text-xs">200-Hour Teacher Training Graduate</p>
              </div>
              <FiveStars />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
