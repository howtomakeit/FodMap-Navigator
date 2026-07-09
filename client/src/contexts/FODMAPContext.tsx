import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FODMAPProfile, TriageResult, ScanResult } from '@/lib/fodmap';

const STORAGE_KEYS = {
  profile: 'fodmap_profile',
  triageResult: 'fodmap_triage_result',
  hasCompletedTriage: 'fodmap_has_completed_triage',
  scanHistory: 'fodmap_scan_history',
};

const MAX_HISTORY = 50;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — ignore
  }
}

interface FODMAPContextType {
  profile: FODMAPProfile;
  setProfile: (profile: FODMAPProfile) => void;
  triageResult: TriageResult | null;
  setTriageResult: (result: TriageResult | null) => void;
  hasCompletedTriage: boolean;
  setHasCompletedTriage: (value: boolean) => void;
  scanHistory: ScanResult[];
  addScanToHistory: (result: ScanResult) => void;
  clearHistory: () => void;
}

const FODMAPContext = createContext<FODMAPContextType | undefined>(undefined);

const DEFAULT_PROFILE: FODMAPProfile = {
  lactose: false,
  fructans: false,
  gos: false,
  fructose: false,
  polyols: false,
};

export function FODMAPProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<FODMAPProfile>(() =>
    loadFromStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  );
  const [triageResult, setTriageResultState] = useState<TriageResult | null>(() =>
    loadFromStorage(STORAGE_KEYS.triageResult, null)
  );
  const [hasCompletedTriage, setHasCompletedTriageState] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.hasCompletedTriage, false)
  );
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(() =>
    loadFromStorage(STORAGE_KEYS.scanHistory, [])
  );

  const setProfile = (p: FODMAPProfile) => {
    setProfileState(p);
    saveToStorage(STORAGE_KEYS.profile, p);
  };

  const setTriageResult = (r: TriageResult | null) => {
    setTriageResultState(r);
    saveToStorage(STORAGE_KEYS.triageResult, r);
  };

  const setHasCompletedTriage = (v: boolean) => {
    setHasCompletedTriageState(v);
    saveToStorage(STORAGE_KEYS.hasCompletedTriage, v);
  };

  const addScanToHistory = (result: ScanResult) => {
    setScanHistory(prev => {
      const updated = [result, ...prev].slice(0, MAX_HISTORY);
      saveToStorage(STORAGE_KEYS.scanHistory, updated);
      return updated;
    });
  };

  const clearHistory = () => {
    setScanHistory([]);
    saveToStorage(STORAGE_KEYS.scanHistory, []);
  };

  return (
    <FODMAPContext.Provider
      value={{
        profile,
        setProfile,
        triageResult,
        setTriageResult,
        hasCompletedTriage,
        setHasCompletedTriage,
        scanHistory,
        addScanToHistory,
        clearHistory,
      }}
    >
      {children}
    </FODMAPContext.Provider>
  );
}

export function useFODMAP() {
  const context = useContext(FODMAPContext);
  if (!context) throw new Error('useFODMAP must be used within FODMAPProvider');
  return context;
}
