import React, { useState } from 'react';
import Header from './components/Header';
import Overview from './components/Overview';
import IndiaMap from './components/IndiaMap';
import Simulator from './components/Simulator';
import WaterMonitor from './components/WaterMonitor';
import MethodologyModal from './components/MethodologyModal';
import { Server, Compass, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <Overview
            onNavigateToMap={() => setActiveTab('map')}
            onNavigateToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'map' && (
          <IndiaMap />
        )}

        {activeTab === 'simulator' && (
          <Simulator />
        )}

        {activeTab === 'water' && (
          <WaterMonitor />
        )}
      </main>

      {/* Methodology & Documentation Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-white text-sm">
              Green<span className="text-emerald-400">DC</span> India
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">
              Decision-Support Platform for AI Data Centre Infrastructure
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-emerald-400 transition"
            >
              Methodology & Formulas
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-emerald-400 transition"
            >
              Simulator
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('map')}
              className="hover:text-emerald-400 transition"
            >
              India Map
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-slate-900 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Educational and research prototype. Not an official site-selection, engineering blueprint, or regulatory environmental clearance instrument.
          </p>
          <p className="flex items-center gap-1">
            Built for CSE Minor Project • Open Data Commons
          </p>
        </div>
      </footer>
    </div>
  );
}
