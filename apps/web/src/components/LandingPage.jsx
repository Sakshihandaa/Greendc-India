import React, { useState, useEffect, useRef } from 'react';
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
  Globe2,
  Play,
  Pause,
  Sliders,
  MapPin,
  Flame,
  Thermometer,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import India3DCanvas, { CAMERA_PRESETS } from './India3DCanvas';
import { getNationalStats } from '../data/facilitiesData';

// 6 Automated Cinematic Video Photography Tour Scenes
export const CINEMATIC_TOUR_SCENES = [
  {
    id: 'rajasthan',
    preset: 'rajasthan',
    state: 'Rajasthan',
    badge: '☀️ Solar Power Capital',
    title: 'Thar Desert 2.24 GW Solar Corridor',
    location: 'Bhadla Solar Park & Jodhpur Cluster',
    tagline: 'World\'s Highest Solar Irradiance with Extreme Water Vulnerability',
    capacity: '2,245 MW Bhadla Solar Park + 24 GW Pipeline',
    freeCooling: '3,250 Hours / Year',
    waterRisk: 'Critical Groundwater Stress',
    tariff: '₹6.80 / kWh (Open Access Solar)',
    pueTarget: '1.24 – 1.30 PUE',
    description: 'Western Rajasthan offers India\'s premier solar insolation (DNI > 5.8 kWh/m²/day). However, hyper-arid desert conditions cause extreme groundwater depletion, mandating zero-water closed-loop dry economizers for all hyperscale AI facilities.',
    policyHighlight: 'Rajasthan Solar Policy 2019: 100% Electricity Duty Exemption for 10 Years & Land Allotment Concessions.',
    humanImpact: 'Using closed-loop dry cooling preserves over 250 Million Litres of rural aquifer water annually.'
  },
  {
    id: 'gujarat',
    preset: 'gujarat',
    state: 'Gujarat',
    badge: '⚡ 30 GW Mega-Hub',
    title: 'Khavda Renewable Frontier & GIFT City',
    location: 'Kutch Hybrid Park & Gandhinagar Fintech Zone',
    tagline: 'World\'s Largest Hybrid Renewable Park Scaling to 30,000 MW',
    capacity: '30 GW Hybrid Park + 50 MW GIFT City Hub',
    freeCooling: '2,650 Hours / Year',
    waterRisk: 'Moderate Coastal Risk',
    tariff: '₹7.10 / kWh (Green Wheeling Corridor)',
    pueTarget: '1.18 – 1.25 PUE',
    description: 'The Khavda Renewable Park spans 72,600 hectares of salt desert, producing 30 GW of wind & solar. GIFT City pairs this clean power with SEZ tax exemptions, redundant 765 kV substations, and dual-feeder reliability.',
    policyHighlight: 'Gujarat DC Policy: 50% Capital Subsidy on transmission lines + Green Power Open Access Surcharge waiver.',
    humanImpact: 'Direct wheeling from Khavda eliminates ~480,000 tonnes of coal emissions annually per 100 MW campus.'
  },
  {
    id: 'mumbai',
    preset: 'mumbai',
    state: 'Maharashtra',
    badge: '🌊 Subsea Epicentre',
    title: 'Navi Mumbai & Chandivali Hyperscale Hub',
    location: 'Panvel, Mahape, TTC Industrial Belt & Chandivali',
    tagline: 'India\'s #1 Subsea Gateway Hosting >54% of National Operational Capacity',
    capacity: '155 MW Operational (>650 MW Total Pipeline)',
    freeCooling: '2,450 Hours / Year',
    waterRisk: 'Moderate Municipal Quotas',
    tariff: '₹8.20 / kWh (Industrial)',
    pueTarget: '1.30 – 1.38 PUE',
    description: 'Navi Mumbai is India\'s digital nerve center, anchored by 15+ subsea cable landings (2Africa, SeaMeWe-5, AAE-1). Coastal humidity during monsoons requires sea-breeze air economization and MIDC tertiary-treated water.',
    policyHighlight: 'Maharashtra DC Policy 2023: 100% Stamp Duty Exemption, Electricity Duty Waiver, and Deemed Industrial Status.',
    humanImpact: 'Consumes electricity equivalent to ~140,000 Mumbai homes; operators are transitioning to 100% green power PPAs.'
  },
  {
    id: 'bengaluru',
    preset: 'south',
    state: 'Karnataka',
    badge: '💻 Silicon Plateau',
    title: 'Bengaluru Tech Corridor & Pavagada Clean Grid',
    location: 'Whitefield, Electronic City & Devanahalli',
    tagline: 'High Deccan Plateau Elevation with 52.8% Clean Energy Grid Mix',
    capacity: '45 MW Operational + Pavagada 2.05 GW Solar',
    freeCooling: '2,900 Hours / Year',
    waterRisk: 'High Urban Groundwater Stress',
    tariff: '₹7.40 / kWh',
    pueTarget: '1.20 – 1.28 PUE',
    description: 'Bengaluru sits at 920m elevation, delivering 2,900+ natural free-cooling hours. However, severe Cauvery municipal water quotas and depleted urban borewells necessitate two-phase liquid immersion or zero-water architectures.',
    policyHighlight: 'Karnataka DC Policy 2022: Green Power Open Access Concessions and Capital Subsidies for AI Compute.',
    humanImpact: 'Zero-evaporative cooling safeguards drinking water for adjacent residential technology corridors.'
  },
  {
    id: 'ncr',
    preset: 'ncr',
    state: 'Uttar Pradesh',
    badge: '🏛️ North India AI Hub',
    title: 'Greater Noida Enterprise Hyperscale Hub',
    location: 'Knowledge Park V & Techzone IV Corridor',
    tagline: 'Sovereign AI Compute Hub Powered by UP\'s Aggressive DC Policy',
    capacity: '78.8 MW Operational Phase (Yotta D1 & CtrlS)',
    freeCooling: '2,980 Hours / Year',
    waterRisk: 'Critical Yamuna Aquifer Stress',
    tariff: '₹7.90 / kWh',
    pueTarget: '1.25 – 1.35 PUE',
    description: 'Knowledge Park V hosts North India\'s premier hyperscale cluster, benefiting from 4x permissible FAR and dedicated 220 kV sub-stations. Yamuna basin groundwater over-extraction requires 100% STP recycled water integration.',
    policyHighlight: 'UP Data Center Policy 2021: 100% Stamp Duty Exemption, 4x FAR, and 50% Dual-Grid Feeder Subsidy up to ₹10 Cr.',
    humanImpact: 'Mandatory recycled STP cooling saves ~220 Million Litres of Yamuna freshwater annually.'
  },
  {
    id: 'himachal',
    preset: 'himachal',
    state: 'Himachal Pradesh',
    badge: '🏔️ Cold-Climate AI Edge',
    title: 'Himalayan Cold-Air Valley & Hydro Grid',
    location: 'Baddi Industrial Node & Solan Cold Corridor',
    tagline: '5,600+ Hours of Natural Free Cooling with 100% Zero-Carbon Hydro',
    capacity: 'Emerging Edge AI & Scientific Compute Hub',
    freeCooling: '5,650 Hours / Year (Sub-1.15 PUE)',
    waterRisk: 'Safe Mountain River Basin',
    tariff: '₹6.20 / kWh (Low Mountain Hydro Tariff)',
    pueTarget: '1.10 – 1.18 PUE',
    description: 'Himachal Pradesh offers unmatched thermodynamic efficiency: crisp sub-15°C mountain air provides over 5,600 free-cooling hours annually. Combined with 100% clean hydro power, it delivers India\'s lowest PUE (<1.15) for AI training.',
    policyHighlight: 'Himachal Industrial Policy: Concessional Mountain Hydro Tariff and Clean Tech Capital Subsidies.',
    humanImpact: 'Lowers annual data center cooling electricity bills by up to 68% compared to coastal metropolitan hubs.'
  }
];

export default function LandingPage({
  onNavigateToCommand,
  onNavigateToMap,
  onNavigateToSimulator,
  onNavigateToCatalog
}) {
  const stats = getNationalStats();

  // Cinematic Video Photography Tour State
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [isPlayingTour, setIsPlayingTour] = useState(true);
  const [tourProgress, setTourProgress] = useState(0);
  const tourTimerRef = useRef(null);

  const currentScene = CINEMATIC_TOUR_SCENES[activeTourIndex];

  // Auto-play loop for cinematic tour (7 seconds per scene)
  useEffect(() => {
    if (!isPlayingTour) return;

    const intervalTime = 70; // 70ms tick
    const totalTicks = 7000 / intervalTime; // 100 ticks = 7000ms

    const interval = setInterval(() => {
      setTourProgress((prev) => {
        if (prev >= 100) {
          setActiveTourIndex((cur) => (cur + 1) % CINEMATIC_TOUR_SCENES.length);
          return 0;
        }
        return prev + (100 / totalTicks);
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlayingTour, activeTourIndex]);

  // Handle manual scene jump
  const handleSelectScene = (index) => {
    setActiveTourIndex(index);
    setTourProgress(0);
  };

  // Mini tactile sandbox on landing page
  const [demoLoadMW, setDemoLoadMW] = useState(50);
  const [demoPUE, setDemoPUE] = useState(1.28);

  const facilityPowerMW = Math.round(demoLoadMW * demoPUE * 10) / 10;
  const annualEnergyGWh = Math.round((facilityPowerMW * 8760 * 0.82) / 1000);
  const equivalentHomes = Math.round((annualEnergyGWh * 1000000) / 2400).toLocaleString();
  const annualWaterML = Math.round(((demoLoadMW * 1000 * 8760 * 0.82 * (demoPUE > 1.3 ? 1.2 : 0.05)) / 1000000) * 10) / 10;
  const olympicPools = Math.round(annualWaterML / 2.5);
  const annualElectricityCr = Math.round(((annualEnergyGWh * 1000000 * 7.4) / 10000000) * 10) / 10;

  return (
    <div className="space-y-12 animate-fadeIn text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* HERO SECTION: Problem Statement & Value Proposition */}
      <div className="text-center max-w-4xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NATIONAL DATA CENTRE INFRASTRUCTURE & SITING INTELLIGENCE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-heading">
          Decarbonizing India's 5 GW <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
            AI & Cloud Data Centre Boom
          </span>
        </h1>

        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          India is expanding from 1,000 MW to over 5,000 MW of data center capacity for Artificial Intelligence.
          GreenDC pairs hyperscale campuses with <strong>30 GW renewable mega-parks</strong>, verified <strong>IMD free-cooling hours</strong>, and <strong>CGWB hydrological water safety</strong> before breaking ground.
        </p>

        {/* Primary Action Buttons (Direct entry to Dashboard) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              if (onNavigateToCommand) onNavigateToCommand();
              else if (onNavigateToSimulator) onNavigateToSimulator();
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-700/25 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>Launch Live Simulation Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (onNavigateToCommand) onNavigateToCommand();
              else if (onNavigateToMap) onNavigateToMap();
            }}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-md transition cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Explore Pan-India GIS Map</span>
          </button>
        </div>
      </div>

      {/* AUTOMATED CINEMATIC "VIDEO PHOTOGRAPHY" 3D TOUR SHOWCASE */}
      <div className="eco-card p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 space-y-4">
        {/* Header & Tour Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                Cinematic 3D Video Photography Tour: Key Indian Siting Corridors
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated drone-flight sequences showcasing live generation, free cooling, and groundwater constraints across India.
            </p>
          </div>

          {/* Video Tour Play/Pause & Progress */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlayingTour(!isPlayingTour)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition cursor-pointer ${
                isPlayingTour
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
              }`}
            >
              {isPlayingTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingTour ? 'Pause Tour' : 'Auto-Fly Video Tour'}</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              {activeTourIndex + 1} / {CINEMATIC_TOUR_SCENES.length}
            </span>
          </div>
        </div>

        {/* 3D Viewport with Live Animated Holographic HUD Card Overlay */}
        <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-950">
          {/* Progress Countdown Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800/80 z-30">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-75"
              style={{ width: `${tourProgress}%` }}
            />
          </div>

          {/* Three.js 3D WebGL Canvas */}
          <India3DCanvas
            activeCameraPreset={currentScene.preset}
            onCameraChange={(camId) => {
              const matchedIdx = CINEMATIC_TOUR_SCENES.findIndex(s => s.preset === camId);
              if (matchedIdx !== -1) {
                setActiveTourIndex(matchedIdx);
                setTourProgress(0);
              }
            }}
            interactive={true}
            height="520px"
            showControls={false}
          />

          {/* FLOATING HOLOGRAPHIC TELEMETRY HUD CARD (Pops up with metrics) */}
          <div className="absolute top-4 left-4 z-20 max-w-sm sm:max-w-md bg-slate-950/85 text-white backdrop-blur-xl rounded-2xl border border-emerald-500/40 p-4 shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400">
                  {currentScene.badge}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Region: <strong className="text-white">{currentScene.state}</strong>
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-white font-heading leading-tight">
                {currentScene.title}
              </h4>
              <p className="text-[11px] text-teal-300 font-medium mt-0.5 line-clamp-1">
                📍 {currentScene.location}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                {currentScene.description}
              </p>
            </div>

            {/* 4 Micro Metric Indicators */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Clean Capacity</span>
                <strong className="text-emerald-400 font-mono text-xs">{currentScene.capacity}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Free Cooling</span>
                <strong className="text-sky-300 font-mono text-xs">{currentScene.freeCooling}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Water Risk</span>
                <strong className="text-amber-400 text-xs">{currentScene.waterRisk}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Power Tariff</span>
                <strong className="text-teal-300 font-mono text-xs">{currentScene.tariff}</strong>
              </div>
            </div>

            {/* Policy & Impact Note */}
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200">
              <span className="font-bold text-white block mb-0.5">📜 State Policy Incentive:</span>
              {currentScene.policyHighlight}
            </div>

            {/* Direct Launch Button */}
            <button
              onClick={() => {
                if (onNavigateToCommand) onNavigateToCommand(currentScene.state);
                else if (onNavigateToSimulator) onNavigateToSimulator();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <span>🚀 Launch Live Simulation in {currentScene.state}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Scene Stepper Pills at Bottom */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-center gap-2 overflow-x-auto py-1">
            {CINEMATIC_TOUR_SCENES.map((scene, idx) => {
              const isActive = idx === activeTourIndex;
              return (
                <button
                  key={scene.id}
                  onClick={() => handleSelectScene(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg backdrop-blur-md ${
                    isActive
                      ? 'bg-emerald-600 text-white border border-emerald-400 ring-2 ring-emerald-500/30'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span>{scene.badge.split(' ')[0]}</span>
                  <span>{scene.state}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* National Siting Key Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 p-3 sm:p-4 text-xs">
          <div className="p-3 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono font-bold">Documented IT Capacity</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">{stats.totalReportedCapacityMW} MW</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Verified hyperscale payload</span>
          </div>

          <div className="p-3 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono font-bold">122+ Indian Siting Cities</span>
            <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">28 States & UTs</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">IMD temperature & water normals</span>
          </div>

          <div className="p-3 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono font-bold">National Renewable Share</span>
            <span className="text-xl font-extrabold text-teal-700 dark:text-teal-400 font-mono mt-0.5 block">44.5% CEA Avg</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Hydro, solar & wind wheeling</span>
          </div>

          <div className="p-3 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono font-bold">Target Modern PUE</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">1.25 vs 1.62</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">-58% Cooling energy waste</span>
          </div>
        </div>
      </div>

      {/* WHY GREENDC INDIA? 3 CORE PILLARS SECTION */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-bold">
            <Building2 className="w-4 h-4 text-emerald-600" /> Platform Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
            How GreenDC Solves India's Siting Bottlenecks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Traditional data center planning looks only at fiber and land. GreenDC adds physics-based energy and water intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Clean Power Corridors */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              1. 30 GW Renewable Mega-Park Matching
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Instead of plugging into thermal coal grids (720+ gCO2/kWh), GreenDC maps high-voltage inter-state corridors from Khavda (30 GW), Bhadla (2.24 GW), and Pavagada (2.05 GW) to achieve true 24x7 green power matching.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Up to 85% Carbon Emissions Reduction
            </div>
          </div>

          {/* Pillar 2: Water Stress Modeling */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              2. CGWB Aquifer Vulnerability Modeling
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Standard cooling towers consume up to 1.8 Litres of freshwater per kWh. In drought-prone regions (Rajasthan, NCR, Bengaluru), GreenDC models adiabatic dry cooling and two-phase liquid immersion to avoid community water conflicts.
            </p>
            <div className="pt-2 text-[11px] font-mono text-sky-700 dark:text-sky-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saves ~180M Litres of Freshwater / Campus
            </div>
          </div>

          {/* Pillar 3: 122+ Cities Directory */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              3. Pan-India 122+ Cities Siting Matrix
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Comprehensive municipal directory tracking real IMD wet-bulb temperatures, natural free-cooling hours, commercial electricity tariffs, subsea cable landings, and 28 state data center policies.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 122+ Verified Industrial Edge Cities
            </div>
          </div>
        </div>
      </div>

      {/* TACTILE INTERACTIVE MINI-SIMULATOR SANDBOX */}
      <div className="eco-card p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Tactile Sizing Sandbox: Real-World Human Scale Equivalents
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adjust IT load and PUE efficiency to see instant plain-English physical impacts.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigateToCommand) onNavigateToCommand();
              else if (onNavigateToSimulator) onNavigateToSimulator();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>Open Full Simulation Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>IT Power Payload:</span>
                <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">{demoLoadMW} MW IT</strong>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={demoLoadMW}
                onChange={(e) => setDemoLoadMW(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10 MW Edge</span>
                <span>50 MW Enterprise</span>
                <span>150 MW AI Megahub</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Power Usage Effectiveness (PUE):</span>
                <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">{demoPUE.toFixed(2)} PUE</strong>
              </div>
              <input
                type="range"
                min="1.10"
                max="1.55"
                step="0.01"
                value={demoPUE}
                onChange={(e) => setDemoPUE(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.10 (Liquid Immersion)</span>
                <span>1.30 (Modern Eco-DC)</span>
                <span>1.55 (Legacy Chiller)</span>
              </div>
            </div>
          </div>

          {/* Real-World Human Equivalents Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Total Facility Power</span>
              <strong className="text-xl font-extrabold text-slate-900 dark:text-white font-mono block mt-0.5">{facilityPowerMW} MW</strong>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Annual: {annualEnergyGWh} GWh/yr</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Residential Home Equiv.</span>
              <strong className="text-xl font-extrabold text-amber-900 dark:text-amber-300 font-mono block mt-0.5">~{equivalentHomes}</strong>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Urban households powered</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Water Consumption</span>
              <strong className="text-xl font-extrabold text-sky-900 dark:text-sky-300 font-mono block mt-0.5">{annualWaterML} ML / yr</strong>
              <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">~{olympicPools} Olympic pools</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Annual Electricity OPEX</span>
              <strong className="text-xl font-extrabold text-teal-900 dark:text-teal-300 font-mono block mt-0.5">₹{annualElectricityCr} Cr</strong>
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">At ₹7.40/unit baseline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
