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
  ArrowUpRight,
  Activity,
  MousePointer2
} from 'lucide-react';
import IndiaMapSVG from './IndiaMapSVG';
import EnergyGridCanvas from './EnergyGridCanvas';
import { getNationalStats } from '../data/facilitiesData';
import { getStateIntelligence } from '../data/allIndiaStateData';

// 6 Automated Siting Corridor Scenes
export const CINEMATIC_TOUR_SCENES = [
  {
    id: 'rajasthan',
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
    policyHighlight: 'Rajasthan Solar Policy: 100% Electricity Duty Exemption for 10 Years & Land Allotment Concessions.',
    humanImpact: 'Using closed-loop dry cooling preserves over 250 Million Litres of rural aquifer water annually.'
  },
  {
    id: 'gujarat',
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
    policyHighlight: 'Karnataka DC Policy: Green Power Open Access Concessions and Capital Subsidies for AI Compute.',
    humanImpact: 'Zero-evaporative cooling safeguards drinking water for adjacent residential technology corridors.'
  },
  {
    id: 'ncr',
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
    policyHighlight: 'UP Data Center Policy: 100% Stamp Duty Exemption, 4x FAR, and 50% Dual-Grid Feeder Subsidy up to ₹10 Cr.',
    humanImpact: 'Mandatory recycled STP cooling saves ~220 Million Litres of Yamuna freshwater annually.'
  },
  {
    id: 'himachal',
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

/**
 * AnimatedSection Wrapper
 * Triggers smooth slide-up reveal as user scrolls down the page
 */
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-10 blur-[0.5px]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage({
  onNavigateToCommand,
  onNavigateToMap,
  onNavigateToSimulator,
  onNavigateToCatalog
}) {
  const stats = getNationalStats();

  // Cinematic Video Tour State
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [isPlayingTour, setIsPlayingTour] = useState(true);
  const [tourProgress, setTourProgress] = useState(0);

  // Custom clicked state (if user clicks any state on the map outside the 6 scenes)
  const [customStateIntel, setCustomStateIntel] = useState(null);

  // Mouse ambient follower light
  const [mousePos, setMousePos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const currentScene = CINEMATIC_TOUR_SCENES[activeTourIndex];

  // Active display data (either currentScene or custom clicked state)
  const activeDisplayState = customStateIntel ? {
    badge: `📍 ${customStateIntel.tier || 'State Intelligence'}`,
    state: customStateIntel.displayName,
    title: `${customStateIntel.displayName} Regional Corridor`,
    location: customStateIntel.tagline || 'Grid Interconnection Node',
    description: customStateIntel.incentives || 'Comprehensive state infrastructure and regulatory policy profile.',
    capacity: `${customStateIntel.knownCapacityMW || 0} MW Operational (${customStateIntel.pipelineMW || 0} MW Planned)`,
    freeCooling: `${(customStateIntel.freeCoolingHours || 2500).toLocaleString()} Hours / Year`,
    waterRisk: `${customStateIntel.waterStress || 'Moderate'} Stress`,
    tariff: `₹${customStateIntel.tariffCommercial || 7.5} / kWh`,
    policyHighlight: customStateIntel.incentives || 'State power duty exemptions and green open-access wheeling policies apply.'
  } : currentScene;

  // Auto-play loop for cinematic tour (7.5 seconds per scene)
  useEffect(() => {
    if (!isPlayingTour) return;

    const intervalTime = 75; // 75ms tick
    const totalTicks = 7500 / intervalTime; // 100 ticks = 7500ms

    const interval = setInterval(() => {
      setTourProgress((prev) => {
        if (prev >= 100) {
          setCustomStateIntel(null);
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
    setCustomStateIntel(null);
    setActiveTourIndex(index);
    setTourProgress(0);
  };

  // Handle state click directly on the real SVG map
  const handleStateClickOnMap = (stateName) => {
    const matchedIdx = CINEMATIC_TOUR_SCENES.findIndex(
      s => s.state.toLowerCase() === stateName.toLowerCase()
    );
    if (matchedIdx !== -1) {
      setCustomStateIntel(null);
      setActiveTourIndex(matchedIdx);
      setTourProgress(0);
    } else {
      const intel = getStateIntelligence(stateName);
      if (intel) {
        setCustomStateIntel(intel);
        setIsPlayingTour(false);
      }
    }
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
    <div className="relative space-y-14 animate-fadeIn text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. HIGH-PERFORMANCE 60FPS BACKGROUND PARTICLES CANVAS */}
      <EnergyGridCanvas />

      {/* 2. DYNAMIC INTERACTIVE MOUSE FOLLOWER GLOW SPOTLIGHT */}
      <div
        className="fixed pointer-events-none rounded-full blur-[110px] -z-10 transition-transform duration-100 ease-out opacity-45 dark:opacity-30"
        style={{
          width: '520px',
          height: '520px',
          left: `${mousePos.x - 260}px`,
          top: `${mousePos.y - 260}px`,
          background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(6,182,212,0.18) 50%, transparent 75%)'
        }}
      />

      {/* 3. AMBIENT MOVING AURORA GRADIENTS */}
      <div className="fixed top-24 left-10 w-[550px] h-[550px] bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-[160px] pointer-events-none -z-10 aurora-glow-1" />
      <div className="fixed bottom-24 right-10 w-[600px] h-[600px] bg-teal-500/15 dark:bg-cyan-500/20 rounded-full blur-[170px] pointer-events-none -z-10 aurora-glow-2" />

      {/* HERO SECTION (Scroll reveal) */}
      <AnimatedSection delay={50} className="text-center max-w-4xl mx-auto space-y-4 pt-4">
        {/* NO API KEY NEEDED BADGE PILL */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-400/50 dark:border-emerald-600/60 text-emerald-800 dark:text-emerald-300 font-bold shadow-md shadow-emerald-500/10 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] tracking-wider uppercase">100% Free & Open Access • No API Key Needed • Deterministic ESG Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] font-display">
          Decarbonizing India's 5 GW <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
            AI & Cloud Data Centre Boom
          </span>
        </h1>

        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
          India is scaling past 5,000 MW of compute capacity for Artificial Intelligence.
          GreenDC pairs hyperscale campuses with <strong>30 GW renewable mega-parks</strong>, verified <strong>IMD free-cooling hours</strong>, and <strong>CGWB hydrological water safety</strong> before breaking ground.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => {
              if (onNavigateToCommand) onNavigateToCommand();
              else if (onNavigateToSimulator) onNavigateToSimulator();
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer font-display"
          >
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>Launch Live Simulation Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (onNavigateToCommand) onNavigateToCommand();
              else if (onNavigateToMap) onNavigateToMap();
            }}
            className="px-5 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center gap-2 border border-slate-300 dark:border-slate-700 shadow-md backdrop-blur-md transition transform hover:-translate-y-0.5 cursor-pointer font-sans"
          >
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Explore Pan-India GIS Map</span>
          </button>
        </div>
      </AnimatedSection>

      {/* REAL DASHBOARD GIS MAP SHOWCASE (100% UNBLOCKED, FULLY VISIBLE) */}
      <AnimatedSection delay={150}>
        <div className="eco-card p-4 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl space-y-4">
          {/* Header & Tour Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                  Interactive Siting Corridors: Pan-India GIS Map
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                Real vector GIS map with 122+ cities, verified DC hubs, and animated renewable transmission corridors. Click any state or city on the map!
              </p>
            </div>

            {/* Video Tour Play/Pause & Progress */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsPlayingTour(!isPlayingTour);
                  if (!isPlayingTour) setCustomStateIntel(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition cursor-pointer font-sans ${
                  isPlayingTour
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isPlayingTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingTour ? 'Pause Tour' : 'Resume Auto-Fly Tour'}</span>
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                {activeTourIndex + 1} / {CINEMATIC_TOUR_SCENES.length}
              </span>
            </div>
          </div>

          {/* Progress Countdown Bar */}
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-75"
              style={{ width: `${tourProgress}%` }}
            />
          </div>

          {/* SIDE-BY-SIDE SPACIOUS LAYOUT: HUD TELEMETRY CARD ON LEFT (4 cols) + UNBLOCKED REAL GIS MAP ON RIGHT (8 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* LEFT: FLOATING HOLOGRAPHIC TELEMETRY HUD CARD (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950 text-white rounded-3xl border border-emerald-500/40 p-5 shadow-2xl space-y-4 relative overflow-hidden">
              {/* Background cyber ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-emerald-400">
                      {activeDisplayState.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Corridor: <strong className="text-white font-bold">{activeDisplayState.state}</strong>
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-white font-display leading-tight">
                    {activeDisplayState.title}
                  </h4>
                  <p className="text-xs text-teal-300 font-medium mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{activeDisplayState.location}</span>
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5 font-sans">
                    {activeDisplayState.description}
                  </p>
                </div>

                {/* 4 Micro Metric Indicators */}
                <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Clean Capacity</span>
                    <strong className="text-emerald-400 font-mono text-xs font-bold block mt-0.5">{activeDisplayState.capacity}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Free Cooling</span>
                    <strong className="text-sky-300 font-mono text-xs font-bold block mt-0.5">{activeDisplayState.freeCooling}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Water Risk</span>
                    <strong className="text-amber-400 text-xs font-bold block mt-0.5">{activeDisplayState.waterRisk}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Power Tariff</span>
                    <strong className="text-teal-300 font-mono text-xs font-bold block mt-0.5">{activeDisplayState.tariff}</strong>
                  </div>
                </div>

                {/* Policy & Impact Note */}
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/25 text-xs text-emerald-200">
                  <span className="font-bold text-white block mb-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>State Policy Incentive:</span>
                  </span>
                  <p className="text-[11px] leading-relaxed text-emerald-100/90">{activeDisplayState.policyHighlight}</p>
                </div>
              </div>

              {/* Direct Launch Button */}
              <button
                onClick={() => {
                  if (onNavigateToCommand) onNavigateToCommand(activeDisplayState.state);
                  else if (onNavigateToSimulator) onNavigateToSimulator();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition cursor-pointer font-display"
              >
                <span>🚀 Launch Live Simulation in {activeDisplayState.state}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* RIGHT: REAL FULL DASHBOARD GIS MAP (lg:col-span-7) */}
            {/* NOTE: showPopupOnSelect={false} and defaultLegendOpen={false} ensures the map is 100% UNBLOCKED and visible! */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl relative min-h-[580px]">
              <IndiaMapSVG
                selectedState={activeDisplayState.state}
                showPopupOnSelect={false}
                defaultLegendOpen={false}
                onStateClick={handleStateClickOnMap}
                onDCClick={(dc) => {
                  if (onNavigateToCommand) onNavigateToCommand(dc.state);
                }}
                height={580}
                mapStyle="satellite"
                showTransmission={true}
                showCities={true}
              />
            </div>
          </div>

          {/* Interactive Scene Stepper Pills at Bottom */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
            {CINEMATIC_TOUR_SCENES.map((scene, idx) => {
              const isActive = !customStateIntel && idx === activeTourIndex;
              return (
                <button
                  key={scene.id}
                  onClick={() => handleSelectScene(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md backdrop-blur-md font-sans ${
                    isActive
                      ? 'bg-emerald-600 text-white border border-emerald-400 ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{scene.badge.split(' ')[0]}</span>
                  <span>{scene.state}</span>
                </button>
              );
            })}
          </div>

          {/* National Siting Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 p-3 sm:p-4 text-xs">
            <div className="p-3 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono font-bold">Documented IT Capacity</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">{stats.totalReportedCapacityMW} MW</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Verified hyperscale payload</span>
            </div>

            <div className="p-3 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono font-bold">122+ Indian Siting Cities</span>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">28 States & UTs</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">IMD temperature & water normals</span>
            </div>

            <div className="p-3 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono font-bold">National Renewable Share</span>
              <span className="text-xl font-black text-teal-700 dark:text-teal-400 font-mono mt-0.5 block">44.5% CEA Avg</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Hydro, solar & wind wheeling</span>
            </div>

            <div className="p-3 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono font-bold">Target Modern PUE</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">1.25 vs 1.62</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">-58% Cooling energy waste</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* WHY GREENDC INDIA? 3 CORE PILLARS SECTION (Scroll Reveal) */}
      <AnimatedSection delay={200} className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-bold">
            <Building2 className="w-4 h-4 text-emerald-600" /> Platform Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            How GreenDC Solves India's Siting Bottlenecks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans">
            Traditional data center planning looks only at fiber and land. GreenDC adds physics-based energy and water intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Clean Power Corridors */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-3 transition transform hover:-translate-y-1 hover:border-emerald-500/50">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
              1. 30 GW Renewable Mega-Park Matching
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Instead of plugging into thermal coal grids (720+ gCO2/kWh), GreenDC maps high-voltage inter-state corridors from Khavda (30 GW), Bhadla (2.24 GW), and Pavagada (2.05 GW) to achieve true 24x7 green power matching.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Up to 85% Carbon Emissions Reduction
            </div>
          </div>

          {/* Pillar 2: Water Stress Modeling */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-3 transition transform hover:-translate-y-1 hover:border-sky-500/50">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
              2. CGWB Aquifer Vulnerability Modeling
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Standard cooling towers consume up to 1.8 Litres of freshwater per kWh. In drought-prone regions (Rajasthan, NCR, Bengaluru), GreenDC models adiabatic dry cooling and two-phase liquid immersion to avoid community water conflicts.
            </p>
            <div className="pt-2 text-[11px] font-mono text-sky-700 dark:text-sky-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saves ~180M Litres of Freshwater / Campus
            </div>
          </div>

          {/* Pillar 3: 122+ Cities Directory */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-3 transition transform hover:-translate-y-1 hover:border-emerald-500/50">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
              3. Pan-India 122+ Cities Siting Matrix
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Comprehensive municipal directory tracking real IMD wet-bulb temperatures, natural free-cooling hours, commercial electricity tariffs, subsea cable landings, and 28 state data center policies.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 122+ Verified Industrial Edge Cities
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* TACTILE INTERACTIVE MINI-SIMULATOR SANDBOX (Scroll Reveal) */}
      <AnimatedSection delay={250}>
        <div className="eco-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                  Tactile Sizing Sandbox: Real-World Human Scale Equivalents
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                Adjust IT load and PUE efficiency to see instant plain-English physical impacts.
              </p>
            </div>

            <button
              onClick={() => {
                if (onNavigateToCommand) onNavigateToCommand();
                else if (onNavigateToSimulator) onNavigateToSimulator();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer font-display"
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
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Total Facility Power</span>
                <strong className="text-xl font-extrabold text-slate-900 dark:text-white font-mono block mt-0.5">{facilityPowerMW} MW</strong>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Annual: {annualEnergyGWh} GWh/yr</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Residential Home Equiv.</span>
                <strong className="text-xl font-extrabold text-amber-900 dark:text-amber-300 font-mono block mt-0.5">~{equivalentHomes}</strong>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Urban households powered</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Water Consumption</span>
                <strong className="text-xl font-extrabold text-sky-900 dark:text-sky-300 font-mono block mt-0.5">{annualWaterML} ML / yr</strong>
                <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">~{olympicPools} Olympic pools</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Annual Electricity OPEX</span>
                <strong className="text-xl font-extrabold text-teal-900 dark:text-teal-300 font-mono block mt-0.5">₹{annualElectricityCr} Cr</strong>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">At ₹7.40/unit baseline</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
