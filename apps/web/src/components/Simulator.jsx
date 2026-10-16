import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  Droplets,
  Server,
  Layers,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Leaf,
  DollarSign,
  Download,
  Copy,
  Scale,
  Home,
  Train,
  TreeDeciduous,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { runSimulationWithFallback, GRID_EMISSION_FACTORS } from '../utils/calculatorEngine';

const PRESETS = [
  {
    name: 'Hyperscale Cloud Campus',
    desc: 'Large multitenant facility (e.g. Navi Mumbai, Greater Noida)',
    icon: '🏢',
    inputs: { itLoadMW: 50, pue: 1.40, utilisation: 0.80, renewableShare: 0.50, wue: 1.20 }
  },
  {
    name: 'Dense AI Training SuperPOD',
    desc: 'Direct-to-chip liquid cooled GPU cluster with continuous load',
    icon: '🤖',
    inputs: { itLoadMW: 100, pue: 1.22, utilisation: 0.95, renewableShare: 0.40, wue: 0.40 }
  },
  {
    name: 'Regional Edge POP',
    desc: 'Low-latency regional edge node with closed-loop dry chillers',
    icon: '📡',
    inputs: { itLoadMW: 5, pue: 1.55, utilisation: 0.65, renewableShare: 0.25, wue: null }
  },
  {
    name: 'Immersion Net-Zero Target',
    desc: 'Two-phase dielectric liquid cooling with 100% clean power matching',
    icon: '❄️',
    inputs: { itLoadMW: 25, pue: 1.08, utilisation: 0.90, renewableShare: 1.00, wue: 0.0 }
  }
];

export default function Simulator({ initialFacility }) {
  // Input states
  const [itLoadMW, setItLoadMW] = useState(initialFacility?.reportedCapacityMW || 25);
  const [pue, setPue] = useState(1.35);
  const [utilisation, setUtilisation] = useState(0.80);
  const [renewableShare, setRenewableShare] = useState(0.40);
  const [includeWater, setIncludeWater] = useState(true);
  const [wue, setWue] = useState(1.20);
  const [gridRegion, setGridRegion] = useState('national');

  // Comparison mode (Scenario A vs Scenario B)
  const [comparisonActive, setComparisonActive] = useState(false);
  const [savedBenchmark, setSavedBenchmark] = useState(null);

  // Simulation result
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Sync if initialFacility changes
  useEffect(() => {
    if (initialFacility?.reportedCapacityMW) {
      setItLoadMW(initialFacility.reportedCapacityMW);
    }
  }, [initialFacility]);

  // Execute simulation
  useEffect(() => {
    let mounted = true;

    async function execute() {
      setLoading(true);
      const res = await runSimulationWithFallback({
        itLoadMW,
        pue,
        utilisation,
        renewableShare,
        wue: includeWater && wue !== '' && wue !== null ? Number(wue) : null,
        gridRegion
      });

      if (mounted) {
        setResult(res);
        setLoading(false);
      }
    }

    const timer = setTimeout(execute, 80);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [itLoadMW, pue, utilisation, renewableShare, includeWater, wue, gridRegion]);

  // Apply preset
  const applyPreset = (preset) => {
    setItLoadMW(preset.inputs.itLoadMW);
    setPue(preset.inputs.pue);
    setUtilisation(preset.inputs.utilisation);
    setRenewableShare(preset.inputs.renewableShare);
    if (preset.inputs.wue === null) {
      setIncludeWater(false);
      setWue(1.2);
    } else {
      setIncludeWater(true);
      setWue(preset.inputs.wue);
    }
  };

  // Save current as Benchmark
  const handleSaveBenchmark = () => {
    if (result) {
      setSavedBenchmark({
        inputs: { itLoadMW, pue, utilisation, renewableShare, wue: includeWater ? wue : null },
        outputs: result.outputs,
        derived: result.derived
      });
      setComparisonActive(true);
    }
  };

  // Generate 24-hour diurnal profile data
  const diurnalData = useMemo(() => {
    if (!result?.outputs) return [];
    const facilityMW = result.outputs.facilityPowerMW;
    const reShare = renewableShare;

    const hours = [];
    for (let h = 0; h < 24; h++) {
      let solarFactor = 0;
      if (h >= 6 && h <= 18) {
        solarFactor = Math.sin(((h - 6) / 12) * Math.PI);
      }
      const windFactor = 0.3 + 0.15 * Math.sin((h / 24) * 2 * Math.PI + 1);
      const cleanGenerationMW = Math.round(facilityMW * reShare * (solarFactor * 1.6 + windFactor * 0.4) * 10) / 10;
      const thermalGridMW = Math.max(0, Math.round((facilityMW - cleanGenerationMW) * 10) / 10);

      hours.push({
        hour: `${h}:00`,
        baseDemandMW: facilityMW,
        cleanGenerationMW,
        thermalGridMW
      });
    }
    return hours;
  }, [result, renewableShare]);

  // Plain-English translations
  const plainEnglish = useMemo(() => {
    if (!result?.outputs) return null;
    const gwh = result.derived.annualFacilityEnergyGWh;
    const homes = Math.round((gwh * 1000000) / 2400).toLocaleString();
    const coalTonnes = Math.round((result.outputs.renewableEquivalentKWh * 0.55) / 1000).toLocaleString();
    const trees = result.derived.treesOffsetEquivalent.toLocaleString();
    const pools = result.derived.olympicPoolsEquivalent;

    return { homes, coalTonnes, trees, pools };
  }, [result]);

  const handleExportJSON = () => {
    if (!result) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `greendc_scenario_${itLoadMW}mw.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    if (!result) return;
    const text = `GreenDC Scenario: ${itLoadMW} MW IT Load, PUE ${pue}, ${result.outputs.facilityPowerMW} MW Facility Draw, ${result.derived.annualFacilityEnergyGWh} GWh/yr, ₹${result.derived.annualElectricityBillCrores} Cr/yr bill.`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      {/* Studio Header (White & Green) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 uppercase tracking-widest font-bold">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" /> Deterministic Mathematical Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
            Facility Energy, Carbon & Water Scenario Studio
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Model physical power draw, cooling water requirements, and CEA carbon emissions for Indian data centres.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <button
            onClick={handleSaveBenchmark}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              comparisonActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            {comparisonActive ? 'Updating Delta' : 'Compare Scenarios'}
          </button>

          <button
            onClick={handleCopySummary}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 shadow-sm transition"
            title="Copy summary"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 shadow-sm transition"
            title="Download JSON Report"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {copiedNotification && (
        <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-800 text-center animate-fadeIn font-mono font-bold shadow-sm">
          Scenario summary copied to clipboard!
        </div>
      )}

      {/* Preset Archetypes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            className="text-left p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-base">{p.icon}</span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                {p.name}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1 leading-normal">
              {p.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider font-mono">
              Scenario Parameters
            </span>
            <button
              onClick={() => applyPreset(PRESETS[0])}
              className="text-slate-500 hover:text-emerald-700 transition flex items-center gap-1 text-[11px] font-semibold"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* 1. IT Load (MW) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-600" /> IT Computing Load
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setItLoadMW(Math.max(1, itLoadMW - 5))}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  value={itLoadMW}
                  onChange={(e) => setItLoadMW(Math.max(1, Number(e.target.value)))}
                  className="w-16 bg-white border border-slate-300 font-mono font-bold text-emerald-700 text-center px-1.5 py-0.5 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={() => setItLoadMW(Math.min(1000, itLoadMW + 5))}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition"
                >
                  +
                </button>
                <span className="text-slate-500 text-[11px] ml-1 font-mono font-bold">MW</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              step="1"
              value={itLoadMW}
              onChange={(e) => setItLoadMW(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[5, 15, 30, 50, 100, 150].map((mw) => (
                <button
                  key={mw}
                  onClick={() => setItLoadMW(mw)}
                  className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-lg transition ${
                    itLoadMW === mw
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  {mw} MW
                </button>
              ))}
            </div>
          </div>

          {/* 2. PUE (Power Usage Effectiveness) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-teal-600" /> Power Usage Effectiveness (PUE)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPue(Math.max(1.0, Math.round((pue - 0.05) * 100) / 100))}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition"
                >
                  -
                </button>
                <span className="font-mono font-extrabold text-teal-700 text-xs w-12 text-center">
                  {pue.toFixed(2)}
                </span>
                <button
                  onClick={() => setPue(Math.min(2.0, Math.round((pue + 0.05) * 100) / 100))}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition"
                >
                  +
                </button>
              </div>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.02"
              value={pue}
              onChange={(e) => setPue(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>1.05 (Immersion)</span>
              <span>1.25 (Liquid)</span>
              <span>1.45 (Chiller)</span>
              <span>1.80 (Legacy)</span>
            </div>
          </div>

          {/* 3. Server Utilisation Factor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-600" /> Server Utilisation Factor
              </span>
              <span className="font-mono font-extrabold text-cyan-700 text-xs">
                {Math.round(utilisation * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={utilisation}
              onChange={(e) => setUtilisation(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* 4. Renewable Share */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Renewable Energy Share
              </span>
              <span className="font-mono font-extrabold text-emerald-700 text-xs">
                {Math.round(renewableShare * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={renewableShare}
              onChange={(e) => setRenewableShare(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* 5. Grid Interconnect Carbon Baseline */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-900 block">
              Indian Grid Emission Factor (CEA 2024 Baseline)
            </label>
            <select
              value={gridRegion}
              onChange={(e) => setGridRegion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              {Object.entries(GRID_EMISSION_FACTORS).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.name} — {info.factor} kg CO2e/kWh
                </option>
              ))}
            </select>
          </div>

          {/* 6. Cooling Water (WUE) */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeWater}
                  onChange={(e) => setIncludeWater(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                />
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" /> Include Water (WUE)
                </span>
              </label>
              {includeWater && (
                <span className="font-mono font-extrabold text-cyan-700 text-xs">
                  {wue} L/kWh IT
                </span>
              )}
            </div>

            {includeWater ? (
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={wue}
                  onChange={(e) => setWue(Number(e.target.value))}
                  className="w-full accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.0 (Zero-Water Dry)</span>
                  <span>0.4 (Direct Liquid)</span>
                  <span>1.8 (Cooling Tower)</span>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500">
                Water reported as Unavailable per GreenDC Missing-Data policy.
              </p>
            )}
          </div>
        </div>

        {/* Outputs Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Connected Power Banner */}
          {result && (
            <div className="p-5 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block font-bold">
                    Total Connected Facility Power
                  </span>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                      {result.outputs.facilityPowerMW}
                    </span>
                    <span className="text-base font-extrabold text-emerald-600">MW</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center px-3 py-1 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs shadow-sm">
                    Grade {result.derived.efficiencyGrade}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                    {result.derived.efficiencyText}
                  </span>
                </div>
              </div>

              {/* Power Breakdown Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-700 font-mono font-bold">
                  <span>IT Load: {result.inputs.itLoadMW} MW</span>
                  <span className="text-amber-700">Overhead: {Math.round((result.outputs.facilityPowerMW - result.inputs.itLoadMW) * 100) / 100} MW</span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex border border-slate-300/50">
                  <div
                    style={{ width: `${(result.inputs.itLoadMW / result.outputs.facilityPowerMW) * 100}%` }}
                    className="bg-emerald-500 h-full"
                  />
                  <div
                    style={{ width: `${((result.outputs.facilityPowerMW - result.inputs.itLoadMW) / result.outputs.facilityPowerMW) * 100}%` }}
                    className="bg-amber-400 h-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Primary Metric Grid (Clean White Cards) */}
          {result && (
            <div className="grid grid-cols-2 gap-3">
              {/* Annual Energy */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block font-bold">
                  Annual Facility Energy
                </span>
                <div>
                  <span className="text-xl font-extrabold text-slate-900 font-mono">
                    {result.derived.annualFacilityEnergyGWh.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-bold ml-1">GWh/yr</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-100 flex justify-between font-mono">
                  <span>IT: {result.derived.annualITEnergyGWh} GWh</span>
                  <span className="text-amber-700">Loss: {result.derived.annualOverheadGWh} GWh</span>
                </div>
              </div>

              {/* Annual Cost */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block font-bold">
                  Annual Power Bill (₹ INR)
                </span>
                <div>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">
                    ₹{result.derived.annualElectricityBillCrores}
                  </span>
                  <span className="text-xs text-slate-500 font-bold ml-1">Cr / yr</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                  Commercial HT tariff @ ₹7.65/kWh
                </div>
              </div>

              {/* Net Scope 2 CO2 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block font-bold">
                  Net Scope 2 Emissions
                </span>
                <div>
                  <span className="text-xl font-extrabold text-slate-900 font-mono">
                    {result.derived.netEmissionsTonnes.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-bold ml-1">T CO2/yr</span>
                </div>
                <div className="text-[10px] text-emerald-700 pt-1.5 border-t border-slate-100 font-bold">
                  Avoided: -{result.derived.avoidedEmissionsTonnes.toLocaleString()} T
                </div>
              </div>

              {/* Annual Water */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block font-bold">
                  Cooling Water Draw
                </span>
                <div>
                  {result.outputs.estimatedWaterML !== null ? (
                    <div>
                      <span className="text-xl font-extrabold text-cyan-700 font-mono">
                        {result.outputs.estimatedWaterML}
                      </span>
                      <span className="text-xs text-slate-500 font-bold ml-1">ML/yr</span>
                    </div>
                  ) : (
                    <span className="text-base text-slate-400 font-mono font-bold">Unavailable</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-100 font-mono">
                  {result.derived.dailyWaterKL ? `${result.derived.dailyWaterKL} kL/day` : 'WUE omitted'}
                </div>
              </div>
            </div>
          )}

          {/* Plain-English Real World Context Translation Card */}
          {plainEnglish && (
            <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 space-y-2.5 shadow-sm">
              <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold tracking-wider block">
                Real-World Equivalent in Indian Society
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <Home className="w-3.5 h-3.5 text-teal-600 mb-1" />
                  <span className="font-extrabold text-slate-900 font-mono text-sm block">~{plainEnglish.homes}</span>
                  <span className="text-[10px] text-slate-500">Indian households</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <Train className="w-3.5 h-3.5 text-amber-600 mb-1" />
                  <span className="font-extrabold text-slate-900 font-mono text-sm block">~{plainEnglish.coalTonnes} T</span>
                  <span className="text-[10px] text-slate-500">Coal burning avoided</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600 mb-1" />
                  <span className="font-extrabold text-cyan-700 font-mono text-sm block">
                    {plainEnglish.pools !== null ? `${plainEnglish.pools} Pools` : '—'}
                  </span>
                  <span className="text-[10px] text-slate-500">Olympic pools evaporated</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <TreeDeciduous className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                  <span className="font-extrabold text-emerald-700 font-mono text-sm block">~{plainEnglish.trees}</span>
                  <span className="text-[10px] text-slate-500">Trees to absorb net CO2</span>
                </div>
              </div>
            </div>
          )}

          {/* Diurnal Load vs Renewable Matching Curve */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">24-Hour Diurnal Load vs Clean Energy</h4>
                <p className="text-[10px] text-slate-500">Continuous IT base load against simulated solar daytime peak.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold">
                Diurnal Model
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={diurnalData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} unit=" MW" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs space-y-0.5 shadow-md">
                            <p className="font-bold text-slate-900">{data.hour}</p>
                            <p className="text-slate-600 font-mono text-[11px]">Base: {data.baseDemandMW} MW</p>
                            <p className="text-emerald-600 font-mono text-[11px] font-bold">Clean: {data.cleanGenerationMW} MW</p>
                            <p className="text-amber-600 font-mono text-[11px]">Thermal Grid: {data.thermalGridMW} MW</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="cleanGenerationMW" stackId="1" stroke="#059669" fill="#10b981" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="thermalGridMW" stackId="1" stroke="#f59e0b" fill="#fbbf24" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Comparison View (When Active) */}
          {comparisonActive && savedBenchmark && result && (
            <div className="bg-emerald-50/80 border border-emerald-300 p-4 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-700" /> Scenario Delta Comparison
                </span>
                <button
                  onClick={() => setComparisonActive(false)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono font-bold">Facility Power</span>
                  <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                    {result.outputs.facilityPowerMW} MW
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${
                    result.outputs.facilityPowerMW <= savedBenchmark.outputs.facilityPowerMW ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {(result.outputs.facilityPowerMW - savedBenchmark.outputs.facilityPowerMW).toFixed(1)} MW
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono font-bold">Annual Power Cost</span>
                  <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                    ₹{result.derived.annualElectricityBillCrores} Cr
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${
                    result.derived.annualElectricityBillCrores <= savedBenchmark.derived.annualElectricityBillCrores ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {(result.derived.annualElectricityBillCrores - savedBenchmark.derived.annualElectricityBillCrores).toFixed(1)} Cr
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono font-bold">Net Scope-2 CO2</span>
                  <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                    {result.derived.netEmissionsTonnes.toLocaleString()} T
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${
                    result.derived.netEmissionsTonnes <= savedBenchmark.derived.netEmissionsTonnes ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {(result.derived.netEmissionsTonnes - savedBenchmark.derived.netEmissionsTonnes).toLocaleString()} T
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
