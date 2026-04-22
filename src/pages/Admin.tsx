import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Video, CheckCircle2, MessageCircle, ChevronRight, Flower2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PERSONA_CONFIG } from "@/config/personas";

interface Profile {
  id: string;
  username: string;
  user_id: string;
}

interface WellnessProfile {
  life_stage: string;
  primary_dosha: string;
  primary_focus: string[];
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedWellness, setSelectedWellness] = useState<WellnessProfile | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
      else checkAdminRole(session.user);
    });
  }, [navigate]);

  const checkAdminRole = async (user: User) => {
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
  };

  const loadProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('username');
    if (error) {
      console.error('Error loading profiles:', error);
      return;
    }
    setProfiles(data || []);
    if (data && data.length > 0) {
      handleUserSelect(data[0].user_id);
    } else {
      setLoading(false);
    }
  };

  const handleUserSelect = async (userId: string) => {
    setSelectedUserId(userId);
    const { data } = await supabase.from('user_wellness_profiles').select('*').eq('user_id', userId).maybeSingle();
    setSelectedWellness(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><div className="text-slate-500">Loading...</div></div>;
  }

  if (!isAdmin) return null;

  const selectedProfile = profiles.find(p => p.user_id === selectedUserId);
  const personaKey = selectedWellness?.life_stage || 'fertility';
  const config = PERSONA_CONFIG[personaKey] || PERSONA_CONFIG['fertility'];

  return (
    <div className="flex flex-col md:flex-row bg-[#FAFAFA] min-h-[100dvh]">
      <div className="w-full md:w-80 bg-white border-r border-slate-100 flex flex-col shadow-sm z-10 shrink-0">
        <div className="p-6 border-b border-slate-100 bg-[#F4F0F8]/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-light text-slate-800">Mumtaz's Desk</h2>
            <p className="text-sm text-slate-500 mt-1">Reviewing your community</p>
          </div>
          <button onClick={() => navigate('/')} className="p-2 border border-slate-200 rounded-full hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {profiles.map(profile => {
             const isSelected = selectedUserId === profile.user_id;
             return (
              <div 
                key={profile.user_id} 
                onClick={() => handleUserSelect(profile.user_id)}
                className={`p-4 rounded-2xl cursor-pointer shadow-sm transform transition-transform hover:scale-[1.02] border ${isSelected ? 'bg-[#EEF3ED] border-[#7A9684]/50' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-slate-800 text-lg">{profile.username || "Anonymous User"}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Member</p>
                  </div>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#7A9684] mt-1"></span>}
                </div>
              </div>
             );
          })}
        </div>
      </div>

      {selectedProfile ? (
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${config.color} ${config.accent} flex items-center justify-center font-medium text-lg`}>
                {(selectedProfile.username?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-light text-slate-800">{selectedProfile.username || "Anonymous"}</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Phase: {config.title} • Primary Element: {selectedWellness?.primary_dosha || 'Unknown'}
                </p>
              </div>
            </div>
            <button className={`${config.accentBg} text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm flex items-center gap-2 transition-colors hover:opacity-90`}>
              <Video className="w-4 h-4" /> Start Live Consult
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 p-8 overflow-y-auto border-r border-slate-100">
              <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-4">Active Protocol</h3>
              <div className={`${config.color} rounded-[2rem] p-6 border ${config.border} mb-8`}>
                <div className="flex items-center gap-3 mb-5">
                  {React.cloneElement(config.icon as React.ReactElement, { className: `w-7 h-7 ${config.accent}` })}
                  <h4 className="text-xl font-medium text-slate-800">{config.remedy}</h4>
                </div>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li className="flex items-start gap-3 bg-white/50 p-3 rounded-xl">
                    <CheckCircle2 className={`w-5 h-5 ${config.accent} flex-shrink-0`} />
                    <span className="pt-0.5">Assigned daily protocol based on {selectedWellness?.primary_dosha || 'their constitution'}.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 p-3 rounded-xl">
                    <CheckCircle2 className={`w-5 h-5 ${config.accent} flex-shrink-0`} />
                    <span className="pt-0.5">Focusing on {selectedWellness?.primary_focus?.[0] || 'general wellbeing'}.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full lg:w-[400px] flex flex-col bg-[#FAFAFA]">
              <div className="p-5 border-b border-slate-100 bg-white">
                <h3 className="font-medium text-slate-800 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#9B8BA7]" /> Direct Message
                </h3>
              </div>
              
              <div className="flex-1 p-5 overflow-y-auto space-y-6 flex items-center justify-center">
                <div className="text-center text-slate-400 text-sm p-4 bg-white border border-slate-100 rounded-2xl">
                  Messaging system pending database integration.
                </div>
              </div>

              <div className="p-5 bg-white border-t border-slate-100">
                <div className="flex gap-3">
                  <input 
                    disabled
                    type="text" 
                    placeholder="Message your student..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm outline-none transition-all cursor-not-allowed opacity-60"
                  />
                  <button disabled className="bg-slate-300 text-white p-3 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm cursor-not-allowed">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Select a user to view their protocol</p>
        </div>
      )}
    </div>
  );
}
