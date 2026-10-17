import React, { useEffect } from 'react';
import {
  X,
  Building2,
  Server,
  Zap,
  Droplets,
  Wind,
  ShieldCheck,
  Compass,
  CheckCircle2,
  ArrowUpRight,
  ExternalLink,
  Layers,
  MapPin,
  Cpu
} from 'lucide-react';
import { getCampusIntelligence } from '../data/campusIntelligence';

export default function CampusDetailsModal({
  facility,
  isOpen,
  onClose,
  onSimulateInEngine
}) {
  // Listen to Escape key and browser back button
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Push state so browser Back button closes modal instead of exiting website
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

  if (!isOpen || !facility) return null;

  const intel = getCampusIntelligence(facility.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col transition-all duration-200 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                {facility.status || 'Operational'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {intel.tier}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {facility.city}, {facility.state}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 leading-tight">
              {facility.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Operator: <strong className="text-slate-800 dark:text-slate-200">{facility.operator}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-700 dark:text-slate-300 text-xs">
          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Commissioned IT Load</span>
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                {facility.reportedCapacityMW ? `${facility.reportedCapacityMW} MW` : 'Enterprise'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Server Racks Capacity</span>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {facility.reportedRacks ? `${facility.reportedRacks.toLocaleString()} Racks` : 'Multi-Suite'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Facility Type</span>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {facility.facilityType || 'Hyperscale'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Verification Status</span>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Public Record
              </div>
            </div>
          </div>

          {/* Section 1: Real-World Scenario & Practical Use Case */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/25 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Real-World Scenario & Purpose (Why this facility exists):
            </div>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 font-normal">
              {intel.realScenarioUseCase}
            </p>
          </div>

          {/* Section 2: Target Workloads */}
          {intel.targetWorkloads && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono">
                Key Digital Workloads & Users:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {intel.targetWorkloads.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex items-center gap-2 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Engineering Deep-Dives in 2-Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Electrical Power Grid Architecture */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Power Grid & Backup Autonomy:
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {intel.powerGridArchitecture}
              </p>
            </div>

            {/* Cooling & Water Conservation */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                Cooling Technology & Water Sourcing:
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {intel.coolingWaterStrategy}
              </p>
            </div>

            {/* Network & Subsea Connectivity */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                Network Fiber & Subsea Gateways:
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {intel.connectivityTransit}
              </p>
            </div>

            {/* Clean Energy Sourcing & PPAs */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-600" />
                Renewable Energy Contracts:
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {intel.sustainabilityPPA}
              </p>
            </div>
          </div>

          {/* Address & Source Verification */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div>
              <strong>Physical Address:</strong> {facility.address}
            </div>
            <div>
              <strong>Public Source:</strong> {facility.sourceTitle}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Coordinates: {facility.coordinates ? `${facility.coordinates[0].toFixed(4)}, ${facility.coordinates[1].toFixed(4)}` : 'Verified Region'}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs cursor-pointer flex-1 sm:flex-initial"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (onSimulateInEngine) onSimulateInEngine(facility);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer flex-1 sm:flex-initial"
            >
              <span>🚀 Simulate This Campus in Engine</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
