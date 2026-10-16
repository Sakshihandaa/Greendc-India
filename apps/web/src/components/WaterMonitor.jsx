import React, { useState } from 'react';
import {
  Droplets,
  AlertTriangle,
  ShieldCheck,
  Waves,
  Info,
  Thermometer,
  Wind,
  Gauge,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sun
} from 'lucide-react';

const REGIONAL_WATER_HUBS = [
  {
    hub: 'Chennai (Siruseri / Ambattur)',
    state: 'Tamil Nadu',
    stressLevel: 'Extremely High',
    stressColor: 'text-rose-700 bg-rose-50 border-rose-200',
    riskSummary: 'Day-Zero vulnerability during dry years; state mandates tertiary treated reverse-osmosis (TTRO) or seawater desalination.',
    waterSource: 'Veeranam pipeline, Minjur/Nemmeli desalination plants',
    wueRecommendation: '< 0.3 L/kWh (Mandatory closed-loop)'
  },
  {
    hub: 'Bengaluru (Electronics City / Whitefield)',
    state: 'Karnataka',
    stressLevel: 'Critical',
    stressColor: 'text-amber-800 bg-amber-50 border-amber-200',
    riskSummary: 'Severe groundwater over-exploitation (800+ ft deep borewells dry); Cauvery Stage V allocation restricted.',
    waterSource: 'Cauvery River piped supply, private tanker supply',
    wueRecommendation: '< 0.2 L/kWh (Zero municipal groundwater draw)'
  },
  {
    hub: 'Noida / Greater Noida (Knowledge Park V)',
    state: 'Uttar Pradesh',
    stressLevel: 'Critical',
    stressColor: 'text-amber-800 bg-amber-50 border-amber-200',
    riskSummary: 'Over-extracted aquifer in western Yamuna sub-basin; UP Ground Water Department mandates rainwater recharge.',
    waterSource: 'Ganga canal pipeline, deep tubewells',
    wueRecommendation: '< 0.5 L/kWh (Dual dry cooler hybrid)'
  },
  {
    hub: 'Navi Mumbai (Panvel / Mahape / Rabale)',
    state: 'Maharashtra',
    stressLevel: 'Moderate to High',
    stressColor: 'text-teal-800 bg-teal-50 border-teal-200',
    riskSummary: 'Abundant coastal monsoon rainfall, but summer municipal water rationing by MIDC/NMMC during April–June.',
    waterSource: 'Barvi Dam, Morbe Dam (MIDC network)',
    wueRecommendation: '< 0.8 L/kWh'
  },
  {
    hub: 'Hyderabad (HITEC City / Madhapur)',
    state: 'Telangana',
    stressLevel: 'Medium-High',
    stressColor: 'text-cyan-800 bg-cyan-50 border-cyan-200',
    riskSummary: 'Hard rock Deccan plateau with minimal aquifer recharge; dependent on Godavari & Krishna lift canals.',
    waterSource: 'Krishna & Godavari drinking water supply',
    wueRecommendation: '< 0.5 L/kWh'
  }
];

const COOLING_TECHS = [
  {
    tech: 'Direct-to-Chip Liquid Cooling',
    indicativeWUE: '0.1 – 0.4 L/kWh',
    waterDemand: 'Very Low',
    pueImpact: '1.15 – 1.25',
    tradeoffs: 'Higher initial CapEx; coolant distribution units (CDUs); optimal for dense AI GPU clusters (30–100 kW/rack).'
  },
  {
    tech: 'Closed-Loop Dry Coolers with Economizers',
    indicativeWUE: '0.0 – 0.2 L/kWh',
    waterDemand: 'Negligible (Zero Water)',
    pueImpact: '1.40 – 1.60',
    tradeoffs: 'Eliminates water consumption completely; higher electricity consumption during hot Indian summer months (>42°C).'
  },
  {
    tech: 'Evaporative Wet Cooling Towers',
    indicativeWUE: '1.5 – 3.0 L/kWh',
    waterDemand: 'High (Continuous Make-up)',
    pueImpact: '1.25 – 1.35',
    tradeoffs: 'Lower electrical PUE, but consumes millions of litres daily. Highly vulnerable to municipal water cuts in Chennai, Noida, and Bengaluru.'
  },
  {
    tech: 'Two-Phase Immersion Cooling',
    indicativeWUE: '0.0 L/kWh (Zero Water)',
    pueImpact: '1.05 – 1.15',
    tradeoffs: 'Emerging technology; dielectric fluids require strict handling and maintenance protocols; higher equipment cost.'
  }
];

export default function WaterMonitor() {
  // Wet-bulb simulation sliders
  const [ambientTemp, setAmbientTemp] = useState(42);
  const [humidity, setHumidity] = useState(40);

  // Simplified Stull formula approximation for Wet-Bulb Temperature (°C)
  const T = ambientTemp;
  const RH = humidity;
  const wetBulb = Math.round(
    (T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035) * 10
  ) / 10;

  // Wet bulb risk classification
  let wetBulbRisk = 'Normal Economizer Range';
  let wetBulbColor = 'text-emerald-800 bg-emerald-100 border-emerald-300';
  if (wetBulb > 30) {
    wetBulbRisk = 'Extreme Chiller Thermal Stress (Evaporation Surge)';
    wetBulbColor = 'text-rose-800 bg-rose-100 border-rose-300';
  } else if (wetBulb > 26) {
    wetBulbRisk = 'High Humidity / Reduced Economizer Efficacy';
    wetBulbColor = 'text-amber-800 bg-amber-100 border-amber-300';
  }

  // Circular Water Harvesting Sandbox
  const [campusAcres, setCampusAcres] = useState(15);
  const [rainfallMM, setRainfallMM] = useState(1100);
  const potentialHarvestedML = Math.round(
    (campusAcres * 4046.86 * rainfallMM * 0.85) / 1000000 * 10
  ) / 10;

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* Hero / Context Banner (Clean White & Cyan/Green) */}
      <div className="bg-gradient-to-br from-cyan-50/80 via-white to-emerald-50/60 border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-900 text-xs font-bold">
            <Droplets className="w-3.5 h-3.5 text-cyan-700" />
            Hydrological Siting & Cooling Governance
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Water Usage Effectiveness (<span className="text-cyan-700">WUE</span>) in India
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            While electrical power dominates regulatory scrutiny, cooling water consumption represents an emerging environmental crisis in water-stressed urban corridors like Noida, Chennai, and Bengaluru.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 max-w-xs shrink-0 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-mono">
            GreenDC Missing-Data Rule
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            If an operator does not publish WUE, GreenDC strictly reports water consumption as <span className="text-cyan-800 font-bold">Unavailable</span>. We never convert missing disclosures into zero water use.
          </p>
        </div>
      </div>

      {/* Regional Water Vulnerability Radar */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-600" />
            Water Stress Profiles of Major Indian Data Centre Corridors
          </h3>
          <p className="text-xs text-slate-500">
            Synthesized from NITI Aayog Composite Water Management Index (CWMI) and Central Ground Water Board (CGWB) records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REGIONAL_WATER_HUBS.map((hub) => (
            <div
              key={hub.hub}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:shadow-md flex flex-col justify-between space-y-3 transition shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500">{hub.state}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hub.stressColor}`}>
                    {hub.stressLevel}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">{hub.hub}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{hub.riskSummary}</p>
              </div>

              <div className="border-t border-slate-100 pt-2.5 text-[11px] text-slate-600 space-y-1">
                <div><strong className="text-slate-800">Primary Supply:</strong> {hub.waterSource}</div>
                <div className="text-cyan-800"><strong className="text-cyan-900">Target Policy:</strong> {hub.wueRecommendation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Wet-Bulb Heatwave Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl border border-cyan-200 bg-white shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold">
              <Thermometer className="w-3.5 h-3.5 text-cyan-700" /> Thermodynamic Stress Model
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight font-heading mt-1">
              Indian Pre-Monsoon Wet-Bulb Temperature Simulator
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When ambient temperatures spike above 42°C during Indian summer heatwaves, evaporative cooling towers experience extreme evaporation rates, while high humidity during monsoon reduces chiller efficiency.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center shrink-0 min-w-[220px]">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block font-mono">Estimated Wet-Bulb</span>
            <div className="text-4xl font-black text-cyan-700 font-mono my-1">
              {wetBulb}°C
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${wetBulbColor}`}>
              {wetBulbRisk}
            </span>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-600" /> Ambient Dry-Bulb Temperature
              </span>
              <span className="font-mono font-extrabold text-amber-700 text-sm">{ambientTemp}°C</span>
            </div>
            <input
              type="range"
              min="25"
              max="48"
              step="1"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>25°C (Winter)</span>
              <span>38°C (Normal)</span>
              <span>48°C (Peak Northern Heatwave)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-600" /> Relative Humidity (RH)
              </span>
              <span className="font-mono font-extrabold text-cyan-700 text-sm">{humidity}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              step="5"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-cyan-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>15% (Dry Desert)</span>
              <span>50% (Equinox)</span>
              <span>95% (Monsoon Saturated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cooling Technologies Comparison */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-600" />
            Cooling Technologies: Water vs Electrical Trade-off Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Compare water usage effectiveness against PUE efficiency and equipment cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COOLING_TECHS.map((tech) => (
            <div
              key={tech.tech}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-bold text-slate-900">{tech.tech}</h4>
                <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-lg">
                  WUE: {tech.indicativeWUE}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">Water Consumption</span>
                  <span className="font-bold text-slate-800">{tech.waterDemand}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">PUE Impact</span>
                  <span className="font-bold text-emerald-700 font-mono">{tech.pueImpact}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {tech.tradeoffs}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Rainwater Harvesting & Circular Water Calculator */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              On-Campus Circular Water & Rainwater Harvesting Potential
            </h4>
            <p className="text-xs text-slate-500">
              Calculate potential annual water captured through rooftop and campus catchment retention.
            </p>
          </div>
          <div className="bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs">
            <span className="text-slate-600 font-medium">Harvesting Potential: </span>
            <span className="font-mono font-bold text-emerald-800">{potentialHarvestedML} ML/year</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-bold">Campus Land Area: {campusAcres} Acres</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={campusAcres}
              onChange={(e) => setCampusAcres(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-bold">Annual Rainfall: {rainfallMM} mm</label>
            <input
              type="range"
              min="400"
              max="2400"
              step="50"
              value={rainfallMM}
              onChange={(e) => setRainfallMM(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
