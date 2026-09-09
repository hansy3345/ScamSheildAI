import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AnalysisResult, AnalysisRequest, AnalysisStatus, HistoryItem, InputType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';
import { getInitialHistory } from '../services/mockData';

/* ===== State ===== */

interface AnalysisState {
  status: AnalysisStatus;
  currentRequest: AnalysisRequest | null;
  currentResult: AnalysisResult | null;
  error: string | null;
}

const initialState: AnalysisState = {
  status: 'idle',
  currentRequest: null,
  currentResult: null,
  error: null,
};

/* ===== Actions ===== */

type AnalysisAction =
  | { type: 'START_ANALYSIS'; request: AnalysisRequest }
  | { type: 'COMPLETE_ANALYSIS'; result: AnalysisResult }
  | { type: 'ANALYSIS_ERROR'; error: string }
  | { type: 'RESET' };

function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case 'START_ANALYSIS':
      return { status: 'scanning', currentRequest: action.request, currentResult: null, error: null };
    case 'COMPLETE_ANALYSIS':
      return { ...state, status: 'complete', currentResult: action.result };
    case 'ANALYSIS_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

/* ===== Context ===== */

interface AnalysisContextType {
  // Current analysis state
  state: AnalysisState;
  startAnalysis: (request: AnalysisRequest) => void;
  completeAnalysis: (result: AnalysisResult) => void;
  setError: (error: string) => void;
  reset: () => void;

  // History management
  history: HistoryItem[];
  addToHistory: (inputType: InputType, inputPreview: string, result: AnalysisResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(STORAGE_KEYS.HISTORY, getInitialHistory());

  const startAnalysis = useCallback((request: AnalysisRequest) => {
    dispatch({ type: 'START_ANALYSIS', request });
  }, []);

  const completeAnalysis = useCallback((result: AnalysisResult) => {
    dispatch({ type: 'COMPLETE_ANALYSIS', result });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'ANALYSIS_ERROR', error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const addToHistory = useCallback((inputType: InputType, inputPreview: string, result: AnalysisResult) => {
    const item: HistoryItem = {
      id: generateId(),
      inputType,
      inputPreview: inputPreview.slice(0, 200),
      result,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [item, ...prev]);
  }, [setHistory]);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return (
    <AnalysisContext.Provider
      value={{
        state,
        startAnalysis,
        completeAnalysis,
        setError,
        reset,
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis(): AnalysisContextType {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
