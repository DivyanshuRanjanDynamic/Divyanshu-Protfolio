import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id={id} ref={ref} className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
