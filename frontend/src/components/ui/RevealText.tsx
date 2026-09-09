import { motion } from 'framer-motion';

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  highlightWords?: string[];
  highlightClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export default function RevealText({
  text,
  className = '',
  delay = 0.1,
  stagger = 0.08,
  highlightWords = [],
  highlightClassName = 'gradient-text',
  as = 'h1'
}: RevealTextProps) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const Tag = as;

  return (
    <Tag className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        className="inline"
      >
        {words.map((word, idx) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const isHighlighted = highlightWords.some(
            hw => hw.toLowerCase() === cleanWord || word.toLowerCase().includes(hw.toLowerCase())
          );

          return (
            <motion.span
              key={`${word}-${idx}`}
              variants={wordVariants}
              className={`inline-block mr-[0.25em] last:mr-0 ${isHighlighted ? highlightClassName : ''}`}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
