import React, { useState, useEffect } from 'react';
import {
  Layers,
  MapPin,
  Activity,
  Droplets,
  BookOpen,
  Server,
  Scale,
  Search,
  CheckCircle2,
  Boxes,
  Compass,
  Download,
  FileText,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenMethodology,
  onOpenSearch,
  onExportPDF,
  isExportingPDF = false,
  isDarkMode = false,
  onToggleDarkMode
}) {
  const [apiHealth, setApiHealth] = useState({ status: 'checking', uptime: null });

  useEffect(() => {
    let mounted = true;

    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
        if (mounted) setApiHealth({ status: 'online', uptime: data.uptimeSeconds });
        } else {
          if (mounted) setApiHealth({ status: 'local', uptime: null });
        }
      } catch (err) {
        if (mounted) setApiHealth({ status: 'local', uptime: null });
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { id: 'landing', label: 'Overview & 3D Tour', icon: Sparkles },
    { id: 'command', label: 'Command Center', icon: Compass },
    { id: 'catalog', label: 'Verified Campuses', icon: Server },
    { id: 'codex', label: 'Physics Codex', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition">
              <Server className="w-5 h-5 text-white font-bold" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-heading">
                  Green<span className="text-emerald-600 dark:text-emerald-400">DC</span> India
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Clean Tech ESG
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xl:block">
                AI & Cloud Data Centre Sustainability Platform
              </p>
            </div>
          </div>

          {/* Streamlined Navigation Bar (Overview & 3D Tour, Command Center, Campuses, Codex) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'command' && (activeTab === 'map' || activeTab === 'simulator' || activeTab === 'water' || activeTab === 'comparison'));
              return (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.id === 'codex') {
                      onOpenMethodology();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-bold scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-900 dark:hover:text-emerald-300 hover:bg-white/90 dark:hover:bg-slate-700/80'
                  }`}
                  title={`Navigate to ${item.label}`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Items: Export PDF, Dark Mode, Search, API Health */}
          <div className="flex items-center gap-2">
            {/* EXPORT PDF BUTTON IN HEADER */}
            <button
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
              title="Export Publication-Grade ESG PDF Report with Map Snapshot"
            >
              <Download className={`w-3.5 h-3.5 ${isExportingPDF ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">
                {isExportingPDF ? 'Generating PDF...' : 'Export PDF'}
              </span>
            </button>

            {/* DARK / LIGHT MODE TOGGLE BUTTON */}
            <button
              onClick={onToggleDarkMode}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition cursor-pointer"
              title={isDarkMode ? 'Switch to Light Eco Mode' : 'Switch to High-Tech Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  <span className="hidden lg:inline text-xs font-semibold">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden lg:inline text-xs font-semibold">Dark</span>
                </>
              )}
            </button>

            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition cursor-pointer"
              title="Search Campuses & States (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="hidden lg:inline text-xs font-medium">Search</span>
              <kbd className="text-[9px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-600 hidden sm:inline">
                ⌘K
              </kbd>
            </button>

            {/* Engine Telemetry */}
            <div
              title={
                apiHealth.status === 'online'
                  ? `Express API Online (:5001) • Deterministic Math Engine Active`
                  : 'Operating in High-Performance Local Mode'
              }
              className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiHealth.status === 'online'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-teal-500'
                }`}
              />
              <span className="text-[11px] font-bold">
                {apiHealth.status === 'online' ? 'API :5001' : 'Local'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-start py-2.5 border-t border-slate-200/80 overflow-x-auto gap-2 no-scrollbar text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'codex') {
                    onOpenMethodology();
                  } else {
                    setActiveTab(item.id);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 whitespace-nowrap rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
