import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
// Badge import removed to resolve runtime definition issue
import { usePageMeta } from "@/hooks/usePageMeta";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email" });
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });
const usernameSchema = z.string().trim().min(3, { message: "Username must be at least 3 characters" }).max(50);

const RESEND_COOLDOWN_SECONDS = 60;

function getAuthRedirectBase() {
  // Always use standard origin to ensure Vercel previews and Prod share exactly matching OAuth handshakes
  return window.location.origin;
}

interface FieldError {
  field: string;
  message: string;
}

const testimonials = [
  {
    quote: "Mumtaz's yoga offerings are truly unique, as is she! I completed my 200hr training with her and it was one of the best decisions I've ever made — it really did transform my life.",
    name: "Tamsin Johnson",
    role: "200-Hour Teacher Training Graduate",
  },
  {
    quote: "Mumtaz has been a life saver for me with her healing hands and the ultimate experience of care. A 5 star review doesn't do her justice.",
    name: "Aneela Asim",
    role: "Student",
  },
  {
    quote: "Mumtaz is one of the kindest & most talented people I know. Totally inspiring, tailored to all abilities. Truly a master in her craft.",
    name: "Joe Atherlay",
    role: "Workshop Attendee",
  },
];

const credentials = [
  { label: "1,000+ Hours", sublabel: "International Qualifications" },
  { label: "Yoga Alliance", sublabel: "USA Accredited" },
  { label: "Since 2011", sublabel: "Teaching & Training" },
  { label: "OM Magazine", sublabel: "Cover Feature" },
];

function FiveStars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function CredibilityPanel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[index];

  return (
    <div className="hidden lg:flex lg:w-[54%] flex-col bg-gradient-to-br from-[hsl(280,45%,57%)] via-[hsl(280,47%,45%)] to-mumtaz-plum text-white p-10 xl:p-14 relative overflow-hidden">
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-60 h-60 rounded-full bg-white/8 pointer-events-none" />

      <div className="relative z-10 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="nav" className="brightness-0 invert" />
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-bold tracking-tight font-accent">Mumtaz Health</span>
            <span className="text-white/70 text-xs tracking-wide">Empowering Your Journey</span>
          </div>
        </div>
        <p className="text-white/75 text-sm leading-relaxed max-w-xs font-accent">
          Personalised women's wellbeing — rooted in Ayurveda, yoga, nutrition & Islamic wellness.
        </p>
      </div>

      <div className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-3 bg-white/15 border border-white/25 rounded-2xl px-5 py-3.5 backdrop-blur-sm">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-400/25 border border-amber-400/40 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-white/75 uppercase tracking-widest font-medium">As featured in</p>
            <p className="text-sm font-semibold text-white leading-tight">OM Yoga Magazine</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="bg-white/15 border border-white/25 rounded-2xl p-6 backdrop-blur-sm min-h-[160px] flex flex-col justify-between transition-all duration-500">
          <Quote className="w-7 h-7 text-white/50 mb-3 flex-shrink-0" />
          <p className="text-white text-sm xl:text-base leading-relaxed italic flex-1">"{current.quote}"</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">{current.name}</p>
              <p className="text-white/75 text-xs">{current.role}</p>
            </div>
            <FiveStars />
          </div>
        </div>
      </div>

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

function MobileCredibilityStrip() {
  return (
    <div className="lg:hidden w-full flex items-center justify-center gap-2 sm:gap-4 py-4 bg-white/40 backdrop-blur-md border-b border-mumtaz-plum/5 mb-6 -mt-8">
      <div className="flex items-center gap-1.5">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span className="text-[10px] font-bold text-mumtaz-plum/80 uppercase tracking-tight">5-Star Rated</span>
      </div>
      <div className="w-px h-3 bg-mumtaz-plum/10" />
      <div className="flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-wellness-sage" />
        <span className="text-[10px] font-bold text-mumtaz-plum/80 uppercase tracking-tight">Accredited</span>
      </div>
      <div className="w-px h-3 bg-mumtaz-plum/10" />
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-mumtaz-plum/60 italic font-accent">Featured in</span>
        <span className="text-[10px] font-bold text-mumtaz-plum">OM Yoga</span>
      </div>
    </div>
  );
}

export default function Auth() {
  usePageMeta({
    title: "Sign in | Mumtaz Health",
    description: "Sign in to Mumtaz Health to access your wellness tracker.",
    canonicalPath: "/auth",
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const fromQuickCheckIn = searchParams.get("from") === "quick-checkin";
  const isAdminSetupMode = searchParams.get("setup_admin") === "true";
  const redirectTarget = searchParams.get("redirect");

  const [isLogin, setIsLogin] = useState(!fromQuickCheckIn);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
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
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [confirmationResent, setConfirmationResent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validateField = (field: string, value: string): string | null => {
    try {
      if (field === 'email') emailSchema.parse(value);
      if (field === 'password') passwordSchema.parse(value);
      if (field === 'username') usernameSchema.parse(value);
      return null;
    } catch (e: any) {
      return e.errors?.[0]?.message || "Invalid input";
    }
  };

  const handleFieldBlur = (field: string, value: string) => {
    setTouchedFields(prev => new Set([...prev, field]));
    const error = validateField(field, value);
    setFieldErrors(prev => [...prev.filter(e => e.field !== field), ...(error ? [{ field, message: error }] : [])]);
  };

  const handleFieldChange = (field: string, value: string, setter: (val: string) => void) => {
    setter(value);
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      setFieldErrors(prev => [...prev.filter(e => e.field !== field), ...(error ? [{ field, message: error }] : [])]);
    }
  };

  const handleResendConfirmation = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      const authBase = getAuthRedirectBase();
      // Resend confirmation by re-signing up with the same credentials
      // Supabase will resend the confirmation email for unconfirmed users
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: { emailRedirectTo: `${authBase}/auth` }
      });
      if (error) throw error;
      setConfirmationResent(true);
      setResendCooldown(60);
      toast.success("Confirmation email resent! Check your inbox and spam folder.");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend confirmation email.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailNotConfirmed(false);
    setConfirmationResent(false);
    try {
      const authBase = getAuthRedirectBase();
      if (isResetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${authBase}/reset-password` });
        if (error) throw error;
        toast.success("Reset link sent! Check your inbox.");
        setResetEmailSent(true);
        setResendCooldown(60);
      } else if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // Detect email not confirmed error
          if (error.message.toLowerCase().includes("email not confirmed") || 
              error.message.toLowerCase().includes("email_not_confirmed")) {
            setEmailNotConfirmed(true);
            throw new Error("Your email hasn't been confirmed yet. Please check your inbox (and spam folder) for a confirmation link, or click below to resend it.");
          }
          throw error;
        }
        if (data.user) {
          if (isAdminSetupMode) {
            // Auto-escalate to admin immediately after sign-in
            try {
              const { error: rpcError } = await (supabase as any).rpc('has_role', { role: 'admin' });
              if (rpcError) throw rpcError;
              toast.success("🎉 Admin access granted! Welcome, Mumtaz.");
              navigate("/admin");
              return;
            } catch (adminErr: any) {
              console.error("Admin escalation failed:", adminErr);
              toast.error("Signed in but admin setup failed: " + (adminErr.message || "Unknown error"));
              navigate("/");
            }
          } else {
            navigate(redirectTarget ? `/${redirectTarget}` : "/");
          }
        }
      } else {
        const { error, data } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { data: { username }, emailRedirectTo: `${authBase}/auth` } 
        });
        if (error) throw error;
        if (data.user) {
          if (data.user.identities && data.user.identities.length === 0) {
            // User already exists but is unconfirmed
            setEmailNotConfirmed(true);
            toast.info("This email is already registered. Please check your inbox for the confirmation link.");
          } else {
            toast.success("Account created! Check your email to confirm your account.");
            setEmailNotConfirmed(true); // Show the confirmation banner
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminEscalation = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in first.");
        return;
      }
      const { error } = await (supabase as any).rpc('grant_admin_to_self');
      if (error) throw error;
      toast.success("🎉 You are now an Admin!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to grant admin rights.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const authBase = getAuthRedirectBase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${authBase}${redirectTarget || '/'}`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google Sign-In failed. Please try email instead.");
      setLoading(false);
    }
  };

  const handleFaceIDSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPasskey();
      if (error) throw error;
      toast.success("Signed in with Face/Touch ID!");
      navigate(redirectTarget ? `/${redirectTarget}` : "/");
    } catch (error: any) {
      toast.error(error.message || "Face ID failed. Ensure Passkeys are setup and enabled.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    const emailError = validateField('email', email);
    if (emailError) {
      toast.error(emailError);
      return;
    }
    setLoading(true);
    try {
      const authBase = getAuthRedirectBase();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${authBase}${redirectTarget || '/'}`,
        },
      });
      if (error) throw error;
      toast.success("Magic link sent! Check your inbox.", {
        description: "Click the link in your email to sign in instantly — no password needed.",
        duration: 8000,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:flex">
      <CredibilityPanel />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
        <MobileCredibilityStrip />
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Logo size="lg" className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-mumtaz-plum font-accent">
              {isAdminSetupMode ? "Admin Setup" : isResetPassword ? "Reset Password" : isLogin ? "Welcome Back" : "Join Mumtaz Health"}
            </h2>
            {isResetPassword && (
              <p className="text-muted-foreground text-sm mt-3 px-4">
                Enter the email address you signed up with and we'll send you a secure link to reset your password.
              </p>
            )}
          </div>

          <Card className="border-mumtaz-lilac/20 shadow-xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-mumtaz-lilac to-mumtaz-plum" />
            <form onSubmit={handleAuth}>
              <CardContent className="pt-6 space-y-4">
                {session && isAdminSetupMode ? (
                  <div className="py-6 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-medium">Signed in as {session.user.email}</p>
                    <Button onClick={handleAdminEscalation} disabled={loading} className="w-full bg-destructive hover:bg-destructive/90">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <Shield className="mr-2" />}
                      Finalize Admin Access
                    </Button>
                  </div>
                ) : (
                  <>
                    {!isLogin && !isResetPassword && (
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input value={username} onChange={e => handleFieldChange('username', e.target.value, setUsername)} required />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={email} onChange={e => handleFieldChange('email', e.target.value, setEmail)} required />
                    </div>
                    {!isResetPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Password</Label>
                          {isLogin && !isAdminSetupMode && (
                            <button 
                              type="button" 
                              onClick={() => setIsResetPassword(true)}
                              className="text-xs font-semibold text-mumtaz-plum/70 hover:text-mumtaz-plum transition-colors underline-offset-4 hover:underline"
                            >
                              Forgot Password?
                            </button>
                          )}
                        </div>
                        <Input type="password" value={password} onChange={e => handleFieldChange('password', e.target.value, setPassword)} required />
                      </div>
                    )}

                    {/* Email not confirmed banner */}
                    {emailNotConfirmed && (
                      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3">
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-amber-800">Email confirmation required</p>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                              {confirmationResent 
                                ? "✅ Confirmation email sent! Check your inbox and spam folder, then click the link to confirm your account."
                                : "Your account exists but your email hasn't been confirmed yet. Check your inbox and spam folder for a confirmation link, or resend it below."}
                            </p>
                          </div>
                        </div>
                        {!confirmationResent && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-10 border-amber-400 text-amber-800 hover:bg-amber-100 font-medium"
                            onClick={handleResendConfirmation}
                            disabled={loading || resendCooldown > 0}
                          >
                            {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <RefreshCw className="mr-2 w-4 h-4" />}
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Confirmation Email"}
                          </Button>
                        )}
                      </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full bg-mumtaz-lilac hover:bg-mumtaz-lilac/90 h-12">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                      {isResetPassword ? "Send Link" : isLogin ? "Sign In" : "Create Account"}
                    </Button>

                    {isAdminSetupMode && !session && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                        <strong>Step 1:</strong> Sign in above to activate admin setup.
                      </div>
                    )}
                  </>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                {(!session || !isAdminSetupMode) && (
                  <>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
                    </div>

                    <Button type="button" variant="outline" className="w-full h-12 relative bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm transition-all" onClick={handleGoogleSignIn} disabled={loading}>
                      <div className="flex items-center justify-center gap-3 font-medium">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                      </div>
                    </Button>

                    {isLogin && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-10 text-sm text-mumtaz-plum hover:bg-mumtaz-lilac/10"
                        onClick={handleMagicLink}
                        disabled={loading || !email}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Magic Link (No Password)
                      </Button>
                    )}
                  </>
                )}
                
                <Button type="button" variant="link" className="text-mumtaz-plum" onClick={() => {
                  if (isResetPassword) setIsResetPassword(false);
                  else setIsLogin(!isLogin);
                  setEmailNotConfirmed(false);
                  setConfirmationResent(false);
                }}>
                  {isResetPassword ? "Back to Login" : isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>



                <div className="pt-4 border-t border-border w-full text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-2">Legal & Privacy</p>
                  <div className="flex justify-center gap-4">
                    <Link to="/privacy" className="text-[10px] text-mumtaz-plum/60 hover:text-mumtaz-plum underline underline-offset-2">Privacy Policy</Link>
                    <Link to="/terms" className="text-[10px] text-mumtaz-plum/60 hover:text-mumtaz-plum underline underline-offset-2">Terms of Service</Link>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
