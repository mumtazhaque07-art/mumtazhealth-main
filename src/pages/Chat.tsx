import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Send, Loader2, Heart, Leaf, Wind, Moon, BookOpen, Users, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PERSONA_CONFIG } from "@/config/personas";
import { useLifeMap } from "@/contexts/LifeMapContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UserProfile {
  username: string;
  primaryDosha?: string;
  secondaryDosha?: string;
  lifeStage?: string;
  lifePhases?: string[];
  primaryFocus?: string[];
  pregnancyTrimester?: number;
  spiritualPreference?: string;
  isMenarcheJourney?: boolean;
  postpartumDeliveryType?: string;
}

const QUICK_ACTIONS = [
  { id: 'checkin', label: 'Quick check-in', icon: Heart, message: "I'd like to do a quick check-in with myself today." },
  { id: 'elements', label: 'My Elements', icon: Leaf, message: "Can you help me understand my primary elements (Dosha)?" },
  { id: 'spiritual', label: 'Spiritual support', icon: Moon, message: "I'm looking for some spiritual support or grounding today." },
];

const STORAGE_KEYS = {
  CONVERSATION_ID: 'mumtaz_guide_conversation_id',
  MESSAGES: 'mumtaz_guide_messages',
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [spiritualPath, setSpiritualPath] = useState('universal');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { lifeStage } = useLifeMap();
  const personaId = Object.keys(PERSONA_CONFIG).includes(lifeStage || '') ? lifeStage : 'fertility';
  const config = PERSONA_CONFIG[personaId || 'fertility'];

  useEffect(() => {
    // Load persisted state
    const savedConversationId = localStorage.getItem(STORAGE_KEYS.CONVERSATION_ID);
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (savedConversationId) setConversationId(savedConversationId);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    }
    fetchUserProfile();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, wellnessRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("user_wellness_profiles").select("*").eq("user_id", user.id).single()
      ]);

      if (profileRes.data) {
        setUserProfile({
          username: profileRes.data.username || "there",
          primaryDosha: wellnessRes.data?.primary_dosha,
          secondaryDosha: wellnessRes.data?.secondary_dosha,
          lifeStage: wellnessRes.data?.life_stage,
          lifePhases: wellnessRes.data?.life_phases,
          primaryFocus: wellnessRes.data?.primary_focus,
          pregnancyTrimester: wellnessRes.data?.current_trimester,
          spiritualPreference: wellnessRes.data?.spiritual_preference,
          isMenarcheJourney: wellnessRes.data?.is_menarche_journey,
          postpartumDeliveryType: wellnessRes.data?.postpartum_delivery_type,
        });

        // Initialize greeting if empty
        if (!localStorage.getItem(STORAGE_KEYS.MESSAGES) || JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]").length === 0) {
           const greeting = spiritualPath === 'islamic' ? 'Salam' : 'Welcome';
           setMessages([{
             role: "assistant",
             content: `${greeting} ${profileRes.data.username || 'there'}, I am the sanctuary guide, here to support your holistic wellness journey alongside Mumtaz's teachings.\n\nYou can ask me for gentle movement, nutrition advice, or emotional grounding. How are you feeling today? 💜`
           }]);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const saveMessage = async (message: Message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !conversationId) return;

      const { error } = await supabase.from("chat_messages").insert({
        user_id: user.id,
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const createInitialConversation = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.from("chat_conversations").insert({
        user_id: user.id,
        preview: "Wellness Session"
      }).select().single();

      if (error) throw error;
      
      setConversationId(data.id);
      localStorage.setItem(STORAGE_KEYS.CONVERSATION_ID, data.id);
      return data.id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  };

  const sendMessage = useCallback(async (messageText?: string, isRetry = false) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || loading) return;

    let activeConvId = conversationId;
    if (!activeConvId) {
      activeConvId = await createInitialConversation();
      if (!activeConvId) {
        toast({ title: "Error", description: "Failed to start conversation. Please try again.", variant: "destructive" });
        return;
      }
    }

    const userMessage: Message = { role: "user", content: textToSend };
    
    if (!isRetry) {
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      await saveMessage(userMessage);
    }
    
    setLoading(true);

    try {
      const rawMessages = isRetry ? messages : [...messages, userMessage];
      const payloadMessages: any[] = [];
      
      for (const msg of rawMessages) {
        if (msg.role !== 'user' && msg.role !== 'assistant') continue;
        
        if (payloadMessages.length === 0) {
          if (msg.role === 'user') {
            payloadMessages.push({ role: msg.role, content: msg.content });
          }
        } else {
          const lastMsg = payloadMessages[payloadMessages.length - 1];
          if (lastMsg.role === msg.role) {
            lastMsg.content += "\n\n" + msg.content;
          } else {
            payloadMessages.push({ role: msg.role, content: msg.content });
          }
        }
      }

      if (payloadMessages.length === 0) {
        payloadMessages.push({ role: 'user', content: textToSend });
      }

      const { data, error } = await supabase.functions.invoke("mumtaz-wisdom-guide", {
        body: {
          messages: payloadMessages,
          userName: userProfile?.username,
          primaryDosha: userProfile?.primaryDosha,
          secondaryDosha: userProfile?.secondaryDosha,
          lifeStage: userProfile?.lifeStage,
          lifePhases: userProfile?.lifePhases,
          primaryFocus: userProfile?.primaryFocus,
          pregnancyTrimester: userProfile?.pregnancyTrimester,
          spiritualPreference: spiritualPath === 'islamic' ? 'islamic' : userProfile?.spiritualPreference,
          isMenarcheJourney: userProfile?.isMenarcheJourney,
          postpartumDeliveryType: userProfile?.postpartumDeliveryType,
        },
      });

      if (error) throw error;
      
      if (data?.error) {
        if (!isRetry && retryCount < 1) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => sendMessage(textToSend, true), 1500);
          return;
        }
        throw new Error(data.error);
      }

      const assistantMessage: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
      setRetryCount(0);

    } catch (error: any) {
      if (!isRetry && retryCount < 1) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => sendMessage(textToSend, true), 1500);
        return;
      }
      
      const errorMessage = error?.message || "I'm having trouble connecting right now.";
      toast({
        title: "Connection Issue",
        description: errorMessage.length > 100 ? "I'm having trouble responding right now. Please try again in a moment." : errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, conversationId, messages, userProfile, retryCount, spiritualPath]);

  const handleQuickAction = (action: any) => {
    sendMessage(action.message);
  };

  const resetChat = () => {
    localStorage.removeItem(STORAGE_KEYS.CONVERSATION_ID);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    setConversationId(null);
    setMessages([]);
    fetchUserProfile(); // Re-trigger greeting
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-slate-50/50 relative overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 pt-12 border-b border-slate-100 bg-white flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center`}>
            <Sparkles className={`w-6 h-6 ${config.accent}`} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-800">Sanctuary Guide</h2>
            <p className="text-xs text-slate-500">Your companion between sessions</p>
          </div>
        </div>

        {/* Path Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-full self-start">
          <button 
            onClick={() => { setSpiritualPath('universal'); resetChat(); }}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${spiritualPath === 'universal' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Universal
          </button>
          <button 
            onClick={() => { setSpiritualPath('islamic'); resetChat(); }}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${spiritualPath === 'islamic' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Islamic Path
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-40">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? `${config.accentBg} text-white rounded-tr-sm` 
                : 'bg-white border text-slate-700 rounded-tl-sm border-slate-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
              <Loader2 className={`w-4 h-4 animate-spin ${config.accent}`} />
              <span className="text-xs text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions & Input Area */}
      <div className="absolute inset-x-0 bottom-[84px] p-4 bg-white border-t border-slate-100 shrink-0">
        {messages.length <= 2 && !loading && (
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
            {QUICK_ACTIONS.map(action => (
              <button 
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <action.icon className={`w-3 h-3 ${config.accent}`} />
                {action.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask for guidance..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:ring-2 outline-none transition-all"
          />
          <button 
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-colors text-white ${
              !input.trim() || loading ? 'bg-slate-300' : config.accentBg
            }`}
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Visual Bottom Navigation */}
      <nav className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-8 py-5 flex justify-between items-center pb-8 z-40">
        {[
          { id: 'home', icon: <Leaf />, path: '/' },
          { id: 'journal', icon: <BookOpen />, path: '/tracker' },
          { id: 'bookings', icon: <Users />, path: '/bookings' },
          { id: 'chat', icon: <MessageCircle />, path: '/chat' },
        ].map((item) => {
          const isActive = item.id === 'chat';
          return (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`transition-all duration-300 relative ${
                isActive ? `${config.accent} scale-110` : 'text-slate-300 hover:text-slate-400'
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement, { className: 'w-7 h-7 stroke-[1.5]' })}
              {isActive && (
                <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${config.accentBg}`} />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  );
}
