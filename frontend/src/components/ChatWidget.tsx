import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiLoader } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  'Summarize his backend experience',
  'Is he available for internships?',
  'Show projects using AWS',
  'Tell me about his Kafka experience',
];

const INITIAL_GREETING =
  "Hi! I'm Divyanshu's AI assistant 🤖\n\nI can answer questions about his backend experience, technical skills, projects, achievements, and availability for internship & full-time roles!\n\nWhat would you like to know?";

// Helper to format simple markdown links, remove ** asterisks, and render dashed section lines ---
function renderFormattedContent(text: string) {
  // Strip out any ** bold asterisks so raw ** never shows up
  const cleanText = text.replace(/\*\*/g, '');

  // Split by horizontal line separators (---)
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
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: INITIAL_GREETING },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    // Append user message immediately
    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
        throw new Error('Failed to fetch AI response');
      }

      const data = await res.json();
      if (data.session_id) setSessionId(data.session_id);

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply || "Sorry, I couldn't generate a response." },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting right now. You can email Divyanshu directly at **divyanshu.work914214@gmail.com**!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        id="chat-widget-btn"
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl text-white text-sm font-semibold cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          boxShadow: '0 0 30px rgba(6,182,212,0.4)',
        }}
        aria-label="Open AI chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <FiX size={18} /> : <FiMessageSquare size={18} />}
          </motion.span>
        </AnimatePresence>
        <span className="hidden sm:inline">
          {isOpen ? 'Close' : 'Chat with AI'}
        </span>
        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-400 animate-ping opacity-75" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="chat-panel glass flex flex-col fixed bottom-20 right-5 w-[92vw] sm:w-[420px] h-[520px] rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              <div className="p-1.5 rounded-full bg-white/20">
                <BsRobot className="text-white" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm leading-tight">Divyanshu's AI Assistant</p>
                <p className="text-white/80 text-xs">Powered by Groq & RAG Pipeline</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white/90 dark:bg-slate-900/90">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent-500 text-white rounded-br-none shadow-sm font-medium'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/60 shadow-sm'
                    }`}
                  >
                    {renderFormattedContent(msg.content)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3.5 py-2 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 font-mono">
                    <FiLoader className="animate-spin text-accent-500" size={14} />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested prompts */}
            {messages.length <= 2 && !isLoading && (
              <div className="flex gap-1.5 flex-wrap px-3 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                {SUGGESTED_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="text-xs px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 hover:bg-accent-500/20 transition-colors text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <input
                id="chat-input"
                type="text"
                value={input}
                disabled={isLoading}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about skills, projects, experience…"
                className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent-500/40 border border-transparent disabled:opacity-50"
              />
              <motion.button
                id="chat-send-btn"
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-white transition-all disabled:opacity-40 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
              >
                <FiSend size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
