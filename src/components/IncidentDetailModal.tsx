import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Building2, 
  UserCheck, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Send,
  Upload,
  ArrowRight
} from 'lucide-react';
import { DamageReport } from '../types';
import { CATEGORY_LABELS, SEVERITY_CONFIG, STATUS_CONFIG, formatTimeAgo } from '../utils/formatters';
import { DEPARTMENTS, COUNCIL_OFFICIALS } from '../data/seedData';

interface IncidentDetailModalProps {
  report: DamageReport | null;
  onClose: () => void;
  onVoteConfirm: (reportId: string) => void;
  onVoteStillBroken: (reportId: string) => void;
  onMarkResolvedWithProof: (reportId: string, proofImageUrl: string, notes: string) => void;
  onOpenExportModal: (report: DamageReport) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  report,
  onClose,
  onVoteConfirm,
  onVoteStillBroken,
  onMarkResolvedWithProof,
  onOpenExportModal,
}) => {
  const [activeImageMode, setActiveImageMode] = useState<'reported' | 'after'>('reported');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [proofUrl, setProofUrl] = useState('https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80');
  const [proofNotes, setProofNotes] = useState('Public repairs inspected and cleared by colony resident.');

  if (!report) return null;

  const dept = DEPARTMENTS.find((d) => d.id === report.assignedDepartmentId);
  const rep = COUNCIL_OFFICIALS.find((c) => c.id === report.councilRepresentativeId);
  const severityInfo = SEVERITY_CONFIG[report.severity];
  const statusInfo = STATUS_CONFIG[report.status];

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#ticket=${report.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyGrievanceLetter = () => {
    const letter = `SEVA MEIN (सेवा में):
To: ${rep?.name || 'Respected Ward Parshad Ji'} & ${dept?.name || 'Chief Engineer / Nodal Officer, Nagar Nigam'}
Subject: Urgent Public Infrastructure Redressal Petition - Ticket ${report.id}
Sthan (Location): ${report.location.address} (${report.location.district})

Respected Sir / Madam,
With utmost respect, we bring to your urgent notice a severe public infrastructure hazard:
"${report.title}"
Vivaran: ${report.description}
AI Hazard Index: ${report.aiAssessment?.hazardScore || 80}/100 (Public Safety Danger)
Risk Factors: ${report.aiAssessment?.riskFactors.join('; ') || 'Hazardous to pedestrians, auto-rickshaws, and commuters'}
Estimated Remediation Cost: ${report.aiAssessment?.estimatedCostRange || '₹40,000 - ₹75,000'}

As per the Right to Public Services Act (Citizen Charter) and Nagar Nigam SLA rules, we kindly petition you to look into the matter urgently and do the needful for speedy repair.

Dhanyawad / Pranam,
Concerned Ward Citizens (जागरूक नागरिक)
Filed anonymously via Fixora Civic Portal`;

    navigator.clipboard.writeText(letter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 3000);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    onMarkResolvedWithProof(report.id, proofUrl, proofNotes);
    setShowProofUpload(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm bg-slate-900 text-white px-2.5 py-1 rounded-lg">
              {report.id}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`font-semibold ${severityInfo.textClass}`}>{severityInfo.label}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">{statusInfo.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenExportModal(report)}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Karyadesh (कार्य आदेश)</span>
            </button>
            <button
              onClick={handleCopyShareLink}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Title & Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="font-medium text-slate-700">{CATEGORY_LABELS[report.category]}</span>
              <span aria-hidden="true">·</span>
              <span>{report.location.district}</span>
              <span aria-hidden="true">·</span>
              <span>Reported {formatTimeAgo(report.reportedAt)}</span>
              {report.isAnonymousExifStripped && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Bilkul Anonymous (100% Secure)
                  </span>
                </>
              )}
            </div>

            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
              {report.title}
            </h2>

            <p className="text-sm text-slate-700 mt-2 leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* Photo Viewer with Before/After Switcher */}
          <div className="space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video max-h-72 w-full">
              <img
                src={activeImageMode === 'after' && report.afterImageUrl ? report.afterImageUrl : report.imageUrl}
                alt={report.title}
                className="w-full h-full object-cover"
              />

              {report.afterImageUrl && (
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-1 rounded-xl shadow-md border border-slate-200 flex items-center gap-1">
                  <button
                    onClick={() => setActiveImageMode('reported')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeImageMode === 'reported' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Prarambhik Defect (पहले)
                  </button>
                  <button
                    onClick={() => setActiveImageMode('after')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeImageMode === 'after' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Kaam Ho Gaya (बाद में)
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{report.location.address} {report.location.landmark ? `(Landmark: ${report.location.landmark})` : ''}</span>
              </div>
              <span className="font-mono text-[11px]">
                {report.location.coordinates.lat.toFixed(4)}, {report.location.coordinates.lng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* AI Civil Engineering Assessment Box */}
          {report.aiAssessment && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    AI Civil Engineer Jan-Padtal (जोखिम व लागत विश्लेषण)
                  </h3>
                </div>
                <span className="font-mono text-xs bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded">
                  {report.aiAssessment.officialDispatchCode}
                </span>
              </div>

              {/* Metric bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-0.5">Hazard Index</span>
                  <div className="font-mono font-bold text-xl text-slate-900">
                    {report.aiAssessment.hazardScore}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-0.5">Est. Repair Time</span>
                  <div className="font-mono font-bold text-xl text-slate-900">
                    {report.aiAssessment.estimatedRepairHours}h
                    <span className="text-xs text-slate-400 font-normal"> crew work</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-0.5">Anumanit Lagat (Cost)</span>
                  <div className="font-mono font-bold text-lg text-slate-900 truncate">
                    {report.aiAssessment.estimatedCostRange}
                  </div>
                </div>
              </div>

              {/* Safety Risks */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">Public Safety Risk Factors:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                  {report.aiAssessment.riskFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">▪</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Advisory */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                <span className="font-semibold">Savdhaani Salah (Advisory): </span>
                {report.aiAssessment.safetyAdvisory}
              </div>
            </div>
          )}

          {/* Department & Council Leadership Accountability */}
          <div className="border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-600" />
                <span>Zimmedar Adhikari & Ward Parshad (जवाबदेही)</span>
              </h3>
              <button
                onClick={handleCopyGrievanceLetter}
                className="text-xs text-slate-700 hover:text-slate-900 font-medium underline underline-offset-2 flex items-center gap-1"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLetter ? 'Petition Copied!' : 'Copy Formal Petition to Parshad Ji'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Department Card */}
              {dept && (
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Responsible Agency (विभाग)</span>
                  <div className="font-bold text-slate-900 text-sm">{dept.name}</div>
                  <div className="text-slate-600">Head: {dept.headOfficial} ({dept.title})</div>
                  <div className="flex items-center justify-between pt-1 text-slate-500 border-t border-slate-200/60">
                    <span>Avg Fix: {dept.averageResolutionDays} days</span>
                    <span className="font-medium text-slate-700">Citizen SLA: {dept.slaComplianceRate}%</span>
                  </div>
                </div>
              )}

              {/* Council Official Card */}
              {rep && (
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 flex items-start gap-3">
                  <img src={rep.avatarUrl} alt={rep.name} className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Elected Ward Parshad (पार्षद)</span>
                    <div className="font-bold text-slate-900 text-sm truncate">{rep.name}</div>
                    <div className="text-slate-600 truncate">{rep.role}</div>
                    <div className="flex items-center justify-between pt-1 text-slate-500 border-t border-slate-200/60">
                      <span>Janta Trust: {rep.citizenApprovalRating}%</span>
                      <span>Resp: ~{rep.avgResponseDays}d</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline of Municipal Actions */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900">
              Sarkari Action Timeline & Public Audit (कार्रवाई विवरण)
            </h3>
            
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {report.timeline.map((event) => (
                <div key={event.id} className="relative text-xs">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="font-semibold text-slate-800">{event.author}</span>
                    <span>·</span>
                    <span>{formatTimeAgo(event.timestamp)}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{event.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Community Verification Actions Bar */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onVoteConfirm(report.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl text-xs transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Confirm Hazard / Me Too (+1 Hai Ji - {report.confirmationsCount})</span>
                </button>

                {report.status !== 'resolved' && (
                  <button
                    onClick={() => onVoteStillBroken(report.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium rounded-xl text-xs transition-colors border border-amber-200"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Abhi Bhi Toota Hai ({report.stillBrokenCount})</span>
                  </button>
                )}
              </div>

              {report.status !== 'resolved' && (
                <button
                  onClick={() => setShowProofUpload(!showProofUpload)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-xs transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Submit Photo Proof of Repair (Kaam Ka Saboot)</span>
                </button>
              )}
            </div>

            {/* Proof submission drawer */}
            {showProofUpload && (
              <form onSubmit={handleSubmitProof} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Upload Photo Proof of Resolved Repair (सत्यापन फोटो)</h4>
                <div className="space-y-2">
                  <input
                    type="url"
                    required
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="URL of repaired road / swing / wire..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                  />
                  <input
                    type="text"
                    required
                    value={proofNotes}
                    onChange={(e) => setProofNotes(e.target.value)}
                    placeholder="Tippani (e.g. Asphault hot-mix patch completed by PWD gang)"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowProofUpload(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg"
                  >
                    Verify & Mark Kaam Ho Gaya
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
