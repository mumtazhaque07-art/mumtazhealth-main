import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3, Heart, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";

interface WellnessDataPoint {
  date: string;
  displayDate: string;
  emotional_score: number | null;
  pain_level: number | null;
  cycle_phase: string | null;
}

type TimeRange = "7d" | "30d" | "90d";

const CYCLE_PHASE_COLORS: Record<string, string> = {
  menstrual: "#e57373",
  follicular: "#81c784",
  ovulation: "#ffb74d",
  luteal: "#ba68c8",
};

const TIME_RANGES: { label: string; value: TimeRange; days: number }[] = [
  { label: "7 days", value: "7d", days: 7 },
  { label: "30 days", value: "30d", days: 30 },
  { label: "90 days", value: "90d", days: 90 },
];

export function WellnessTrendCharts() {
  const [data, setData] = useState<WellnessDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const range = TIME_RANGES.find((r) => r.value === timeRange);
      const startDate = subDays(new Date(), range?.days || 30);

      const { data: entries, error } = await supabase
        .from("wellness_entries")
        .select("entry_date, emotional_score, pain_level, cycle_phase")
        .eq("user_id", user.id)
        .gte("entry_date", format(startDate, "yyyy-MM-dd"))
        .order("entry_date", { ascending: true });

      if (error) {
        console.error("Error fetching wellness entries:", error);
        return;
      }

      const chartData: WellnessDataPoint[] = (entries || []).map((entry) => ({
        date: entry.entry_date,
        displayDate: format(parseISO(entry.entry_date), "d MMM"),
        emotional_score: entry.emotional_score,
        pain_level: entry.pain_level,
        cycle_phase: entry.cycle_phase,
      }));

      setData(chartData);
    } catch (err) {
      console.error("Error loading trend data:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasEmotionalData = data.some((d) => d.emotional_score !== null);
  const hasPainData = data.some((d) => d.pain_level !== null);
  const hasCycleData = data.some((d) => d.cycle_phase !== null);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (data.length < 2) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold mb-1">More data needed</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Log at least 2 daily check-ins to see your wellness trends visualised here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {entry.value !== null ? entry.value : "—"}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Wellness Trends
        </h2>
        <div className="flex gap-1">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range.value)}
              className="text-xs h-7 px-3"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Emotional Score Chart */}
      {hasEmotionalData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-400" />
              Emotional Wellbeing
            </CardTitle>
            <CardDescription>Your emotional score over time (1–10)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="emotionalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="emotional_score"
                    name="Emotional Score"
                    stroke="#c084fc"
                    strokeWidth={2}
                    fill="url(#emotionalGradient)"
                    dot={{ r: 3, fill: "#c084fc" }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pain Level Chart */}
      {hasPainData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Pain Level
            </CardTitle>
            <CardDescription>Your pain level over time (0–10, lower is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="pain_level"
                    name="Pain Level"
                    stroke="#fb923c"
                    strokeWidth={2}
                    fill="url(#painGradient)"
                    dot={{ r: 3, fill: "#fb923c" }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combined Overview (if both exist) */}
      {hasEmotionalData && hasPainData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Combined Overview</CardTitle>
            <CardDescription>Emotional wellbeing vs pain level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="emotional_score"
                    name="Emotional"
                    stroke="#c084fc"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="pain_level"
                    name="Pain"
                    stroke="#fb923c"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cycle Phase Legend */}
      {hasCycleData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cycle Phase Timeline</CardTitle>
            <CardDescription>Your cycle phases during this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-3">
              {Object.entries(CYCLE_PHASE_COLORS).map(([phase, color]) => (
                <div key={phase} className="flex items-center gap-1.5 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="capitalize">{phase}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-0.5 h-6 rounded-md overflow-hidden">
              {data.map((point, i) => (
                <div
                  key={i}
                  className="flex-1 transition-colors"
                  style={{
                    backgroundColor: point.cycle_phase
                      ? CYCLE_PHASE_COLORS[point.cycle_phase] || "#94a3b8"
                      : "#e2e8f0",
                  }}
                  title={`${point.displayDate}: ${point.cycle_phase || "no data"}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">{data[0]?.displayDate}</span>
              <span className="text-xs text-muted-foreground">{data[data.length - 1]?.displayDate}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
