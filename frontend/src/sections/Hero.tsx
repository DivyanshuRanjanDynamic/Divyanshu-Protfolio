import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  isDark?: boolean;
}

/* ——————————————————————————————————————————————
   Floating HUD tag – scattered keyword labels
—————————————————————————————————————————————— */
const FloatingTag = ({ text, top, left, right, bottom, color = 'slate' }: any) => {
  const border = color === 'accent'
    ? 'border-accent-500/40 dark:border-accent-500/30'
    : 'border-slate-300 dark:border-slate-600/30';
  const fg = color === 'accent'
    ? 'text-accent-700 dark:text-accent-400/90'
    : 'text-slate-600 dark:text-slate-400/80';
  return (
    <div
      className={`absolute px-3 py-1.5 border ${border} ${fg} text-[9px] font-mono tracking-widest uppercase bg-white/60 dark:bg-dark-bg/30 backdrop-blur-sm pointer-events-none select-none opacity-80 transition-colors duration-300`}
      style={{ top, left, right, bottom }}
    >
      {text}
    </div>
  );
};

/* ——————————————————————————————————————————————
   HERO — Interactive split-screen slider with Light & Dark Mode
   
   Cursor LEFT  → Bottom layer visible:
       Artistic image (left) + Text right ("PRODUCT EXPERIENCE BUILDER")
   
   Cursor RIGHT → Top layer visible:
       Text left ("SOFTWARE & AI ENGINEER") + Normal image (right)
—————————————————————————————————————————————— */
export default function Hero({ isDark = false }: HeroProps) {
  const [pos, setPos] = useState(50);
  const containerRef  = useRef<HTMLDivElement>(null);
  const rafRef        = useRef<number | null>(null);

  const track = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const { left, width } = containerRef.current!.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
      setPos(pct);
    });
  }, []);

  const onMouseMove = (e: React.MouseEvent) => track(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => track(e.touches[0].clientX);

  // Theme-aware colors for smooth background transition
  const bottomBgColor = isDark ? '#07090b' : '#F4FBFD';
  const topBgColor    = isDark ? '#070b0d' : '#E6F4F8';

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative h-screen min-h-[700px] w-full overflow-hidden cursor-ew-resize select-none transition-colors duration-300"
      style={{ backgroundColor: bottomBgColor }}
    >

      {/* ============================================ */}
      {/*  BOTTOM LAYER — visible when cursor is LEFT  */}
      {/*  Artistic image (left) + Text (right)        */}
      {/* ============================================ */}
      <div
        className="absolute inset-0 w-full h-full flex transition-colors duration-300"
        style={{
          clipPath: `polygon(${pos}% 0, 100% 0, 100% 100%, ${pos}% 100%)`,
          backgroundColor: bottomBgColor,
        }}
      >
        {/* Grid bg pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-100"
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)'
              : 'linear-gradient(rgba(14,116,144,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,144,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating tags - hidden on mobile for clean readable layout */}
        <div className="hidden md:block">
          <FloatingTag text="REACT UX SYSTEMS"   top="12%" right="8%" />
          <FloatingTag text="height: 100vh;"     top="20%" right="16%" />
          <FloatingTag text="ACCESSIBLE UI FLOW" top="32%" right="38%" />
          <FloatingTag text="class=&quot;hero&quot;" top="42%" right="12%" />
          <FloatingTag text="INDEXEDDB CACHING"  top="62%" right="42%" />
          <FloatingTag text="DEV UTILITY LABS"   top="72%" right="32%" />
          <FloatingTag text="</html>"            bottom="12%" right="22%" />
          <FloatingTag text="color: #0E7490;"    top="58%" right="10%" />
          <FloatingTag text="HACKATHON SHIP MODE" bottom="22%" right="15%" />
        </div>

        {/* LEFT: Artistic Image — fully fitted, full height */}
        <div className="w-1/2 h-full relative overflow-hidden">
          <motion.img
            src="/artistic.png"
            alt="Artistic Portrait"
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          {/* Gradient fade on right edge for smooth blend */}
          <div 
            className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l to-transparent transition-colors duration-300 pointer-events-none"
            style={{ backgroundImage: `linear-gradient(to left, ${bottomBgColor}, transparent)` }}
          />
        </div>

        {/* RIGHT: Text — MODE_02 */}
        <div className="w-1/2 h-full flex flex-col justify-center items-end text-right pr-4 sm:pr-10 md:pr-16 lg:pr-24 relative z-10">
          <div className="hud-text text-slate-500 dark:text-slate-400 mb-3 sm:mb-6 flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
            <span className="w-6 sm:w-10 h-px bg-slate-300 dark:bg-slate-700" />
            MODE_02
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[5rem] xl:text-[6rem] font-serif leading-[0.9] text-slate-900 dark:text-slate-100 uppercase tracking-tight">
            PRODUCT<br />
            <span className="italic text-slate-500 dark:text-slate-400">EXPERIENCE</span><br />
            BUILDER
          </h1>

          <p className="font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-4 sm:mt-8 mb-4 sm:mb-8 max-w-[240px] sm:max-w-sm">
            Useful tools. Polished feel.
          </p>

          <div className="flex flex-wrap justify-end gap-1.5 sm:gap-3 max-w-xs sm:max-w-md">
            {['REACT', 'VITE', 'TAILWIND', 'INDEXEDDB', 'UNITY'].map(t => (
              <span
                key={t}
                className="px-2 sm:px-3 py-0.5 sm:py-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 text-[8px] sm:text-[10px] font-mono tracking-widest uppercase bg-white/50 dark:bg-transparent"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-1.5 sm:gap-3 mt-2 sm:mt-3">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 text-[8px] sm:text-[10px] font-mono tracking-widest uppercase bg-white/50 dark:bg-transparent">
              ARCJET/ANONB
            </span>
          </div>

          <div className="hud-text text-slate-500 dark:text-slate-600 mt-6 sm:mt-10 text-right text-[9px] sm:text-[10px] space-y-1 hidden sm:block">
            <div>Java<span className="text-accent-500/60">.</span> HACKATHON SHIP MODE</div>
            <div className="opacity-60">&lt;/html&gt;</div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/*  TOP LAYER — visible when cursor is RIGHT    */}
      {/*  Text (left) + Normal image (right)          */}
      {/* ============================================ */}
      <div
        className="absolute inset-0 w-full h-full flex transition-colors duration-300"
        style={{
          clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`,
          backgroundColor: topBgColor,
          backgroundImage: isDark
            ? 'repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(6,182,212,0.04) 18px, rgba(6,182,212,0.04) 19px)'
            : 'repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(6,182,212,0.08) 18px, rgba(6,182,212,0.08) 19px)',
        }}
      >
        {/* Floating tags - hidden on mobile */}
        <div className="hidden md:block">
          <FloatingTag text="REAL TIME AI"         top="12%" left="8%"  color="accent" />
          <FloatingTag text="FASTAPI WS CORE"      top="24%" left="40%" color="accent" />
          <FloatingTag text="WHISPER PIPELINE"      top="34%" left="4%"  color="accent" />
          <FloatingTag text="GEMINI INFERENCE"      top="52%" left="36%" color="accent" />
          <FloatingTag text="LOW LATENCY PATH"      top="54%" left="6%"  color="accent" />
          <FloatingTag text="SECURE BACKEND FIRST" top="72%" left="30%" color="accent" />
          <FloatingTag text="CREWAI ORCHESTRATION" bottom="12%" left="12%" color="accent" />
        </div>

        {/* Code snippets on the right side */}
        <div className="absolute right-6 top-[12%] hud-text text-[10px] text-accent-700/50 dark:text-accent-500/30 space-y-1 hidden lg:block pointer-events-none z-0">
          <div>&lt;html&gt;</div>
          <div className="ml-4">REACT UX SYSTEMS</div>
          <div className="ml-4">height: "...4K"</div>
        </div>

        {/* LEFT: Text — MODE_01 */}
        <div className="w-1/2 h-full flex flex-col justify-center items-start text-left pl-4 sm:pl-10 md:pl-16 lg:pl-24 relative z-10">
          <div className="hud-text text-accent-700 dark:text-accent-400 mb-3 sm:mb-6 flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
            MODE_01
            <span className="w-6 sm:w-10 h-px bg-accent-500/50" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[5rem] xl:text-[6rem] font-serif leading-[0.9] text-slate-900 dark:text-white uppercase tracking-tight">
            SOFTWARE <span className="text-accent-600 dark:text-accent-400">&</span><br />
            AI<br />
            ENGINEER
          </h1>

          <p className="font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-4 sm:mt-8 mb-4 sm:mb-8 max-w-[240px] sm:max-w-sm">
            Low latency. High reliability.
          </p>

          <div className="flex flex-wrap justify-start gap-1.5 sm:gap-3 max-w-xs sm:max-w-md">
            {['FASTAPI', 'WEBSOCKETS', 'WHISPER', 'SARVAM AI'].map(t => (
              <span
                key={t}
                className="px-2 sm:px-3 py-0.5 sm:py-1 border border-accent-500/40 dark:border-accent-500/30 text-accent-700 dark:text-accent-400 text-[8px] sm:text-[10px] font-mono tracking-widest uppercase bg-accent-500/10 dark:bg-accent-500/5"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-start gap-1.5 sm:gap-3 mt-2 sm:mt-3">
            {['GEMINI', 'CREWAI'].map(t => (
              <span
                key={t}
                className="px-2 sm:px-3 py-0.5 sm:py-1 border border-accent-500/40 dark:border-accent-500/30 text-accent-700 dark:text-accent-400 text-[8px] sm:text-[10px] font-mono tracking-widest uppercase bg-accent-500/10 dark:bg-accent-500/5"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: Normal Image — fully fitted, full height */}
        <div className="w-1/2 h-full relative overflow-hidden">
          {/* Gradient fade on left edge for smooth blend */}
          <div 
            className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r to-transparent transition-colors duration-300 z-10 pointer-events-none" 
            style={{ backgroundImage: `linear-gradient(to right, ${topBgColor}, transparent)` }}
          />
          <motion.img
            src="/normal.png"
            alt="Professional Portrait"
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ============================================ */}
      {/*  CURSOR LINE — glowing vertical divider      */}
      {/* ============================================ */}
      <div
        className="absolute top-0 bottom-0 z-30 pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        {/* Glow line */}
        <div className="absolute inset-y-0 left-0 w-px bg-accent-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-3.5 h-3.5 rounded-full bg-accent-500 shadow-[0_0_16px_rgba(6,182,212,0.8)]" />
        </div>

        {/* Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-5 text-accent-600 dark:text-accent-500/60 text-lg select-none font-bold">‹</div>
        <div className="absolute top-1/2 -translate-y-1/2 left-3  text-accent-600 dark:text-accent-500/60 text-lg select-none font-bold">›</div>
      </div>

      {/* ============================================ */}
      {/*  BOTTOM BAR — status row & mobile tap buttons */}
      {/* ============================================ */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 px-4 sm:px-10 flex justify-between items-center z-30 hud-text text-[9px] sm:text-[10px]">
        <button
          onClick={() => setPos(75)}
          className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-700 dark:text-accent-400 border border-accent-500/30 hover:bg-accent-500/20 transition-all font-mono"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
          MODE_01
        </button>

        <div className="opacity-60 dark:opacity-30 tracking-[0.15em] sm:tracking-[0.2em] text-slate-700 dark:text-slate-400 text-center select-none text-[8px] sm:text-[10px]">
          ‹ DRAG OR TAP TO SWITCH ›
        </div>

        <button
          onClick={() => setPos(25)}
          className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all font-mono"
        >
          MODE_02
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
        </button>
      </div>

      {/* Decorative corner squares */}
      <div className="absolute top-12 left-6 sm:left-10 w-3 sm:w-4 h-3 sm:h-4 border border-accent-500/40 dark:border-accent-500/30 z-30 pointer-events-none" />
      <div className="absolute top-20 left-6 sm:left-10 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-accent-500/40 z-30 pointer-events-none" />
    </section>
  );
}
