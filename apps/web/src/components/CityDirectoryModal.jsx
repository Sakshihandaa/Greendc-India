import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Zap,
  Filter,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ALL_INDIA_CITIES, searchCities } from '../data/allIndiaCitiesData';

export default function CityDirectoryModal({
  isOpen,
  onClose,
  onSiteCityOnMap,
  onSimulateCity
}) {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState('cooling'); // 'cooling' | 'temp' | 'name'

  // Escape key listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const states = ['All', ...new Set(ALL_INDIA_CITIES.map(c => c.state))].sort();
  const tiers = ['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Emerging DC Hub'];

  let filtered = searchCities(search, selectedState, selectedTier);

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'cooling') return b.freeCoolingHours - a.freeCoolingHours;
    if (sortBy === 'temp') return a.ambientAvgTemp - b.ambientAvgTemp;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                120+ Pan-India Siting Directory
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {filtered.length} Cities Matching
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-heading">
              All-India Siting & Cities Catalog
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore thermodynamic free cooling hours, hydrological water risk, and grid tariffs across Indian cities.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-3 sm:px-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, state or highlight..."
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-52 font-medium"
              />
            </div>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {states.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All States (35)' : s}</option>
              ))}
            </select>

            {/* Tier Filter */}
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {tiers.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Tiers' : t}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="cooling">Sort: Highest Free Cooling</option>
              <option value="temp">Sort: Coldest Avg Temp</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>

          {(search || selectedState !== 'All' || selectedTier !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedState('All');
                setSelectedTier('All');
              }}
              className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Cities Grid List */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((city) => (
              <div
                key={city.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {city.tier}
                      </span>
                      {city.subseaLanding && (
                        <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                          🌊 Subsea Cable Landing
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                      {city.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {city.state} • Coordinates: {city.lat.toFixed(2)}°N, {city.lng.toFixed(2)}°E
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Power Tariff</span>
                    <span className="font-black text-slate-900 dark:text-white font-mono text-sm">
                      ₹{city.tariff} <span className="text-[10px] font-normal text-slate-500">/unit</span>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {city.highlight}
                </p>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block font-mono">Free Cooling</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-mono">
                      {city.freeCoolingHours.toLocaleString()} hrs/yr
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block font-mono">Avg Ambient</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">
                      {city.ambientAvgTemp}°C
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block font-mono">Water Risk</span>
                    <strong className={`font-mono ${
                      city.waterRisk === 'Low' ? 'text-emerald-600' :
                      city.waterRisk === 'Moderate' ? 'text-amber-600' : 'text-red-500'
                    }`}>
                      {city.waterRisk}
                    </strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onSiteCityOnMap) onSiteCityOnMap(city);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Site on Map
                  </button>
                  <button
                    onClick={() => {
                      if (onSimulateCity) onSimulateCity(city);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Simulate
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No Indian cities found matching your filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
