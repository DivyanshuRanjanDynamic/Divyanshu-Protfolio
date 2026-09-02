import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiLoader,
  FiChevronRight,
  FiCheckCircle,
  FiArrowRight,
  FiFileText,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiHome,
  FiHelpCircle,
  FiSearch,
  FiCopy,
  FiCheck,
  FiRotateCcw,
} from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const SUGGESTED_QUESTIONS = [
  'What are Divyanshu\'s top technical skills?',
  'Tell me about his internship & backend experience',
  'Show featured projects (MechHub & ProConnect)',
  'Is he available for Full-Time / Internship roles?',
  'How to contact Divyanshu directly?',
];

const QUICK_CHIPS = [
  'Backend Experience',
  'Kafka & Cloud',
  'Projects & Demos',
  'Availability & Status',
];

// Helper to format simple markdown links, remove ** asterisks, and render dashed section lines ---
function renderFormattedContent(text: string) {
  const cleanText = text.replace(/\*\*/g, '');
  const sections = cleanText.split(/(?:\r?\n)?---(?:\r?\n)?/);

  return (
    <div className="space-y-3">
      {sections.map((sec, secIdx) => {
        if (!sec.trim()) return null;

        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        const parts: (string | ReactNode)[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = linkRegex.exec(sec)) !== null) {
          if (match.index > lastIndex) {
            parts.push(sec.substring(lastIndex, match.index));
          }
          const label = match[1];
          const url = match[2];
          parts.push(
            <a
              key={`${secIdx}-${match.index}`}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-accent-400 hover:underline font-semibold underline-offset-2"
            >
              {label} ↗
            </a>
          );
          lastIndex = linkRegex.lastIndex;
        }
        if (lastIndex < sec.length) {
          parts.push(sec.substring(lastIndex));
        }

        return (
          <div key={secIdx}>
            {secIdx > 0 && (
              <hr className="my-3 border-t border-dashed border-slate-300 dark:border-slate-700" />
            )}
            <span className="whitespace-pre-wrap">{parts}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'help'>('home');
  const [input, setInput] = useState('');
  const [homeSearchInput, setHomeSearchInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm Divyanshu's AI assistant 🤖\n\nI can answer questions about his backend experience, technical skills, projects, achievements, and availability for internship & full-time roles!\n\nWhat would you like to know?",
      timestamp: 'Just now',
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'messages') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading, activeTab]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input || homeSearchInput).trim();
    if (!query || isLoading) return;

    // Switch to messages tab when sending a message
    setActiveTab('messages');

    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setHomeSearchInput('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          session_id: sessionId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server status ${res.status}`);
      }

      const data = await res.json();
      if (data.session_id) setSessionId(data.session_id);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || "Sorry, I couldn't generate a response.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I am specifically designed to answer questions about Divyanshu Ranjan's professional background, skills, projects, and experience. For general questions, feel free to reach out to Divyanshu directly via email at divyanshu.work914214@gmail.com!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setSessionId(null);
    setMessages([
      {
        role: 'assistant',
        content:
          "Hi! I'm Divyanshu's AI assistant 🤖\n\nI can answer questions about his backend experience, technical skills, projects, achievements, and availability for internship & full-time roles!\n\nWhat would you like to know?",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Launch Button */}
      <motion.button
        id="chat-widget-btn"
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl text-white text-sm font-semibold cursor-pointer border border-white/20"
        style={{
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)',
          boxShadow: '0 8px 32px rgba(6, 182, 212, 0.45)',
        }}
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <FiX size={20} /> : <BsRobot size={20} />}
          </motion.span>
        </AnimatePresence>
        <span className="hidden sm:inline font-medium">
          {isOpen ? 'Close' : 'Divyanshu AI'}
        </span>
        {!isOpen && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        )}
      </motion.button>

      {/* Modern Veed/Intercom Style Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="chat-panel glass flex flex-col fixed bottom-20 right-4 sm:right-6 w-[94vw] sm:w-[410px] h-[580px] rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl"
          >
            {/* Top Brand Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white shrink-0 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="./favicon.png" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-wide text-white">DIVYANSHU.AI</span>
                  </div>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-2">
                {activeTab === 'messages' && (
                  <button
                    onClick={handleResetChat}
                    title="Reset Conversation"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <FiRotateCcw size={15} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto relative bg-slate-50/60 dark:bg-slate-900/60">
              {/* HOME TAB */}
              {activeTab === 'home' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="p-5 space-y-4"
                >
                  {/* Hero Greeting Section */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-accent-500 dark:text-accent-400">
                        Hi recruiter 👋
                      </p>

                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                      How can I help?
                    </h2>
                  </div>

                  {/* Action Card 1: Ask AI Assistant */}
                  <div
                    onClick={() => setActiveTab('messages')}
                    className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-accent-500/40 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-accent-500 transition-colors">
                          Ask AI Assistant
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                          Instant
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ask about backend skills, projects, Kafka, or availability.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-500 group-hover:bg-accent-500 group-hover:text-white transition-all shrink-0">
                      <FiArrowRight size={16} />
                    </div>
                  </div>

                  {/* Suggested Questions List */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Suggested Questions
                      </span>
                      <span className="text-[11px] text-slate-400">Click to ask</span>
                    </div>

                    <div className="space-y-2">
                      {SUGGESTED_QUESTIONS.map((q, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="group cursor-pointer p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 hover:border-accent-500/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        >
                          <span className="truncate pr-2">{q}</span>
                          <FiChevronRight className="text-slate-400 group-hover:text-accent-500 group-hover:translate-x-0.5 transition-all shrink-0" size={14} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'
                          }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {msg.role === 'user' ? 'You' : 'Divyanshu AI'}
                          </span>
                          {msg.timestamp && (
                            <span className="text-[10px] text-slate-400/70">
                              • {msg.timestamp}
                            </span>
                          )}
                        </div>

                        <div className="relative group max-w-[88%]">
                          <div
                            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.role === 'user'
                              ? 'bg-gradient-to-r from-accent-500 to-blue-600 text-white rounded-br-none shadow-md font-medium'
                              : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/90 dark:border-slate-800 shadow-sm'
                              }`}
                          >
                            {renderFormattedContent(msg.content)}
                          </div>

                          {/* Copy button for assistant messages */}
                          {msg.role === 'assistant' && (
                            <button
                              onClick={() => handleCopy(msg.content, i)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                              title="Copy response"
                            >
                              {copiedIndex === i ? (
                                <FiCheck size={12} className="text-emerald-500" />
                              ) : (
                                <FiCopy size={12} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex flex-col items-start">
                        <div className="text-[10px] font-semibold text-slate-400 mb-1 px-1">
                          Divyanshu AI
                        </div>
                        <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 font-mono shadow-sm">
                          <FiLoader className="animate-spin text-accent-500" size={14} />
                          Thinking...
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Quick Chips at bottom of Messages */}
                  {messages.length <= 3 && !isLoading && (
                    <div className="flex gap-1.5 flex-wrap px-3 py-2 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
                      {QUICK_CHIPS.map(chip => (
                        <button
                          key={chip}
                          onClick={() => handleSend(`Tell me about your ${chip}`)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 hover:bg-accent-500/20 transition-colors"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* HELP & LINKS TAB */}
              {activeTab === 'help' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-5 space-y-4"
                >
                  <div className="space-y-1 pt-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Direct Links & Resume
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Quick access to official profiles and documentation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <a
                      href="https://1drv.ms/b/c/ec04afbe3c304831/IQCoUeLZmg09QbqKvtR_WMGlAdUy6oQM86RJazeR5amfmmE?e=5ccO2h"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-accent-500/40 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                          <FiFileText size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Official Resume (PDF)</p>
                          <p className="text-[11px] text-slate-400 font-normal">View latest resume on OneDrive</p>
                        </div>
                      </div>
                      <FiChevronRight className="text-slate-400 group-hover:text-accent-500 transition-colors" size={16} />
                    </a>

                    <a
                      href="mailto:divyanshu.work914214@gmail.com"
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-accent-500/40 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                          <FiMail size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Send Direct Email</p>
                          <p className="text-[11px] text-slate-400 font-normal">divyanshu.work914214@gmail.com</p>
                        </div>
                      </div>
                      <FiChevronRight className="text-slate-400 group-hover:text-accent-500 transition-colors" size={16} />
                    </a>

                    <a
                      href="https://linkedin.com/in/divyanshuranjan01"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-accent-500/40 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600">
                          <FiLinkedin size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">LinkedIn Profile</p>
                          <p className="text-[11px] text-slate-400 font-normal">Connect on LinkedIn</p>
                        </div>
                      </div>
                      <FiChevronRight className="text-slate-400 group-hover:text-accent-500 transition-colors" size={16} />
                    </a>

                    <a
                      href="https://github.com/DivyanshuRanjanDynamic"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-accent-500/40 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                          <FiGithub size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">GitHub Repositories</p>
                          <p className="text-[11px] text-slate-400 font-normal">github.com/DivyanshuRanjanDynamic</p>
                        </div>
                      </div>
                      <FiChevronRight className="text-slate-400 group-hover:text-accent-500 transition-colors" size={16} />
                    </a>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom Input Area for Messages or Home Search */}
            <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-accent-500/40 transition-all">
                <FiSearch className="text-slate-400" size={15} />
                <input
                  id="chat-input"
                  type="text"
                  value={activeTab === 'home' ? homeSearchInput : input}
                  disabled={isLoading}
                  onChange={e =>
                    activeTab === 'home'
                      ? setHomeSearchInput(e.target.value)
                      : setInput(e.target.value)
                  }
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={
                    activeTab === 'home'
                      ? 'Search or ask anything about Divyanshu…'
                      : 'Ask about skills, projects, experience…'
                  }
                  className="flex-1 text-xs sm:text-sm bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none py-1.5 disabled:opacity-50"
                />
                <motion.button
                  id="chat-send-btn"
                  onClick={() => handleSend()}
                  disabled={
                    isLoading ||
                    !(activeTab === 'home' ? homeSearchInput.trim() : input.trim())
                  }
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg text-white transition-all disabled:opacity-40 cursor-pointer shadow-sm shrink-0"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                >
                  <FiSend size={14} />
                </motion.button>
              </div>

              {/* Bottom Integrated Tab Navigation Bar */}
              <div className="flex items-center justify-around pt-2.5 pb-0.5">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${activeTab === 'home'
                    ? 'text-accent-500 dark:text-accent-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                >
                  <FiHome size={16} />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`relative flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${activeTab === 'messages'
                    ? 'text-accent-500 dark:text-accent-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                >
                  <FiMessageSquare size={16} />
                  <span>Messages</span>
                  {messages.length > 1 && (
                    <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-accent-500" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('help')}
                  className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${activeTab === 'help'
                    ? 'text-accent-500 dark:text-accent-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                >
                  <FiHelpCircle size={16} />
                  <span>Links & Help</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

