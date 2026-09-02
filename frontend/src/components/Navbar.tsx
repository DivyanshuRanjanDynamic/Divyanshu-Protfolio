import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi';
import { useScrollSpy } from '../hooks/useScrollSpy';
import profile from '../data/profile';

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Activity', id: 'activity' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
];

interface NavbarProps {
  isDark: boolean;
  onToggleDark: () => void;
}

const playSwitchSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Primary metallic click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio restrictions
  }
};

export default function Navbar({ isDark, onToggleDark }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(NAV_LINKS.map(l => l.id));

  const handleToggle = () => {
    playSwitchSound();
    onToggleDark();
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Hanging Lamp Theme Toggle with String Pendulum Swing & Dynamic Flame Lighting */}
      <div className="fixed top-0 right-4 sm:right-14 z-50 pointer-events-none">
        <motion.div
          animate={{ rotate: [-7, 7, -7] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center origin-top pointer-events-auto cursor-pointer group"
          onClick={handleToggle}
          aria-label="Toggle dark mode"
          title={isDark ? "Dark mode active (Lamp shining) - Click to switch to Light mode" : "Light mode active (Lamp off) - Click to switch to Dark mode"}
        >
          {/* Ceiling Mount Cap */}
          <div className="w-4 h-2 bg-slate-400 dark:bg-slate-600 rounded-b-md shadow-sm shrink-0" />

          {/* Dotted Hanging Cable / String */}
          <div className="w-0.5 h-16 sm:h-24 border-l-2 border-dotted border-slate-600 dark:border-amber-300/80 transition-colors duration-500" />

          {/* Lamp Assembly */}
          <div className="relative flex flex-col items-center">
            {/* Dark Mode Warm Glow Halo */}
            <div
              className={`absolute -inset-4 rounded-full transition-all duration-500 ${
                isDark
                  ? 'bg-amber-400/30 blur-xl opacity-100 scale-125'
                  : 'opacity-0 scale-90'
              }`}
            />

            {/* Lamp Shade Base */}
            <div className="relative w-16 h-12 sm:w-20 sm:h-14 bg-gradient-to-b from-[#dfbe95] to-[#b89568] dark:from-[#5a4834] dark:to-[#382b1d] rounded-t-xl rounded-b-md shadow-2xl border-b-4 border-slate-950 flex flex-col justify-end items-center pb-1 transition-all duration-300 group-hover:scale-105">
              {/* Internal Socket Ring */}
              <div className="w-10 h-1 bg-slate-900/70 rounded-t-full mb-0.5" />

              {/* Flame / Bulb */}
              <div
                className={`w-10 h-5 sm:w-12 sm:h-6 rounded-b-full transition-all duration-500 ${
                  isDark
                    ? 'bg-gradient-to-b from-amber-200 via-amber-300 to-yellow-400 shadow-[0_0_22px_#f59e0b,0_8px_32px_#fbbf24]'
                    : 'bg-slate-800 border-t border-slate-700 shadow-inner'
                }`}
              />
            </div>

            {/* Downward Light Cone Beam (Dark Mode Only) */}
            <div
              className={`pointer-events-none transition-all duration-500 origin-top ${
                isDark
                  ? 'opacity-80 scale-100 h-32 sm:h-44 w-40 sm:w-56'
                  : 'opacity-0 scale-75 h-0 w-0'
              }`}
              style={{
                clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.4), rgba(245, 158, 11, 0.1), transparent)',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Center Pill Nav (Desktop) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 hidden md:block">
        <div className="glass px-2 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
          <button
            onClick={() => scrollTo('hero')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2"
          >
            <img src="/favicon.png" alt="Logo" className="w-15 h-10 rounded-full flex items-center justify-center font-serif text-sm italic font-bold" />
          </button>

          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeId === link.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {link.label}
            </button>
          ))}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

          <div className="flex items-center gap-1 pr-2 text-slate-500">
            <a href={profile.meta.github} target="_blank" rel="noreferrer" className="p-1.5 hover:text-slate-900 dark:hover:text-white transition-colors" title="GitHub"><FiGithub size={16} /></a>
            <a href={profile.meta.linkedin} target="_blank" rel="noreferrer" className="p-1.5 hover:text-slate-900 dark:hover:text-white transition-colors" title="LinkedIn"><FiLinkedin size={16} /></a>
            <a href={`mailto:${profile.meta.email}`} className="p-1.5 hover:text-slate-900 dark:hover:text-white transition-colors" title="Email"><FiMail size={16} /></a>
            <a href={profile.meta.resumeUrl} target="_blank" rel="noreferrer" className="p-1.5 hover:text-slate-900 dark:hover:text-white transition-colors" title="Resume"><FiFileText size={16} /></a>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 z-40 flex justify-between items-center pointer-events-none">
        <button
          onClick={() => scrollTo('hero')}
          className="pointer-events-auto w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-serif text-lg italic font-bold shadow-md"
        >
          DR
        </button>
        <div className="flex items-center gap-4">
          <button
            className="pointer-events-auto p-2 glass rounded-full text-slate-700 dark:text-slate-300"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu size={20} />
          </button>
          {/* spacer for lamp */}
          <div className="w-12" />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm flex flex-col justify-center items-center"
          >
            <button
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <FiX size={24} />
            </button>
            <div className="flex flex-col gap-6 text-center">
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="font-serif text-3xl text-slate-800 dark:text-slate-200"
                >
                  {link.label}
                </button>
              ))}
              <a
                href={profile.meta.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 font-mono text-sm text-accent-500 hover:text-accent-400 transition-colors mt-4"
              >
                <FiFileText size={18} /> Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
