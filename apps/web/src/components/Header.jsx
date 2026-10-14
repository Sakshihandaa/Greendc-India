import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Activity, Droplets, BookOpen, Server, Layers } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenMethodology }) {
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
          if (mounted) setApiHealth({ status: 'offline', uptime: null });
        }
      } catch (err) {
        if (mounted) setApiHealth({ status: 'offline', uptime: null });
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
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'map', label: 'India Geospatial Explorer', icon: MapPin },
    { id: 'simulator', label: 'Energy Simulator', icon: Activity },
    { id: 'water', label: 'Water & Cooling', icon: Droplets },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
              <Server className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  Green<span className="text-emerald-400">DC</span> India
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  Research Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI & Cloud Data Centre Sustainability Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/70">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-600/90 text-white shadow-sm shadow-emerald-900/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / System Status */}
          <div className="flex items-center gap-3">
            {/* API Health Pill */}
            <div
              title={
                apiHealth.status === 'online'
                  ? `Express API Online (Uptime: ${apiHealth.uptime}s)`
                  : 'Express API Offline or Unreachable on :5000'
              }
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiHealth.status === 'online'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />
              <span className="text-slate-300 font-mono text-[11px]">
                {apiHealth.status === 'online' ? 'API :5000' : 'API Offline'}
              </span>
            </div>

            {/* Methodology & Citations */}
            <button
              onClick={onOpenMethodology}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Methodology</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/50 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
                  isActive
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
