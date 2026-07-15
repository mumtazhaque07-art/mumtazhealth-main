import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function UserInbox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data: profile } = await supabase
      .from('user_wellness_profiles')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .maybeSingle();
      
    setIsPremium(profile?.subscription_tier === 'premium');
    loadMessages(user.id);
  };

  const loadMessages = async (uid: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', uid)
      .eq('conversation_id', 'direct_inbox')
      .order('created_at', { ascending: true });
      
    setMessages(data || []);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;
    
    const msgContent = newMessage.trim();
    const msg = {
      content: msgContent,
      role: 'user',
      user_id: userId,
      conversation_id: 'direct_inbox'
    };
    
    const { error } = await supabase.from('chat_messages').insert(msg);
    if (!error) {
      setMessages([...messages, { ...msg, id: Date.now().toString(), created_at: new Date().toISOString() } as any]);
      setNewMessage("");
      
      // Fire and forget email notification to Admin
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          supabase.functions.invoke('send-chat-notification', {
            body: {
              userName: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'Student',
              userEmail: data.user.email,
              messagePreview: msgContent
            }
          }).catch(err => console.error("Notification error:", err));
        }
      });
    } else {
      toast({ title: "Failed to send message", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading inbox...</div>;
  }

  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const isLockedOut = isPremium === false && userMessageCount >= 3;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-wellness-sage/20 shadow-sm flex flex-col h-[600px]">
      <div className="p-6 border-b border-slate-100 bg-wellness-sage/5 flex items-center gap-4">
        <div className="w-12 h-12 bg-wellness-plum/10 rounded-full flex items-center justify-center">
          <span className="text-wellness-plum font-serif text-xl">M</span>
        </div>
        <div>
          <h3 className="font-serif text-xl text-gray-900">Mumtaz Haque</h3>
          <p className="text-sm text-gray-500">Your Personal Guide</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm m-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-sm">
            <p>Welcome to your private inbox.</p>
            <p className="mt-2 text-xs">This is a direct line to Mumtaz. Share how you're feeling or ask any questions about your practice.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-wellness-sage text-white self-end rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-800 self-start shadow-sm rounded-tl-sm'}`}>
              <p className="text-[15px] leading-relaxed">{msg.content}</p>
              <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>

      {isLockedOut ? (
        <div className="p-8 bg-wellness-sage/5 border-t border-slate-100 text-center">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
            <Lock className="w-5 h-5 text-wellness-sage" />
          </div>
          <h4 className="font-serif text-lg text-gray-900 mb-2">Continue Your Journey</h4>
          <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
            You've reached your free trial limit of 3 direct messages. Upgrade to Premium for unlimited 1-on-1 coaching and personalized support.
          </p>
          <Button onClick={() => navigate('/pricing')} className="bg-wellness-plum hover:bg-wellness-plum/90 text-white rounded-full px-6 shadow-sm transition-transform hover:scale-105">
            Upgrade to Premium
          </Button>
        </div>
      ) : (
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message to Mumtaz..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-6 text-[15px] outline-none transition-all focus-visible:ring-1 focus-visible:ring-wellness-sage focus-visible:border-wellness-sage"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-wellness-sage hover:bg-wellness-sage/90 text-white w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-all hover:-translate-y-1">
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
