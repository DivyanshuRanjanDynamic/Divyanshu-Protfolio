import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';
import profile from '../data/profile';

export default function About() {
  const { education } = profile;

  return (
    <SectionWrapper id="about" className="relative">
      <div className="absolute top-10 left-0 w-full flex justify-center hud-text pointer-events-none opacity-40">
        [ COMPILATION_TOOLKIT_PROFILE ]
      </div>

      <div className="pt-16 pb-12">
        <div className="hud-text mb-4 opacity-50">TECHNICAL TOOLKIT LEDGER</div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left Side */}
          <div>
            <h2 className="section-heading text-slate-900 dark:text-slate-100 mb-6">
              Engineered Capabilities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl leading-relaxed mb-10">
              Undergraduate systems builder focusing on high-performance backend frameworks, asynchronous AI architectures, data structures, and real-time multiplayer platforms. Currently pursuing {education.degree} at {education.institution}.
            </p>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '[NODES]', value: '100+' },
                { label: '[EXPERIENCE]', value: '1+ yrs' },
                { label: '[BUILDS]', value: '5+' },
                { label: '[AVG_GPA]', value: education.gpa },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-4 card-hover rounded-sm flex flex-col justify-center"
                >
                  <div className="hud-text mb-2 text-[0.55rem]">{stat.label}</div>
                  <div className="font-serif text-2xl sm:text-2xl text-accent-500">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Framework Snapshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-6 sm:p-8 rounded-sm card-hover relative"
          >
            <div className="absolute top-4 left-6 hud-text">[ FRAMEWORK_SNAPSHOT ]</div>
            <div className="mt-8 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4">

              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-start">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">FRONTEND:</span>
                <span className="leading-relaxed">React, Tailwind CSS, Framer Motion, HTML, CSS</span>
              </div>

              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-start">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">BACKEND:</span>
                <span className="leading-relaxed">Node.js, Express.js, FastAPI, REST APIs, WebSockets</span>
              </div>

              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-start">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">LANGUAGES:</span>
                <span className="leading-relaxed">Java, JavaScript, Python, SQL</span>
              </div>

              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-start">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">DATABASES:</span>
                <span className="leading-relaxed">PostgreSQL, MongoDB, Redis</span>
              </div>

            </div>
            <div className="absolute bottom-4 right-6 hud-text">[ SPEC_08 ]</div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
