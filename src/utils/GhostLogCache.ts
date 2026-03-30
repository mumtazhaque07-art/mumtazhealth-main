/**
 * GhostLogCache manages temporary night-time symptom logging.
 * It stores data exclusively in localStorage to avoid cloud syncing 
 * until the user explicitly clears or keeps it in the morning.
 */

export interface NightLog {
  id: string;
  timestamp: string; // ISO string
  emotions: string[];
  symptoms: string[];
  notes?: string;
}

const GHOST_LOG_KEY = "mumtaz_ghost_log";

export const GhostLogCache = {
  addLog: (logInput: Omit<NightLog, "id" | "timestamp">) => {
    const currentLogs = GhostLogCache.getLogs();
    const newLog: NightLog = {
      ...logInput,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(GHOST_LOG_KEY, JSON.stringify([...currentLogs, newLog]));
  },

  getLogs: (): NightLog[] => {
    const raw = localStorage.getItem(GHOST_LOG_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  clearLogs: () => {
    localStorage.removeItem(GHOST_LOG_KEY);
  },
  
  hasPendingLogs: (): boolean => {
    return GhostLogCache.getLogs().length > 0;
  }
};
