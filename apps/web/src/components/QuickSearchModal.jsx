import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Server, MapPin, Zap, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { FACILITIES, STATE_SUMMARIES } from '../data/facilitiesData';

export default function QuickSearchModal({ isOpen, onClose, onSelectFacility, onSelectState, onOpenSimulatorWithPreset }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd/Ctrl + K and Escape) & browser Back button
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.history.pushState({ modalOpen: true }, '');
    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter facilities
  const matchedFacilities = FACILITIES.filter(f => 
    !cleanQuery ||
    f.name.toLowerCase().includes(cleanQuery) ||
    f.operator.toLowerCase().includes(cleanQuery) ||
    f.city.toLowerCase().includes(cleanQuery) ||
    f.state.toLowerCase().includes(cleanQuery)
  ).slice(0, 5);

  // Filter states
  const matchedStates = Object.keys(STATE_SUMMARIES).filter(s =>
    !cleanQuery || s.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn select-none">
      <div 
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search data centre campus, operator, Indian state, or city..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-700 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Facilities Section */}
          {matchedFacilities.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 flex items-center justify-between font-mono">
                <span>Facilities & Campuses</span>
                <span className="text-[10px] text-emerald-700 font-bold">{matchedFacilities.length} found</span>
              </div>
              <div className="space-y-1.5 mt-1">
                {matchedFacilities.map((fac) => (
                  <button
                    key={fac.id}
                    onClick={() => {
                      onSelectFacility(fac);
                      onClose();
                    }}
                    className="w-full text-left px-3.5 py-3 rounded-2xl hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200 flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition flex items-center gap-2">
                          {fac.name}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            fac.status === 'Operational' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {fac.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {fac.operator} • {fac.city}, {fac.state}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-extrabold text-emerald-700 text-xs">
                        {fac.reportedCapacityMW ? `${fac.reportedCapacityMW} MW` : 'Undisclosed'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Load</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* States Section */}
          {matchedStates.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 flex items-center justify-between font-mono">
                <span>Indian States & Grid Baselines</span>
                <span className="text-[10px] text-cyan-700 font-bold">{matchedStates.length} found</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {matchedStates.map((st) => {
                  const summ = STATE_SUMMARIES[st];
                  return (
                    <button
                      key={st}
                      onClick={() => {
                        onSelectState(st);
                        onClose();
                      }}
                      className="text-left p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                          {st}
                        </span>
                        <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {summ.facilityCount} Facilities • {summ.knownCapacityMW} MW Known
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {matchedFacilities.length === 0 && matchedStates.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No results found for "{query}". Try searching "Mumbai", "Noida", or "Adani".
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span>Type to search</span>
            <span>•</span>
            <span>Click to select</span>
          </div>
          <span className="font-mono text-emerald-700 font-bold">GreenDC Quick Finder</span>
        </div>
      </div>
    </div>
  );
}
