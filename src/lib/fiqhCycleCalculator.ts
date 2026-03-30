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
   * Islamic guidance is based on scholarly consensus (Hanafi, Shafi'i, Maliki).
   */
  getRecommendations(status: CycleStatus) {
    switch (status) {
      case "Hayd":
        return {
          practices: [
            "Dhikr — SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (34x)",
            "Du'a — all supplications are fully accepted",
            "Quran on screen/device (permitted by many scholars)",
            "Salawat on the Prophet ﷺ",
            "Restorative Yoga & Yoga Nidra",
            "Gentle self-massage (Abhyanga)",
          ],
          focus: "Sacred Rest — Salah & fasting waived, not missed",
          notes: "Your prayers are waived by Divine Mercy during Hayd — not missed, not owed. There is nothing to make up. Fill these blessed days with dhikr, du'a, and gentle healing. You remain in Allah's full grace.",
          islamicNote: "Hayd is defined as the natural blood of menstruation. During this state, salah and fasting are waived entirely — this is a mercy, not a punishment. The Prophet ﷺ said: 'Is it not the case that when she menstruates, she does not pray and does not fast?' [Bukhari]",
          physicalGuidance: "Apana Vayu (downward life-force) is dominant. Support it with warmth, rest, and grounding. Legs-up-the-wall, child's pose, and deep belly breathing are ideal.",
        };
      case "Tuhr":
        return {
          practices: [
            "All 5 prayers with full presence and stillness",
            "Tahajjud (night prayer) — even 2 raka'ahs",
            "Fasting: Mondays, Thursdays, or White Days (13th, 14th, 15th)",
            "Increased Quran recitation — one page daily as a minimum",
            "Sadaqah — even a smile is charity",
            "Vinyasa Flow, Sun Salutations, Strength Building",
          ],
          focus: "Spiritual Bloom — all acts of worship fully open",
          notes: "You are in complete purity (Tuhr). This is your most spiritually expansive time. Your salah, fasting, and recitation carry their full weight. The White Days of fasting (13th, 14th, 15th of the Islamic month) are especially recommended — SubhanAllahi wa bihamdihi, SubhanAllahil Adheem.",
          islamicNote: "Tuhr is the state of purity between menstrual cycles. All acts of worship are fully permitted and encouraged. This is an ideal time to increase voluntary acts of 'ibadah.",
          physicalGuidance: "Building Prana (life-force). Your body is ready to rebuild strength and energy. Embrace more active movement, fresh foods, and creative expression.",
        };
      case "Istihadah":
        return {
          practices: [
            "Perform wudu fresh before each salah",
            "Continue all 5 prayers normally",
            "Fasting is permitted and continues",
            "Quran recitation continues",
            "Masjid entry continues",
            "Gentle Hatha Yoga & Breathwork",
          ],
          focus: "Continuous Worship — wudu before each prayer",
          notes: "Istihadah is irregular or prolonged bleeding distinct from your expected Hayd. You continue all acts of worship without interruption. Simply perform a fresh wudu before each salah. If you are uncertain whether this is Hayd or Istihadah, consult a scholar or Islamic counsellor you trust.",
          islamicNote: "Istihadah (irregular bleeding) does not carry the same rulings as Hayd. The woman performs wudu for each prayer as a concession (rukhsah) from Allah. She prays, fasts, and worships without pause. [Confirmed in Fiqh al-Sunnah and all four madhabs]",
          physicalGuidance: "Balance and stability are the focus. Gentle, consistent practices — light yoga and breathwork — support your body during this irregular time.",
        };
    }
  }
};

