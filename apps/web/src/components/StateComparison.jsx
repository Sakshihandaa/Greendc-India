import React, { useState } from 'react';
import {
  Scale,
  Building2,
  Zap,
  Droplets,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { STATE_SUMMARIES, FACILITIES } from '../data/facilitiesData';

const STATE_POLICIES = {
  Maharashtra: {
    incentives: 'Maharashtra Data Centre Policy 2023: 100% stamp duty exemption, electricity duty waiver for 10-15 years, Green power open access waiver.',
    subseaConnectivity: 'Primary national gateway: 15+ subsea cable landings (SMC, AAE-1, BBG, SeaMeWe-5, 2Africa) at Mumbai MMR.'
  },
  Karnataka: {
    incentives: 'Karnataka Data Centre Policy 2022: Up to 100% stamp duty exemption, power tariff subsidy, 100% clean power banking permission.',
    subseaConnectivity: 'High-speed terrestrial backhaul to Mumbai and Chennai landing stations; local dark-fiber rings in Bengaluru.'
  },
  'Uttar Pradesh': {
    incentives: 'UP Data Center Policy 2021: 100% stamp duty exemption, 4x FAR permissible, dual grid-feeder line cost subsidy.',
    subseaConnectivity: 'Inland northern hub; dedicated dark fiber routes connecting to Mumbai and Kolkata cable gateways.'
  },
  'Tamil Nadu': {
    incentives: 'Tamil Nadu DC Policy 2021: Dual power source guarantee, green building incentives, electricity tax concessions.',
    subseaConnectivity: 'Eastern maritime gateway: 5+ subsea cable landings (Bay of Bengal Gateway, SeaMeWe-4, Chennai-Andaman).'
  },
  Telangana: {
    incentives: 'Telangana Data Center Policy: Industrial water allocation priority, 100% power reliability guarantee, single-window TS-iPASS.',
    subseaConnectivity: 'Central subcontinent node with multiple redundant optical paths to Mumbai and Chennai coastal gateways.'
  },
  Gujarat: {
    incentives: 'Gujarat IT/ITeS Policy: Power subsidy of ₹1/unit for 5 years, mega project capital subsidies in GIFT City / Dholera.',
    subseaConnectivity: 'Direct subsea connectivity planned at GIFT City / Maroli; direct high-voltage HVDC grid lines to Khavda 30 GW.'
  },
  'West Bengal': {
    incentives: 'West Bengal DC Policy: Priority industrial land allotment in Bengal Silicon Valley (New Town, Kolkata).',
    subseaConnectivity: 'Eastern hub with direct Bay of Bengal subsea cables connecting to Singapore and Southeast Asia.'
  }
};

export default function StateComparison({ onNavigateToSimulator, onSelectStateForMap }) {
  const availableStates = Object.keys(STATE_SUMMARIES);
  const [stateA, setStateA] = useState('Maharashtra');
  const [stateB, setStateB] = useState('Karnataka');

  const summaryA = STATE_SUMMARIES[stateA];
  const summaryB = STATE_SUMMARIES[stateB];

  const policyA = STATE_POLICIES[stateA] || {};
  const policyB = STATE_POLICIES[stateB] || {};

  const facilitiesA = FACILITIES.filter(f => f.state === stateA);
  const facilitiesB = FACILITIES.filter(f => f.state === stateB);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* Header Banner (Clean White & Emerald) */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            Infrastructure Siting & Policy Benchmark
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Inter-State Data Centre Sustainability Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Evaluate location trade-offs across power reliability, CEA renewable penetration proxies, municipal water vulnerability, and state-specific policy incentives to make informed site-selection decisions.
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State A Selector */}
        <div className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block font-mono">
              Benchmark State 1
            </span>
            <select
              value={stateA}
              onChange={(e) => setStateA(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 font-extrabold text-base rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {availableStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-bold block">Documented Load</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{summaryA?.knownCapacityMW || 0} MW</span>
          </div>
        </div>

        {/* State B Selector */}
        <div className="bg-white border border-cyan-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block font-mono">
              Benchmark State 2
            </span>
            <select
              value={stateB}
              onChange={(e) => setStateB(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 font-extrabold text-base rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {availableStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-bold block">Documented Load</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{summaryB?.knownCapacityMW || 0} MW</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid Table (Clean White) */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-slate-50 p-4 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
          <div className="col-span-4">Evaluation Dimension</div>
          <div className="col-span-4 text-emerald-700 font-extrabold">{stateA}</div>
          <div className="col-span-4 text-cyan-700 font-extrabold">{stateB}</div>
        </div>

        <div className="divide-y divide-slate-100 text-xs text-slate-700">
          {/* Curated Facilities */}
          <div className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/70 transition">
            <div className="col-span-4 font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Curated Campuses
            </div>
            <div className="col-span-4 font-mono font-bold text-emerald-700">
              {summaryA?.facilityCount || 0} campuses ({summaryA?.statusBreakdown?.Operational || 0} Operational)
            </div>
            <div className="col-span-4 font-mono font-bold text-cyan-700">
              {summaryB?.facilityCount || 0} campuses ({summaryB?.statusBreakdown?.Operational || 0} Operational)
            </div>
          </div>

          {/* Renewable Energy Share */}
          <div className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/70 transition">
            <div className="col-span-4 font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Clean Energy Capacity Share
            </div>
            <div className="col-span-4">
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                {summaryA?.gridContext?.reShareProxy || 'N/A'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">{summaryA?.gridContext?.installedRECapacityMW}</p>
            </div>
            <div className="col-span-4">
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                {summaryB?.gridContext?.reShareProxy || 'N/A'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">{summaryB?.gridContext?.installedRECapacityMW}</p>
            </div>
          </div>

          {/* Water Stress & Hydrology */}
          <div className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/70 transition">
            <div className="col-span-4 font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-600" /> Water Stress Profile (NITI Aayog / CGWB)
            </div>
            <div className="col-span-4">
              <p className="text-slate-600 leading-relaxed">{summaryA?.gridContext?.waterStress}</p>
            </div>
            <div className="col-span-4">
              <p className="text-slate-600 leading-relaxed">{summaryB?.gridContext?.waterStress}</p>
            </div>
          </div>

          {/* Subsea Cable / Connectivity */}
          <div className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/70 transition">
            <div className="col-span-4 font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Subsea Cable Landing & Gateway
            </div>
            <div className="col-span-4">
              <p className="text-slate-600">{policyA.subseaConnectivity || 'Inland terrestrial fiber interconnect'}</p>
            </div>
            <div className="col-span-4">
              <p className="text-slate-600">{policyB.subseaConnectivity || 'Inland terrestrial fiber interconnect'}</p>
            </div>
          </div>

          {/* Policy Incentives */}
          <div className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/70 transition">
            <div className="col-span-4 font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> State Data Centre Policy
            </div>
            <div className="col-span-4">
              <p className="text-slate-600 leading-relaxed">{policyA.incentives || 'General state industrial policy'}</p>
            </div>
            <div className="col-span-4">
              <p className="text-slate-600 leading-relaxed">{policyB.incentives || 'General state industrial policy'}</p>
            </div>
          </div>

          {/* Key Clusters */}
          <div className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/70 transition">
            <div className="col-span-4 font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" /> Major Industrial Clusters
            </div>
            <div className="col-span-4">
              <div className="flex flex-wrap gap-1.5">
                {facilitiesA.map(f => (
                  <span key={f.id} className="text-[10px] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 text-emerald-800 font-semibold">
                    {f.name} ({f.city})
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-wrap gap-1.5">
                {facilitiesB.map(f => (
                  <span key={f.id} className="text-[10px] bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-200 text-cyan-800 font-semibold">
                    {f.name} ({f.city})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
