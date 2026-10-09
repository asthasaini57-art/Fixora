import React from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, Building2, AlertTriangle } from 'lucide-react';
import { DamageReport } from '../types';
import { CATEGORY_LABELS, SEVERITY_CONFIG, STATUS_CONFIG } from '../utils/formatters';
import { DEPARTMENTS, COUNCIL_OFFICIALS } from '../data/seedData';

interface WorkOrderExportModalProps {
  report: DamageReport | null;
  onClose: () => void;
}

export const WorkOrderExportModal: React.FC<WorkOrderExportModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const dept = DEPARTMENTS.find((d) => d.id === report.assignedDepartmentId);
  const rep = COUNCIL_OFFICIALS.find((c) => c.id === report.councilRepresentativeId);
  const severityInfo = SEVERITY_CONFIG[report.severity];
  const statusInfo = STATUS_CONFIG[report.status];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none">
        
        {/* Header Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-slate-800">Official Municipal Karyadesh Dossier (कार्य आदेश)</span>
            <span className="font-mono text-xs text-slate-500">[{report.id}]</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF (प्रिंट निकालें)</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900">
          
          {/* Municipal Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest font-mono text-slate-500">
                MUNICIPAL CORPORATION (NAGAR NIGAM) & PWD PUBLIC WORKS COMMISSION
              </div>
              <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                MUNICIPAL KARYADESH (WORK ORDER) & JANTA GRIEVANCE DOCKET
              </h1>
              <div className="text-xs text-slate-600 mt-1">
                Issued pursuant to Section 313 of the Municipal Corporation Act · Right to Public Services Act (Citizen Charter)
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-xl text-slate-900">{report.id}</div>
              <div className="text-[11px] font-mono text-slate-500">Pauti Token: {report.anonymousToken.slice(0, 14)}...</div>
              <div className="text-[11px] text-slate-500">Tarikh (Date): {new Date(report.reportedAt).toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* Top Status & Agency Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Zimmedar Vibhag (Agency)</span>
              <span className="font-bold text-slate-900">{dept?.name || 'PWD / Nagar Nigam'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Ward & Zone (वार्ड)</span>
              <span className="font-bold text-slate-900">{report.location.district}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Khatra Level (Severity)</span>
              <span className="font-bold text-red-700 uppercase">{severityInfo.label}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Vartaman Sthiti (Status)</span>
              <span className="font-bold text-slate-900 uppercase">{statusInfo.label}</span>
            </div>
          </div>

          {/* Defect Description */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-500">
              01. Defect Description & Location (समस्या का स्थान व विवरण)
            </h3>
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-sm">
              <div className="font-bold text-base text-slate-900">{report.title}</div>
              <p className="text-slate-700 leading-relaxed text-xs">{report.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Address: {report.location.address}</span>
                {report.location.landmark && <span>Landmark: {report.location.landmark}</span>}
                <span>Coordinates: {report.location.coordinates.lat.toFixed(5)}, {report.location.coordinates.lng.toFixed(5)}</span>
              </div>
            </div>
          </div>

          {/* Photo Visual Evidence */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-500">
              02. Visual Photographic Evidence (फोटो प्रमाण)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <img src={report.imageUrl} alt="Defect" className="w-full h-44 object-cover" />
                <div className="p-2 text-[11px] text-slate-600 bg-slate-50 text-center font-medium">
                  Initial Citizen Hazard Submission (प्रारंभिक फोटो)
                </div>
              </div>

              {report.afterImageUrl ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <img src={report.afterImageUrl} alt="Repaired" className="w-full h-44 object-cover" />
                  <div className="p-2 text-[11px] text-emerald-800 bg-emerald-50 text-center font-medium">
                    Verified Completed Remediation (Kaam Ho Gaya)
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 text-center text-slate-400 text-xs">
                  <AlertTriangle className="w-6 h-6 mb-1 text-slate-400" />
                  <span>Awaiting Final Municipal Crew Clearance Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Civil Engineering Assessment */}
          {report.aiAssessment && (
            <div className="space-y-2">
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-500">
                03. Civil Engineering Hazard Analysis & Dispatch Recommendation (सिविल इंजीनियरिंग विश्लेषण)
              </h3>
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 text-xs bg-slate-50">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Hazard Index</span>
                    <div className="font-mono font-bold text-base text-slate-900">{report.aiAssessment.hazardScore}/100</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Estimated Labor</span>
                    <div className="font-mono font-bold text-base text-slate-900">{report.aiAssessment.estimatedRepairHours} Crew Hours</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Anumanit Lagat (Cost)</span>
                    <div className="font-mono font-bold text-base text-slate-900">{report.aiAssessment.estimatedCostRange}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">Public Safety Risk Factors:</span>
                  <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                    {report.aiAssessment.riskFactors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Official Signatures & Verification Seal */}
          <div className="pt-6 border-t-2 border-slate-900 flex items-end justify-between text-xs">
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase text-slate-400">Accountability Sign-Off (हस्ताक्षर प्रकोष्ठ)</div>
              <div className="font-bold text-slate-900">{rep?.name} ({rep?.district})</div>
              <div className="text-slate-500">{dept?.headOfficial}, {dept?.title}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                <div>Scan for Live Status</div>
                <div>fixora.nagarnigam.in/{report.id}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
