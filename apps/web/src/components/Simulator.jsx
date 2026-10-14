import React, { useState, useEffect } from 'react';
import {
  Zap,
  Droplets,
  Server,
  Layers,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

const PRESETS = [
  {
    name: 'Hyperscale Cloud DC',
    desc: 'Large multitenant campus (e.g. Navi Mumbai, Greater Noida)',
    inputs: { itLoadMW: 50, pue: 1.4, utilisation: 0.8, renewableShare: 0.5, wue: 1.2 }
  },
  {
    name: 'High-Density AI Training Cluster',
    desc: 'Liquid-cooled dense GPU deployment with high utilization',
    inputs: { itLoadMW: 100, pue: 1.25, utilisation: 0.9, renewableShare: 0.4, wue: 0.8 }
  },
  {
    name: 'Regional Edge Data Centre',
    desc: 'Lower capacity point-of-presence without local water cooling',
    inputs: { itLoadMW: 5, pue: 1.55, utilisation: 0.65, renewableShare: 0.25, wue: null }
  },
  {
    name: 'Zero-Water Air-Cooled Facility',
    desc: 'Closed-loop dry coolers / air economizers (WUE = 0.0)',
    inputs: { itLoadMW: 20, pue: 1.45, utilisation: 0.75, renewableShare: 0.6, wue: 0.0 }
  }
];

export default function Simulator() {
  // Input states
  const [itLoadMW, setItLoadMW] = useState(10);
  const [pue, setPue] = useState(1.5);
  const [utilisation, setUtilisation] = useState(0.8); // 0.0 to 1.0
  const [renewableShare, setRenewableShare] = useState(0.4); // 0.0 to 1.0
  const [includeWater, setIncludeWater] = useState(true);
  const [wue, setWue] = useState(1.2); // L/kWh IT

  // API response state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showFormulaDrawer, setShowFormulaDrawer] = useState(false);

  // Call Express API endpoint POST /api/simulations/calculate
  const runSimulation = async (customInputs = null) => {
    setLoading(true);
    setApiError(null);

    const payload = customInputs || {
      itLoadMW: Number(itLoadMW),
      pue: Number(pue),
      utilisation: Number(utilisation),
      renewableShare: Number(renewableShare),
      wue: includeWater && wue !== '' && wue !== null ? Number(wue) : null
    };

    try {
      const response = await fetch('/api/simulations/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error?.message || 'Simulation calculation failed.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setApiError('Unable to connect to Express API on port 5000. Ensure npm run start:api is running.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Run calculation on initial mount and when parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 200);
    return () => clearTimeout(timer);
  }, [itLoadMW, pue, utilisation, renewableShare, includeWater, wue]);

  // Load a preset
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

  // Data for power breakdown chart
  const powerBreakdownData = result
    ? [
        {
          name: 'Power (MW)',
          itPower: result.inputs.itLoadMW,
          facilityOverhead: Math.round((result.outputs.facilityPowerMW - result.inputs.itLoadMW) * 100) / 100
        }
      ]
    : [];

  // Data for utilisation sensitivity curve
  const sensitivityData = result
    ? [0.2, 0.4, 0.6, 0.8, 1.0].map((u) => {
        const itEnergyGWh = Math.round((result.inputs.itLoadMW * 1000 * 8760 * u) / 1000000);
        const facilityEnergyGWh = Math.round(itEnergyGWh * result.inputs.pue);
        return {
          utilPercent: `${Math.round(u * 100)}%`,
          itEnergyGWh,
          facilityEnergyGWh
        };
      })
    : [];

  return (
    <div className="space-y-8">
      {/* Simulator Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Facility Energy & Water Demand Simulator
            </h2>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Deterministic Math Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compute annual power, energy, cooling water, and renewable-equivalent demand from first principles via GreenDC's backend API.
          </p>
        </div>

        {/* Presets dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              title={p.desc}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs Column & Results Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Controls Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Scenario Assumptions
            </h3>
            <span className="text-[11px] text-slate-400">Validated Ranges</span>
          </div>

          {/* Input 1: IT Load (MW) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">
                IT Load (<span className="text-emerald-400 font-mono">MW</span>)
              </label>
              <span className="font-mono text-sm font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {itLoadMW} MW
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              step="1"
              value={itLoadMW}
              onChange={(e) => setItLoadMW(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 MW (Edge)</span>
              <span>50 MW (Hyperscale)</span>
              <span>200 MW (Mega-campus)</span>
            </div>
          </div>

          {/* Input 2: PUE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1">
                Power Usage Effectiveness (<span className="text-teal-400 font-mono">PUE</span>)
              </label>
              <span className="font-mono text-sm font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {pue.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={pue}
              onChange={(e) => setPue(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1.00 (Ideal)</span>
              <span>1.35 (Green DC)</span>
              <span>2.00 (Legacy)</span>
            </div>
          </div>

          {/* Input 3: Utilisation (%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">
                Server Utilisation Factor (<span className="text-mint-400 font-mono">%</span>)
              </label>
              <span className="font-mono text-sm font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
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
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10% (Idle)</span>
              <span>50% (Standard Enterprise)</span>
              <span>100% (Continuous AI)</span>
            </div>
          </div>

          {/* Input 4: Renewable Share (%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">
                Renewable Share Assumption (<span className="text-emerald-400 font-mono">%</span>)
              </label>
              <span className="font-mono text-sm font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
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
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Hypothetical scenario PPA or green tariff fraction. Not verified physical electron matching.
            </p>
          </div>

          {/* Input 5: Water Usage Effectiveness (WUE) Toggle & Slider */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={includeWater}
                  onChange={(e) => setIncludeWater(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
                />
                Include Cooling Water Estimate
              </label>
              {!includeWater && (
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  WUE Omitted
                </span>
              )}
            </div>

            {includeWater ? (
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    WUE (<span className="text-cyan-400 font-mono">L/kWh IT energy</span>)
                  </span>
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {wue.toFixed(1)} L/kWh
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={wue}
                  onChange={(e) => setWue(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.0 (Air/Direct dry)</span>
                  <span>1.2 (Moderate tower)</span>
                  <span>2.5+ (High evaporation)</span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 italic">
                WUE is left unspecified. The platform strictly reports water consumption as <strong>unavailable</strong> rather than misleadingly defaulting to zero.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output KPI Cards, Recharts, & Transparency (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* API Error Notification */}
          {apiError && (
            <div className="bg-red-950/60 border border-red-800 p-4 rounded-2xl flex items-start gap-3 text-red-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="font-bold text-red-300">Calculation Error</p>
                <p className="mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* Loading state indicator */}
          {loading && (
            <div className="text-center py-2 text-xs text-emerald-400 font-medium animate-pulse flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Computing deterministic simulation via Express API...
            </div>
          )}

          {/* Output Cards Grid */}
          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Facility Power (MW) */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Connected Power
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                    Calculated Estimate
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {result.outputs.facilityPowerMW}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">MW</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  IT Load ({result.inputs.itLoadMW} MW) × PUE ({result.inputs.pue})
                </p>
              </div>

              {/* Card 2: Annual Facility Energy (GWh/year) */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Annual Facility Energy
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-teal-950 text-teal-400 font-bold border border-teal-800">
                    Calculated Estimate
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {(result.outputs.annualFacilityEnergyKWh / 1000000).toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">GWh / year</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {result.outputs.annualFacilityEnergyKWh.toLocaleString()} kWh/yr
                </p>
              </div>

              {/* Card 3: Renewable-Equivalent Scenario Energy */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Renewable-Equivalent
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800">
                    Scenario Estimate
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {(result.outputs.renewableEquivalentKWh / 1000000).toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">GWh / year</span>
                </div>
                <p className="text-[10px] text-amber-300/80 leading-snug">
                  Scenario estimate based on {Math.round(result.inputs.renewableShare * 100)}% entered share. Not physical supply proof.
                </p>
              </div>

              {/* Card 4: Estimated Water Consumption */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Cooling Water Demand
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold border ${
                      result.outputs.estimatedWaterML !== null
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {result.outputs.estimatedWaterML !== null ? 'Calculated Estimate' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  {result.outputs.estimatedWaterML !== null ? (
                    <>
                      <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
                        {result.outputs.estimatedWaterML.toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-slate-400">ML / year</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-slate-500 py-1">
                      Not Reported
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {result.outputs.estimatedWaterLitres !== null
                    ? `${result.outputs.estimatedWaterLitres.toLocaleString()} Litres`
                    : 'WUE omitted — no assumption made'}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Recharts: Power Overhead & Energy Sensitivity */}
          {result && (
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Power Breakdown & Energy Sensitivity Curve
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Annual electricity demand across utilisation rates (20% – 100%).
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Unit: GWh / year</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensitivityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="utilPercent" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-slate-950/95 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs text-slate-200">
                              <strong className="text-white block">Utilisation: {item.utilPercent}</strong>
                              <div className="text-emerald-400 mt-1">
                                Facility Total: <strong>{item.facilityEnergyGWh} GWh</strong>
                              </div>
                              <div className="text-slate-400 text-[10px]">
                                IT Payload: {item.itEnergyGWh} GWh
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="facilityEnergyGWh"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Facility Energy"
                    />
                    <Line
                      type="monotone"
                      dataKey="itEnergyGWh"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ fill: '#0ea5e9', r: 3 }}
                      name="IT Energy"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Formula & Methodological Transparency Drawer */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowFormulaDrawer(!showFormulaDrawer)}
              className="w-full px-5 py-3 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/90 transition"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                Mathematical Formulas & Calculation Rules (FR-03 to FR-05)
              </span>
              {showFormulaDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFormulaDrawer && (
              <div className="p-5 border-t border-slate-800 space-y-3 text-xs text-slate-300 bg-slate-950/60 font-mono">
                <div className="space-y-1">
                  <span className="text-emerald-400 font-semibold">1. Facility Power (MW):</span>
                  <p className="text-slate-400 pl-3">IT Load (MW) × PUE = {itLoadMW} × {pue} = {itLoadMW * pue} MW</p>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-semibold">2. Annual IT Energy (kWh):</span>
                  <p className="text-slate-400 pl-3">IT Load (MW) × 1,000 × 8,760 × Utilisation</p>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-semibold">3. Annual Facility Energy (kWh):</span>
                  <p className="text-slate-400 pl-3">IT Load (MW) × 1,000 × PUE × 8,760 × Utilisation</p>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-semibold">4. Renewable-Equivalent (kWh):</span>
                  <p className="text-slate-400 pl-3">Annual Facility Energy × Renewable Share</p>
                </div>
                <div className="space-y-1">
                  <span className="text-cyan-400 font-semibold">5. Estimated Water Consumption:</span>
                  <p className="text-slate-400 pl-3">Annual IT Energy (kWh) × WUE (L/kWh IT energy) ÷ 1,000,000 [ML]</p>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800 font-sans italic">
                  Note: All calculation arithmetic is performed deterministically on the Express API backend without LLM hallucination.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
