import { motion } from 'framer-motion';
import { FiBriefcase } from 'react-icons/fi';
import SectionWrapper from '../components/SectionWrapper';
import profile from '../data/profile';

export default function Experience() {
  return (
    <SectionWrapper id="experience" className="relative">
      <div className="text-center mb-16">
        <h2 className="section-heading text-slate-900 dark:text-slate-100 mb-2">
          Professional Ledger
        </h2>
        <p className="hud-text lowercase tracking-widest text-slate-500">
          select * from experience order by date desc
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto pl-8 sm:pl-0">
        {/* Timeline Line (hidden on small screens, center on large) */}
        <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-dark-border sm:-translate-x-1/2" />

        {profile.experience.map((exp, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative mb-12 last:mb-0 sm:flex sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''}`}
            >
              
              {/* Timeline Node */}
              <div className="absolute -left-[1.35rem] sm:left-1/2 sm:-translate-x-1/2 w-10 h-10 bg-light-bg dark:bg-dark-bg border-4 border-accent-500 rounded-full flex items-center justify-center z-10 top-0 sm:top-1/2 sm:-translate-y-1/2">
                <FiBriefcase className="text-accent-500" size={14} />
              </div>

              {/* Spacer for center layout */}
              <div className="hidden sm:block sm:w-1/2" />

              {/* Content Card */}
              <div className={`sm:w-1/2 ${isEven ? 'sm:pl-12' : 'sm:pr-12'}`}>
                <div className="glass rounded-sm p-6 sm:p-8 border border-light-border dark:border-dark-border card-hover relative group">
                  
                  {/* Corner bracket hover effect */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="hud-text mb-3 text-accent-500">{exp.period}</div>
                  
                  <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {exp.title}
                  </h3>
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                    {exp.company} • {exp.location}
                  </p>
                  
                  <ul className="space-y-2 mb-4">
                    {exp.bullets.map((bullet, bi) => (
                      <li key={bi} className="flex items-start gap-2">
                        <span className="mt-[0.4rem] w-1 h-1 bg-accent-500 flex-shrink-0" />
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{bullet}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200/50 dark:border-dark-border/50">
                    {exp.tech.map(t => (
                      <span key={t} className="text-[10px] font-mono text-slate-400 lowercase">
                        #{t}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
