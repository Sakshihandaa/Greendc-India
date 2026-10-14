import React from 'react';
import {
  Server,
  Zap,
  Droplets,
  Layers,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getNationalStats, STATE_SUMMARIES, FACILITIES } from '../data/facilitiesData';

export default function Overview({ onNavigateToMap, onNavigateToSimulator }) {
  const stats = getNationalStats();

  // Prepare chart data for state capacity breakdown
  const stateCapacityData = Object.entries(STATE_SUMMARIES)
    .map(([name, summary]) => ({
      name,
      capacityMW: summary.knownCapacityMW || 0,
      facilities: summary.facilityCount
    }))
    .sort((a, b) => b.capacityMW - a.capacityMW);

  // Status breakdown data for donut chart
  const statusData = [
    { name: 'Operational', value: stats.operationalCount, color: '#10b981' },
    { name: 'Under Construction', value: stats.underConstructionCount, color: '#f59e0b' },
    { name: 'Planned', value: stats.plannedCount, color: '#64748b' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero / Vision Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Decarbonising India's Compute Infrastructure
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Geospatial & Sustainability Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-mint-400">Indian Data Centres</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            As AI clusters and cloud hyperscalers expand rapidly across Mumbai, NCR, Chennai, and Bengaluru, power density and cooling water demand create localized infrastructural stress. GreenDC India brings verifiable public indicators and transparent physics-based simulation into a unified research platform.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToMap}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              Explore India Map
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700/80 transition"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              Run Facility Simulator
            </button>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </div>

      {/* Verified National Infrastructure KPIs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Curated National Indicators</h2>
            <p className="text-xs text-slate-400">Verified from public announcements and Central Electricity Authority records.</p>
          </div>
          <span className="text-[11px] font-medium text-amber-400/90 bg-amber-950/50 border border-amber-800/60 px-2.5 py-1 rounded-lg">
            Catalog Sample: 12 Major Facilities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Curated Facilities */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documented Campuses</span>
              <div className="p-2 bg-emerald-950 rounded-xl border border-emerald-800/80">
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-white">{stats.totalFacilities}</span>
              <span className="text-xs text-slate-400 ml-2">campuses in 7 states</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>{stats.operationalCount} Operational</span>
              <span>{stats.underConstructionCount} Under Const.</span>
            </div>
          </div>

          {/* Documented IT Load */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified IT Capacity</span>
              <div className="p-2 bg-teal-950 rounded-xl border border-teal-800/80">
                <Zap className="w-4 h-4 text-teal-400" />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{stats.totalReportedCapacityMW}</span>
              <span className="text-sm font-semibold text-slate-400">MW IT Load</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              Sum of explicitly reported phase capacities
            </div>
          </div>

          {/* Regional Concentration */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">State Density</span>
              <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                <Layers className="w-4 h-4 text-mint-400" />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">49%</span>
              <span className="text-xs text-slate-400">in Maharashtra</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              Navi Mumbai & Chandivali lead coastal connectivity
            </div>
          </div>

          {/* Design Efficiency Benchmarks */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Design PUE Range</span>
              <div className="p-2 bg-cyan-950 rounded-xl border border-cyan-800/80">
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">1.35 – 1.50</span>
              <span className="text-xs text-slate-400">design claimed</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              Water reporting (WUE) remains largely undisclosed
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Capacity Distribution Bar Chart */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Documented IT Power by State (MW)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated sample of major enterprise campuses from corporate disclosures.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Unit: Megawatts (MW)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateCapacityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950/95 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs text-slate-200">
                          <strong className="text-white block">{data.name}</strong>
                          <div className="mt-1">
                            Documented IT Load: <span className="text-emerald-400 font-bold">{data.capacityMW} MW</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Facilities counted: {data.facilities}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="capacityMW" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Pipeline Donut Chart */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Facility Pipeline Status
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown across the 12 curated campuses.
            </p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-slate-950/95 border border-slate-700 p-2 rounded-lg text-xs text-white">
                          <span>{data.name}: <strong>{data.value}</strong></span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 border-t border-slate-800 pt-3">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value} campuses</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure Themes & Methodological Guardrails */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <Zap className="w-4 h-4" />
            Grid Renewable Penetration
          </div>
          <h4 className="text-sm font-bold text-white">Renewable Open-Access vs 24/7 Match</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            While Karnataka (52%) and Tamil Nadu (49%) lead in installed renewable percentage, intermittent solar/wind requires battery storage or firm contracts to sustain continuous data-centre baseloads without fossil backup.
          </p>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <Droplets className="w-4 h-4" />
            Cooling & Water Vulnerability
          </div>
          <h4 className="text-sm font-bold text-white">The Hidden Cost of Evaporative Cooling</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hyperscalers using wet cooling towers in water-stressed districts (e.g. Noida, Chennai, Bengaluru) face municipal restrictions and groundwater over-extraction risks. Operators increasingly turn to closed-loop chillers and treated STP effluent.
          </p>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            Data Quality & Integrity Rules
          </div>
          <h4 className="text-sm font-bold text-white">No Fabricated Metrics</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            GreenDC India refuses to invent facility counts or state renewable shares. Where official disclosures do not exist, fields are flagged as "Not reported" or "Unavailable" to avoid misleading decision-makers.
          </p>
        </div>
      </div>
    </div>
  );
}
