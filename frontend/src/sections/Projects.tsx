import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import SectionWrapper from '../components/SectionWrapper';
import profile from '../data/profile';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function Projects() {
  return (
    <SectionWrapper id="projects" className="relative">
      <div className="absolute top-10 right-10 hud-text pointer-events-none opacity-40">
        [ DEPLOYMENT_ARCHIVE ]
      </div>

      <div className="text-center mb-16">
        <h2 className="section-heading text-slate-900 dark:text-slate-100 mb-2">
          Featured Architecture
        </h2>
        <p className="hud-text lowercase tracking-widest text-slate-500">
          select * from builds where status = 'production'
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
        {profile.projects.map((proj, i) => (
          <motion.div
            key={proj.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="glass rounded-sm p-6 sm:p-8 border border-light-border dark:border-dark-border flex flex-col group card-hover relative overflow-hidden"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Project Preview Image with rounded edges */}
            {proj.image && (
              <div className="mb-6 overflow-hidden rounded-md border border-slate-200/80 dark:border-dark-border/80 bg-slate-100 dark:bg-slate-900/60 shadow-sm">
                <img 
                  src={proj.image} 
                  alt={proj.name} 
                  className="w-full h-48 sm:h-56 object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out" 
                />
              </div>
            )}

            {/* Title */}
            <div className="mb-4">
              <h3 className="font-serif text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent-500 transition-colors">
                {proj.name}
              </h3>
              <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                {proj.subtitle}
              </p>
            </div>

            {/* Bullets */}
            <ul className="space-y-3 flex-1 mb-6">
              {proj.bullets.map((b, bi) => (
                <li key={bi} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1 h-1 bg-accent-500 flex-shrink-0" />
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{b}</p>
                </li>
              ))}
            </ul>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-2 mb-6 pt-4 border-t border-slate-200/50 dark:border-dark-border/50">
              {proj.tech.map(t => (
                <span key={t} className="tech-badge bg-transparent border-none px-0 text-slate-400 hover:text-accent-500">
                  #{t.toLowerCase()}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-4 mt-auto">
              <a
                href={proj.github}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary py-1.5 px-3 text-[10px]"
              >
                <FiGithub size={12} /> Source
              </a>
              {proj.live && (
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary py-1.5 px-3 text-[10px]"
                >
                  Demo <FiExternalLink size={12} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
