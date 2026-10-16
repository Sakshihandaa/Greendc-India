import React from 'react';
import {
  X,
  ExternalLink,
  Zap,
  Droplets,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getStateDetails } from '../data/facilitiesData';

export default function StateDetailPanel({ stateName, onClose, onNavigateToSimulatorWithFacility }) {
  if (!stateName) return null;

  const details = getStateDetails(stateName);

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col h-full max-h-[620px] overflow-hidden text-slate-800">
      {/* Panel Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
              {stateName}
            </h3>
            {details.hasRecords ? (
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Records
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Data Baseline
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            State & Regional Power Grid Assessment
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto space-y-4 pr-1 py-3 flex-1 text-xs">
        {/* State Summary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase font-mono">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Curated Campuses
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {details.facilityCount}
              </span>
              <span className="text-xs text-slate-500">campuses</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase font-mono">
              <Zap className="w-3.5 h-3.5 text-teal-600" /> IT Power Load
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {details.knownCapacityMW !== null ? `${details.knownCapacityMW}` : '—'}
              </span>
              {details.knownCapacityMW !== null && (
                <span className="text-xs text-slate-500">MW</span>
              )}
            </div>
          </div>
        </div>

        {/* CEA Grid & Clean Energy Profile */}
        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
            <Zap className="w-4 h-4 text-emerald-600" />
            CEA Power Grid & Clean Energy Profile
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Clean Energy Share Proxy:</span>
              <span className="font-bold text-emerald-800 font-mono">
                {details.gridContext?.reShareProxy || 'Unavailable'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 shrink-0">Installed Clean Capacity:</span>
              <span className="text-right text-slate-800 font-mono text-[11px]">
                {details.gridContext?.installedRECapacityMW || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Water Stress Profile */}
        <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 font-mono">
            <Droplets className="w-4 h-4 text-sky-600" />
            Hydrological Vulnerability (NITI Aayog / CGWB)
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {details.gridContext?.waterStress || 'Hydrological risk assessment unavailable in local catalog.'}
          </p>
        </div>

        {/* Regional Ecosystem Context */}
        {details.notes && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1 font-mono">
              Regional Ecosystem Context
            </span>
            <p className="leading-relaxed">{details.notes}</p>
          </div>
        )}

        {/* Facilities Roster */}
        {details.facilities && details.facilities.length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Campuses in {stateName} ({details.facilities.length})
            </h4>

            <div className="space-y-2">
              {details.facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 transition shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {fac.name}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      fac.status === 'Operational' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {fac.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    {fac.city} • {fac.operator}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="font-mono text-emerald-700 font-bold">
                      {fac.reportedCapacityMW ? `${fac.reportedCapacityMW} MW Load` : 'Capacity Undisclosed'}
                    </span>
                    {onNavigateToSimulatorWithFacility && (
                      <button
                        onClick={() => onNavigateToSimulatorWithFacility(fac)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        Simulate <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
