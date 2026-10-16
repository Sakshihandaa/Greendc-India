import React, { useState } from 'react';
import {
  Server,
  Zap,
  Droplets,
  Layers,
  ArrowRight,
  ShieldCheck,
  Compass,
  Sparkles,
  Cpu,
  Building2,
  TreeDeciduous,
  Home,
  Train,
  Waves,
  Eye,
  Camera,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Wind,
  Globe2
} from 'lucide-react';
import India3DCanvas, { CAMERA_PRESETS } from './India3DCanvas';
import { getNationalStats } from '../data/facilitiesData';

const REAL_WORLD_SCENARIOS = [
  {
    id: 'mumbai',
    title: 'Navi Mumbai Hyperscale Epicentre',
    state: 'Maharashtra',
    tag: 'Coastal Hyperscale Hub',
    capacity: '155 MW Verified IT Load',
    pueGoal: '1.30 – 1.40 PUE',
    realLifeSummary: 'Navi Mumbai (Panvel, Mahape, Rabale) and Chandivali host over 54% of India\'s data centre capacity, anchored by 15+ subsea cable landings and reliable power from Tata Power & MSEDCL.',
    environmentalChallenge: 'High coastal humidity during the monsoon lowers evaporative cooling efficiency. Summer municipal water rationing by MIDC forces operators toward closed-loop systems.',
    humanImpact: '155 MW continuous IT load consumes electricity equivalent to ~140,000 residential apartments in Mumbai MMR.',
    recommendedCooling: 'Direct-to-Chip Liquid Cooling with Sea Breeze Air Economizers'
  },
  {
    id: 'noida',
    title: 'Greater Noida AI Compute Corridor',
    state: 'Uttar Pradesh',
    tag: 'Inland Growth Cluster',
    capacity: '78.8 MW Phase Capacity',
    pueGoal: '1.25 – 1.35 PUE',
    realLifeSummary: 'Rapid cluster expansion driven by the UP Data Center Policy 2021 (100% stamp duty exemption, 24x7 clearances, and dedicated transmission lines in Knowledge Park V).',
    environmentalChallenge: 'Western Yamuna basin aquifer is severely depleted. CGWB strictly regulates groundwater extraction, requiring operators to harvest rainwater or tap treated municipal canal supply.',
    humanImpact: 'At standard evaporative cooling, an 80 MW campus consumes ~220 Million Litres of water annually (~88 Olympic swimming pools).',
    recommendedCooling: 'Closed-Loop Dry Coolers with Hybrid Adiabatic Boost'
  },
  {
    id: 'bengaluru',
    title: 'Bengaluru R&D & Groundwater Stress',
    state: 'Karnataka',
    tag: 'Enterprise & AI Labs',
    capacity: '15 MW Phase Capacity',
    pueGoal: '1.20 – 1.30 PUE',
    realLifeSummary: 'Leading hub for semiconductor research, cloud software, and AI model testing in Electronics City and Whitefield, connected to Karnataka\'s 52% clean power grid.',
    environmentalChallenge: 'Severe groundwater exhaustion in urban Bengaluru (borewells exceeding 800+ ft dry), coupled with municipal Cauvery water allocation quotas for tech parks.',
    humanImpact: 'Mandates zero-water cooling architectures to prevent community water table depletion.',
    recommendedCooling: 'Two-Phase Immersion or Zero-Water Dry Economizers'
  },
  {
    id: 'chennai',
    title: 'Chennai Eastern Subsea Gateway',
    state: 'Tamil Nadu',
    tag: 'East Coast Connectivity',
    capacity: '33 MW Phase 1 (100 MW Target)',
    pueGoal: '1.28 – 1.38 PUE',
    realLifeSummary: 'Primary eastern subsea cable gateway landing point connecting India to Southeast Asia and the Bay of Bengal network, backed by Tamil Nadu\'s 49% renewable wind/solar capacity.',
    environmentalChallenge: 'High pre-monsoon summer drought vulnerability. Local government mandates Tertiary Treated Reverse Osmosis (TTRO) industrial water usage rather than municipal freshwater.',
    humanImpact: 'Using TTRO water preserves ~180 Million Litres of municipal drinking water for Chennai city annually.',
    recommendedCooling: 'Tertiary Treated Recycled Water Towers + Direct-to-Chip'
  }
];

export default function LandingPage({ onNavigateToMap, onNavigateToSimulator, onNavigateToWater, onSelectFacility }) {
  const stats = getNationalStats();
  const [activeCam, setActiveCam] = useState('cinematic');
  const [selectedScenario, setSelectedScenario] = useState(REAL_WORLD_SCENARIOS[0]);

  // Mini tactile sandbox on landing page
  const [demoLoadMW, setDemoLoadMW] = useState(50);
  const [demoPUE, setDemoPUE] = useState(1.35);

  // Computed plain-English equivalents
  const facilityPowerMW = Math.round(demoLoadMW * demoPUE * 10) / 10;
  const annualEnergyGWh = Math.round((facilityPowerMW * 8760 * 0.8) / 1000);
  const equivalentHomes = Math.round((annualEnergyGWh * 1000000) / 2400).toLocaleString();
  const annualWaterML = Math.round(((demoLoadMW * 1000 * 8760 * 0.8 * 1.2) / 1000000) * 10) / 10;
  const olympicPools = Math.round(annualWaterML / 2.5);
  const annualElectricityCr = Math.round(((annualEnergyGWh * 1000000 * 7.65) / 10000000) * 10) / 10;

  return (
    <div className="space-y-12 animate-fadeIn text-slate-800">
      {/* Hero Header Area (Clean White & Green) */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-bold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          CLEAN ENERGY • NATIONAL INFRASTRUCTURE ESG PLATFORM
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-heading">
          AI & Cloud Data Centre <span className="text-emerald-600">Sustainability Intelligence</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Explore India's data centre decarbonisation pathway with deterministic physics simulations, Central Electricity Authority (CEA) grid baselines, and regional hydrological vulnerability indicators.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onNavigateToSimulator();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4" />
            Launch Scenario Studio
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onNavigateToMap();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-200 shadow-sm transition"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            Explore 3D India Geospatial Map
          </button>
        </div>
      </div>

      {/* Hero 3D India Map Container with Full Solid India Landmass */}
      <div className="eco-card p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-md bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Interactive 3D Subcontinent Telemetry & Atmospheric Flow
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Wind className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Monsoon & Renewable Energy Flow Vectors Active</span>
          </div>
        </div>

        {/* 3D Canvas Mount with Solid Country Geometry */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-emerald-100">
          <India3DCanvas
            activeCameraPreset={activeCam}
            onCameraChange={(camId) => setActiveCam(camId)}
            onSelectFacility={onSelectFacility}
            height="500px"
            showControls={true}
          />
        </div>

        {/* National Telemetry Strip Below Map */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-emerald-50/40 rounded-2xl border border-emerald-100 p-3 sm:p-4 text-xs">
          <div className="p-3 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono font-bold">Documented IT Capacity</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">{stats.totalReportedCapacityMW} MW</span>
            <span className="text-[10px] text-slate-500">Verified phase IT payload</span>
          </div>

          <div className="p-3 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono font-bold">Documented Campuses</span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5 block">{stats.totalFacilities} Facilities</span>
            <span className="text-[10px] text-slate-500">Across 7 Indian states</span>
          </div>

          <div className="p-3 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono font-bold">Renewable Grid Mix</span>
            <span className="text-xl font-extrabold text-teal-700 font-mono mt-0.5 block">44.5% CEA Avg</span>
            <span className="text-[10px] text-slate-500">Solar & wind generation proxy</span>
          </div>

          <div className="p-3 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono font-bold">Target Modern PUE</span>
            <span className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5 block">1.35 vs 1.62</span>
            <span className="text-[10px] text-slate-500">-43% Cooling power losses</span>
          </div>
        </div>
      </div>

      {/* Real-World Case Studies & Empirical Ground Realities */}
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 uppercase tracking-widest font-bold">
            <Building2 className="w-4 h-4 text-emerald-600" /> Empirical Case Studies
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading mt-1">
            Indian Data Centre Corridors & Real-World Realities
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            How regional climate, power grid architecture, and water availability govern operations in India's top data center clusters.
          </p>
        </div>

        {/* Scenario Selector Tabs (Clean White & Green Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {REAL_WORLD_SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`text-left p-4 rounded-2xl border transition ${
                  isSelected
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/80 border-slate-200 hover:border-emerald-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-500 font-semibold">{sc.state}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${isSelected ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 bg-slate-100'}`}>
                    {sc.tag}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {sc.title}
                </h4>
                <div className="text-[11px] font-mono text-emerald-700 font-bold mt-1.5">
                  {sc.capacity}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Dossier */}
        {selectedScenario && (
          <div className="eco-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {selectedScenario.title}
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    {selectedScenario.state}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Design Target: {selectedScenario.pueGoal} • Capacity: {selectedScenario.capacity}
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigateToSimulator();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="self-start md:self-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Simulate this Corridor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold tracking-wider block">
                  1. Infrastructure Context
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {selectedScenario.realLifeSummary}
                </p>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-mono text-amber-700 uppercase font-bold tracking-wider block">
                  2. Ecological Constraint
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {selectedScenario.environmentalChallenge}
                </p>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-mono text-sky-700 uppercase font-bold tracking-wider block">
                  3. Real-World Equivalence
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {selectedScenario.humanImpact}
                </p>
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-mono">
                  Recommended: <span className="text-emerald-700 font-bold">{selectedScenario.recommendedCooling}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Plain-English Sensitivity Sandbox (White & Green Theme) */}
      <div className="eco-card p-6 sm:p-8 rounded-3xl border border-emerald-200 bg-white space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Real-World Impact Translator
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-heading">
              What Does Data Centre Power Draw Mean in Everyday Terms?
            </h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Adjust IT capacity and cooling efficiency below to see physical electrical power, operating bill, and water evaporation translated into familiar Indian context.
            </p>
          </div>

          <button
            onClick={() => {
              onNavigateToSimulator();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            Open Full Scenario Studio
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stepper + Sliders Input Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-2">
          {/* IT Load Control */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">IT Computing Load</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoLoadMW(Math.max(5, demoLoadMW - 5))}
                  className="stepper-btn"
                  title="Decrease 5 MW"
                >
                  -
                </button>
                <span className="font-mono font-bold text-emerald-700 text-sm w-16 text-center">
                  {demoLoadMW} MW
                </span>
                <button
                  onClick={() => setDemoLoadMW(Math.min(250, demoLoadMW + 5))}
                  className="stepper-btn"
                  title="Increase 5 MW"
                >
                  +
                </button>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={demoLoadMW}
              onChange={(e) => setDemoLoadMW(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 MW (Edge Node)</span>
              <span>50 MW (Hyperscale)</span>
              <span>200 MW (Gigawatt Park)</span>
            </div>
          </div>

          {/* PUE Control */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Power Usage Effectiveness (PUE)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoPUE(Math.max(1.10, Math.round((demoPUE - 0.05) * 100) / 100))}
                  className="stepper-btn"
                >
                  -
                </button>
                <span className="font-mono font-bold text-teal-700 text-sm w-16 text-center">
                  {demoPUE.toFixed(2)}
                </span>
                <button
                  onClick={() => setDemoPUE(Math.min(1.90, Math.round((demoPUE + 0.05) * 100) / 100))}
                  className="stepper-btn"
                >
                  +
                </button>
              </div>
            </div>
            <input
              type="range"
              min="1.10"
              max="1.90"
              step="0.05"
              value={demoPUE}
              onChange={(e) => setDemoPUE(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.15 (Liquid Cooling)</span>
              <span>1.35 (Modern Benchmark)</span>
              <span>1.70 (Legacy Chiller)</span>
            </div>
          </div>
        </div>

        {/* Translation Equivalency Cards (Clean White & Green Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Facility Power</span>
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">{facilityPowerMW} MW</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">~{annualEnergyGWh} GWh/yr grid draw</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Indian Homes</span>
              <Home className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">~{equivalentHomes}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Homes powered continuously</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Cooling Water</span>
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold text-sky-700 font-mono">{annualWaterML} ML</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">≈ {olympicPools} Olympic swimming pools</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Annual Power Bill</span>
              <span className="text-[10px] font-mono font-bold text-emerald-700">₹7.65/kWh</span>
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">₹{annualElectricityCr} Cr</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Annual industrial tariff bill</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
