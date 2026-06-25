import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, RefreshCw, Compass, ArrowRight } from 'lucide-react';

interface AIAssistantProps {
  onActionClick: (action: string) => void;
  ticketId?: string;
  seatInfo?: string;
}

export default function AIAssistant({ onActionClick, ticketId, seatInfo }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "### Welcome to the FIFA HACKUP Smart Stadium! 🏟️\n\nI am your central **AI Stadium Orchestrator**. I coordinate our stadium's smart network of specialized agents to optimize your matchday experience:\n\n* 🚇 **Travel Planner Agent**: Custom Zurich itineraries, flights, and hotels\n* 🍔 **Food Concierge Agent**: Seedless food pairings, combos, and seating orders\n* 🎟️ **SeatServe Agent**: Best seat recommendations & visual angle POVs\n* 🗺️ **Navigation Agent**: Step-by-step gate and stadium services routes\n* 🚨 **Emergency Response Agent**: Direct priority assistance & security team dispatch\n* 📊 **Crowd Intelligence Agent**: Real-time queue forecasts & entrance congestion reviews\n\nHow can I elevate your SwissArena matchday today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activeAgent: 'orchestrator',
      agentName: 'Stadium AI Orchestrator',
      suggestedActions: ["Book a Seat Ticket", "Order Alpine Food", "Plan Zurich Travel", "Request Medical Help"],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState('orchestrator');
  const [activeAgentName, setActiveAgentName] = useState('Stadium AI Orchestrator');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          context: { ticketId, seatInfo },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          activeAgent: data.activeAgent,
          agentName: data.agentName,
          suggestedActions: data.suggestedActions,
          data: data.data,
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (data.activeAgent) setActiveAgentId(data.activeAgent);
        if (data.agentName) setActiveAgentName(data.agentName);
      } else {
        throw new Error(data.error || 'Failed to fetch AI response');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: "🚨 **Service Interrupted**\n\nOur neural stadium network is experiencing peak crowd interference. I am active on local backup mode! Let me guide you through seat booking and pre-orders directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeAgent: 'orchestrator',
        agentName: 'Operations Backup Agent',
        suggestedActions: ["Book a Seat Ticket", "Order Alpine Food"],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClickInternal = (action: string) => {
    // Check if it corresponds to an applet tab change, otherwise send as chat prompt
    if (action === "Book a Seat Ticket" || action === "Book a Seat") {
      onActionClick("Seat Booking");
    } else if (action === "Order Alpine Food" || action === "Order Alpine Burger") {
      onActionClick("Food Ordering");
    } else if (action === "Plan Zurich Travel") {
      onActionClick("Travel Guide");
    } else if (action === "Request Medical Help" || action === "Call Stadium Security") {
      onActionClick("Operations Desk");
    } else {
      handleSendMessage(action);
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'travel': return 'from-sky-500 to-indigo-600 text-sky-400 border-sky-500/20';
      case 'food': return 'from-orange-500 to-amber-600 text-orange-400 border-orange-500/20';
      case 'seat': return 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/20';
      case 'navigation': return 'from-purple-500 to-pink-600 text-purple-400 border-purple-500/20';
      case 'crowd': return 'from-indigo-500 to-violet-600 text-indigo-400 border-indigo-500/20';
      case 'emergency': return 'from-rose-600 to-red-700 text-rose-400 border-red-500/40 animate-pulse';
      case 'analytics': return 'from-cyan-500 to-blue-600 text-cyan-400 border-cyan-500/20';
      default: return 'from-slate-700 to-slate-800 text-slate-400 border-slate-700/20';
    }
  };

  return (
    <div id="ai-assistant-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)]">
      {/* LEFT PANEL: ACTIVE CONTEXT & MULTI-AGENT TELEMETRY */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2 no-scrollbar">
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            AI Orchestration System
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A state-of-the-art multi-agent framework routing your stadium requests instantly to specialized backend nodes.
          </p>

          <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/20 space-y-3">
            <span className="text-3xs text-slate-400 uppercase tracking-widest font-bold block">Current Session Context</span>
            <div className="text-xs space-y-2 font-mono text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Active Ticket:</span>
                <span className="text-emerald-500 font-bold">{ticketId || "No Ticket Loaded"}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Seat:</span>
                <span className="text-blue-500">{seatInfo || "No Seat Booked"}</span>
              </div>
              <div className="flex justify-between">
                <span>Routing Node:</span>
                <span className="text-purple-400">{activeAgentName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AGENTS PIPELINE STATUS */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 flex-1">
          <span className="text-2xs text-slate-400 uppercase tracking-widest font-bold block">Agentic Network Telemetry</span>
          
          <div className="space-y-3">
            {[
              { id: 'travel', name: 'Travel Planner Agent', status: 'Standby' },
              { id: 'food', name: 'Food Concierge Agent', status: 'Standby' },
              { id: 'seat', name: 'SeatServe Agent', status: 'Standby' },
              { id: 'navigation', name: 'Navigation Agent', status: 'Standby' },
              { id: 'crowd', name: 'Crowd Agent', status: 'Standby' },
              { id: 'feedback', name: 'Feedback Agent', status: 'Standby' },
              { id: 'analytics', name: 'Analytics Agent', status: 'Standby' },
              { id: 'emergency', name: 'Emergency Agent', status: 'Priority Alert' },
            ].map((agent) => {
              const isActive = activeAgentId === agent.id;
              return (
                <div
                  key={agent.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition ${
                    isActive
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-white'
                      : 'bg-white/5 border-slate-200/10 dark:border-slate-800/20 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500/60'}`} />
                    <span className="text-xs font-semibold">{agent.name}</span>
                  </div>
                  <span className={`font-mono text-3xs uppercase tracking-wider px-2 py-0.5 rounded ${
                    isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                  }`}>
                    {isActive ? 'ACTIVE' : agent.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: IMMERSIVE CHAT INTERFACE */}
      <div className="lg:col-span-8 flex flex-col h-full glass-panel rounded-3xl overflow-hidden">
        {/* CHAT HEADER */}
        <div className="p-4 bg-slate-100/85 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${getAgentColor(activeAgentId)} border`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activeAgentName}</h4>
              <p className="text-3xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">
                Active Node: {activeAgentId.toUpperCase()}
              </p>
            </div>
          </div>
          
          <button
            id="reset-chat-history-btn"
            onClick={() => {
              setMessages([messages[0]]);
              setActiveAgentId('orchestrator');
              setActiveAgentName('Stadium AI Orchestrator');
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition cursor-pointer"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* CHAT MESSAGES STREAM */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${msg.role === 'user' ? 'flex-row-reverse ml-auto' : 'mr-auto'}`}
            >
              <div className={`p-2 rounded-xl h-9 w-9 shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' : 'bg-indigo-900/40 text-indigo-400 border border-indigo-500/20'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-2">
                <div className={`rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/20 text-slate-900 dark:text-white'
                }`}>
                  {/* Basic markdown parsing helper (paragraphs and list items) */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.text.split('\n\n').map((paragraph, pi) => {
                      if (paragraph.startsWith('### ')) {
                        return <h4 key={pi} className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-2">{paragraph.replace('### ', '')}</h4>;
                      }
                      if (paragraph.startsWith('* **') || paragraph.startsWith('- **') || paragraph.startsWith('1. **')) {
                        return (
                          <ul key={pi} className="list-disc pl-5 space-y-1.5 text-xs text-slate-800 dark:text-slate-300">
                            {paragraph.split('\n').map((li, li_idx) => {
                              // bold extraction helper
                              const cleaned = li.replace(/^(\*|-|\d+\.)\s+/, '');
                              return <li key={li_idx}>{cleaned}</li>;
                            })}
                          </ul>
                        );
                      }
                      return <p key={pi} className="text-slate-800 dark:text-slate-300">{paragraph}</p>;
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-4xs text-slate-500 px-2 font-mono">
                  <span>{msg.agentName || (msg.role === 'user' ? 'Fan' : 'System')}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* SUGGESTED ACTION PILLS */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {msg.suggestedActions.map((action, ai_idx) => (
                      <button
                        id={`chat-action-pill-${ai_idx}`}
                        key={ai_idx}
                        onClick={() => handleActionClickInternal(action)}
                        className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full transition cursor-pointer flex items-center gap-1"
                      >
                        {action} <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* LOADING TYPING STATE */}
          {isLoading && (
            <div className="flex gap-3 mr-auto">
              <div className="p-2 rounded-xl h-9 w-9 bg-indigo-900/40 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 dark:bg-slate-900/60 border border-slate-200/10 dark:border-slate-800/20 rounded-3xl px-5 py-3.5 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT TRAY */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
          className="p-4 bg-slate-100/90 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800/20 flex items-center gap-3"
        >
          <input
            id="ai-chat-input-box"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything (e.g., 'suggest food combo', 'where is gate B?', 'emergency security')"
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-2xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            id="ai-chat-send-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg transition duration-150 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
