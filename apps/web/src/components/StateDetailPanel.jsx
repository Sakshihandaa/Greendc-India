import React from 'react';
import { X, ExternalLink, Zap, Droplets, Building2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { getStateDetails } from '../data/facilitiesData';

export default function StateDetailPanel({ stateName, onClose }) {
  if (!stateName) return null;

  const details = getStateDetails(stateName);
  const isComplete = details.dataCoverage === 'verified_partial';

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-full max-h-[750px] overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">{stateName}</h3>
            {details.hasRecords ? (
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Verified Partial
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Dataset Incomplete
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic Level: State / Union Territory of India
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto space-y-5 pr-1 py-4 flex-1">
        {/* Dataset notice banner */}
        {!details.hasRecords && (
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">No Verified Records in Catalog</p>
              <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                GreenDC does not assume zero facilities exist in this state. Rather, no comparable public enterprise announcements or regulatory filings have been verified in our curated dataset.
              </p>
            </div>
          </div>
        )}

        {/* State Summary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Curated Facilities
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-white">
                {details.facilityCount}
              </span>
              <span className="text-[10px] text-slate-400">counted</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Major hyperscale & colocation campuses verified from company disclosures.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-400" /> Documented IT Power
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-white">
                {details.knownCapacityMW !== null ? `${details.knownCapacityMW}` : '—'}
              </span>
              {details.knownCapacityMW !== null ? (
                <span className="text-xs text-slate-400">MW</span>
              ) : (
                <span className="text-[10px] text-slate-500">Not reported</span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Sum of explicitly published IT load across verified phases.
            </p>
          </div>
        </div>

        {/* Facility Status Breakdown */}
        {details.hasRecords && (
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/70">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Status Breakdown
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-lg">
                <span className="text-[10px] text-emerald-400 font-medium block">Operational</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {details.statusBreakdown.Operational || 0}
                </span>
              </div>
              <div className="bg-amber-950/40 border border-amber-800/50 p-2 rounded-lg">
                <span className="text-[10px] text-amber-400 font-medium block">Under Const.</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {details.statusBreakdown['Under Construction'] || 0}
                </span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 p-2 rounded-lg">
                <span className="text-[10px] text-slate-300 font-medium block">Planned</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {details.statusBreakdown.Planned || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Regional Infrastructure Context (Energy & Water) */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Regional Sustainability Context
          </h4>

          {/* Renewable Energy Grid Context */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Renewable Energy Grid Share</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                {details.gridContext?.reShareProxy || 'Not reported'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Installed RE: <span className="text-slate-200 font-medium">{details.gridContext?.installedRECapacityMW || 'Not available'}</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Source: {details.gridContext?.powerSource || 'Central Electricity Authority (CEA) Baseline Pending'}
            </p>
          </div>

          {/* Water & Hydrological Stress */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">Water Availability & Cooling Stress</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {details.gridContext?.waterStress || 'Unavailable for this region.'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Source: {details.gridContext?.waterSource || 'Central Ground Water Board (CGWB)'}
            </p>
          </div>
        </div>

        {/* Curated Facilities List in this state */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Verified Facility Records ({details.facilities.length})
          </h4>
          {details.facilities.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No facility records documented in this state.</p>
          ) : (
            <div className="space-y-2.5">
              {details.facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white">{fac.name}</span>
                    <span
                      className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        fac.status === 'Operational'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : fac.status === 'Under Construction'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {fac.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5">{fac.operator} • {fac.city}</p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300">
                    <span>
                      IT Power: <strong className="text-emerald-400">{fac.reportedCapacityMW ? `${fac.reportedCapacityMW} MW` : 'Undisclosed'}</strong>
                    </span>
                    {fac.reportedRacks && (
                      <span>Racks: <strong>{fac.reportedRacks.toLocaleString()}</strong></span>
                    )}
                  </div>

                  {fac.notes && (
                    <p className="text-[10px] text-slate-400 mt-1.5 italic bg-slate-900/60 p-1.5 rounded">
                      {fac.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                    <span title={fac.sourceTitle} className="truncate max-w-[200px]">
                      Source: {fac.sourceTitle}
                    </span>
                    {fac.sourceUrl && (
                      <a
                        href={fac.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
                      >
                        Source <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* State Notes & Methodology footnote */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-300 font-medium">Regional Assessment Note</p>
            <p className="mt-0.5">{details.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
