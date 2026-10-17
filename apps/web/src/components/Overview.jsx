import React, { useState, useMemo } from 'react';
import {
  Server,
  Zap,
  Droplets,
  Layers,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileText,
  Search,
  Sliders,
  Filter,
  Sparkles,
  ExternalLink,
  Cpu,
  TrendingDown,
  Globe
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

export default function Overview({ onNavigateToMap, onNavigateToSimulator, onSelectFacilityForSimulator, onSelectFacilityForMap }) {
  const stats = getNationalStats();
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogStatus, setCatalogStatus] = useState('All');
  const [catalogState, setCatalogState] = useState('All');

  // Quick sandbox mini-calculator state
  const [sandboxMW, setSandboxMW] = useState(50);
  const [sandboxPUE, setSandboxPUE] = useState(1.4);

  // State Capacity breakdown data for Recharts
  const stateCapacityData = useMemo(() => {
    return Object.entries(STATE_SUMMARIES)
      .map(([name, summary]) => ({
        name,
        capacityMW: summary.knownCapacityMW || 0,
        facilities: summary.facilityCount,
        reShareNum: parseFloat(summary.gridContext?.reShareProxy) || 30
      }))
      .sort((a, b) => b.capacityMW - a.capacityMW);
  }, []);

  // Status breakdown data for Donut Chart
  const statusData = useMemo(() => [
    { name: 'Operational', value: stats.operationalCount, color: '#10b981' },
    { name: 'Under Construction', value: stats.underConstructionCount, color: '#f59e0b' },
    { name: 'Planned', value: stats.plannedCount, color: '#64748b' }
  ], [stats]);

  // Filtered facilities for catalog
  const filteredFacilities = useMemo(() => {
    return FACILITIES.filter((f) => {
      const matchSearch = !catalogSearch ||
        f.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        f.operator.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        f.city.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchStatus = catalogStatus === 'All' || f.status === catalogStatus;
      const matchState = catalogState === 'All' || f.state === catalogState;
      return matchSearch && matchStatus && matchState;
    });
  }, [catalogSearch, catalogStatus, catalogState]);

  // Unique states list for filter
  const stateOptions = useMemo(() => {
    const set = new Set(FACILITIES.map(f => f.state));
    return ['All', ...Array.from(set)];
  }, []);

  // Sandbox quick calculation
  const sandboxFacilityPower = Math.round(sandboxMW * sandboxPUE * 10) / 10;
  const sandboxOverhead = Math.round((sandboxFacilityPower - sandboxMW) * 10) / 10;
  const sandboxAnnualGWh = Math.round((sandboxFacilityPower * 8760 * 0.8) / 1000);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero / Executive ESG Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1222] via-[#09101d] to-[#041d14] border border-slate-800/90 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            National Infrastructure & Clean Energy Decision Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
            Sustainability & Location Intelligence for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Indian Data Centres
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            As AI supercomputing clusters and hyperscalers expand rapidly across Mumbai, Noida, Chennai, and Bengaluru, power density and cooling water demand create acute regional stress. GreenDC India provides transparent physics-based simulation, verified public metrics, and geospatial location intelligence.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToSimulator}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              Launch Carbon & Cost Simulator
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToMap}
              className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700/80 transition"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              Explore India Geospatial Map
            </button>
          </div>
        </div>

        {/* Futuristic glowing cyber rings background decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute right-40 bottom-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -mb-20"></div>
      </div>

      {/* Verified National Infrastructure KPIs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-heading flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              Curated National ESG Indicators
            </h2>
            <p className="text-xs text-slate-400">
              Verified from enterprise disclosures, Uptime Institute certifications, and Central Electricity Authority (CEA) records.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-xl self-start sm:self-auto">
            12 Major Campuses • 7 States
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Curated Campuses */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documented Campuses</span>
              <div className="p-2 bg-emerald-950/80 rounded-xl border border-emerald-800/80 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.totalFacilities}</span>
              <span className="text-xs text-slate-400 ml-2">campuses in {stats.statesWithFacilities} states</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span className="text-emerald-400 font-semibold">{stats.operationalCount} Operational</span>
              <span className="text-amber-400 font-semibold">{stats.underConstructionCount} Under Const.</span>
            </div>
          </div>

          {/* Verified IT Capacity */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-teal-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified IT Capacity</span>
              <div className="p-2 bg-teal-950/80 rounded-xl border border-teal-800/80 text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.totalReportedCapacityMW}</span>
              <span className="text-sm font-semibold text-slate-400">MW IT Load</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>Facility Connected Power:</span>
              <span className="text-teal-300 font-mono font-semibold">~415 MW</span>
            </div>
          </div>

          {/* Regional Concentration */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Epicentre</span>
              <div className="p-2 bg-cyan-950/80 rounded-xl border border-cyan-800/80 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">54%</span>
              <span className="text-sm font-semibold text-slate-400">in Maharashtra</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              Navi Mumbai (Panvel, Rabale, Mahape) & Chandivali
            </div>
          </div>

          {/* Average Hyperscale PUE */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-indigo-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Modern PUE</span>
              <div className="p-2 bg-indigo-950/80 rounded-xl border border-indigo-800/80 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">1.35</span>
              <span className="text-xs text-slate-400">vs 1.62 Legacy</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>Overhead savings:</span>
              <span className="text-emerald-400 font-semibold">-43% Power Loss</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Capacity Bar Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-heading flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                State Data Centre IT Load & Clean Energy Share
              </h3>
              <p className="text-xs text-slate-400">
                Documented IT capacity in Megawatts (MW) mapped across Indian states.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              Total 286.8 MW
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateCapacityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  unit=" MW"
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white text-sm">{data.name}</p>
                          <p className="text-emerald-400 font-mono font-bold">
                            {data.capacityMW} MW IT Capacity
                          </p>
                          <p className="text-slate-300">
                            {data.facilities} Campuses Documented
                          </p>
                          <p className="text-teal-300">
                            ~{data.reShareNum}% State Renewable Capacity Share
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="capacityMW"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Commissioning Status Donut */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight font-heading flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pipeline Commissioning
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Operational vs under-construction expansion pipeline.
            </p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0];
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-xs">
                          <p className="font-bold text-white">{item.name}</p>
                          <p className="text-emerald-400 font-mono">{item.value} Facilities</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-xs">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span>{s.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Quick Sandbox Teaser */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Instant Sensitivity Sandbox
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Test Real-Time Facility PUE & Power Overhead
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Drag the sliders below to see how IT load and cooling efficiency immediately shift connected power demand and annual electrical energy requirements.
            </p>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 w-full md:w-auto shrink-0 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Facility Power:</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{sandboxFacilityPower} MW</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Cooling & Electrical Loss:</span>
              <span className="text-sm font-semibold text-amber-400 font-mono">+{sandboxOverhead} MW</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Annual Grid Draw (80% util):</span>
              <span className="text-sm font-semibold text-teal-300 font-mono">~{sandboxAnnualGWh} GWh/yr</span>
            </div>

            <button
              onClick={onNavigateToSimulator}
              className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              Open Full Carbon & Cost Engine
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">IT Computing Load</span>
              <span className="font-mono text-emerald-400 font-bold">{sandboxMW} MW</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={sandboxMW}
              onChange={(e) => setSandboxMW(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>5 MW (Edge)</span>
              <span>50 MW (Hyperscale)</span>
              <span>200 MW (AI Campus)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">Power Usage Effectiveness (PUE)</span>
              <span className="font-mono text-teal-400 font-bold">{sandboxPUE.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.10"
              max="2.00"
              step="0.05"
              value={sandboxPUE}
              onChange={(e) => setSandboxPUE(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1.10 (Direct Liquid)</span>
              <span>1.40 (Modern Air)</span>
              <span>2.00 (Legacy)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Facilities Catalog Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight font-heading flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              Documented Data Centre Campuses in India
            </h3>
            <p className="text-xs text-slate-400">
              Explore individual facilities, verified power capacities, and launch into the simulation engine.
            </p>
          </div>

          {/* Catalog Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search facility or operator..."
                className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-48 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={catalogStatus}
              onChange={(e) => setCatalogStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Planned">Planned</option>
            </select>

            {/* State Filter */}
            <select
              value={catalogState}
              onChange={(e) => setCatalogState(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {stateOptions.map(st => (
                <option key={st} value={st}>{st === 'All' ? 'All States' : st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFacilities.map((fac) => {
            const isOp = fac.status === 'Operational';
            const isUc = fac.status === 'Under Construction';

            return (
              <div
                key={fac.id}
                className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 flex flex-col justify-between space-y-4 group transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {fac.operator}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
                      isOp
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : isUc
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {fac.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition">
                    {fac.name}
                  </h4>

                  <p className="text-xs text-slate-400 mt-1">
                    📍 {fac.city}, {fac.state}
                  </p>

                  <p className="text-xs text-slate-300/90 mt-2 line-clamp-2 leading-relaxed">
                    {fac.notes}
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block">IT Load</span>
                      <span className="font-bold text-white font-mono">
                        {fac.reportedCapacityMW ? `${fac.reportedCapacityMW} MW` : 'Undisclosed'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Racks</span>
                      <span className="font-bold text-slate-200 font-mono">
                        {fac.reportedRacks ? `${fac.reportedRacks.toLocaleString()}` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Type</span>
                      <span className="font-bold text-slate-300 font-mono">
                        {fac.facilityType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectFacilityForSimulator(fac)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Simulate Load
                    </button>
                    <button
                      onClick={() => onSelectFacilityForMap(fac)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                      title="Inspect coordinates on India map"
                    >
                      <Compass className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl text-slate-400 text-sm">
            No facilities found matching your search filters.
          </div>
        )}
      </div>
    </div>
  );
}
