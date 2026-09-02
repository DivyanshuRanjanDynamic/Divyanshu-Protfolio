import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';
import profile from '../data/profile';

const ICON_MAP: Record<string, string> = {
  trophy: '🏆',
  medal:  '🥇',
  code:   '💻',
};

export default function Achievements() {
  return (
    <SectionWrapper id="achievements">
      <div className="text-center mb-16">
        <h2 className="section-heading text-slate-900 dark:text-slate-100 mb-2">
          Milestones & Recognition
        </h2>
        <p className="hud-text lowercase tracking-widest text-slate-500">
          select * from achievements limit 3
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {profile.achievements.map((ach, i) => (
          <motion.div
            key={ach.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass rounded-sm p-8 border border-light-border dark:border-dark-border text-center card-hover group relative"
          >
            {/* Top Border Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{ICON_MAP[ach.icon]}</div>
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-3">{ach.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{ach.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
