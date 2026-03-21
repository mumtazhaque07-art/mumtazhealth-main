import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FiqhCycleCalculator, CycleStatus, FiqhConfig, PeriodEntry } from "@/lib/fiqhCycleCalculator";

export function useFiqhStatus(userId: string | undefined, selectedDate: Date) {
  const [status, setStatus] = useState<CycleStatus>("Tuhr");
  const [dayOfStatus, setDayOfStatus] = useState(1);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<PeriodEntry[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      setLoading(true);
      // Fetch the last 45 days of entries to catch the previous two cycles
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 45);

      const { data, error } = await supabase
        .from('wellness_entries')
        .select('entry_date, cycle_phase')
        .eq('user_id', userId)
        .gte('entry_date', startDate.toISOString().split('T')[0])
        .order('entry_date', { ascending: true });

      if (error) {
        console.error("Error fetching cycle history:", error);
        setLoading(false);
        return;
      }

      // Group consecutive "Menstrual" days into PeriodEntry objects
      const periods: PeriodEntry[] = [];
      let currentPeriod: { start: Date; last: Date } | null = null;

      data.forEach(entry => {
        if (entry.cycle_phase === 'Menstrual') {
          const entryDate = new Date(entry.entry_date);
          if (!currentPeriod) {
            currentPeriod = { start: entryDate, last: entryDate };
          } else {
            currentPeriod.last = entryDate;
          }
        } else if (currentPeriod) {
          periods.push({ startDate: currentPeriod.start, endDate: currentPeriod.last });
          currentPeriod = null;
        }
      });

      if (currentPeriod) {
        periods.push({ startDate: currentPeriod.start, endDate: currentPeriod.last });
      }

      setEntries(periods);

      // Calculate status for selectedDate
      const config = FiqhCycleCalculator.getDefaultConfig("Hanafi"); // TODO: Load from profile
      const result = FiqhCycleCalculator.calculateStatus(selectedDate, periods, config);
      
      setStatus(result.status);
      setDayOfStatus(result.dayOfStatus);
      setLoading(false);
    };

    fetchHistory();
  }, [userId, selectedDate]);

  return { status, dayOfStatus, loading, recommendations: FiqhCycleCalculator.getRecommendations(status) };
}
