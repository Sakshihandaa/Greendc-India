import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import * as d3geo from 'd3-geo';
import {
  MapPin, Layers, RefreshCw, ZoomIn, ZoomOut, Maximize2, Minimize2,
  Sun, Wind, Zap, Droplets, ShieldCheck, Sparkles, Box,
  Compass, Eye, X, ArrowUpRight, CheckCircle2, Sliders, Target, Activity,
  HelpCircle, ChevronDown, ChevronUp, Info, Table, Network, Globe
} from 'lucide-react';
import indiaStatesGeo from '../data/indiaStatesGeo.json';
import { FACILITIES } from '../data/facilitiesData';
import {
  ALL_INDIA_STATES,
  getStateIntelligence,
  getChoroplethColor
} from '../data/allIndiaStateData';
import { ALL_INDIA_CITIES } from '../data/allIndiaCitiesData';

// Verified data center clusters
const DC_CLUSTERS = [
  { id: 'mum', name: 'Mumbai MMR Hub', state: 'Maharashtra', lat: 19.076, lng: 72.877, mw: 155, status: 'Operational', subsea: true },
  { id: 'del', name: 'Greater Noida NCR', state: 'Uttar Pradesh', lat: 28.474, lng: 77.504, mw: 78, status: 'Operational', subsea: false },
  { id: 'ben', name: 'Bengaluru Tech Corridor', state: 'Karnataka', lat: 12.971, lng: 77.594, mw: 45, status: 'Operational', subsea: false },
  { id: 'hyd', name: 'Hyderabad HITEC City', state: 'Telangana', lat: 17.447, lng: 78.376, mw: 32, status: 'Operational', subsea: false },
  { id: 'che', name: 'Chennai TICEL Park', state: 'Tamil Nadu', lat: 13.082, lng: 80.274, mw: 33, status: 'Operational', subsea: true },
  { id: 'gift', name: 'GIFT City Gandhinagar', state: 'Gujarat', lat: 23.161, lng: 72.684, mw: 50, status: 'Under Construction', subsea: false },
  { id: 'pun', name: 'Pune Hinjawadi', state: 'Maharashtra', lat: 18.590, lng: 73.739, mw: 25, status: 'Operational', subsea: false },
  { id: 'kol', name: 'Kolkata New Town', state: 'West Bengal', lat: 22.572, lng: 88.363, mw: 18, status: 'Under Construction', subsea: false },
  { id: 'vizag', name: 'Visakhapatnam Coastal Node', state: 'Andhra Pradesh', lat: 17.686, lng: 83.218, mw: 15, status: 'Under Construction', subsea: true },
  { id: 'kochi', name: 'Kochi Subsea Gateway', state: 'Kerala', lat: 9.931, lng: 76.267, mw: 12, status: 'Operational', subsea: true },
  { id: 'baddi', name: 'Baddi Cold-Climate Hub', state: 'Himachal Pradesh', lat: 30.957, lng: 76.791, mw: 5, status: 'Planned', subsea: false },
  { id: 'guw', name: 'Guwahati Northeast Edge', state: 'Assam', lat: 26.115, lng: 91.586, mw: 6, status: 'Planned', subsea: false },
];

// Renewable Mega-Parks
const RENEWABLE_HUBS = [
  { id: 'khavda', name: 'Khavda 30 GW Hybrid', lat: 23.95, lng: 69.83, type: 'solar_wind', mw: 30000 },
  { id: 'bhadla', name: 'Bhadla Solar 2.24 GW', lat: 27.53, lng: 71.91, type: 'solar', mw: 2245 },
  { id: 'pavagada', name: 'Pavagada Solar 2.05 GW', lat: 14.28, lng: 77.27, type: 'solar', mw: 2050 },
  { id: 'muppandal', name: 'Muppandal Wind 1.5 GW', lat: 8.25, lng: 77.54, type: 'wind', mw: 1500 },
  { id: 'rewa', name: 'Rewa Ultra Solar 750 MW', lat: 24.53, lng: 81.30, type: 'solar', mw: 750 },
];

// Transmission routes from nearest RE park to each DC hub
const TRANSMISSION_ROUTES = [
  { from: [23.95, 69.83], to: [19.076, 72.877], label: 'Khavda → Mumbai', state: 'Maharashtra' },
  { from: [27.53, 71.91], to: [28.474, 77.504], label: 'Bhadla → Noida', state: 'Uttar Pradesh' },
  { from: [14.28, 77.27], to: [12.971, 77.594], label: 'Pavagada → Bengaluru', state: 'Karnataka' },
  { from: [8.25, 77.54],  to: [13.082, 80.274], label: 'Muppandal → Chennai', state: 'Tamil Nadu' },
  { from: [14.28, 77.27], to: [17.447, 78.376], label: 'Pavagada → Hyderabad', state: 'Telangana' },
  { from: [24.53, 81.30], to: [22.572, 88.363], label: 'Rewa → Kolkata', state: 'West Bengal' },
  { from: [8.25, 77.54],  to: [9.931, 76.267],  label: 'Muppandal → Kochi', state: 'Kerala' },
  { from: [23.95, 69.83], to: [23.161, 72.684], label: 'Khavda → GIFT City', state: 'Gujarat' },
  { from: [27.53, 71.91], to: [26.91, 75.79],   label: 'Bhadla → Jaipur', state: 'Rajasthan' },
  { from: [14.28, 77.27], to: [17.686, 83.218], label: 'Pavagada → Vizag', state: 'Andhra Pradesh' },
];

const PULSE_RINGS = [0, 1, 2];

export default function IndiaMapSVG({
  onStateClick,
  onLocationSited,
  selectedState: externalSelectedState,
  customSitedCoords,
  mapStyle = 'eco',
  showTransmission = true,
  showCities = true,
  height = 640,
  onDCClick,
  isExpanded = false,
  onToggleExpand,
  simulatedCapacityMW = 50,
  simulatedRenewableShare = 0.50,
  simulatedCoolingTech = 'immersion_1p',
  simulatedPUE = 1.30,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const animFrameRef = useRef(null);

  const [containerSize, setContainerSize] = useState({ w: 750, h: height });
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Free interactive 3D camera angles ("apni marzi se camera angle")
  const [pitchAngle, setPitchAngle] = useState(0); // 0 (flat) to 50
  const [yawAngle, setYawAngle] = useState(0);     // -30 to +30
  const [showAngleControls, setShowAngleControls] = useState(false);

  const [metricLayer, setMetricLayer] = useState('suitability'); // 'suitability', 'reShare', 'waterStress', 'carbon'
  const [activePopupState, setActivePopupState] = useState(null);
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics', 'policy', 'connectivity'

  // Map Legend & Guide State
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [legendTab, setLegendTab] = useState('symbols'); // 'symbols' | 'scale'
  const [hoveredCity, setHoveredCity] = useState(null);
  const [showAllCities, setShowAllCities] = useState(false);

  const isDark = mapStyle === 'satellite';

  // Responsive Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({
          w: entry.contentRect.width || 750,
          h: entry.contentRect.height || height,
        });
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [height]);

  // Pulse animation loop
  useEffect(() => {
    let t = 0;
    function tick() {
      // Speed up flow when simulated renewable share is high
      const speed = 0.012 + (simulatedRenewableShare * 0.015);
      t += speed;
      setPulsePhase(t);
      animFrameRef.current = requestAnimationFrame(tick);
    }
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [simulatedRenewableShare]);

  // D3 Mercator Projection with fitExtent to fill 100% of container
  const { projection, statePaths, stateCentroids } = useMemo(() => {
    const margin = 16;
    const proj = d3geo.geoMercator()
      .fitExtent([[margin, margin], [containerSize.w - margin, containerSize.h - margin]], indiaStatesGeo);

    const pg = d3geo.geoPath().projection(proj);

    const sp = {};
    const centroids = {};
    if (indiaStatesGeo?.features) {
      for (const f of indiaStatesGeo.features) {
        const name = f.properties.name;
        const d = pg(f.geometry);
        if (d) sp[name] = d;

        const c = pg.centroid(f.geometry);
        if (c && !isNaN(c[0]) && !isNaN(c[1])) {
          centroids[name] = c;
        }
      }
    }
    return { projection: proj, statePaths: sp, stateCentroids: centroids };
  }, [containerSize]);

  // Handle map click for custom siting
  const handleSVGClick = useCallback((e) => {
    if (!svgRef.current || panning) return;
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const svgX = (rawX - transform.x) / transform.k;
    const svgY = (rawY - transform.y) / transform.k;
    const coords = projection.invert([svgX, svgY]);
    if (coords && onLocationSited) {
      onLocationSited([coords[1], coords[0]]);
    }
  }, [projection, transform, panning, onLocationSited]);

  // Pan handlers
  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) {
      setPanning(false);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e) => {
    if (panStart === null) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    if (Math.abs(dx - transform.x) > 4 || Math.abs(dy - transform.y) > 4) setPanning(true);
    setTransform(t => ({ ...t, x: dx, y: dy }));
  }, [panStart, transform]);

  const handleMouseUp = useCallback(() => {
    setPanStart(null);
  }, []);

  // Zoom wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.12;
    setTransform(t => {
      const newK = Math.max(0.7, Math.min(6, t.k * factor));
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return t;
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const x = cx - (cx - t.x) * (newK / t.k);
      const y = cy - (cy - t.y) * (newK / t.k);
      return { x, y, k: newK };
    });
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Sync externalSelectedState
  useEffect(() => {
    if (externalSelectedState) {
      const intel = getStateIntelligence(externalSelectedState);
      if (intel) setActivePopupState(intel);
    }
  }, [externalSelectedState]);

  // Focus zoom on selected state centroid
  const handleFocusSelectedState = useCallback((targetStateName) => {
    const sName = targetStateName || externalSelectedState;
    if (!sName) return;
    const intel = getStateIntelligence(sName);
    const geoKey = intel?.geoName || sName;
    const centroid = stateCentroids[geoKey];
    if (centroid) {
      const targetK = 2.2;
      const targetX = containerSize.w / 2 - centroid[0] * targetK;
      const targetY = containerSize.h / 2 - centroid[1] * targetK;
      setTransform({ x: targetX, y: targetY, k: targetK });
    }
  }, [externalSelectedState, stateCentroids, containerSize]);

  // Colors & styles
  const bg = isDark
    ? {
        bg: '#0f172a',
        ocean: '#0b1324',
        grid: '#38bdf815',
        textFill: '#f8fafc',
        stroke: '#1e293b'
      }
    : {
        bg: '#f8fafc',
        ocean: '#e0f2fe',
        grid: '#05966915',
        textFill: '#0f172a',
        stroke: '#ffffff'
      };

  // Projected transmission paths with dynamic glow matching right panel
  const transmissionPaths = useMemo(() => {
    if (!showTransmission) return [];
    return TRANSMISSION_ROUTES.map((r, i) => {
      const isConnectedToSelected = r.state === externalSelectedState;
      return {
        ...r,
        fromPt: projection([r.from[1], r.from[0]]),
        toPt: projection([r.to[1], r.to[0]]),
        id: i,
        isConnectedToSelected
      };
    });
  }, [projection, showTransmission, externalSelectedState]);

  // Projected DC points
  const dcPoints = useMemo(() => {
    return DC_CLUSTERS.map(dc => ({
      ...dc,
      pt: projection([dc.lng, dc.lat])
    }));
  }, [projection]);

  // Projected RE points
  const rePoints = useMemo(() => {
    return RENEWABLE_HUBS.map(r => ({
      ...r,
      pt: projection([r.lng, r.lat])
    }));
  }, [projection]);

  // Projected cities from 100+ All-India Cities directory
  const cityPoints = useMemo(() => {
    if (!showCities) return [];
    return ALL_INDIA_CITIES.map(c => ({
      ...c,
      pt: projection([c.lng, c.lat]),
      major: c.tier === 'Tier 1' || c.tier === 'Emerging DC Hub'
    })).filter(c => c.pt && !isNaN(c.pt[0]) && !isNaN(c.pt[1]));
  }, [projection, showCities]);

  // Custom sited point
  const sitedPt = useMemo(() => {
    if (!customSitedCoords) return null;
    return projection([customSitedCoords[1], customSitedCoords[0]]);
  }, [projection, customSitedCoords]);

  // Selected state centroid point for the active simulated beacon
  const selectedStateCentroid = useMemo(() => {
    if (!externalSelectedState) return null;
    const intel = getStateIntelligence(externalSelectedState);
    const geoKey = intel?.geoName || externalSelectedState;
    return stateCentroids[geoKey] || null;
  }, [externalSelectedState, stateCentroids]);

  // 3D Camera transform style calculated from pitch & yaw
  const cameraTransformStyle = useMemo(() => {
    if (pitchAngle === 0 && yawAngle === 0) {
      return {
        transform: 'none',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      };
    }
    return {
      transform: `perspective(1100px) rotateX(${pitchAngle}deg) rotateY(${yawAngle}deg) scale(${1 + pitchAngle * 0.003})`,
      transformOrigin: '50% 50%',
      transition: 'transform 0.2s ease-out'
    };
  }, [pitchAngle, yawAngle]);

  const selectedState = externalSelectedState || null;

  // Active state border glow color derived from simulated cooling technology
  const coolingGlowColor = useMemo(() => {
    if (simulatedCoolingTech.includes('immersion')) return '#10b981'; // vibrant emerald
    if (simulatedCoolingTech.includes('adiabatic') || simulatedCoolingTech.includes('free_air')) return '#06b6d4'; // cyan
    return '#f59e0b'; // amber
  }, [simulatedCoolingTech]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 rounded-3xl shadow-2xl' : 'rounded-3xl'
      }`}
      style={{ height: isExpanded ? 'calc(100vh - 32px)' : height, background: bg.ocean }}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 35%, #172554 0%, #0b1324 70%, #020617 100%)'
            : 'radial-gradient(ellipse at 50% 35%, #e0f2fe 0%, #f1f5f9 55%, #e2e8f0 100%)',
          zIndex: 0
        }}
      />

      {/* TOP CONTROL BAR: Camera Angles, Pitch Slider, Layers, City Filter & Guide */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Interactive Camera Angle Presets & Tilt Slider */}
        <div className="flex items-center gap-1.5 p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-md">
          <div className="flex items-center gap-1 px-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
            <Compass className="w-3.5 h-3.5 text-emerald-600" /> Cam Angle:
          </div>

          <button
            onClick={() => { setPitchAngle(0); setYawAngle(0); }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              pitchAngle === 0 && yawAngle === 0
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>📐 2D Flat</span>
          </button>

          <button
            onClick={() => { setPitchAngle(28); setYawAngle(-6); }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              pitchAngle === 28
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>🌐 3D Tactical 28°</span>
          </button>

          <button
            onClick={() => { setPitchAngle(42); setYawAngle(4); }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              pitchAngle === 42
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>🚁 High Horizon 42°</span>
          </button>

          {/* Toggle Custom Angle Sliders Drawer */}
          <button
            onClick={() => setShowAngleControls(!showAngleControls)}
            title="Custom Pitch & Yaw Camera Sliders"
            className={`px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition cursor-pointer ${
              showAngleControls
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span className="text-[11px] font-mono">{pitchAngle}°</span>
          </button>

          {/* Focus State Button */}
          {selectedState && (
            <button
              onClick={() => handleFocusSelectedState(selectedState)}
              title={`Zoom and focus camera directly onto ${selectedState}`}
              className="px-2 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition cursor-pointer"
            >
              <Target className="w-3 h-3 text-emerald-600" /> Focus {selectedState}
            </button>
          )}
        </div>

        {/* Right: Thematic Layers, City Filter, Guide & Fullscreen */}
        <div className="flex items-center gap-1.5 p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-md text-xs">
          <div className="flex items-center gap-1 px-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase">
            <Layers className="w-3.5 h-3.5 text-emerald-600" /> Layer:
          </div>

          <button
            onClick={() => setMetricLayer('suitability')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              metricLayer === 'suitability'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
            }`}
          >
            🎯 DC Suitability
          </button>
          <button
            onClick={() => setMetricLayer('reShare')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              metricLayer === 'reShare'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
            }`}
          >
            🌿 RE Share %
          </button>
          <button
            onClick={() => setMetricLayer('waterStress')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              metricLayer === 'waterStress'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
            }`}
          >
            💧 Water Risk
          </button>
          <button
            onClick={() => setMetricLayer('carbon')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              metricLayer === 'carbon'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
            }`}
          >
            💨 Grid Carbon
          </button>

          {/* Toggle All Cities vs Major Only */}
          <button
            onClick={() => setShowAllCities(!showAllCities)}
            title="Toggle All 122+ Cities Labels vs Major Only"
            className={`px-2 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
              showAllCities
                ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-300 shadow-sm'
                : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🏙️ {showAllCities ? 'All 122 Cities' : 'Major Cities'}</span>
          </button>

          {/* Map Guide & Denotation Table Toggle */}
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            title="Toggle Map Guide & Symbols Denotation Chart"
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
              isLegendOpen
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 shadow-sm'
                : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Map Key</span>
          </button>

          {/* Fullscreen / Expand Map Toggle */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              title={isExpanded ? 'Collapse Map' : 'Expand Map to Fullscreen'}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 ml-1 transition cursor-pointer"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* DROPDOWN DRAWER: CUSTOM PITCH & YAW CAMERA SLIDERS */}
      {showAngleControls && (
        <div className="absolute top-16 left-3 z-30 p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl w-64 space-y-2.5 text-xs animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" /> Free 3D Camera Controls
            </span>
            <button onClick={() => { setPitchAngle(0); setYawAngle(0); }} className="text-[10px] text-emerald-600 hover:underline">
              Reset 0°
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              <span>Vertical Tilt (Pitch):</span>
              <strong className="text-emerald-700">{pitchAngle}°</strong>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={pitchAngle}
              onChange={(e) => setPitchAngle(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>0° (Flat 2D)</span>
              <span>25°</span>
              <span>50° (Deep 3D)</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              <span>Horizontal Rotation (Yaw):</span>
              <strong className="text-emerald-700">{yawAngle}°</strong>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              value={yawAngle}
              onChange={(e) => setYawAngle(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>-30° (West)</span>
              <span>0°</span>
              <span>+30° (East)</span>
            </div>
          </div>
        </div>
      )}

      {/* LIVE SIMULATION HUD STRIP (Visual feedback connecting right-panel inputs to map) */}
      {selectedState && (
        <div className="absolute top-16 left-3 z-15 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 text-white backdrop-blur-md border border-emerald-500/40 text-[11px] shadow-lg animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono font-bold text-emerald-300 uppercase">Live Simulation Active:</span>
          <span><strong>{selectedState}</strong></span>
          <span className="text-slate-400">•</span>
          <span className="text-amber-300 font-mono font-bold">{simulatedCapacityMW} MW IT</span>
          <span className="text-slate-400">•</span>
          <span className="text-teal-300 font-mono">PUE {simulatedPUE.toFixed(2)}</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-300 font-mono">{Math.round(simulatedRenewableShare * 100)}% Green RE</span>
        </div>
      )}

      {/* 3D PERSPECTIVE VIEWPORT */}
      <div
        className="w-full h-full relative"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="w-full h-full relative" style={cameraTransformStyle}>
          {pitchAngle > 10 && (
            <div
              className="absolute pointer-events-none rounded-full blur-3xl opacity-30"
              style={{
                width: '80%',
                height: '75%',
                top: '15%',
                left: '10%',
                background: isDark
                  ? 'radial-gradient(ellipse, #000000 0%, transparent 75%)'
                  : 'radial-gradient(ellipse, #04785750 0%, transparent 75%)',
                transform: 'translateZ(-15px)'
              }}
            />
          )}

          {/* SVG MAP ELEMENT WITH EXPLICIT XMLNS AND ID FOR 100% RELIABLE PDF CAPTURE */}
          <svg
            id="greendc-india-svg"
            xmlns="http://www.w3.org/2000/svg"
            ref={svgRef}
            width={containerSize.w}
            height={containerSize.h}
            className="absolute inset-0 cursor-crosshair"
            style={{ zIndex: 1 }}
            onClick={handleSVGClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <radialGradient id="dcGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={bg.grid} strokeWidth="0.5" />
              </pattern>
              <filter id="landShadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000022" />
              </filter>
              <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#00000030" />
              </filter>
            </defs>

            {/* Grid overlay */}
            <rect width="100%" height="100%" fill="url(#mapGrid)" opacity="0.35" />

            {/* Transform Group (Pan & Zoom) */}
            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
              {/* ALL 35/36 STATES IN INDIA GEOJSON */}
              {indiaStatesGeo?.features?.map(feature => {
                const geoName = feature.properties.name;
                const pathD = statePaths[geoName];
                if (!pathD) return null;

                const intel = getStateIntelligence(geoName);
                const isSelected = selectedState === geoName || selectedState === intel?.displayName;
                const isHovered = hoveredState === geoName;
                const fillColor = getChoroplethColor(geoName, metricLayer, isDark);

                const centroid = stateCentroids[geoName];

                return (
                  <g key={geoName}>
                    {/* State Polygon Path - Vivid, High Contrast Thematic Coloring */}
                    <path
                      d={pathD}
                      fill={fillColor}
                      fillOpacity={
                        isSelected
                          ? 0.98
                          : isHovered
                          ? 0.92
                          : (isDark ? 0.82 : 0.80)
                      }
                      stroke={
                        isSelected
                          ? '#047857'
                          : isHovered
                          ? (isDark ? '#38bdf8' : '#0284c7')
                          : (isDark ? '#0f172a' : '#ffffff')
                      }
                      strokeWidth={
                        (isSelected ? 3.0 : isHovered ? 2.2 : 1.25) / transform.k
                      }
                      style={{
                        cursor: 'pointer',
                        transition: 'fill-opacity 0.2s, stroke 0.2s, stroke-width 0.2s',
                        filter: isSelected ? 'url(#landShadow)' : 'none'
                      }}
                      onMouseEnter={() => setHoveredState(geoName)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!panning) {
                          const targetName = intel?.displayName || geoName;
                          if (onStateClick) onStateClick(targetName);
                          setActivePopupState(intel);
                        }
                      }}
                    >
                      <title>{`${intel?.displayName || geoName} (${intel?.code || ''})\n• Tier: ${intel?.tier || 'Regional'}\n• DC Suitability Score: ${intel?.greenSuitabilityScore || 80}/100\n• RE Generation Share: ${intel?.reSharePercent || 30}%\n• Water Stress: ${intel?.waterStress || 'Moderate'}\n• Grid Carbon: ${intel?.gridCarbonFactor || 710} gCO2/kWh\n• Commercial Tariff: ₹${intel?.tariffCommercial || 7.5}/unit\n\n👉 Click to inspect State Policy & Telemetry`}</title>
                    </path>

                    {/* State Code Label Badge centered on polygon */}
                    {centroid && intel?.code && (
                      <g
                        style={{ pointerEvents: 'none' }}
                        transform={`translate(${centroid[0]}, ${centroid[1]})`}
                      >
                        <rect
                          x={-11 / transform.k}
                          y={-7.5 / transform.k}
                          width={22 / transform.k}
                          height={15 / transform.k}
                          rx={4 / transform.k}
                          fill={isSelected ? '#059669' : (isDark ? '#1e293bf2' : '#fffffffa')}
                          stroke={isSelected ? '#ffffff' : (isDark ? '#475569' : '#cbd5e1')}
                          strokeWidth={1 / transform.k}
                          filter="url(#badgeShadow)"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={7.5 / transform.k}
                          fill={isSelected ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a')}
                          fontWeight="800"
                          fontFamily="sans-serif"
                        >
                          {intel.code}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Dynamic Transmission Lines - Glow and pulse with simulatedRenewableShare */}
              {transmissionPaths.map(r => {
                const isSelectedCorridor = r.isConnectedToSelected;
                const strokeColor = isSelectedCorridor
                  ? (simulatedRenewableShare > 0.7 ? '#10b981' : '#14b8a6')
                  : '#10b981';
                const strokeWidth = (isSelectedCorridor ? (2.5 + simulatedRenewableShare * 2) : 1.8) / transform.k;

                return (
                  <g key={r.id}>
                    <line
                      x1={r.fromPt[0]} y1={r.fromPt[1]}
                      x2={r.toPt[0]}   y2={r.toPt[1]}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${8 / transform.k},${5 / transform.k}`}
                      strokeDashoffset={-pulsePhase * (25 + simulatedRenewableShare * 30)}
                      opacity={isSelectedCorridor ? 0.95 : 0.65}
                      strokeLinecap="round"
                      style={{ pointerEvents: 'none' }}
                    >
                      <title>{`⚡ Green Power Transmission Corridor: ${r.label}\n• High-voltage clean energy wheeling into ${r.state} Data Center Cluster`}</title>
                    </line>
                  </g>
                );
              })}

              {/* Renewable Energy Mega-Parks */}
              {rePoints.map(r => {
                const [rx, ry] = r.pt;
                const ringScale = (Math.sin(pulsePhase + r.id * 1.1) + 1) / 2;
                const ringR = 10 + ringScale * 8;

                return (
                  <g
                    key={r.id}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const matchingState = ALL_INDIA_STATES[r.name.includes('Khavda') ? 'Gujarat' : r.name.includes('Bhadla') ? 'Rajasthan' : r.name.includes('Pavagada') ? 'Karnataka' : 'Tamil Nadu'];
                      if (matchingState) {
                        if (onStateClick) onStateClick(matchingState.displayName);
                        setActivePopupState(matchingState);
                      }
                    }}
                  >
                    <title>{`⚡ RE Mega-Park: ${r.name}\n• Type: ${r.type === 'solar' ? 'Solar Mega-Park' : r.type === 'wind' ? 'Wind Mega-Farm' : 'Solar-Wind Hybrid'}\n• Generation Capacity: ${(r.mw >= 1000 ? `${(r.mw/1000).toFixed(1)} GW` : `${r.mw} MW`)}\n\n👉 Click to view Green Power Corridor`}</title>
                    <circle cx={rx} cy={ry} r={ringR / transform.k} fill="#0ea5e9" opacity={0.16 + 0.1 * ringScale} />
                    <rect
                      x={rx - 7 / transform.k} y={ry - 7 / transform.k}
                      width={14 / transform.k} height={14 / transform.k}
                      rx={3 / transform.k}
                      transform={`rotate(45,${rx},${ry})`}
                      fill="#0ea5e9" opacity={0.9}
                      stroke="#ffffff" strokeWidth={1.2 / transform.k}
                    />
                    <text
                      x={rx} y={ry}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize={7 / transform.k}
                      fill="#fff" fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {r.type === 'solar' ? '☀' : r.type === 'wind' ? '💨' : '⚡'}
                    </text>
                  </g>
                );
              })}

              {/* Data Center Cluster Beacons */}
              {dcPoints.map(dc => {
                const [dx, dy] = dc.pt;
                const isOp = dc.status === 'Operational';
                const baseColor = isOp ? '#059669' : '#d97706';
                const isSelected = dc.state === selectedState;
                
                // Scale beacon radius dynamically with simulatedCapacityMW when selected
                const effectiveMW = isSelected ? simulatedCapacityMW : dc.mw;
                const coreR = (isSelected ? 9.5 : 7) / transform.k;
                
                const rings = PULSE_RINGS.map(i => {
                  const phase = (pulsePhase - i * 0.7) % (Math.PI * 2);
                  const progress = (Math.sin(phase) + 1) / 2;
                  const spread = isSelected ? (13 + progress * 24) : (9 + progress * 15);
                  return { r: spread / transform.k, opacity: (isSelected ? 0.42 : 0.3) - progress * 0.25 };
                });

                return (
                  <g
                    key={dc.id}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDCClick) onDCClick(dc);
                      if (onStateClick) onStateClick(dc.state);
                      const intel = getStateIntelligence(dc.state);
                      if (intel) setActivePopupState(intel);
                    }}
                  >
                    <title>{`🏢 ${dc.name} (${dc.state})\n• Status: ${dc.status} Data Center Hub\n• IT Power Capacity: ${effectiveMW} Megawatts (MW)\n• Subsea Cable Landing: ${dc.subsea ? 'Yes (International Subsea Landing)' : 'Inland Terrestrial'}\n\n👉 Click to Select & Run Green DC Simulation`}</title>
                    {/* Pulsing beacon rings */}
                    {rings.map((ring, i) => (
                      <circle key={i} cx={dx} cy={dy} r={ring.r}
                        fill={isSelected ? coolingGlowColor : baseColor} opacity={ring.opacity} />
                    ))}
                    {/* Center node */}
                    <circle cx={dx} cy={dy} r={coreR + 2 / transform.k}
                      fill={isSelected ? coolingGlowColor : baseColor} opacity={0.35} />
                    <circle cx={dx} cy={dy} r={coreR}
                      fill={isSelected ? coolingGlowColor : baseColor}
                      stroke="#ffffff"
                      strokeWidth={1.8 / transform.k}
                      filter="url(#landShadow)"
                    />
                    {/* Capacity label: Shows MW capacity (e.g. 50M, 155M) */}
                    <text x={dx} y={dy}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize={(isSelected ? 5.8 : 5.2) / transform.k}
                      fill="#fff" fontWeight="800"
                      fontFamily="monospace"
                      style={{ pointerEvents: 'none' }}
                    >
                      {effectiveMW > 99 ? `${Math.round(effectiveMW / 10) * 10}M` : `${effectiveMW}M`}
                    </text>

                    {/* Readable Hub Name Label below beacon */}
                    <text
                      x={dx}
                      y={dy + (coreR + 6 / transform.k)}
                      textAnchor="middle"
                      fontSize={6.2 / transform.k}
                      fill={isDark ? '#f8fafc' : '#0f172a'}
                      stroke={isDark ? '#0f172a' : '#ffffff'}
                      strokeWidth={2.2 / transform.k}
                      strokeLinejoin="round"
                      style={{ paintOrder: 'stroke fill', pointerEvents: 'none' }}
                      fontWeight="700"
                      fontFamily="sans-serif"
                    >
                      {dc.name.split(' ')[0]} ({effectiveMW}M)
                    </text>
                  </g>
                );
              })}

              {/* All-India 122+ Cities & Regional Siting Anchors */}
              {cityPoints.map(c => {
                const [cx, cy] = c.pt;
                const isMajor = c.major || showAllCities || transform.k > 1.35;
                return (
                  <g
                    key={c.id || c.name}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredCity(c)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onLocationSited) onLocationSited([c.lat, c.lng]);
                      if (onStateClick) onStateClick(c.state);
                    }}
                  >
                    <title>{`📍 ${c.name} (${c.state})\n• Tier: ${c.tier}\n• Free Cooling: ${c.freeCoolingHours.toLocaleString()} hrs/yr\n• Water Risk: ${c.waterRisk}\n• Tariff: ₹${c.tariff}/unit\n${c.highlight}\n\n👉 Click to Site Data Centre Here`}</title>
                    {/* Outer glow ring for major cities */}
                    {c.major && (
                      <circle
                        cx={cx} cy={cy}
                        r={4.8 / transform.k}
                        fill="#0284c7"
                        opacity={0.25}
                      />
                    )}
                    <circle
                      cx={cx} cy={cy}
                      r={(c.major ? 3.0 : 1.8) / transform.k}
                      fill={c.major ? '#0284c7' : '#0ea5e9'}
                      stroke="#ffffff"
                      strokeWidth={0.9 / transform.k}
                    />
                    {isMajor && (
                      <text
                        x={cx + 4.5 / transform.k} y={cy + 1.2 / transform.k}
                        fontSize={(c.major ? 7.2 : 5.8) / transform.k}
                        fill={isDark ? '#f8fafc' : '#0f172a'}
                        stroke={isDark ? '#0f172a' : '#ffffff'}
                        strokeWidth={2.5 / transform.k}
                        strokeLinejoin="round"
                        style={{ paintOrder: 'stroke fill', pointerEvents: 'none' }}
                        fontWeight={c.major ? '800' : '600'}
                        fontFamily="sans-serif"
                      >
                        {c.name.split(' (')[0]}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Custom Sited Marker */}
              {sitedPt && (
                <g style={{ pointerEvents: 'none' }}>
                  <circle cx={sitedPt[0]} cy={sitedPt[1]}
                    r={22 / transform.k} fill="#10b981" opacity={0.2} />
                  <circle cx={sitedPt[0]} cy={sitedPt[1]}
                    r={14 / transform.k} fill="#10b981" opacity={0.3} />
                  <circle cx={sitedPt[0]} cy={sitedPt[1]}
                    r={8 / transform.k}
                    fill="#047857" stroke="#ffffff"
                    strokeWidth={2 / transform.k} />
                  <text x={sitedPt[0]} y={sitedPt[1]}
                    textAnchor="middle" dominantBaseline="central"
                    fontSize={8 / transform.k} fill="#fff">📍</text>
                  <text x={sitedPt[0]} y={sitedPt[1] - 16 / transform.k}
                    textAnchor="middle"
                    fontSize={7.5 / transform.k}
                    fill="#047857" fontWeight="800">
                    Sited Node
                  </text>
                </g>
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* QUICK HOVER TELEMETRY TOOLTIP (Shows when hovering over any of the 122 cities) */}
      {hoveredCity && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-3.5 py-2 rounded-xl bg-slate-900/90 text-white backdrop-blur-md border border-sky-400/80 shadow-2xl text-xs flex items-center gap-3 animate-fadeIn">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          <div>
            <div className="font-extrabold text-sm text-sky-200">
              📍 {hoveredCity.name} <span className="text-slate-400 text-xs font-normal">({hoveredCity.state})</span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
              <span>Tier: <strong className="text-white">{hoveredCity.tier}</strong></span>
              <span>•</span>
              <span>Free Cooling: <strong className="text-emerald-400">{hoveredCity.freeCoolingHours?.toLocaleString()} hrs/yr</strong></span>
              <span>•</span>
              <span>Tariff: <strong className="text-amber-400">₹{hoveredCity.tariff}/kWh</strong></span>
              <span>•</span>
              <span>Water Risk: <strong className="text-teal-300">{hoveredCity.waterRisk}</strong></span>
              <span>•</span>
              <span className="text-sky-300 font-bold">👉 Click node to site</span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING MAP LEGEND & SYMBOL DENOTATION GUIDE CARD */}
      <div className="absolute bottom-3 right-3 z-20 max-w-[calc(100%-24px)] pointer-events-auto">
        {isLegendOpen ? (
          <div className="w-80 sm:w-96 max-h-[380px] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-3 text-xs select-none transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-none">
                    Map Guide & Symbols Key
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Live GIS Telemetry & Denotation Chart
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsLegendOpen(false)}
                title="Collapse Legend"
                className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Segmented Tab Controls: Symbols Table vs Active Layer Scale */}
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-2.5 font-bold text-[11px]">
              <button
                onClick={() => setLegendTab('symbols')}
                className={`py-1 rounded-lg transition cursor-pointer ${
                  legendTab === 'symbols'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🔍 Symbols Key (Chart)
              </button>
              <button
                onClick={() => setLegendTab('scale')}
                className={`py-1 rounded-lg transition cursor-pointer ${
                  legendTab === 'scale'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🎨 Color Scale ({metricLayer === 'suitability' ? 'Suitability' : metricLayer === 'reShare' ? 'RE Share' : metricLayer === 'waterStress' ? 'Water' : 'Carbon'})
              </button>
            </div>

            {/* TAB 1: SYMBOL DENOTATION TABLE */}
            {legendTab === 'symbols' && (
              <div className="space-y-1.5">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="text-[10px] font-mono text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left pb-1 font-bold">Symbol</th>
                      <th className="text-left pb-1 font-bold">Name</th>
                      <th className="text-left pb-1 font-bold">Denotation & Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    <tr>
                      <td className="py-1.5 pr-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-sm">
                          50M
                        </div>
                      </td>
                      <td className="py-1.5 pr-2 font-bold text-slate-800 dark:text-slate-200">
                        Operational DC Hub
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">
                        Active Hyperscale facility. <strong>M = Megawatts (MW) IT capacity</strong> (e.g. 155M = 155 MW).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-2">
                        <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-sm">
                          18M
                        </div>
                      </td>
                      <td className="py-1.5 pr-2 font-bold text-slate-800 dark:text-slate-200">
                        Planned / Pipeline DC
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">
                        Under construction or proposed campus with power capacity in MW.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-2">
                        <div className="w-5 h-5 bg-sky-500 text-white font-bold text-xs flex items-center justify-center rotate-45 rounded shadow-sm mx-auto">
                          <span className="-rotate-45">⚡</span>
                        </div>
                      </td>
                      <td className="py-1.5 pr-2 font-bold text-slate-800 dark:text-slate-200">
                        RE Mega-Park
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">
                        Solar (☀), Wind (💨), or Hybrid (⚡) parks (750 MW to 30 GW, e.g. Khavda, Bhadla).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-2 text-center">
                        <span className="font-mono text-emerald-500 font-black text-sm tracking-tighter">
                          ━ ━ ━
                        </span>
                      </td>
                      <td className="py-1.5 pr-2 font-bold text-slate-800 dark:text-slate-200">
                        Clean Power Corridor
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">
                        Green Energy Corridor high-voltage transmission direct to DC hub.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-2 text-center">
                        <span className="text-base">📍</span>
                      </td>
                      <td className="py-1.5 pr-2 font-bold text-slate-800 dark:text-slate-200">
                        Sited Target Node
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">
                        Active simulation candidate node with real-time PUE and cooling telemetry.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-2 text-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-600 border border-white mx-auto shadow-sm" />
                      </td>
                      <td className="py-1.5 pr-2 font-bold text-slate-800 dark:text-slate-200">
                        122+ Siting Cities
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">
                        Catalog cities with IMD free cooling hours, water risk & power tariffs.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: ACTIVE METRIC LAYER SCALE */}
            {legendTab === 'scale' && (
              <div className="space-y-2">
                {metricLayer === 'suitability' && (
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1.5">
                      🎯 Green DC Siting Suitability Index (0 – 100)
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-emerald-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">90 – 100:</span>
                        <span className="text-slate-600 dark:text-slate-300">Tier-1 Megahub (KA, TN, GJ, HP, UK)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-cyan-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">86 – 89:</span>
                        <span className="text-slate-600 dark:text-slate-300">Hydro & Clean Energy Leaders (MH, TS, AP, KL)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-blue-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">82 – 85:</span>
                        <span className="text-slate-600 dark:text-slate-300">Emerging Solar Corridors (RJ, MP, PB, HR)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-amber-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">78 – 81:</span>
                        <span className="text-slate-600 dark:text-slate-300">Industrial Transition Hubs (UP, WB, OD, CG)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-purple-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">&lt; 78:</span>
                        <span className="text-slate-600 dark:text-slate-300">Frontier Edge Regions (BR, NE States)</span>
                      </div>
                    </div>
                  </div>
                )}

                {metricLayer === 'reShare' && (
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1.5">
                      🌿 Renewable Energy Generation Share (%)
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-emerald-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">&gt; 70%:</span>
                        <span className="text-slate-600 dark:text-slate-300">Ultra High Renewable Penetration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-teal-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">50% – 70%:</span>
                        <span className="text-slate-600 dark:text-slate-300">Strong Clean Energy Grid Mix</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-amber-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">35% – 50%:</span>
                        <span className="text-slate-600 dark:text-slate-300">Moderate / Active Transition Mix</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-rose-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">&lt; 35%:</span>
                        <span className="text-slate-600 dark:text-slate-300">Thermal / Coal Dependent</span>
                      </div>
                    </div>
                  </div>
                )}

                {metricLayer === 'waterStress' && (
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1.5">
                      💧 Hydrological Water Risk (CGWB Assessment)
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-emerald-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Safe Basin:</span>
                        <span className="text-slate-600 dark:text-slate-300">Abundant water; low stress index</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-yellow-400 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Moderate:</span>
                        <span className="text-slate-600 dark:text-slate-300">Seasonal stress; dual-source recommended</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-orange-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">High Stress:</span>
                        <span className="text-slate-600 dark:text-slate-300">Depleted aquifer; STP recycled water required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-red-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Critical:</span>
                        <span className="text-slate-600 dark:text-slate-300">Overexploited; closed-loop dry/immersion cooling mandatory</span>
                      </div>
                    </div>
                  </div>
                )}

                {metricLayer === 'carbon' && (
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1.5">
                      💨 Grid Carbon Factor (CEA 2024 gCO2/kWh)
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-emerald-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">&lt; 300 g:</span>
                        <span className="text-slate-600 dark:text-slate-300">Hydro / Clean Power (Near Zero Carbon)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-blue-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">300 – 550 g:</span>
                        <span className="text-slate-600 dark:text-slate-300">High Clean Energy Share</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-amber-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">550 – 720 g:</span>
                        <span className="text-slate-600 dark:text-slate-300">National Grid Baseline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded bg-rose-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">&gt; 720 g:</span>
                        <span className="text-slate-600 dark:text-slate-300">Thermal Coal Intensive</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Scale Indicator */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-8 h-1 bg-slate-400 rounded-full inline-block" /> ~500 km Scale
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                💡 Click any State or City to Site DC
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsLegendOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-emerald-700 hover:border-emerald-300 transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Map Symbols & Legend Guide</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {/* ZOOM & RE-CENTER CONTROLS (Right Side) */}
      <div className="absolute top-20 right-3.5 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setTransform(t => ({ ...t, k: Math.min(6, t.k * 1.3) }))}
          title="Zoom In"
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-white shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-700 transition font-bold text-sm cursor-pointer"
        >
          +
        </button>
        <button
          onClick={() => setTransform(t => ({ ...t, k: Math.max(0.6, t.k / 1.3) }))}
          title="Zoom Out"
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-white shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-700 transition font-bold text-sm cursor-pointer"
        >
          −
        </button>
        <button
          onClick={() => { setTransform({ x: 0, y: 0, k: 1 }); setPitchAngle(0); setYawAngle(0); }}
          title="Reset View and Camera Angle"
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-white shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-700 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* POPPING HIGH-ANIMATED STATE INTELLIGENCE TERMINAL */}
      {activePopupState && (
        <div
          className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-[410px] max-h-[82%] overflow-y-auto z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/20 p-4 transition-all duration-300 animate-in fade-in zoom-in-95"
          style={{
            animationDuration: '300ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                  {activePopupState.code}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                  {activePopupState.tier}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Telemetry
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 leading-tight flex items-center gap-2">
                {activePopupState.displayName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {activePopupState.tagline}
              </p>
            </div>
            <button
              onClick={() => setActivePopupState(null)}
              className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Green DC Suitability Score Ring */}
          <div className="my-3 p-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Green DC Suitability Index
              </span>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {activePopupState.greenSuitabilityScore >= 90
                  ? '🌟 Exceptional Clean Siting Grade (A+)'
                  : activePopupState.greenSuitabilityScore >= 80
                  ? '✅ Strong Clean Energy & Infrastructure (A)'
                  : '⚡ Viable Industrial Siting Region (B+)'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Based on RE mix, water availability, grid carbon & cooling
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray={`${activePopupState.greenSuitabilityScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-xs font-black text-slate-900 dark:text-white">
                {activePopupState.greenSuitabilityScore}
              </div>
            </div>
          </div>

          {/* Tab Selector: Metrics | Policy | Connectivity */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs mb-3">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex-1 py-1 rounded-lg font-bold text-center transition cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📊 Core Metrics
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`flex-1 py-1 rounded-lg font-bold text-center transition cursor-pointer ${
                activeTab === 'policy'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ⚖️ Policy Subsidies
            </button>
            <button
              onClick={() => setActiveTab('connectivity')}
              className={`flex-1 py-1 rounded-lg font-bold text-center transition cursor-pointer ${
                activeTab === 'connectivity'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🌐 Fiber & Subsea
            </button>
          </div>

          {/* TAB 1: 6 KEY CALCULATED METRICS */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> DC Capacity
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {activePopupState.knownCapacityMW} MW
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {activePopupState.operationalMW} MW op • {activePopupState.pipelineMW} MW planned
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Sun className="w-3 h-3 text-emerald-500" /> Clean RE Share
                </span>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {activePopupState.reSharePercent}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {activePopupState.installedRECapacityMW.toLocaleString()} MW clean grid
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Wind className="w-3 h-3 text-indigo-500" /> Grid Carbon Factor
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {activePopupState.gridCarbonFactor} <span className="text-[10px] font-normal text-slate-500">gCO2/kWh</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {activePopupState.gridCarbonFactor < 710 ? '🌿 Below national avg' : '⚠️ Carbon-intensive'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-500" /> Free Cooling
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {activePopupState.freeCoolingHours.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">hrs/yr</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Est. PUE: <strong className="text-emerald-600">{activePopupState.pueEstimate}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-500" /> Water Risk Level
                </span>
                <div className={`text-sm font-black mt-0.5 ${
                  activePopupState.waterStress === 'Critical' ? 'text-red-600' :
                  activePopupState.waterStress === 'High' ? 'text-orange-600' :
                  activePopupState.waterStress === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {activePopupState.waterStress}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  CGWB Assessment Index
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" /> Power Tariff
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  ₹{activePopupState.tariffCommercial} <span className="text-[10px] font-normal text-slate-500">/unit</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Commercial Grid Base Rate
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POLICY INCENTIVES */}
          {activeTab === 'policy' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> State Data Centre & Clean Energy Policy:
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {activePopupState.incentives}
              </p>
              <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Open Access Banking: Allowed</span>
                <span className="text-emerald-600 font-bold">100% Stamp Duty Waiver Eligible</span>
              </div>
            </div>
          )}

          {/* TAB 3: CONNECTIVITY & SUBSEA */}
          {activeTab === 'connectivity' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" /> Maritime & Terrestrial Backhaul Infrastructure:
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {activePopupState.subseaConnectivity}
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {activePopupState.dcClusters?.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-[10px] font-mono border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                    🏢 {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA: Simulate Facility in this State */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                if (onStateClick) onStateClick(activePopupState.displayName);
                handleFocusSelectedState(activePopupState.displayName);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>🚀 Simulate 50 MW Facility in {activePopupState.displayName}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map Attribution Footer */}
      <div className="absolute bottom-1 left-2 z-10 text-[9px] text-slate-500 font-mono">
        GreenDC India · Full Border-to-Border GIS Map · Free Custom Angle Controls · No API Key Required
      </div>
    </div>
  );
}
