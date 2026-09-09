import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export { default as SectionLine } from './SectionLine';
export { default as RevealText } from './RevealText';
export { default as ScrollReveal } from './ScrollReveal';

/* ===== Button ===== */

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden';

  const variants: Record<string, string> = {
    primary:
      'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 border border-cyan-400/40 active:scale-[0.98]',
    pill:
      'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full shadow-lg shadow-cyan-500/20 border border-cyan-300/30 active:scale-[0.98]',
    secondary:
      'bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800/80 shadow-sm hover:border-slate-300 dark:hover:border-white/20',
    outline:
      'bg-transparent border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50',
    ghost:
      'text-slate-600 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5',
    danger:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold',
    md: 'px-5 py-2.5 text-sm font-semibold',
    lg: 'px-7 py-3.5 text-base font-bold',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}

/* ===== Card ===== */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'cyan' | 'violet' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Card({ children, className = '', hover = false, glow = 'none', padding = 'md' }: CardProps) {
  const paddings: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const glowStyles: Record<string, string> = {
    none: '',
    cyan: 'glow-cyan',
    violet: 'glow-violet',
  };

  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? { whileHover: { y: -3, transition: { duration: 0.2 } } } : {};

  return (
    <Component
      className={`glass rounded-3xl ${paddings[padding]} ${glowStyles[glow]} ${hover ? 'eqty-card' : ''} ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}

/* ===== Badge ===== */

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'safe' | 'suspicious' | 'high-risk' | 'critical' | 'outline' | 'tag';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-slate-100 dark:bg-zinc-800/70 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700',
    safe: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    suspicious: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30',
    'high-risk': 'bg-orange-500/10 text-orange-800 dark:text-orange-300 border-orange-500/30',
    critical: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
    outline: 'bg-transparent text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    tag: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 uppercase tracking-wider text-[10px] font-mono',
  };

  const sizes: Record<string, string> = {
    sm: 'px-2.5 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-sm font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

/* ===== Tag ===== */

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className = '' }: TagProps) {
  return (
    <span className={`tag-bordered ${className}`}>
      {children}
    </span>
  );
}

/* ===== Modal ===== */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizes: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative w-full ${sizes[size]} glass-strong rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
        {footer && (
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ===== Skeleton ===== */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export function Skeleton({ className = '', variant = 'text', width, height }: SkeletonProps) {
  const variantStyles: Record<string, string> = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  };

  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-800/60 ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

/* ===== EmptyState ===== */

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4 text-zinc-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}

/* ===== ErrorState ===== */

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4 text-rose-500">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
