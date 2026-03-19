import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Video, Upload, Edit, Trash2, Plus, Image, Users, Activity, Heart, BookOpen, TrendingUp, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { AdminPoseImageUploader } from "@/components/AdminPoseImageUploader";

interface Profile {
  id: string;
  username: string;
  user_id: string;
}

interface WellnessEntry {
  id: string;
  entry_date: string;
  cycle_phase: string | null;
  emotional_state: string | null;
  physical_symptoms: string | null;
  daily_practices: any;
}

interface WellnessContent {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  video_url: string | null;
  animation_url: string | null; // Animated instructional videos (all tiers)
  image_url: string | null;
  tier_requirement: string;
  difficulty_level: string | null;
  duration_minutes: number | null;
  detailed_guidance: string | null;
  benefits: string[] | null;
  cycle_phases: string[] | null;
  doshas: string[] | null;
  pregnancy_statuses: string[] | null;
  is_premium: boolean;
  is_active: boolean;
}

// Helper component to show pose image count
const PoseImageCount = ({ contentId }: { contentId: string }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('content_pose_images')
      .select('id', { count: 'exact', head: true })
      .eq('content_id', contentId)
      .then(({ count: imageCount }) => {
        setCount(imageCount || 0);
      });
  }, [contentId]);

  if (count === null) return null;

  return (
    <p className={`text-xs flex items-center gap-1 ${count > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
      <Image className="w-3 h-3" />
      {count > 0 ? `${count} pose images uploaded` : 'No pose images'}
    </p>
  );
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [entries, setEntries] = useState<WellnessEntry[]>([]);
  const [contentList, setContentList] = useState<WellnessContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<WellnessContent | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [animationFile, setAnimationFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingAnimation, setUploadingAnimation] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    content_type: "yoga",
    tier_requirement: "free",
    difficulty_level: "beginner",
    is_premium: false,
    is_active: true,
  });

  const personas = [
    {
      name: "Menarche Journey",
      description: "Young user, Menstrual Cycle focus, Islamic Wisdom, Kapha",
      data: {
        life_stage: "menstrual_cycle",
        is_menarche_journey: true,
        primary_dosha: "kapha",
        spiritual_preference: "islamic",
        onboarding_completed: true,
      }
    },
    {
      name: "Pregnant (Trimester 2)",
      description: "Pregnancy phase, Holistic focus, Both Spiritualities, Pitta",
      data: {
        life_stage: "pregnancy",
        pregnancy_status: "pregnant",
        current_trimester: 2,
        primary_dosha: "pitta",
        spiritual_preference: "both",
        onboarding_completed: true,
      }
    },
    {
      name: "Postpartum (Natural)",
      description: "Post-delivery recovery, Vata-balancing, Both Spiritualities",
      data: {
        life_stage: "postpartum",
        pregnancy_status: "postpartum",
        postpartum_delivery_type: "natural",
        primary_dosha: "vata",
        spiritual_preference: "both",
        onboarding_completed: true,
      }
    },
    {
      name: "Perimenopause",
      description: "Hormonal shifts, Heat management, Both Spiritualities, Pitta",
      data: {
        life_stage: "perimenopause",
        primary_dosha: "pitta",
        spiritual_preference: "both",
        onboarding_completed: true,
      }
    },
    {
      name: "Menopause",
      description: "Transition completed, Structural support, Meditation, Vata",
      data: {
        life_stage: "menopause",
        primary_dosha: "vata",
        spiritual_preference: "meditation",
        onboarding_completed: true,
      }
    }
  ];

  // ── Stats state ──────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    totalUsers: 0,
    onboardedUsers: 0,
    totalEntries: 0,
    totalSaves: 0,
    totalCheckIns: 0,
    totalCompletions: 0,
    byLifeStage: [] as { stage: string; count: number }[],
    topContent: [] as { title: string; saves: number }[],
    recentUsers: [] as { username: string; created_at: string }[],
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (!data) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    
    setIsAdmin(true);
    loadProfiles();
    loadContent();
    loadStats();
  };

  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username');
    
    if (error) {
      console.error('Error loading profiles:', error);
      toast.error('Error loading user profiles');
      return;
    }
    
    setProfiles(data || []);
  };

  const loadUserEntries = async (userId: string) => {
    const { data, error } = await supabase
      .from('wellness_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error loading entries:', error);
      toast.error('Error loading wellness entries');
      return;
    }
    
    setEntries(data || []);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    if (userId) {
      loadUserEntries(userId);
    } else {
      setEntries([]);
    }
  };

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('wellness_content')
      .select('*')
      .order('title');
    
    if (error) {
      console.error('Error loading content:', error);
      toast.error('Error loading wellness content');
      return;
    }
    
    setContentList(data || []);
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const [
        { count: totalUsers },
        { count: onboardedUsers },
        { count: totalEntries },
        { count: totalSaves },
        { count: totalCheckIns },
        { count: totalCompletions },
        { data: lifeStageData },
        { data: recentUsersData },
        { data: topSavedData },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_wellness_profiles').select('*', { count: 'exact', head: true }).eq('onboarding_completed', true),
        supabase.from('wellness_entries').select('*', { count: 'exact', head: true }),
        supabase.from('user_saved_content').select('*', { count: 'exact', head: true }),
        supabase.from('quick_checkin_logs').select('*', { count: 'exact', head: true }),
        supabase.from('user_content_progress').select('*', { count: 'exact', head: true }).eq('completed', true),
        supabase.from('user_wellness_profiles').select('life_stage').not('life_stage', 'is', null),
        supabase.from('profiles').select('username, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('user_saved_content').select('content_id').limit(200),
      ]);

      // Tally life stages
      const stageCounts: Record<string, number> = {};
      (lifeStageData || []).forEach((row: any) => {
        if (row.life_stage) {
          stageCounts[row.life_stage] = (stageCounts[row.life_stage] || 0) + 1;
        }
      });
      const byLifeStage = Object.entries(stageCounts)
        .map(([stage, count]) => ({ stage, count }))
        .sort((a, b) => b.count - a.count);

      // Tally top saved content
      const contentCounts: Record<string, number> = {};
      (topSavedData || []).forEach((row: any) => {
        if (row.content_id) {
          contentCounts[row.content_id] = (contentCounts[row.content_id] || 0) + 1;
        }
      });
      const topContentIds = Object.entries(contentCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);

      let topContent: { title: string; saves: number }[] = [];
      if (topContentIds.length > 0) {
        const { data: contentTitles } = await supabase
          .from('wellness_content')
          .select('id, title')
          .in('id', topContentIds);
        topContent = topContentIds.map((id) => ({
          title: contentTitles?.find((c: any) => c.id === id)?.title || 'Unknown',
          saves: contentCounts[id],
        }));
      }

      setStats({
        totalUsers: totalUsers || 0,
        onboardedUsers: onboardedUsers || 0,
        totalEntries: totalEntries || 0,
        totalSaves: totalSaves || 0,
        totalCheckIns: totalCheckIns || 0,
        totalCompletions: totalCompletions || 0,
        byLifeStage,
        topContent,
        recentUsers: (recentUsersData || []).map((u: any) => ({
          username: u.username,
          created_at: u.created_at,
        })),
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleVideoUpload = async (contentId: string) => {
    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    try {
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${contentId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('wellness-videos')
        .upload(filePath, videoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wellness-videos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('wellness_content')
        .update({ video_url: publicUrl })
        .eq('id', contentId);

      if (updateError) throw updateError;

      toast.success('Video uploaded successfully');
      loadContent();
      setVideoFile(null);
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleAnimationUpload = async (contentId: string) => {
    if (!animationFile) {
      toast.error("Please select an animation file");
      return;
    }

    setUploadingAnimation(true);
    try {
      const fileExt = animationFile.name.split('.').pop();
      const fileName = `animation-${contentId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('wellness-videos')
        .upload(filePath, animationFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wellness-videos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('wellness_content')
        .update({ animation_url: publicUrl })
        .eq('id', contentId);

      if (updateError) throw updateError;

      toast.success('Animation uploaded successfully');
      loadContent();
      setAnimationFile(null);
    } catch (error) {
      console.error('Error uploading animation:', error);
      toast.error('Failed to upload animation');
    } finally {
      setUploadingAnimation(false);
    }
  };

  const handleUpdateContent = async (content: Partial<WellnessContent>) => {
    if (!selectedContent) return;

    try {
      const { error } = await supabase
        .from('wellness_content')
        .update(content)
        .eq('id', selectedContent.id);

      if (error) throw error;

      toast.success('Content updated successfully');
      loadContent();
      setEditDialogOpen(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this content?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('wellness_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      toast.success('Content deleted successfully');
      loadContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const handleCreateContent = async () => {
    if (!newContent.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('wellness_content')
        .insert({
          title: newContent.title.trim(),
          description: newContent.description.trim() || null,
          content_type: newContent.content_type,
          tier_requirement: newContent.tier_requirement,
          difficulty_level: newContent.difficulty_level,
          is_premium: newContent.is_premium,
          is_active: newContent.is_active,
        });

      if (error) throw error;

      toast.success('Content created successfully');
      loadContent();
      setCreateDialogOpen(false);
      setNewContent({
        title: "",
        description: "",
        content_type: "yoga",
        tier_requirement: "free",
        difficulty_level: "beginner",
        is_premium: false,
        is_active: true,
      });
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    }
  };

  const handleResetUser = async (userId: string) => {
    if (!userId) {
      toast.error("Please select a user first");
      return;
    }

    const selectedProfile = profiles.find(p => p.user_id === userId);
    if (!selectedProfile) return;

    const confirmed = window.confirm(
      `Reset all data for ${selectedProfile.username}?\n\nThis will:\n- Reset onboarding status\n- Clear wellness profile\n- Delete all wellness entries\n- Clear saved content\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Delete wellness entries
      const { error: entriesError } = await supabase
        .from('wellness_entries')
        .delete()
        .eq('user_id', userId);

      if (entriesError) throw entriesError;

      // Delete saved content
      const { error: savedContentError } = await supabase
        .from('user_saved_content')
        .delete()
        .eq('user_id', userId);

      if (savedContentError) throw savedContentError;

      // Delete daily recommendations
      const { error: recsError } = await supabase
        .from('daily_recommendations')
        .delete()
        .eq('user_id', userId);

      if (recsError) throw recsError;

      // Reset wellness profile
      const { error: profileError } = await supabase
        .from('user_wellness_profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast.success(`User ${selectedProfile.username} has been reset to first-time state`);
      setEntries([]);
    } catch (error) {
      console.error('Error resetting user:', error);
      toast.error('Failed to reset user data');
    }
  };

  const handleSetPersona = async (userId: string, personaName: string, personaData: any) => {
    if (!userId) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_wellness_profiles')
        .update(personaData)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`Persona set to "${personaName}" for the selected user`);
      
      // Optionally refresh the view if needed, or redirect
      // navigate("/");
    } catch (error) {
      console.error('Error setting persona:', error);
      toast.error('Failed to update persona');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wellness-beige">
        <div className="text-wellness-taupe text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-wellness-beige">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 pt-24">
        <Card className="mb-6 bg-wellness-warm border-wellness-taupe/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-wellness-taupe">
                Admin Dashboard
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage users and wellness content
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-wellness-taupe/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tracker
            </Button>
          </CardHeader>
        </Card>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">📊 Statistics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
          </TabsList>

          {/* ── Statistics Tab ──────────────────────────────────────────────── */}
          <TabsContent value="stats" className="space-y-6">
            {statsLoading ? (
              <div className="flex items-center justify-center py-16 text-wellness-taupe">
                Loading statistics…
              </div>
            ) : (
              <>
                {/* ── Headline metric cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Card className="border-mumtaz-lilac/20 bg-gradient-to-br from-mumtaz-lilac/10 to-background shadow">
                    <CardContent className="pt-5 pb-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-mumtaz-lilac">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Total Users</span>
                      </div>
                      <p className="text-4xl font-bold text-mumtaz-plum">{stats.totalUsers}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-wellness-sage/20 bg-gradient-to-br from-wellness-sage/10 to-background shadow">
                    <CardContent className="pt-5 pb-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-wellness-sage">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Onboarded</span>
                      </div>
                      <p className="text-4xl font-bold text-mumtaz-plum">{stats.onboardedUsers}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.totalUsers > 0 ? Math.round((stats.onboardedUsers / stats.totalUsers) * 100) : 0}% completion rate
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-wellness-taupe/20 bg-gradient-to-br from-wellness-taupe/10 to-background shadow">
                    <CardContent className="pt-5 pb-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-wellness-taupe">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Wellness Entries</span>
                      </div>
                      <p className="text-4xl font-bold text-mumtaz-plum">{stats.totalEntries}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-mumtaz-lilac/20 bg-gradient-to-br from-mumtaz-lilac/8 to-background shadow">
                    <CardContent className="pt-5 pb-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-mumtaz-lilac">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Saved Content</span>
                      </div>
                      <p className="text-4xl font-bold text-mumtaz-plum">{stats.totalSaves}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-wellness-sage/20 bg-gradient-to-br from-wellness-sage/8 to-background shadow">
                    <CardContent className="pt-5 pb-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-wellness-sage">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Check-ins</span>
                      </div>
                      <p className="text-4xl font-bold text-mumtaz-plum">{stats.totalCheckIns}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-wellness-taupe/20 bg-gradient-to-br from-wellness-taupe/8 to-background shadow">
                    <CardContent className="pt-5 pb-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-wellness-taupe">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Completions</span>
                      </div>
                      <p className="text-4xl font-bold text-mumtaz-plum">{stats.totalCompletions}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* ── Lower row: Life Stage · Top Content · Recent Users ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Life stage breakdown */}
                  <Card className="border-wellness-taupe/20 shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-wellness-taupe flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Users by Life Stage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats.byLifeStage.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No data yet</p>
                      ) : (
                        <div className="space-y-2">
                          {stats.byLifeStage.map(({ stage, count }) => (
                            <div key={stage} className="flex items-center justify-between">
                              <span className="text-sm capitalize text-wellness-taupe">
                                {typeof stage === 'string' ? stage.replace(/_/g, ' ') : String(stage)}
                              </span>
                              <span className="text-sm font-semibold bg-mumtaz-lilac/15 text-mumtaz-plum px-2 py-0.5 rounded-full">
                                {count}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Top saved content */}
                  <Card className="border-wellness-taupe/20 shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-wellness-taupe flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Most Saved Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats.topContent.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No data yet</p>
                      ) : (
                        <div className="space-y-2">
                          {stats.topContent.map(({ title, saves }, i) => (
                            <div key={title} className="flex items-start justify-between gap-2">
                              <span className="text-sm text-wellness-taupe leading-snug">
                                <span className="text-muted-foreground mr-1">{i + 1}.</span>
                                {title}
                              </span>
                              <span className="text-sm font-semibold bg-wellness-sage/15 text-wellness-taupe px-2 py-0.5 rounded-full shrink-0">
                                {saves}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent sign-ups */}
                  <Card className="border-wellness-taupe/20 shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-wellness-taupe flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Recent Sign-ups
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats.recentUsers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No users yet</p>
                      ) : (
                        <div className="space-y-2">
                          {stats.recentUsers.map(({ username, created_at }) => (
                            <div key={username} className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-mumtaz-plum truncate">
                                {username}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {new Date(created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                </div>

                {/* Refresh button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadStats}
                    className="border-mumtaz-lilac/30 text-mumtaz-plum hover:bg-mumtaz-lilac/10"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Refresh Stats
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">

        <Card className="border-wellness-taupe/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-wellness-taupe">User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-wellness-taupe mb-2">
                Select User
              </label>
              <Select value={selectedUserId} onValueChange={handleUserSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user to view their data" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.user_id}>
                      {profile.username} ({profile.user_id.slice(0, 8)}...)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUserId && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-wellness-sage/10 rounded-lg border border-wellness-sage/20">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-wellness-taupe">Reset Test User</p>
                    <p className="text-xs text-wellness-taupe/70 mt-1">
                      Clear all data and return user to onboarding state
                    </p>
                  </div>
                  <Button
                    onClick={() => handleResetUser(selectedUserId)}
                    variant="outline"
                    className="border-wellness-sage text-wellness-sage hover:bg-wellness-sage/10"
                  >
                    Reset User
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-wellness-taupe flex items-center gap-2">
                       <Plus className="w-5 h-5" />
                       Persona Switcher (Dev Mode)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Instantly update your profile to test different app states
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personas.map((persona) => (
                      <Card key={persona.name} className="border-wellness-taupe/10 hover:border-mumtaz-lilac/30 transition-all cursor-pointer overflow-hidden group">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                          <div>
                            <h4 className="font-bold text-mumtaz-plum group-hover:text-accent transition-colors">{persona.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {persona.description}
                            </p>
                          </div>
                          <Button 
                            className="w-full mt-4 bg-mumtaz-lilac/20 hover:bg-mumtaz-lilac/40 text-mumtaz-plum border-none text-xs h-8"
                            onClick={() => handleSetPersona(selectedUserId, persona.name, persona.data)}
                          >
                            Switch to this Persona
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
            </Card>

            {selectedUserId && entries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-wellness-taupe">Recent Entries (Last 10)</h2>
            {entries.map((entry) => (
              <Card key={entry.id} className="border-wellness-taupe/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-wellness-taupe" />
                      {new Date(entry.entry_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardTitle>
                    {entry.cycle_phase && (
                      <span className="px-3 py-1 bg-wellness-pink rounded-full text-sm font-medium">
                        {entry.cycle_phase}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.emotional_state && (
                    <div>
                      <p className="text-sm font-medium text-wellness-taupe">Emotional State:</p>
                      <p className="text-sm text-muted-foreground">{entry.emotional_state}</p>
                    </div>
                  )}
                  {entry.physical_symptoms && (
                    <div>
                      <p className="text-sm font-medium text-wellness-taupe">Physical Symptoms:</p>
                      <p className="text-sm text-muted-foreground">{entry.physical_symptoms}</p>
                    </div>
                  )}
                  {entry.daily_practices && Object.keys(entry.daily_practices).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-wellness-taupe mb-2">Daily Practices:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(entry.daily_practices).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex items-center gap-2 text-muted-foreground">
                            <span className={value?.status ? "text-green-600" : "text-gray-400"}>
                              {value?.status ? "✓" : "○"}
                            </span>
                            <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
            )}

            {selectedUserId && entries.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No wellness entries found for this user.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="border-wellness-taupe/20 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-wellness-taupe flex items-center gap-2">
                  <Video className="w-6 h-6" />
                  Wellness Content Library
                </CardTitle>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5">
                      <Plus className="w-4 h-4" />
                      New Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create New Content</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={newContent.title}
                          onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                          placeholder="e.g. Gentle Morning Yoga Flow"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newContent.description}
                          onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                          placeholder="A gentle yoga flow to start your day..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Content Type</Label>
                          <Select
                            value={newContent.content_type}
                            onValueChange={(v) => setNewContent({ ...newContent, content_type: v })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yoga">Yoga</SelectItem>
                              <SelectItem value="nutrition">Nutrition</SelectItem>
                              <SelectItem value="ayurveda">Ayurveda</SelectItem>
                              <SelectItem value="meditation">Meditation</SelectItem>
                              <SelectItem value="breathwork">Breathwork</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tier</Label>
                          <Select
                            value={newContent.tier_requirement}
                            onValueChange={(v) => setNewContent({ ...newContent, tier_requirement: v })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <Select
                            value={newContent.difficulty_level}
                            onValueChange={(v) => setNewContent({ ...newContent, difficulty_level: v })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 flex flex-col justify-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newContent.is_premium}
                              onChange={(e) => setNewContent({ ...newContent, is_premium: e.target.checked })}
                              className="rounded"
                            />
                            <span className="text-sm">Premium content</span>
                          </label>
                        </div>
                      </div>
                      <Button onClick={handleCreateContent} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Content
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentList.map((content) => (
                    <Card key={content.id} className="border-wellness-sage/20">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg text-wellness-taupe">
                                {content.title}
                              </h3>
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                {content.tier_requirement}
                              </span>
                              <span className="px-2 py-1 bg-wellness-sage/20 text-wellness-taupe text-xs rounded-full">
                                {content.content_type}
                              </span>
                              {content.is_premium && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                  Premium
                                </span>
                              )}
                              {!content.is_active && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {content.description}
                            </p>
                            <div className="flex flex-col gap-1">
                              {content.animation_url ? (
                                <p className="text-xs text-blue-600 flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  Animation uploaded (All Tiers)
                                </p>
                              ) : (
                                <p className="text-xs text-amber-600">No animation uploaded</p>
                              )}
                              {content.video_url ? (
                                <p className="text-xs text-purple-600 flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  Live video uploaded (Premium Only)
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground">No live video</p>
                              )}
                              <PoseImageCount contentId={content.id} />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Dialog open={editDialogOpen && selectedContent?.id === content.id} 
                                    onOpenChange={(open) => {
                                      setEditDialogOpen(open);
                                      if (!open) setSelectedContent(null);
                                    }}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedContent(content)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Content: {content.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="animation-upload" className="flex items-center gap-2">
                                      Upload Animation
                                      <span className="text-xs text-muted-foreground font-normal">(Available to all tiers)</span>
                                    </Label>
                                    <div className="flex gap-2">
                                      <Input
                                        id="animation-upload"
                                        type="file"
                                        accept="video/mp4,video/webm,video/quicktime,image/gif"
                                        onChange={(e) => setAnimationFile(e.target.files?.[0] || null)}
                                        disabled={uploadingAnimation}
                                      />
                                      <Button
                                        onClick={() => handleAnimationUpload(content.id)}
                                        disabled={!animationFile || uploadingAnimation}
                                        size="sm"
                                      >
                                        <Upload className="w-4 h-4 mr-1" />
                                        {uploadingAnimation ? 'Uploading...' : 'Upload'}
                                      </Button>
                                    </div>
                                    {content.animation_url && (
                                      <p className="text-xs text-muted-foreground">
                                        Current: {content.animation_url.split('/').pop()}
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="video-upload" className="flex items-center gap-2">
                                      Upload Live Video
                                      <span className="text-xs text-purple-600 font-normal">(Premium Only)</span>
                                    </Label>
                                    <div className="flex gap-2">
                                      <Input
                                        id="video-upload"
                                        type="file"
                                        accept="video/mp4,video/webm,video/quicktime"
                                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                        disabled={uploading}
                                      />
                                      <Button
                                        onClick={() => handleVideoUpload(content.id)}
                                        disabled={!videoFile || uploading}
                                        size="sm"
                                      >
                                        <Upload className="w-4 h-4 mr-1" />
                                        {uploading ? 'Uploading...' : 'Upload'}
                                      </Button>
                                    </div>
                                    {content.video_url && (
                                      <p className="text-xs text-muted-foreground">
                                        Current: {content.video_url.split('/').pop()}
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="video-url" className="flex items-center gap-2">
                                      Video URL (Direct Link)
                                      <span className="text-xs text-purple-600 font-normal">(Premium Only)</span>
                                    </Label>
                                    <Input
                                      id="video-url"
                                      type="url"
                                      placeholder="https://example.com/video.mp4"
                                      defaultValue={content.video_url || ''}
                                      onChange={(e) => {
                                        if (selectedContent) {
                                          setSelectedContent({...selectedContent, video_url: e.target.value || null});
                                        }
                                      }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Enter a direct URL to a video file, or upload above
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                      id="title"
                                      defaultValue={content.title}
                                      onChange={(e) => {
                                        if (selectedContent) {
                                          setSelectedContent({...selectedContent, title: e.target.value});
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                      id="description"
                                      defaultValue={content.description || ''}
                                      onChange={(e) => {
                                        if (selectedContent) {
                                          setSelectedContent({...selectedContent, description: e.target.value});
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="guidance">Detailed Guidance</Label>
                                    <Textarea
                                      id="guidance"
                                      defaultValue={content.detailed_guidance || ''}
                                      rows={6}
                                      onChange={(e) => {
                                        if (selectedContent) {
                                          setSelectedContent({...selectedContent, detailed_guidance: e.target.value});
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="tier">Tier Requirement</Label>
                                      <Select
                                        defaultValue={content.tier_requirement}
                                        onValueChange={(value) => {
                                          if (selectedContent) {
                                            setSelectedContent({...selectedContent, tier_requirement: value});
                                          }
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="free">Free</SelectItem>
                                          <SelectItem value="basic">Basic</SelectItem>
                                          <SelectItem value="standard">Standard</SelectItem>
                                          <SelectItem value="premium">Premium</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="difficulty">Difficulty</Label>
                                      <Select
                                        defaultValue={content.difficulty_level || 'beginner'}
                                        onValueChange={(value) => {
                                          if (selectedContent) {
                                            setSelectedContent({...selectedContent, difficulty_level: value});
                                          }
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="beginner">Beginner</SelectItem>
                                          <SelectItem value="intermediate">Intermediate</SelectItem>
                                          <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  {/* Pose Images Section */}
                                  <div className="border-t pt-4">
                                    <AdminPoseImageUploader 
                                      contentId={content.id} 
                                      contentTitle={content.title}
                                    />
                                  </div>

                                  <Button
                                    onClick={() => handleUpdateContent(selectedContent!)}
                                    className="w-full"
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteContent(content.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
