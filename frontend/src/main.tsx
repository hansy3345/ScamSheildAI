import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './store/ThemeContext';
import { AnalysisProvider } from './store/AnalysisContext';
import App from './App';
import './index.css';

import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import ScanPage from './pages/ScanPage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SafetyCenterPage from './pages/SafetyCenterPage';
import HowItWorksPage from './pages/HowItWorksPage';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AnalysisProvider>
          <Routes>
            <Route element={<App />}>
              <Route index element={<LandingPage />} />
              <Route path="analyze" element={<AnalyzePage />} />
              <Route path="scan" element={<ScanPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="results/:id" element={<ResultsPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="safety" element={<SafetyCenterPage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
            </Route>
          </Routes>
        </AnalysisProvider>

      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
