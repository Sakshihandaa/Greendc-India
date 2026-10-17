import React, { useEffect } from 'react';
import {
  X,
  Calculator,
  Info,
  MapPin,
  Server,
  Shield,
  Droplets,
  Zap,
  Activity,
  ChevronDown,
  TreeDeciduous,
  Waves,
  Scale,
  Sparkles,
  Award,
  ArrowRight,
  TrendingDown,
  Compass,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { ALL_INDIA_STATES } from '../data/allIndiaStateData';

export default function SimulationDrawer({
  isOpen,
  onClose,
  selectedState,
  setSelectedState,
  itLoadMW,
  setItLoadMW,
  pue,
  setPue,
  selectedCoolingTech,
  handleSelectCoolingTech,
  renewableShare,
  setRenewableShare,
  selectedWaterSource,
  setSelectedWaterSource,
  effectiveTariff,
  setCustomTariff,
  analysisOutputs,
  waterMetrics,
  activeStateIntel,
  activeConsoleTab,
  setActiveConsoleTab,
  capacityPresets,
  coolingPresets,
  waterSources,
  onExportPDF,
  isExportingPDF
}) {
  // Listen to Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn select-none">
      {/* Backdrop (click to close) */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Panel */}
      <div
        className="w-full sm:w-[560px] md:w-[620px] lg:w-[680px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/25">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                  Facility Siting & ESG Simulation Studio
                </h2>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Live Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                CEA 2024 Grid Baselines & CGWB Hydrological Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              title="Close Drawer (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-800 dark:text-slate-200">
          {/* EXPLICIT INFO SIGN & EXPLANATION BANNER */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-2xl flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                <span>Kya Hai Ye Facility Siting & ESG Studio? (Explanation & Use Case)</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Ye studio aapko kisi bhi AI Compute Cluster ya Enterprise Data Centre ke liye real-time power demand, annual electricity cost (₹ Cr), water stress, aur Net Scope-2 carbon emissions model karne ki suvidha deta hai. Saare calculations Central Electricity Authority (CEA 2024) aur Central Ground Water Board (CGWB) ke physical formulas par based hain.
              </p>
            </div>
          </div>

          {/* SECTION 1: FACILITY INPUT SYSTEM */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                1. Siting & Compute Parameters
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                Deterministic Inputs
              </span>
            </div>

            {/* Input 1: Siting Geography / State */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Target State / Geography:
                </label>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  35 States & UTs
                </span>
              </div>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-2.5 pr-8 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none cursor-pointer shadow-xs"
                >
                  {Object.keys(ALL_INDIA_STATES).sort().map((st) => {
                    const stData = ALL_INDIA_STATES[st];
                    return (
                      <option key={st} value={st}>
                        {stData.displayName} ({stData.code}) — {stData.tier}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Input 2: IT Computing Load (MW) + Quick Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-indigo-600" /> IT Computing Load:
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={itLoadMW}
                    onChange={(e) => setItLoadMW(Math.max(1, Number(e.target.value)))}
                    className="w-16 text-center font-mono font-black text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs py-0.5"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">MW</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-1.5">
                {capacityPresets.map((p) => (
                  <button
                    key={p.mw}
                    onClick={() => setItLoadMW(p.mw)}
                    className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold transition truncate cursor-pointer ${
                      itLoadMW === p.mw
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={itLoadMW}
                onChange={(e) => setItLoadMW(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Input 3: Cooling Technology Selector */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-600" /> Cooling System Architecture:
              </label>
              <div className="relative">
                <select
                  value={selectedCoolingTech}
                  onChange={(e) => handleSelectCoolingTech(e.target.value)}
                  className="w-full p-2.5 pr-8 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none cursor-pointer shadow-xs"
                >
                  {coolingPresets.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (PUE {c.pue} • WUE {c.wue})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Input 4: Target PUE & Clean RE PPA Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Target PUE:</span>
                  <span className="font-mono font-black text-teal-700 dark:text-teal-400">{pue.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.05"
                  max="1.80"
                  step="0.02"
                  value={pue}
                  onChange={(e) => setPue(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>1.05 (Immersion)</span>
                  <span>1.45 (Chiller)</span>
                </div>
              </div>

              <div className="space-y-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Clean RE PPA:</span>
                  <span className="font-mono font-black text-emerald-700 dark:text-emerald-400">{Math.round(renewableShare * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={renewableShare}
                  onChange={(e) => setRenewableShare(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>0% (Grid)</span>
                  <span>50%</span>
                  <span>100% (Zero)</span>
                </div>
              </div>
            </div>

            {/* Input 5: Water Sourcing Strategy & Tariff */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-600" /> Water Sourcing:
                </label>
                <select
                  value={selectedWaterSource}
                  onChange={(e) => setSelectedWaterSource(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {waterSources.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Commercial Tariff (₹/kWh):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="15.0"
                    value={effectiveTariff}
                    onChange={(e) => setCustomTariff(Number(e.target.value))}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
                  />
                  <span className="text-[10px] text-slate-400 shrink-0">₹/unit</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: INSTANT CALCULATED ESG & FINANCIAL ANALYSIS */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border-2 border-emerald-500/30 p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    2. Instant ESG & Cost Computation
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Calculated for {itLoadMW} MW IT payload in {selectedState}
                  </p>
                </div>
              </div>

              {/* ESG Rating Badge */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-[9px] font-mono text-slate-400 uppercase font-bold">ESG Rating</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 leading-none">
                    Grade {analysisOutputs?.esgGrade || 'B+'}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-sm font-mono">
                  {analysisOutputs?.compositeESGScore || 85}
                </div>
              </div>
            </div>

            {/* 4 Core KPI Stat Cards */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono font-bold">
                  <span>Total Power Draw</span>
                  <Zap className="w-3 h-3 text-amber-500" />
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                  {analysisOutputs?.facilityMW || itLoadMW} <span className="text-xs font-normal text-slate-500">MW</span>
                </div>
                <div className="text-[10px] text-slate-500">PUE Overhead: {((analysisOutputs?.facilityMW || (itLoadMW * pue)) - itLoadMW).toFixed(1)} MW</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono font-bold">
                  <span>Annual Energy Bill</span>
                  <TrendingDown className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                  ₹{analysisOutputs?.annualBillCr || analysisOutputs?.annualElectricityBillCr || 0} <span className="text-xs font-normal text-slate-500">Cr/yr</span>
                </div>
                <div className="text-[10px] text-slate-500">@ ₹{effectiveTariff}/unit HT tariff</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono font-bold">
                  <span>Net Scope-2 Carbon</span>
                  <Shield className="w-3 h-3 text-teal-600" />
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                  {(analysisOutputs?.netScope2MT || analysisOutputs?.netEmissionsMT || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">T/yr</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">Avoided: -{(analysisOutputs?.avoidedEmissionsMT || 0).toLocaleString()} T</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono font-bold">
                  <span>Cooling Water Draft</span>
                  <Droplets className="w-3 h-3 text-cyan-600" />
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                  {analysisOutputs?.waterDraftML || analysisOutputs?.annualWaterML || 0} <span className="text-xs font-normal text-slate-500">ML/yr</span>
                </div>
                <div className="text-[10px] text-slate-500">WUE {waterMetrics?.wue || 0.05} L/kWh • {selectedWaterSource}</div>
              </div>
            </div>

            {/* Deep-Dive Navigation Tabs */}
            <div className="pt-2">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveConsoleTab('energy')}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                    activeConsoleTab === 'energy'
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  ⚡ Power & Carbon Breakdown
                </button>
                <button
                  onClick={() => setActiveConsoleTab('water')}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                    activeConsoleTab === 'water'
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  💧 Water Stress & Cooling
                </button>
                <button
                  onClick={() => setActiveConsoleTab('policy')}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                    activeConsoleTab === 'policy'
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  🏛 State Incentives
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-3">
                {activeConsoleTab === 'energy' && (
                  <div className="space-y-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    <p>
                      Annual facility energy demand is <strong>{analysisOutputs?.annualEnergyGWh || analysisOutputs?.annualGWh || 0} GWh</strong>. With a <strong>{Math.round(renewableShare > 1 ? renewableShare : (renewableShare || 0) * 100)}% Clean Energy PPA</strong>, clean energy matching offsets <strong>{(analysisOutputs?.avoidedEmissionsMT || 0).toLocaleString()} Tonnes CO2/year</strong> (equivalent to planting <strong>{(analysisOutputs?.treesEquivalent || Math.round((analysisOutputs?.avoidedEmissionsMT || 0) * 45)).toLocaleString()} mature trees</strong>).
                    </p>
                  </div>
                )}

                {activeConsoleTab === 'water' && (
                  <div className="space-y-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    <p>
                      State aquifer depletion category is <strong>{activeStateIntel?.waterRisk || activeStateIntel?.waterStressRisk || 'Moderate'}</strong>. With <strong>{selectedCoolingTech}</strong>, evaporative water loss is minimized to <strong>{analysisOutputs?.waterDraftML || analysisOutputs?.annualWaterML || 0} Million Liters/year</strong>.
                    </p>
                  </div>
                )}

                {activeConsoleTab === 'policy' && (
                  <div className="space-y-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    <p>
                      <strong>{selectedState} Data Centre Policy:</strong> {activeStateIntel?.policyIncentives || activeStateIntel?.policyNotes || '100% stamp duty exemption on land purchase, electricity duty waiver for 10-15 years, and green power open access wheeling waiver.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>View On Map</span>
            </button>
            <button
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-60"
            >
              <span>{isExportingPDF ? 'Exporting...' : 'Export Audit PDF'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
