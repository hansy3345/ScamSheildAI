import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageAtmosphere from './components/layout/PageAtmosphere';

export default function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Contextual & calm page-specific atmospheric lighting and depth */}
      <PageAtmosphere />

      <Navbar />

      {/* Main content with smooth page transitions */}
      <main className="relative z-10 flex-1 pt-16">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
