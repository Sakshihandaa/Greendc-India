import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import IndiaMapSVG from './IndiaMapSVG';
import CampusDetailsModal from './CampusDetailsModal';
import AIChatConsultant from './AIChatConsultant';
import CityDirectoryModal from './CityDirectoryModal';
import SimulationDrawer from './SimulationDrawer';
import {
  Compass,
  Zap,
  Droplets,
  Scale,
  Server,
  Layers,
  MapPin,
  Building2,
  Wind,
  Sun,
  Shield,
  Search,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Info,
  Thermometer,
  Waves,
  RefreshCw,
  Home,
  Train,
  TreeDeciduous,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Maximize2,
  Minimize2,
  Activity,
  Award,
  ChevronDown,
  Calculator,
  ChevronLeft,
  ChevronRightSquare,
  HelpCircle,
  Bot,
  MessageSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FACILITIES, STATE_SUMMARIES, STATE_POLICIES } from '../data/facilitiesData';
import { ALL_INDIA_STATES, getStateIntelligence } from '../data/allIndiaStateData';
import { runSimulationWithFallback, GRID_EMISSION_FACTORS } from '../utils/calculatorEngine';
import { exportSustainabilityPDF } from '../utils/pdfExport';

// Quick Corridor Navigation Presets
const CORRIDOR_PRESETS = [
  { name: 'All India', state: null, defaultLoad: 50, defaultPUE: 1.35 },
  { name: 'Navi Mumbai (155 MW)', state: 'Maharashtra', defaultLoad: 155, defaultPUE: 1.34 },
  { name: 'Greater Noida (78 MW)', state: 'Uttar Pradesh', defaultLoad: 78, defaultPUE: 1.30 },
  { name: 'Bengaluru (45 MW)', state: 'Karnataka', defaultLoad: 45, defaultPUE: 1.25 },
  { name: 'Hyderabad (32 MW)', state: 'Telangana', defaultLoad: 32, defaultPUE: 1.30 },
  { name: 'Chennai (33 MW)', state: 'Tamil Nadu', defaultLoad: 33, defaultPUE: 1.30 },
  { name: 'GIFT City / Kutch (50 MW)', state: 'Gujarat', defaultLoad: 50, defaultPUE: 1.20 },
  { name: 'Rajasthan (Solar Capital)', state: 'Rajasthan', defaultLoad: 50, defaultPUE: 1.25 },
  { name: 'Kochi (Subsea Gateway)', state: 'Kerala', defaultLoad: 30, defaultPUE: 1.30 },
  { name: 'Kolkata Silicon Valley', state: 'West Bengal', defaultLoad: 25, defaultPUE: 1.35 },
  { name: 'Baddi / HP (Cold Hydro PUE 1.15)', state: 'Himachal Pradesh', defaultLoad: 20, defaultPUE: 1.15 }
];

// Cooling Architecture Technology Presets
const COOLING_PRESETS = [
  { id: 'immersion_1p', name: 'Direct Liquid Immersion (Single-Phase)', pue: 1.12, wue: 0.02, desc: 'Ultra-low PUE, near-zero evaporative water loss, ideal for AI clusters' },
  { id: 'immersion_2p', name: 'Two-Phase Liquid Immersion', pue: 1.08, wue: 0.01, desc: 'Peak density AI compute cooling, zero water footprint' },
  { id: 'adiabatic', name: 'Adiabatic Dry Coolers', pue: 1.22, wue: 0.18, desc: 'Uses ambient air with evaporative trim only in peak summer' },
  { id: 'free_air', name: 'Direct Free-Air Economizer', pue: 1.25, wue: 0.25, desc: 'Cold climate direct outside air intake (HP, J&K, UK)' },
  { id: 'chiller', name: 'Closed-Loop Chilled Water', pue: 1.45, wue: 1.10, desc: 'Standard centralized chiller with cooling towers' },
  { id: 'evaporative', name: 'Open Evaporative Cooling Towers', pue: 1.35, wue: 1.65, desc: 'High municipal water consumption' },
];

// IT Capacity Quick Presets
const CAPACITY_PRESETS = [
  { label: '⚡ 10 MW Edge', mw: 10 },
  { label: '🏢 50 MW Enterprise', mw: 50 },
  { label: '🌐 100 MW Hyperscale', mw: 100 },
  { label: '🚀 250 MW AI Gigawatt', mw: 250 },
];

// Water Sourcing Strategy Options
const WATER_SOURCES = [
  { id: 'stp', name: '100% Recycled Tertiary STP Water (Zero freshwater draft)', risk: 'Low' },
  { id: 'municipal', name: 'Municipal Industrial Utility Grid', risk: 'Moderate' },
  { id: 'groundwater', name: 'Groundwater / Deep Borewell Extraction', risk: 'High' },
  { id: 'desal', name: 'Coastal Seawater Desalination Plant', risk: 'Low' }
];

const LOCAL_STORAGE_KEY = 'greendc_simulation_state_v2';

export default function UnifiedCommandCenter({
  onOpenCodex,
  onRegisterExportHandler,
  initialFacility = null,
  initialConsoleTab = 'energy'
}) {
  // Load saved state from localStorage if available
  const savedState = useMemo(() => {
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }, []);

  // Map View State
  const [activeTileKey, setActiveTileKey] = useState('voyager');
  const [selectedFacility, setSelectedFacility] = useState(initialFacility || FACILITIES[0]);
  const [selectedState, setSelectedState] = useState(savedState?.selectedState || initialFacility?.state || 'Maharashtra');
  const [customSitedCoords, setCustomSitedCoords] = useState(null);
  const [showTransmissionArcs, setShowTransmissionArcs] = useState(true);
  const [showStateBorders, setShowStateBorders] = useState(true);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(savedState?.isConsoleCollapsed || false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isCityDirectoryOpen, setIsCityDirectoryOpen] = useState(false);
  const [isStudioDrawerOpen, setIsStudioDrawerOpen] = useState(false);

  // Active Deep Dive Tab: 'energy' | 'water' | 'policy'
  const [activeConsoleTab, setActiveConsoleTab] = useState(savedState?.activeConsoleTab || initialConsoleTab);

  // Core User-Controlled Siting & Simulation Inputs
  const [itLoadMW, setItLoadMW] = useState(savedState?.itLoadMW || 50);
  const [pue, setPue] = useState(savedState?.pue || 1.30);
  const [selectedCoolingTech, setSelectedCoolingTech] = useState(savedState?.selectedCoolingTech || 'immersion_1p');
  const [renewableShare, setRenewableShare] = useState(savedState?.renewableShare !== undefined ? savedState.renewableShare : 0.50);
  const [selectedWaterSource, setSelectedWaterSource] = useState(savedState?.selectedWaterSource || 'stp');
  const [wue, setWue] = useState(savedState?.wue !== undefined ? savedState.wue : 0.02);
  const [customTariff, setCustomTariff] = useState(savedState?.customTariff !== undefined ? savedState.customTariff : null);

  // Secondary Thermodynamic Parameters
  const [utilisation, setUtilisation] = useState(0.85);
  const [ambientTemp, setAmbientTemp] = useState(38);
  const [humidity, setHumidity] = useState(45);
  const [campusAcres, setCampusAcres] = useState(15);
  const [rainfallMM, setRainfallMM] = useState(1100);

  // Simulation Results & Loading State
  const [simResult, setSimResult] = useState(null);
  const [loadingSim, setLoadingSim] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Campus Details Modal State
  const [inspectingCampus, setInspectingCampus] = useState(null);

  // Get active state intelligence profile
  const activeStateIntel = useMemo(() => {
    return getStateIntelligence(selectedState) || ALL_INDIA_STATES['Maharashtra'];
  }, [selectedState]);

  // Current effective electricity tariff (INR / unit)
  const effectiveTariff = customTariff !== null ? customTariff : (activeStateIntel?.tariffCommercial || 7.5);

  // Save state to localStorage on changes (prevents reset on refresh/back)
  useEffect(() => {
    try {
      const stateToSave = {
        selectedState,
        itLoadMW,
        pue,
        selectedCoolingTech,
        renewableShare,
        selectedWaterSource,
        customTariff,
        wue,
        activeConsoleTab,
        isConsoleCollapsed
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.warn('Could not save simulation state to localStorage:', err);
    }
  }, [selectedState, itLoadMW, pue, selectedCoolingTech, renewableShare, selectedWaterSource, customTariff, wue, activeConsoleTab, isConsoleCollapsed]);

  // Update cooling preset handler
  const handleSelectCoolingTech = (techId) => {
    setSelectedCoolingTech(techId);
    const preset = COOLING_PRESETS.find(c => c.id === techId);
    if (preset) {
      setPue(preset.pue);
      setWue(preset.wue);
    }
  };

  // Sync state tariff when selectedState changes
  useEffect(() => {
    if (activeStateIntel?.tariffCommercial && customTariff === null) {
      setCustomTariff(activeStateIntel.tariffCommercial);
    }
  }, [selectedState, activeStateIntel]);

  // Calculate Stull formula wet-bulb temperature
  const wetBulb = useMemo(() => {
    const T = ambientTemp;
    const RH = humidity;
    return Math.round(
      (T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
      Math.atan(T + RH) -
      Math.atan(RH - 1.676331) +
      0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
      4.686035) * 10
    ) / 10;
  }, [ambientTemp, humidity]);

  // Rainwater Harvesting Potential
  const potentialHarvestedML = useMemo(() => {
    return Math.round((campusAcres * 4046.86 * rainfallMM * 0.85) / 1000000 * 10) / 10;
  }, [campusAcres, rainfallMM]);

  // Sync Facility selection into simulation
  useEffect(() => {
    if (selectedFacility) {
      if (selectedFacility.reportedCapacityMW) {
        setItLoadMW(selectedFacility.reportedCapacityMW);
      }
      if (selectedFacility.state) {
        setSelectedState(selectedFacility.state);
      }
    }
  }, [selectedFacility]);

  // Run Deterministic Physics Simulation whenever parameters change
  useEffect(() => {
    let mounted = true;
    async function execute() {
      setLoadingSim(true);
      const res = await runSimulationWithFallback({
        itLoadMW,
        pue,
        utilisation,
        renewableShare,
        wue: wue !== '' && wue !== null ? Number(wue) : 0.05,
        gridRegion: 'national'
      });

      if (mounted) {
        setSimResult(res);
        setLoadingSim(false);
      }
    }

    const timer = setTimeout(execute, 50);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [itLoadMW, pue, utilisation, renewableShare, wue]);

  // Key Instant Real-Time Analysis Outputs
  const analysisOutputs = useMemo(() => {
    const facilityMW = Math.round(itLoadMW * pue * 10) / 10;
    const annualGWh = Math.round((facilityMW * 8760 * utilisation) / 1000 * 10) / 10;

    const gridCarbonFactor = activeStateIntel?.gridCarbonFactor || 710; // gCO2/kWh
    const grossEmissionsMT = Math.round((annualGWh * 1000 * gridCarbonFactor) / 1000);
    const netEmissionsMT = Math.round(grossEmissionsMT * (1 - renewableShare));
    const avoidedEmissionsMT = grossEmissionsMT - netEmissionsMT;

    const annualWaterML = Math.round((annualGWh * 1000 * wue) / 1000 * 10) / 10;
    const dailyWaterLiters = Math.round(((annualWaterML * 1000000) / 365));

    const annualElectricityBillCr = Math.round((annualGWh * 1000000 * effectiveTariff) / 10000000 * 10) / 10;
    const greenPpaSavingsCr = Math.round((annualElectricityBillCr * 0.16 * renewableShare) * 10) / 10;

    const estimatedStampDutyWaiverCr = Math.round((itLoadMW * 0.15) * 10) / 10;
    const estimatedPowerSubsidyCr = Math.round((annualElectricityBillCr * 0.12) * 10) / 10;
    const totalPolicyBenefitCr = Math.round((estimatedStampDutyWaiverCr + estimatedPowerSubsidyCr) * 10) / 10;

    const pueScore = Math.max(0, Math.min(35, (1.8 - pue) / (1.8 - 1.05) * 35));
    const reScore = renewableShare * 35;
    const wueScore = Math.max(0, Math.min(20, (1.5 - wue) / (1.5 - 0.01) * 20));
    const policyScore = (activeStateIntel?.greenSuitabilityScore || 80) * 0.1;
    const compositeESGScore = Math.min(100, Math.round(pueScore + reScore + wueScore + policyScore));

    const esgGrade = compositeESGScore >= 90 ? 'A+' : compositeESGScore >= 80 ? 'A' : compositeESGScore >= 70 ? 'B+' : 'B';

    return {
      facilityMW,
      annualGWh,
      annualEnergyGWh: annualGWh,
      gridCarbonFactor,
      grossEmissionsMT,
      netEmissionsMT,
      netScope2MT: netEmissionsMT,
      avoidedEmissionsMT,
      treesEquivalent: Math.round(avoidedEmissionsMT * 45),
      annualWaterML,
      waterDraftML: annualWaterML,
      dailyWaterLiters,
      annualElectricityBillCr,
      annualBillCr: annualElectricityBillCr,
      greenPpaSavingsCr,
      totalPolicyBenefitCr,
      compositeESGScore,
      esgGrade
    };
  }, [itLoadMW, pue, utilisation, renewableShare, wue, effectiveTariff, activeStateIntel]);

  // Derived Water Metrics for simulation and drawer display
  const waterMetrics = useMemo(() => ({
    wue: wue !== undefined && wue !== null ? wue : 0.05,
    annualWaterML: analysisOutputs?.annualWaterML || 0,
    dailyWaterLiters: analysisOutputs?.dailyWaterLiters || 0,
    cgwbGroundwaterRisk: activeStateIntel?.waterStressRisk || 'Moderate',
    complianceNote: activeStateIntel?.recycledWaterMandatory
      ? 'Mandatory 100% tertiary treated STP water sourcing in municipal/urban jurisdiction.'
      : 'Tertiary recycled water recommended to comply with MOEFCC/CPCB sustainability guidelines.'
  }), [wue, analysisOutputs, activeStateIntel]);

  // 24-Hour Diurnal Solar Profile
  const diurnalData = useMemo(() => {
    if (!analysisOutputs) return [];
    const facilityMW = analysisOutputs.facilityMW;
    const reShare = renewableShare;
    const hours = [];
    for (let h = 0; h < 24; h++) {
      let solarProfile = 0;
      if (h >= 6 && h <= 18) {
        solarProfile = Math.sin(((h - 6) / 12) * Math.PI);
      }
      const cleanGen = Math.round((facilityMW * reShare * (0.4 + 1.2 * solarProfile)) * 10) / 10;
      const thermalGrid = Math.max(0, Math.round((facilityMW - cleanGen) * 10) / 10);

      hours.push({
        hour: `${h}:00`,
        baseDemandMW: facilityMW,
        cleanGen,
        thermalGrid
      });
    }
    return hours;
  }, [analysisOutputs, renewableShare]);

  // Handle Location Sited by User Click on Map
  const handleMapLocationSited = (coords) => {
    setCustomSitedCoords(coords);
    setSelectedFacility(null);

    const [lat, lng] = coords;
    let detectedState = 'Maharashtra';
    if (lat > 26) detectedState = 'Uttar Pradesh';
    else if (lat > 20 && lng < 74) detectedState = 'Gujarat';
    else if (lat < 14 && lng > 78) detectedState = 'Tamil Nadu';
    else if (lat < 15 && lng <= 78) detectedState = 'Karnataka';
    else if (lat > 16 && lat < 19 && lng > 77) detectedState = 'Telangana';

    setSelectedState(detectedState);
  };

  // Handle Corridor Jump
  const handleCorridorJump = (corridor) => {
    if (corridor.state) setSelectedState(corridor.state);
    if (corridor.defaultLoad) setItLoadMW(corridor.defaultLoad);
    if (corridor.defaultPUE) setPue(corridor.defaultPUE);
    setCustomSitedCoords(null);

    const matchingFacility = FACILITIES.find(f => f.state === corridor.state);
    if (matchingFacility) setSelectedFacility(matchingFacility);
  };

  // Dynamic ref holding latest state for PDF export
  const exportParamsRef = useRef({
    selectedFacility,
    selectedState,
    simResult,
    analysisOutputs,
    wetBulb,
    statePolicy: STATE_POLICIES[selectedState]
  });
  exportParamsRef.current = {
    selectedFacility,
    selectedState,
    simResult,
    analysisOutputs,
    wetBulb,
    statePolicy: STATE_POLICIES[selectedState]
  };

  // Handle Export PDF
  const handleTriggerExportPDF = useCallback(async () => {
    try {
      setIsExportingPDF(true);
      const { selectedFacility: fac, selectedState: st, simResult: sim, analysisOutputs: outs, wetBulb: wb, statePolicy: sp } = exportParamsRef.current;
      await exportSustainabilityPDF({
        mapElementId: 'greendc-map-container',
        facility: fac,
        stateName: st,
        simResult: sim,
        analysisOutputs: outs,
        waterMetrics: {
          wetBulb: wb,
          aquiferStress: st === 'Karnataka' || st === 'Tamil Nadu' || st === 'Uttar Pradesh' ? 'Critical Stress (CGWB Over-Exploited)' : 'Safe to Moderate'
        },
        statePolicy: sp
      });
    } catch (e) {
      alert('Could not generate PDF: ' + e.message);
    } finally {
      setIsExportingPDF(false);
    }
  }, []);

  // Expose PDF export function to global header
  useEffect(() => {
    if (onRegisterExportHandler) {
      onRegisterExportHandler(handleTriggerExportPDF);
      return () => onRegisterExportHandler(null);
    }
  }, [onRegisterExportHandler, handleTriggerExportPDF]);

  const stateDetails = STATE_SUMMARIES[selectedState] || {};
  const statePolicy = STATE_POLICIES[selectedState] || {};

  return (
    <div className="space-y-5 animate-fadeIn text-slate-800 dark:text-slate-100">
      {/* TOP COMMAND HEADER */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-bold">
              <Compass className="w-4 h-4 text-emerald-600" /> National Location & Environmental Intelligence Command
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-heading mt-0.5">
              India Data Centre Sustainability Command Center
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Full-scale GIS map of India with live 3D perspective controls, state-by-state energy telemetry, and frontend facility simulation engine.
            </p>
          </div>

          {/* Quick PDF Action */}
          <button
            onClick={handleTriggerExportPDF}
            disabled={isExportingPDF}
            className="self-start lg:self-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            <Download className={`w-3.5 h-3.5 ${isExportingPDF ? 'animate-bounce' : ''}`} />
            {isExportingPDF ? 'Generating High-Res PDF...' : 'Download Site ESG PDF Report'}
          </button>
        </div>

        {/* Quick Corridor Navigation Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Corridors:
          </span>
          {CORRIDOR_PRESETS.map((c) => {
            const isActive = selectedState === c.state && !customSitedCoords;
            return (
              <button
                key={c.name}
                onClick={() => handleCorridorJump(c)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* FULL-WIDTH HERO MAP CANVAS */}
      <div className="w-full relative">
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col space-y-0 relative transition-all duration-300">
          {/* Map Controls Header */}
          <div className="p-3 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Map Style:</span>
              <button
                onClick={() => setActiveTileKey('voyager')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTileKey === 'voyager' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                🌿 Eco-Tech
              </button>
              <button
                onClick={() => setActiveTileKey('satellite')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTileKey === 'satellite' ? 'bg-slate-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                🛰 Dark Mode
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTransmissionArcs}
                  onChange={(e) => setShowTransmissionArcs(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span className="text-slate-600 dark:text-slate-400">RE Corridors</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showStateBorders}
                  onChange={(e) => setShowStateBorders(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span className="text-slate-600 dark:text-slate-400">30+ Cities</span>
              </label>

              {/* 100+ Cities Catalog Button */}
              <button
                onClick={() => setIsCityDirectoryOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                title="Browse 100+ Indian Cities with cooling hours & water risk"
              >
                <Building2 className="w-3 h-3 text-emerald-600" />
                <span>100+ Cities</span>
              </button>

              {/* AI Siting Advisor Trigger */}
              <button
                onClick={() => setIsAIChatOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                title="Open AI Siting Consultant"
              >
                <Bot className="w-3 h-3" />
                <span>AI Advisor</span>
              </button>

              {/* Simulation Studio Trigger Button with Info Sign */}
              <button
                onClick={() => setIsStudioDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition cursor-pointer transform hover:-translate-y-0.5 border border-emerald-400/40"
                title="Open Facility Siting & ESG Simulation Console (i)"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulation Studio</span>
                <span className="w-3.5 h-3.5 rounded-full bg-white/25 text-white text-[9px] flex items-center justify-center font-mono font-bold">i</span>
              </button>

              {/* Fullscreen Expand Button */}
              <button
                onClick={() => setIsMapExpanded(!isMapExpanded)}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                {isMapExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                <span>{isMapExpanded ? 'Normal' : 'Expand'}</span>
              </button>
            </div>
          </div>

          {/* SVG MAP WRAPPER (Custom high-detail SVG map with D3 fitExtent) */}
          <div id="greendc-map-container" className="w-full relative">
            <IndiaMapSVG
              selectedState={selectedState}
              customSitedCoords={customSitedCoords}
              mapStyle={activeTileKey === 'satellite' ? 'satellite' : 'eco'}
              showTransmission={showTransmissionArcs}
              showCities={showStateBorders}
              height={isMapExpanded ? 780 : 660}
              onStateClick={(stateName) => {
                setSelectedState(stateName);
                setCustomSitedCoords(null);
                const matchingFacility = FACILITIES.find(f => f.state === stateName);
                if (matchingFacility) {
                  setSelectedFacility(matchingFacility);
                  if (matchingFacility.reportedCapacityMW) setItLoadMW(matchingFacility.reportedCapacityMW);
                }
              }}
              onLocationSited={handleMapLocationSited}
              onDCClick={(dc) => {
                setSelectedState(dc.state);
                setItLoadMW(dc.mw);
              }}
              isExpanded={false}
              onToggleExpand={() => setIsMapExpanded(!isMapExpanded)}
              simulatedCapacityMW={itLoadMW}
              simulatedRenewableShare={renewableShare}
              simulatedCoolingTech={selectedCoolingTech}
              simulatedPUE={pue}
            />
          </div>

          {/* Sited Node Info Strip Footer */}
          <div className="p-3.5 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                Active Siting Target
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                {selectedFacility ? selectedFacility.name : (customSitedCoords ? `Custom Sited Node (${customSitedCoords[0].toFixed(2)}, ${customSitedCoords[1].toFixed(2)})` : `${selectedState} Regional Node`)}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Region: <strong className="text-slate-800 dark:text-slate-200">{selectedState}</strong> • Sited Load: <strong className="text-emerald-700 dark:text-emerald-400">{itLoadMW} MW IT ({analysisOutputs.facilityMW} MW Total Peak)</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold font-mono text-xs">
                Score: {activeStateIntel?.greenSuitabilityScore || 85}/100
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                {activeStateIntel?.tier || 'Regional Edge Hub'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* REGIONAL INFRASTRUCTURE TELEMETRY & DOCUMENTED CAMPUSES (Clean Uncluttered Grid Below Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: State Power, Clean Energy & Tariffs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Power Tariff & Grid Carbon
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-semibold">
              CEA 2025 Data
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
              <div className="text-[10px] text-slate-500">Commercial Tariff</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                ₹{effectiveTariff}/kWh
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
              <div className="text-[10px] text-slate-500">Grid Carbon Intensity</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {activeStateIntel?.gridEmissionsKgCO2PerKWh || 0.72} <span className="text-[10px] font-normal text-slate-400">kg/kWh</span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>State RE Target: <strong>{activeStateIntel?.rePolicyScore || 80}% by 2030</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Open Access PPA Ready</span>
          </div>
        </div>

        {/* Card 2: Water Stress & Free Cooling Potential */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-500" />
              Hydrology & Climate Cooling
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 font-semibold">
              CGWB 2024
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
              <div className="text-[10px] text-slate-500">Water Stress Risk</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {activeStateIntel?.waterStressRisk || 'Medium'}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
              <div className="text-[10px] text-slate-500">Free Cooling Hours</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {activeStateIntel?.freeCoolingHoursYear || 2800} <span className="text-[10px] font-normal text-slate-400">hrs/yr</span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>Mandatory STP: <strong>{activeStateIntel?.recycledWaterMandatory ? 'Yes (Urban Zones)' : 'Recommended'}</strong></span>
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">WUE Target &lt; 0.40</span>
          </div>
        </div>

        {/* Card 3: Documented Hyperscale Campuses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Campuses in {selectedState} ({stateDetails.facilityCount || 0})
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Click to Inspect
            </span>
          </div>
          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 no-scrollbar">
            {FACILITIES.filter(f => f.state.toLowerCase() === selectedState.toLowerCase()).map(f => (
              <div
                key={f.id}
                onClick={() => setInspectingCampus(f)}
                className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-400 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-emerald-50/60 dark:hover:bg-slate-750 transition cursor-pointer flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="text-slate-900 dark:text-white font-bold group-hover:text-emerald-600 flex items-center gap-1 text-[11px]">
                    <span>{f.name}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{f.operator} • {f.city}</div>
                </div>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold text-[11px]">
                  {f.reportedCapacityMW ? `${f.reportedCapacityMW} MW` : 'Undisclosed'}
                </span>
              </div>
            ))}
            {FACILITIES.filter(f => f.state.toLowerCase() === selectedState.toLowerCase()).length === 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center text-slate-500 text-[11px]">
                No legacy colocation campuses registered. Ideal greenfield zone under state policy!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING ACTION TRIGGER: SIMULATION STUDIO POPUP (Right Edge Pill with Info Icon) */}
      <button
        onClick={() => setIsStudioDrawerOpen(true)}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-30 flex items-center gap-2 pl-3.5 pr-2.5 py-3 rounded-l-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-2xl shadow-emerald-950/40 border-l border-y border-emerald-400/40 transition duration-200 cursor-pointer group"
        title="Open Facility Siting & ESG Simulation Console (i)"
      >
        <Calculator className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition" />
        <span className="hidden sm:inline font-mono">⚡ Simulation Studio ({itLoadMW} MW)</span>
        <span className="w-5 h-5 rounded-full bg-white/25 text-white text-[11px] flex items-center justify-center font-bold font-mono">i</span>
      </button>

      {/* SLIDE-OVER RIGHT POPUP DRAWER: FACILITY SITING & ESG SIMULATION STUDIO */}
      <SimulationDrawer
        isOpen={isStudioDrawerOpen}
        onClose={() => setIsStudioDrawerOpen(false)}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        itLoadMW={itLoadMW}
        setItLoadMW={setItLoadMW}
        pue={pue}
        setPue={setPue}
        selectedCoolingTech={selectedCoolingTech}
        handleSelectCoolingTech={handleSelectCoolingTech}
        renewableShare={renewableShare}
        setRenewableShare={setRenewableShare}
        selectedWaterSource={selectedWaterSource}
        setSelectedWaterSource={setSelectedWaterSource}
        effectiveTariff={effectiveTariff}
        setCustomTariff={setCustomTariff}
        analysisOutputs={analysisOutputs}
        waterMetrics={waterMetrics}
        activeStateIntel={activeStateIntel}
        activeConsoleTab={activeConsoleTab}
        setActiveConsoleTab={setActiveConsoleTab}
        capacityPresets={CAPACITY_PRESETS}
        coolingPresets={COOLING_PRESETS}
        waterSources={WATER_SOURCES}
        onExportPDF={handleTriggerExportPDF}
        isExportingPDF={isExportingPDF}
      />

      {/* CAMPUS DETAILS & REAL-WORLD USE CASE MODAL */}
      <CampusDetailsModal
        facility={inspectingCampus}
        isOpen={!!inspectingCampus}
        onClose={() => setInspectingCampus(null)}
        onSimulateInEngine={(fac) => {
          setSelectedFacility(fac);
          if (fac.reportedCapacityMW) setItLoadMW(fac.reportedCapacityMW);
          if (fac.state) setSelectedState(fac.state);
        }}
      />

      {/* ALL-INDIA 100+ CITIES & REGIONAL SITING CATALOG MODAL */}
      <CityDirectoryModal
        isOpen={isCityDirectoryOpen}
        onClose={() => setIsCityDirectoryOpen(false)}
        onSiteCityOnMap={(city) => {
          setSelectedState(city.state);
          setCustomSitedCoords([city.lat, city.lng]);
          if (city.tariff) setCustomTariff(city.tariff);
        }}
        onSimulateCity={(city) => {
          setSelectedState(city.state);
          setCustomSitedCoords([city.lat, city.lng]);
          if (city.tariff) setCustomTariff(city.tariff);
          if (city.freeCoolingHours > 4500) {
            setSelectedCoolingTech('free_air');
            setPue(1.18);
          } else if (city.freeCoolingHours > 3000) {
            setSelectedCoolingTech('adiabatic');
            setPue(1.22);
          }
        }}
      />

      {/* FLOATING ACTION TRIGGER: GREEN DC AI ADVISOR */}
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-5 right-5 sm:right-7 z-40 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xl shadow-emerald-700/30 flex items-center gap-2 transform hover:-translate-y-1 transition duration-200 cursor-pointer border border-emerald-400/40"
        title="Open Clean Compute & Siting AI Consultant"
      >
        <Bot className="w-4 h-4 text-emerald-200" />
        <span className="hidden sm:inline">Ask AI Siting Advisor</span>
        <span className="sm:hidden">AI Advisor</span>
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
      </button>

      {/* INTERACTIVE AI SITING & CLEAN COMPUTE CONSULTANT CHAT */}
      <AIChatConsultant
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        currentSimState={{
          itLoadMW,
          pue,
          selectedState
        }}
        onFocusLocation={({ state, coords }) => {
          if (state) setSelectedState(state);
          if (coords) setCustomSitedCoords(coords);
        }}
        onOpenCityDirectory={() => setIsCityDirectoryOpen(true)}
        onOpenSimulationStudio={() => setIsStudioDrawerOpen(true)}
        onApplySimulationPreset={({ state, mw, pue: newPue, coolingTech, renewableShare: newRE, openStudio }) => {
          if (state) setSelectedState(state);
          if (mw) setItLoadMW(mw);
          if (newPue) setPue(newPue);
          if (coolingTech) handleSelectCoolingTech(coolingTech);
          if (newRE !== undefined) setRenewableShare(newRE);
          if (openStudio) setIsStudioDrawerOpen(true);
        }}
      />
    </div>
  );
}
