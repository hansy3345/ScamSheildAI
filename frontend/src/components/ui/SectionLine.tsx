import { motion } from 'framer-motion';

interface SectionLineProps {
  className?: string;
  gradient?: string;
}

export default function SectionLine({
  className = '',
  gradient = 'from-cyan-500/60 via-violet-500/30 to-transparent'
}: SectionLineProps) {
  return (
    <div className={`w-full overflow-hidden my-8 sm:my-12 ${className}`}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '0% 50%' }}
        className={`h-[1px] w-full bg-gradient-to-r ${gradient}`}
      />
    </div>
  );
}
