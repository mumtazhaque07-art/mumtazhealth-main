import { Navigate } from "react-router-dom";
import { useLifeMap } from "@/contexts/LifeMapContext";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function PremiumRoute({ children }: { children: React.ReactNode }) {
  const { isPremium, loading } = useLifeMap();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });
  }, []);

  if (loading || authLoading) {
    return <PageLoadingSkeleton variant="simple" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isPremium) {
    return <Navigate to="/upgrade" replace />;
  }

  return <>{children}</>;
}
