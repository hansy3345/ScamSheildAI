import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS } from '../../utils/constants';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-[#030712]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/40 py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400/60 transition-all">
                <Shield className="w-5 h-5 text-cyan-500 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight flex items-center">
                  <span className="text-slate-900 dark:text-white">ScamShield</span>
                  <span className="gradient-text font-black ml-2 text-base px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">AI</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/60 dark:bg-white/[0.04] p-1 rounded-full border border-slate-200/60 dark:border-white/[0.08] backdrop-blur-md">
              {NAV_LINKS.map(link => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? 'text-slate-900 dark:text-white bg-white dark:bg-white/10 shadow-sm'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link to="/analyze" className="hidden sm:inline-flex">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer">
                  <span>Start Analyzing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Slide-in drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-72 bg-white dark:bg-[#030712] border-l border-slate-200 dark:border-white/10 md:hidden shadow-2xl p-6 flex flex-col justify-between"
            >
              <div className="pt-16 flex flex-col gap-2">
                {NAV_LINKS.map(link => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-colors flex items-center justify-between ${
                        isActive
                          ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                          : 'text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                <Link to="/analyze" className="w-full">
                  <button className="w-full py-3 rounded-xl text-sm font-bold bg-cyan-500 text-slate-950 flex items-center justify-center gap-2">
                    <span>Analyze Threat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
