import React from 'react';
import { Droplets, AlertTriangle, ShieldCheck, Waves, Info, Thermometer, Wind } from 'lucide-react';

const COOLING_TECHS = [
  {
    tech: 'Direct-to-Chip Liquid Cooling',
    indicativeWUE: '0.1 – 0.4 L/kWh',
    waterDemand: 'Very Low',
    pueImpact: '1.15 – 1.25',
    tradeoffs: 'High initial CapEx; coolant distribution units (CDUs); optimal for dense AI clusters (30–100 kW/rack).'
  },
  {
    tech: 'Closed-Loop Air Chillers with Economizers',
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
    tradeoffs: 'Lower electrical PUE, but consumes millions of litres daily. Vulnerable to municipal water cuts in Chennai, Noida, and Bengaluru.'
  },
  {
    tech: 'Two-Phase Immersion Cooling',
    indicativeWUE: '0.0 L/kWh (Zero Water)',
    pueImpact: '1.05 – 1.15',
    tradeoffs: 'Emerging technology; dielectric fluids require strict handling and maintenance protocols; high equipment cost.'
  }
];

export default function WaterMonitor() {
  return (
    <div className="space-y-8">
      {/* Hero / Context Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5" />
            Hydrological Impact & Cooling Governance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Water Usage Effectiveness (<span className="text-cyan-400">WUE</span>) in Indian Data Centres
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            While power consumption receives heavy regulatory scrutiny, cooling water consumption represents an emerging sustainability flashpoint in water-stressed urban corridors like Noida, Chennai, and Bengaluru.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-xs shrink-0 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            GreenDC Missing-Data Rule
          </span>
          <p className="text-xs text-slate-300">
            If an operator does not publish WUE, GreenDC reports water consumption as <span className="text-cyan-400 font-bold">Unavailable</span>. We never convert missing disclosures into zero water use.
          </p>
        </div>
      </div>

      {/* The WUE Metric Explained */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            Standard WUE Definition (The Green Grid)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Water Usage Effectiveness measures the volume of water consumed for cooling and humidification per unit of electricity delivered to computing hardware:
          </p>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center font-mono text-xs text-cyan-300">
            WUE (L/kWh) = Annual Water Consumption (Litres) ÷ Annual IT Energy (kWh)
          </div>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span><strong>IT-Energy Basis:</strong> Standard used throughout GreenDC India calculations.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              <span><strong>Total-Facility Basis:</strong> Used by some European audits (always clarify baseline).</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            Indian Climatic & Wet-Bulb Considerations
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Water consumption is not static throughout the year. During Indian pre-monsoon heatwaves (April–June) when ambient dry-bulb temperatures surpass 42°C, evaporative cooling demand spikes dramatically:
          </p>
          <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl text-xs text-amber-200 space-y-1">
            <p className="font-semibold text-amber-300">Monsoon & Humidity Trade-off:</p>
            <p className="text-amber-200/90 leading-relaxed">
              High wet-bulb temperatures during monsoon months reduce evaporative cooling efficiency, forcing chillers to draw substantially more electrical power to prevent thermal throttling.
            </p>
          </div>
        </div>
      </div>

      {/* Cooling Technology Comparison Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Cooling Architecture Trade-Offs in India
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparative analysis of common data centre thermal management systems.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Cooling Architecture</th>
                <th className="py-2.5 px-3 font-semibold">Indicative WUE</th>
                <th className="py-2.5 px-3 font-semibold">Water Demand</th>
                <th className="py-2.5 px-3 font-semibold">Design PUE</th>
                <th className="py-2.5 px-3 font-semibold">Key Trade-offs in Indian Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {COOLING_TECHS.map((tech) => (
                <tr key={tech.tech} className="hover:bg-slate-950/40 transition">
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{tech.tech}</td>
                  <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{tech.indicativeWUE}</td>
                  <td className="py-3 px-3 text-slate-300">{tech.waterDemand}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">{tech.pueImpact}</td>
                  <td className="py-3 px-3 text-slate-400 leading-relaxed min-w-[280px]">{tech.tradeoffs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
