import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { LifeMapProvider } from "@/contexts/LifeMapContext";
import { MumtazWisdomGuide } from "@/components/MumtazWisdomGuide";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { useEffect, lazy, Suspense } from "react";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { PageTransition } from "@/components/PageTransition";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { AdminRoute } from "@/components/AdminRoute";
import { VoiceNavigation } from "@/components/VoiceNavigation";
import { DynamicBackground } from "@/components/DynamicBackground";
import { GlobalDisclaimerFooter } from "@/components/GlobalDisclaimerFooter";
import { MorningReviewModal } from "@/components/MorningReviewModal";

// Core pages — loaded immediately on first visit
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// All other pages are lazy-loaded — downloaded only when the user navigates there.
// This keeps the initial app load fast.
const Tracker = lazy(() => import("./pages/Tracker"));
const Admin = lazy(() => import("./pages/Admin"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const MonthlySummary = lazy(() => import("./pages/MonthlySummary"));
const Bookings = lazy(() => import("./pages/Bookings"));
const ContentLibrary = lazy(() => import("./pages/ContentLibrary"));
const Insights = lazy(() => import("./pages/Insights"));
const Settings = lazy(() => import("./pages/Settings"));
const ConditionTracker = lazy(() => import("./pages/ConditionTracker"));
const MyDailyPractice = lazy(() => import("./pages/MyDailyPractice"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const HormonalTransitionTracker = lazy(() => import("./pages/HormonalTransitionTracker"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Logs route changes to the browser console for debugging
function RouteLogger() {
  const location = useLocation();
  useEffect(() => {
    console.log("[Router] Navigated to:", location.pathname, location.search);
  }, [location]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LoadingProvider>
          <LifeMapProvider>
            <RouteLogger />
            <MumtazWisdomGuide />
            {/* <PersonaSwitcher /> */}
           {/* <VoiceNavigation /> */} 
            <DynamicBackground>
            <Suspense fallback={<PageLoadingSkeleton variant="simple" />}>
              <Routes>
                <Route path="/" element={
                  <RouteErrorBoundary variant="dashboard">
                    <PageTransition><Index /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/tracker" element={
                  <RouteErrorBoundary variant="tracker">
                    <PageTransition><Tracker /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/auth" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><Auth /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/onboarding" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><Onboarding /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/summary" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><MonthlySummary /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/bookings" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><Bookings /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/content" element={<Navigate replace to="/content-library" />} />

                <Route path="/content-library" element={
                  <RouteErrorBoundary variant="content">
                    <PageTransition><ContentLibrary /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/insights" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><Insights /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/settings" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><Settings /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/condition-tracker" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><ConditionTracker /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/my-daily-practice" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><MyDailyPractice /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/reset-password" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><ResetPassword /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/hormonal-transition" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><HormonalTransitionTracker /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/admin" element={
                  <AdminRoute>
                    <RouteErrorBoundary variant="simple">
                      <PageTransition><Admin /></PageTransition>
                    </RouteErrorBoundary>
                  </AdminRoute>
                } />

                <Route path="/privacy" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><PrivacyPolicy /></PageTransition>
                  </RouteErrorBoundary>
                } />

                <Route path="/terms" element={
                  <RouteErrorBoundary variant="simple">
                    <PageTransition><TermsOfService /></PageTransition>
                  </RouteErrorBoundary>
                } />

                {/* Catch-all — must stay last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <MorningReviewModal />
            <GlobalDisclaimerFooter />
            </DynamicBackground>
          </LifeMapProvider>
        </LoadingProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
