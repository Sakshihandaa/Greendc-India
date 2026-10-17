import React, { useEffect } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Droplets,
  Layers,
  Building2,
  FileCheck,
  Scale,
  HelpCircle,
  ExternalLink,
  Code2,
  Bookmark
} from 'lucide-react';

export default function MethodologyModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.history.pushState({ modalOpen: true }, '');
    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto animate-fadeIn select-none">
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-2xl border border-emerald-200 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight font-heading">
                Methodology, Physics Formulas & Data Codex
              </h3>
              <p className="text-xs text-slate-500">
                GreenDC India Research Documentation & Mathematical Specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Research Context & Scope Notice */}
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Academic & Decision-Support Scope
            </div>
            <p className="text-slate-700 leading-relaxed">
              GreenDC India is an educational and policy decision-support platform designed to model the energy, water, and spatial constraints of AI compute clusters across India. It provides explainable, reproducible calculations rather than proprietary black-box outputs. It is not an official regulatory clearance or civil engineering blueprint.
            </p>
          </div>

          {/* Core Mathematical Formulations */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 font-heading">
              <Code2 className="w-4 h-4 text-emerald-600" />
              1. Deterministic Calculation Rules (FR-03 to FR-05)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Facility Power */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono">
                  Facility Power (MW)
                </span>
                <div className="font-mono text-sm text-slate-900 font-extrabold bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                  P_facility = P_IT × PUE
                </div>
                <p className="text-[11px] text-slate-500">
                  Where P_IT is the commissioned IT payload in megawatts, and PUE is Power Usage Effectiveness (≥ 1.0).
                </p>
              </div>

              {/* Annual IT Energy */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 font-mono">
                  Annual IT Energy (kWh/year)
                </span>
                <div className="font-mono text-sm text-slate-900 font-extrabold bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                  E_IT = P_IT × 1,000 × 8,760 × Utilisation
                </div>
                <p className="text-[11px] text-slate-500">
                  8,760 hours/year; utilisation represents the average annual capacity factor (0.0 to 1.0).
                </p>
              </div>

              {/* Annual Facility Energy */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 font-mono">
                  Annual Facility Energy (kWh/year)
                </span>
                <div className="font-mono text-sm text-slate-900 font-extrabold bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                  E_facility = E_IT × PUE
                </div>
                <p className="text-[11px] text-slate-500">
                  Total grid and on-site generation draw, including cooling, UPS losses, switchgear, and auxiliary power.
                </p>
              </div>

              {/* Water Consumption */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 font-mono">
                  Cooling Water Consumption (Litres/year)
                </span>
                <div className="font-mono text-sm text-slate-900 font-extrabold bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                  W_annual = E_IT × WUE
                </div>
                <p className="text-[11px] text-slate-500">
                  WUE is in Litres per kWh of IT energy. Converted to Megalitres (ML) by dividing by 1,000,000.
                </p>
              </div>
            </div>
          </div>

          {/* Missing-Data Integrity Policy */}
          <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-600" />
              2. Scientific Missing-Data Rule (FR-08)
            </h4>
            <p className="leading-relaxed text-slate-700">
              When an operator does not explicitly publish water metrics or rack counts, GreenDC treats the field as <strong className="text-slate-900 font-mono">null (Unavailable)</strong>. GreenDC never assumes missing disclosures to be zero or imputes favorable defaults. This ensures corporate environmental transparency is accurately captured.
            </p>
          </div>

          {/* Data Sources and Provenance */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 font-heading">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              3. Verifiable Data Sources & Citations
            </h4>
            <div className="space-y-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-semibold">Power Grid & Renewable Penetration:</strong>
                <span className="text-slate-600 text-[11px]">
                  Central Electricity Authority (CEA) Ministry of Power — Monthly Generation & Installed Capacity Reports (2023–2024), CO2 Baseline Database for the Indian Power Sector v19.
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-semibold">Hydrological Stress & Aquifer Depletion:</strong>
                <span className="text-slate-600 text-[11px]">
                  Central Ground Water Board (CGWB) Dynamic Ground Water Resources of India & NITI Aayog Composite Water Management Index (CWMI).
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-semibold">Facility Capacities & Phase Disclosures:</strong>
                <span className="text-slate-600 text-[11px]">
                  Public corporate announcements, Uptime Institute Tier IV certifications, and state industrial development corporation (MIDC, UPSIDA, SIPCOT) land allotments.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Open Data Commons • Transparent Mathematics
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-emerald-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
