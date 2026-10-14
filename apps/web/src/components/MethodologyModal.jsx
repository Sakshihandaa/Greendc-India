import React from 'react';
import { X, BookOpen, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function MethodologyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950 rounded-xl border border-emerald-800">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Methodology, Formulas & Data Provenance
              </h3>
              <p className="text-xs text-slate-400">GreenDC India Technical Documentation & PRD Standards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Research Context & Disclaimer */}
          <div className="bg-emerald-950/30 border border-emerald-800/50 p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Research Prototype Scope (PRD Section 1)
            </h4>
            <p className="text-slate-300">
              GreenDC India is an educational/research decision-support platform exploring the sustainability implications of AI data-centre infrastructure in India. It is not an official site-selection, engineering design, or environmental-clearance tool.
            </p>
          </div>

          {/* Formulas */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              1. Deterministic Calculation Formulas (FR-03 to FR-05)
            </h4>
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px]">
              <div>
                <strong className="text-emerald-400">Facility Power (MW):</strong>
                <span className="text-slate-300 ml-2">IT Load (MW) × PUE</span>
              </div>
              <div>
                <strong className="text-emerald-400">Annual IT Energy (kWh/year):</strong>
                <span className="text-slate-300 ml-2">IT Load (MW) × 1,000 × 8,760 × Utilisation</span>
              </div>
              <div>
                <strong className="text-emerald-400">Annual Facility Energy (kWh/year):</strong>
                <span className="text-slate-300 ml-2">IT Load (MW) × 1,000 × PUE × 8,760 × Utilisation</span>
              </div>
              <div>
                <strong className="text-emerald-400">Renewable-Equivalent Energy (kWh/year):</strong>
                <span className="text-slate-300 ml-2">Annual Facility Energy × Renewable Share</span>
                <p className="text-[10px] text-amber-300/80 font-sans mt-0.5">
                  * Note: Scenario estimate only. Does not indicate verified physical green electron matching.
                </p>
              </div>
              <div>
                <strong className="text-cyan-400">Estimated Water Consumption (Litres/year):</strong>
                <span className="text-slate-300 ml-2">Annual IT Energy (kWh) × WUE (L/kWh IT energy)</span>
              </div>
              <div>
                <strong className="text-cyan-400">Estimated Water Consumption (ML/year):</strong>
                <span className="text-slate-300 ml-2">Estimated Water (Litres) ÷ 1,000,000</span>
              </div>
            </div>
          </div>

          {/* Missing Data Policy */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              2. Missing-Data Policy (FR-08)
            </h4>
            <p>
              GreenDC India adheres strictly to a transparent missing-data rule: unavailable or undisclosed data is preserved as <span className="text-slate-200 font-mono">null / unavailable</span>. It is never silently replaced with zero or a favourable dummy score.
            </p>
          </div>

          {/* Data Sources and Provenance */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              3. Data Sources & Provenance
            </h4>
            <ul className="space-y-2 list-disc pl-4 text-slate-300">
              <li>
                <strong>Power & Renewable Energy:</strong> Central Electricity Authority (CEA) Executive Summary and State-wise Renewable Generation Reports (2023–2024).
              </li>
              <li>
                <strong>Water Vulnerability:</strong> Central Ground Water Board (CGWB) Dynamic Ground Water Resources Assessment & NITI Aayog Composite Water Management Index (CWMI).
              </li>
              <li>
                <strong>Facility Disclosures:</strong> Official corporate press releases and Uptime Institute Tier IV certifications from Yotta Infrastructure, CtrlS Datacenters, AdaniConneX, NTT GDC, and Equinix India.
              </li>
              <li>
                <strong>Geographical Boundaries:</strong> Simplified India State boundaries derived from DataMeet / OpenStreetMap under open license.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
