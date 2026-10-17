import React, { useState } from 'react';
import {
  Server,
  Search,
  Filter,
  MapPin,
  Zap,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Info,
  BookOpen
} from 'lucide-react';
import { FACILITIES } from '../data/facilitiesData';
import CampusDetailsModal from './CampusDetailsModal';

export default function Catalog({ onSelectFacilityForSimulator, onSelectFacilityForMap }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [inspectingCampus, setInspectingCampus] = useState(null);

  const states = ['All', ...new Set(FACILITIES.map(f => f.state))];

  const filtered = FACILITIES.filter(fac => {
    const matchesSearch =
      fac.name.toLowerCase().includes(search.toLowerCase()) ||
      fac.operator.toLowerCase().includes(search.toLowerCase()) ||
      fac.city.toLowerCase().includes(search.toLowerCase()) ||
      fac.state.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || fac.status === statusFilter;
    const matchesState = stateFilter === 'All' || fac.state === stateFilter;
    const matchesType = typeFilter === 'All' || fac.facilityType === typeFilter;

    return matchesSearch && matchesStatus && matchesState && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800 dark:text-slate-200">
      {/* Page Header (Clean White / Dark Eco-Tech) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-bold">
            <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Curated National Repository
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-heading mt-0.5">
            Verified Indian Data Centre Campuses
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Curated directory of major hyperscale and enterprise facilities across India with verified phase capacities & plain-English real-world scenarios.
          </p>
        </div>

        <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-xl self-start sm:self-auto shadow-sm">
          {filtered.length} of {FACILITIES.length} Campuses
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campus or operator..."
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-800 w-56 font-medium"
            />
          </div>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {states.map(st => (
              <option key={st} value={st}>{st === 'All' ? 'All States' : st}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Under Construction">Under Construction</option>
            <option value="Planned">Planned</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Hyperscale">Hyperscale</option>
            <option value="Colocation">Colocation</option>
            <option value="Edge">Edge</option>
          </select>
        </div>

        {(search || statusFilter !== 'All' || stateFilter !== 'All' || typeFilter !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setStateFilter('All');
              setTypeFilter('All');
            }}
            className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fac) => {
          const isOp = fac.status === 'Operational';
          const isUc = fac.status === 'Under Construction';

          return (
            <div
              key={fac.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:shadow-md transition group text-xs relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 uppercase font-bold">
                    {fac.operator}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isOp
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : isUc
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {fac.status}
                  </span>
                </div>

                <h4
                  onClick={() => setInspectingCampus(fac)}
                  className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition font-heading cursor-pointer flex items-center justify-between"
                  title="Click to view detailed real-world scenario and engineering dossier"
                >
                  <span>{fac.name}</span>
                  <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition shrink-0 ml-1" />
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  📍 {fac.city}, {fac.state}
                </p>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {fac.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-bold">IT Load</span>
                    <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                      {fac.reportedCapacityMW ? `${fac.reportedCapacityMW} MW` : 'Undisclosed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-bold">Racks</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 font-mono">
                      {fac.reportedRacks ? fac.reportedRacks.toLocaleString() : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-bold">Type</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 font-mono">{fac.facilityType}</span>
                  </div>
                </div>

                {/* Plain-English Dossier Button */}
                <button
                  onClick={() => setInspectingCampus(fac)}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                  title="View complete real-world scenario, who uses it, power backup, and cooling systems"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Real Scenario & Use Case Dossier</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectFacilityForSimulator(fac)}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition shadow-sm shadow-emerald-600/20 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    Simulate Load
                  </button>
                  <button
                    onClick={() => onSelectFacilityForMap(fac)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700 shadow-sm transition cursor-pointer"
                    title="View on Map"
                  >
                    <Compass className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs shadow-sm">
          No data centre campuses found matching your search filters.
        </div>
      )}

      {/* Plain English Real-World Scenario & Use Case Intelligence Modal */}
      <CampusDetailsModal
        facility={inspectingCampus}
        isOpen={Boolean(inspectingCampus)}
        onClose={() => setInspectingCampus(null)}
        onSimulateInEngine={(fac) => {
          onSelectFacilityForSimulator(fac);
        }}
      />
    </div>
  );
}
