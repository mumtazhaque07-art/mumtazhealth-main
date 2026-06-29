import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  content_title: string;
  reflection: string;
  created_at: string;
}

export default function JournalHistory() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_journal_entries" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        // If the table doesn't exist yet, just fail silently and show empty
        console.error("Error fetching journal entries:", error);
      } else {
        setEntries(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wellness-sand/30 pb-20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            My Private Journal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            A sacred space to reflect back on your holistic journey, thoughts, and emotional shifts over time.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <Card className="bg-white shadow-sm border-wellness-sage/20">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="h-12 w-12 text-wellness-sage/50 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your journal is waiting</h3>
              <p className="text-gray-500 max-w-sm">
                After you complete a practice in the Content Library, click "Log My Journey" to save your reflections here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="bg-white shadow-sm hover:shadow-md transition-shadow border-wellness-sage/20">
                <CardHeader className="pb-3 border-b border-gray-100 bg-wellness-sage/5">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {entry.content_title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                      <Calendar className="h-3.5 w-3.5 mr-2" />
                      {format(new Date(entry.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {entry.reflection}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
