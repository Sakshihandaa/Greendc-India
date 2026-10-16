import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import UnifiedCommandCenter from './components/UnifiedCommandCenter';
import Catalog from './components/Catalog';
import MethodologyModal from './components/MethodologyModal';
import QuickSearchModal from './components/QuickSearchModal';
import { Server, Compass, BookOpen } from 'lucide-react';

const HASH_MAP = {
  '': 'command',
  '#command': 'command',
  '#overview': 'command',
  '#map': 'command',
  '#scenario': 'command',
  '#water': 'command',
  '#matrix': 'command',
  '#campuses': 'catalog',
  '#codex': 'codex'
};

const TAB_TO_HASH = {
  command: '#command',
  catalog: '#campuses',
  codex: '#codex'
};

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    return HASH_MAP[hash] || 'command';
  });
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [initialConsoleTab, setInitialConsoleTab] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#water') return 'water';
    if (hash === '#matrix') return 'policy';
    return 'energy';
  });

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const exportPDFHandlerRef = useRef(null);

  // Global Theme (Light Eco-Tech / Dark High-Tech)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('greendc_theme');
      if (saved) return saved === 'dark';
    } catch {
      // Fallback
    }
    return false; // Default to clean eco-tech light mode
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('greendc_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('greendc_theme', 'light');
      }
    } catch (err) {
      console.warn('Theme storage failed:', err);
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Sync state when URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#codex') {
        setIsMethodologyOpen(true);
        return;
      }
      if (HASH_MAP[hash]) {
        setActiveTab(HASH_MAP[hash]);
        if (hash === '#water') setInitialConsoleTab('water');
        else if (hash === '#matrix') setInitialConsoleTab('policy');
        else if (hash === '#scenario') setInitialConsoleTab('energy');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === 'codex') {
      setIsMethodologyOpen(true);
      return;
    }
    setActiveTab(tabId);
    const hash = TAB_TO_HASH[tabId];
    if (hash && window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFacilityFromCatalog = (facility) => {
    setSelectedFacility(facility);
    setActiveTab('command');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerExportPDFFromHeader = async () => {
    if (exportPDFHandlerRef.current) {
      setIsExportingPDF(true);
      try {
        await exportPDFHandlerRef.current();
      } catch (err) {
        console.error('PDF export error:', err);
      } finally {
        setIsExportingPDF(false);
      }
    } else {
      setActiveTab('command');
      setTimeout(() => {
        if (exportPDFHandlerRef.current) {
          exportPDFHandlerRef.current();
        }
      }, 300);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'} flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 relative overflow-x-hidden transition-colors duration-200`}>
      {/* Background ambient natural eco-tint glow circles */}
      <div className={`fixed top-0 left-1/4 w-[700px] h-[700px] ${isDarkMode ? 'bg-emerald-950/20' : 'bg-emerald-100/60'} rounded-full blur-[160px] pointer-events-none -z-10`} />
      <div className={`fixed bottom-0 right-1/4 w-[600px] h-[600px] ${isDarkMode ? 'bg-teal-950/20' : 'bg-teal-100/50'} rounded-full blur-[160px] pointer-events-none -z-10`} />

      {/* Streamlined Navigation Header with Export PDF & Dark Mode Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onExportPDF={handleTriggerExportPDFFromHeader}
        isExportingPDF={isExportingPDF}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'command' && (
          <UnifiedCommandCenter
            onOpenCodex={() => setIsMethodologyOpen(true)}
            onRegisterExportHandler={(fn) => {
              exportPDFHandlerRef.current = fn;
            }}
            initialFacility={selectedFacility}
            initialConsoleTab={initialConsoleTab}
          />
        )}

        {activeTab === 'catalog' && (
          <Catalog
            onSelectFacilityForSimulator={handleSelectFacilityFromCatalog}
            onSelectFacilityForMap={handleSelectFacilityFromCatalog}
          />
        )}
      </main>

      {/* Quick Search Modal (Cmd+K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectFacility={handleSelectFacilityFromCatalog}
        onSelectState={(stateName) => {
          setActiveTab('command');
        }}
        onOpenSimulatorWithPreset={() => {
          setActiveTab('command');
        }}
      />

      {/* Methodology & Documentation Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Clean Light / Dark Eco-Tech Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 mt-16 py-8 text-xs text-slate-600 dark:text-slate-400 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-500/20">
                <Server className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm font-heading">
                  Green<span className="text-emerald-600 dark:text-emerald-400">DC</span> India
                </span>
                <span className="text-slate-300 dark:text-slate-700 text-xs">|</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Clean Tech & Data Centre Sustainability Intelligence
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
              <button
                onClick={() => handleTabChange('command')}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition font-semibold"
              >
                Command Center (Real GIS & Studio)
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={() => handleTabChange('catalog')}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                Verified Campuses
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                Physics Codex
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="max-w-3xl leading-relaxed text-center sm:text-left">
              Transparent physics-based research engine for India's digital infrastructure. Sources: Central Electricity Authority (CEA 2024), Central Ground Water Board (CGWB), and verified corporate sustainability reports.
            </p>
            <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Deterministic Engine Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
