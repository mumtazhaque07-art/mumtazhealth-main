import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LifeStage, LifeMapConfig, getLifeMapConfig } from "@/types/lifemap";
import { useLoading } from "./LoadingContext";
import { toast } from "sonner";

interface LifeMapContextType {
  lifeStage: LifeStage;
  config: LifeMapConfig;
  islamicMode: boolean;
  loading: boolean;
  setLifeStage: (stage: LifeStage) => Promise<void>;
  setIslamicMode: (enabled: boolean) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const LifeMapContext = createContext<LifeMapContextType | undefined>(undefined);

export const LifeMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lifeStage, setLifeStageState] = useState<LifeStage>("fertility");
  const [islamicMode, setIslamicModeState] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useLoading();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("user_wellness_profiles")
        .select("life_stage")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("[LIFEMAP_CONTEXT] Error fetching profile:", error);
      } else if (profile?.life_stage) {
        setLifeStageState(profile.life_stage.toLowerCase() as LifeStage);
      }

      // Check local storage for islamic mode as a fallback/primary toggle until DB column is fully migrated
      const savedIslamicMode = localStorage.getItem("mumtaz_islamic_mode");
      if (savedIslamicMode !== null) {
        setIslamicModeState(savedIslamicMode === "true");
      }

    } catch (err) {
      console.error("[LIFEMAP_CONTEXT] Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateLifeStage = async (stage: LifeStage) => {
    setGlobalLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from("user_wellness_profiles")
        .update({ life_stage: stage })
        .eq("user_id", user.id);

      if (error) throw error;

      setLifeStageState(stage);
      toast.success(`Transitioned to ${getLifeMapConfig(stage).title}`);
    } catch (err) {
      console.error("[LIFEMAP_CONTEXT] Error updating life stage:", err);
      toast.error("Failed to update life stage");
    } finally {
      setGlobalLoading(false);
    }
  };

  const updateIslamicMode = async (enabled: boolean) => {
    setIslamicModeState(enabled);
    localStorage.setItem("mumtaz_islamic_mode", String(enabled));
    
    // Attempt to save to profile if the user wants it persisted
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Note: Using 'as any' because the column might not be in types.ts yet
        await supabase
          .from("user_wellness_profiles")
          .update({ islamic_mode_enabled: enabled } as any)
          .eq("user_id", user.id);
      }
    } catch (e) {
      // Silently fail if column doesn't exist yet, local storage will handle it
    }

    toast.info(enabled ? "Islamic Mode Enabled 🌙" : "Universal Mode Enabled ✨");
  };

  const config = getLifeMapConfig(lifeStage);

  return (
    <LifeMapContext.Provider
      value={{
        lifeStage,
        config,
        islamicMode,
        loading,
        setLifeStage: updateLifeStage,
        setIslamicMode: updateIslamicMode,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </LifeMapContext.Provider>
  );
};

export const useLifeMap = () => {
  const context = useContext(LifeMapContext);
  if (context === undefined) {
    throw new Error("useLifeMap must be used within a LifeMapProvider");
  }
  return context;
};
