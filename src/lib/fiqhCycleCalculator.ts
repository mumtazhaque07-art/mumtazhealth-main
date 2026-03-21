import { differenceInDays, addDays, isWithinInterval, startOfDay } from "date-fns";

export type FiqhSchool = "Hanafi" | "Shafi'i";

export type CycleStatus = "Hayd" | "Tuhr" | "Istihadah";

export interface FiqhConfig {
  school: FiqhSchool;
  minTuhrDays: number; // Usually 15
  maxHaydDays: number; // 10 for Hanafi, 15 for Shafi'i
}

export interface PeriodEntry {
  startDate: Date;
  endDate: Date;
}

/**
 * Centrally manages Islamic jurisprudence rules for menstruation (Hayd).
 */
export const FiqhCycleCalculator = {
  getDefaultConfig(school: FiqhSchool = "Hanafi"): FiqhConfig {
    return {
      school,
      minTuhrDays: 15,
      maxHaydDays: school === "Hanafi" ? 10 : 15,
    };
  },

  /**
   * Determines the status of a specific date based on historical entries and Fiqh rules.
   */
  calculateStatus(
    targetDate: Date,
    history: PeriodEntry[],
    config: FiqhConfig
  ): { status: CycleStatus; dayOfStatus: number } {
    const target = startOfDay(targetDate);
    const sortedHistory = [...history].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    
    // Find the current or most recent period
    const currentOrPastPeriod = sortedHistory.find(p => p.startDate <= target);

    if (!currentOrPastPeriod) {
      return { status: "Tuhr", dayOfStatus: 1 }; // Default to Tuhr if no history
    }

    const daysSinceStart = differenceInDays(target, currentOrPastPeriod.startDate) + 1;

    // Rule 1: Max Hayd duration
    if (daysSinceStart <= config.maxHaydDays) {
      // It's within the max window, but check if it was preceded by min Tuhr
      const previousPeriod = sortedHistory.find(p => p.startDate < currentOrPastPeriod.startDate);
      if (previousPeriod) {
        const tuhrDuration = differenceInDays(currentOrPastPeriod.startDate, previousPeriod.endDate) - 1;
        if (tuhrDuration < config.minTuhrDays) {
          return { status: "Istihadah", dayOfStatus: daysSinceStart };
        }
      }
      return { status: "Hayd", dayOfStatus: daysSinceStart };
    }

    // Rule 2: Outside max Hayd window but before next period starts
    return { status: "Tuhr", dayOfStatus: daysSinceStart - config.maxHaydDays };
  },

  /**
   * Helper to identify if a woman should prioritize specific practices based on her status.
   */
  getRecommendations(status: CycleStatus) {
    switch (status) {
      case "Hayd":
        return {
          practices: ["Restorative Yoga", "Yoga Nidra", "Grounding Meditation"],
          focus: "Apana Vayu (Downward energy)",
          notes: "Focus on gentle, earth-based practices. Avoid inversions.",
        };
      case "Tuhr":
        return {
          practices: ["Vinyasa Flow", "Sun Salutations", "Strength Building"],
          focus: "Building Prana",
          notes: "A time for rebuilding and active movement.",
        };
      case "Istihadah":
        return {
          practices: ["Gentle Hatha", "Breathwork"],
          focus: "Balance & Stability",
          notes: "Maintain regular routines with extra attention to comfort.",
        };
    }
  }
};
