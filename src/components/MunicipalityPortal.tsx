import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Send, 
  Upload, 
  Eye, 
  ShieldCheck, 
  X, 
  Check, 
  Calendar,
  Layers,
  Sparkles,
  Printer
} from 'lucide-react';
import { DamageReport, ReportStatus, HazardCategory } from '../types';
import { CATEGORY_LABELS, SEVERITY_CONFIG, STATUS_CONFIG, formatTimeAgo } from '../utils/formatters';
import { DEPARTMENTS } from '../data/seedData';

interface MunicipalityPortalProps {
  reports: DamageReport[];
  officerEmail: string;
  onUpdateReportStatus: (
    reportId: string, 
    newStatus: ReportStatus, 
    officerNotes: string, 
    proofImageUrl?: string
  ) => void;
  onSelectReportForDossier: (report: DamageReport) => void;
  onOpenExportModal: (report: DamageReport) => void;
}

const SAMPLE_REPAIR_PHOTOS = [
  { label: 'Naya Tarmac / Repaved Bitumen Road', url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop&q=80' },
  { label: 'Theek Hua Park Jhula (New ISI Chains)', url: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80' },
  { label: 'Saaf Ki Gayi Gali (Malba Removed)', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80' },
  { label: 'Covered High-Voltage Box (Taar Sealed)', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80' },
];

export const MunicipalityPortal: React.FC<MunicipalityPortalProps> = ({
  reports,
  officerEmail,
  onUpdateReportStatus,
  onSelectReportForDossier,
  onOpenExportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  
  // Status update dialog state
  const [selectedReportForUpdate, setSelectedReportForUpdate] = useState<DamageReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('in_progress');
  const [officerNotes, setOfficerNotes] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.location.address.toLowerCase().includes(q) ||
        r.location.district.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (districtFilter !== 'all' && !r.location.district.includes(districtFilter)) {
      return false;
    }

    if (statusFilter === 'pending' && r.status !== 'reported' && r.status !== 'triaged') {
      return false;
    }
    if (statusFilter === 'in_progress' && r.status !== 'in_progress' && r.status !== 'dispatched') {
      return false;
    }
    if (statusFilter === 'resolved' && r.status !== 'resolved' && r.status !== 'community_verified') {
      return false;
    }

    return true;
  });

  // Key metrics
  const totalReportsCount = reports.length;
  const pendingTriageCount = reports.filter((r) => r.status === 'reported' || r.status === 'triaged').length;
  const underProcessCount = reports.filter((r) => r.status === 'in_progress' || r.status === 'dispatched').length;
  const workDoneCount = reports.filter((r) => r.status === 'resolved' || r.status === 'community_verified').length;
  const criticalCount = reports.filter((r) => r.severity === 'critical' && r.status !== 'resolved').length;

  const handleOpenStatusModal = (report: DamageReport, targetStatus: ReportStatus) => {
    setSelectedReportForUpdate(report);
    setNewStatus(targetStatus);
    setProofImageUrl(report.afterImageUrl || SAMPLE_REPAIR_PHOTOS[0].url);
    if (targetStatus === 'in_progress') {
      setOfficerNotes(`Nagar Nigam & PWD Quick Response Unit dispatched. Safety barricades placed at ${report.location.address}. Repair work underway.`);
    } else if (targetStatus === 'resolved') {
      setOfficerNotes(`Work completed and inspected by Nagar Nigam Zonal Inspector. Site restored as per Indian Road & Civic Safety standards.`);
    } else {
      setOfficerNotes(`Grievance triaged by Nagar Nigam Officer Mayank. Department work order dispatched.`);
    }
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportForUpdate) return;

    setIsPublishing(true);
    setTimeout(() => {
      onUpdateReportStatus(
        selectedReportForUpdate.id,
        newStatus,
        officerNotes,
        newStatus === 'resolved' ? proofImageUrl : undefined
      );
      setIsPublishing(false);
      setSelectedReportForUpdate(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Officer Header / Municipal Command Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded">
                Official Sarkari Cell
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-300">Nagar Nigam & PWD Civic Redressal</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
              <span>Nagar Nigam Officer Portal · Adhikari Mayank</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Authorized municipal officer console for updating ground remediation status to <strong className="text-amber-400">Kaam Chalu Hai (Under Process)</strong> or <strong className="text-emerald-400">Kaam Ho Gaya (Work Done)</strong>, and publishing public proof for full civic transparency.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 text-xs space-y-1 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">Authorized Nodal Adhikari:</span>
            </div>
            <div className="font-mono text-slate-300 font-bold">{officerEmail}</div>
            <div className="text-[11px] text-slate-400">Chief Municipal Infrastructure Inspector (MCD)</div>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider block">Kul Shikayatein (Total)</span>
            <div className="font-mono font-bold text-2xl text-white">{totalReportsCount}</div>
            <span className="text-[11px] text-slate-500">Citizen logged grievances</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-amber-400 uppercase text-[10px] tracking-wider block">Kaam Chalu Hai</span>
            <div className="font-mono font-bold text-2xl text-amber-400">{underProcessCount}</div>
            <span className="text-[11px] text-slate-400">Active municipal work crews</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-emerald-400 uppercase text-[10px] tracking-wider block">Kaam Ho Gaya (Fixed)</span>
            <div className="font-mono font-bold text-2xl text-emerald-400">{workDoneCount}</div>
            <span className="text-[11px] text-slate-400">Publicly verified cleared</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-red-400 uppercase text-[10px] tracking-wider block">Khatarnak Hazards</span>
            <div className="font-mono font-bold text-2xl text-red-400">{criticalCount}</div>
            <span className="text-[11px] text-slate-400">Immediate action needed</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID (e.g. DL-9412-W2), street address, gadda description..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="all">All Wards / Zones (Sabhi Ward)</option>
              <option value="Ward 1">Ward 1 - Connaught Place / Central</option>
              <option value="Ward 2">Ward 2 - Lajpat Nagar / South</option>
              <option value="Ward 3">Ward 3 - Karol Bagh / West</option>
              <option value="Ward 4">Ward 4 - Chandni Chowk / North</option>
              <option value="Ward 5">Ward 5 - Rohini / Pitampura</option>
            </select>
          </div>
        </div>

        {/* Status Tab Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Awaiting Review ({pendingTriageCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'in_progress' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kaam Chalu Hai ({underProcessCount})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'resolved' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kaam Ho Gaya ({workDoneCount})
          </button>
        </div>
      </div>

      {/* Municipal Damage Records Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Damage Photo & Ticket</th>
                <th className="px-5 py-3.5">Location & Ward</th>
                <th className="px-5 py-3.5">Report Time & SLA</th>
                <th className="px-5 py-3.5">Hazard Severity</th>
                <th className="px-5 py-3.5">Current Status</th>
                <th className="px-5 py-3.5 text-right">Adhikari Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => {
                const severityInfo = SEVERITY_CONFIG[report.severity];
                const statusInfo = STATUS_CONFIG[report.status];
                const dept = DEPARTMENTS.find((d) => d.id === report.assignedDepartmentId);

                return (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Photo, Title & Ticket */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={report.afterImageUrl || report.imageUrl}
                            alt={report.title}
                            className="w-full h-full object-cover"
                          />
                          {report.afterImageUrl && (
                            <span className="absolute bottom-0 inset-x-0 bg-emerald-700 text-white text-[9px] text-center font-bold">
                              Fixed
                            </span>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                              {report.id}
                            </span>
                            <span className="text-xs text-slate-500 font-medium truncate max-w-[140px]">
                              {CATEGORY_LABELS[report.category]}
                            </span>
                          </div>
                          <h4 
                            onClick={() => onSelectReportForDossier(report)}
                            className="font-display font-bold text-sm text-slate-900 hover:text-slate-700 cursor-pointer line-clamp-1 max-w-xs"
                          >
                            {report.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <div className="font-medium text-slate-900 truncate max-w-[200px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{report.location.address}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{report.location.district}</div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {report.location.coordinates.lat.toFixed(4)}, {report.location.coordinates.lng.toFixed(4)}
                      </div>
                    </td>

                    {/* Timestamp & SLA */}
                    <td className="px-5 py-4 text-xs">
                      <div className="font-mono text-slate-900 font-medium">
                        {new Date(report.reportedAt).toLocaleDateString('en-IN')} {new Date(report.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatTimeAgo(report.reportedAt)}</span>
                      </div>
                    </td>

                    {/* Hazard Severity */}
                    <td className="px-5 py-4 text-xs">
                      <span className={`inline-block font-semibold px-2 py-0.5 rounded-md ${severityInfo.bgClass}`}>
                        {severityInfo.label}
                      </span>
                      {report.aiAssessment && (
                        <div className="font-mono text-[11px] text-slate-500 mt-1">
                          Risk: {report.aiAssessment.hazardScore}/100
                        </div>
                      )}
                    </td>

                    {/* Public Status */}
                    <td className="px-5 py-4 text-xs">
                      <span className={`inline-block font-bold px-2.5 py-1 rounded-lg ${statusInfo.bgClass}`}>
                        {statusInfo.label}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {dept?.shortCode || 'PWD / Nagar Nigam'}
                      </div>
                    </td>

                    {/* Municipal Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Action: Mark Under Process */}
                        {report.status !== 'in_progress' && report.status !== 'resolved' && (
                          <button
                            onClick={() => handleOpenStatusModal(report, 'in_progress')}
                            title="Publish to public that repairs are under process"
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <span>Kaam Chalu</span>
                          </button>
                        )}

                        {/* Action: Mark Done */}
                        {report.status !== 'resolved' && (
                          <button
                            onClick={() => handleOpenStatusModal(report, 'resolved')}
                            title="Publish to public that work is complete"
                            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Kaam Ho Gaya</span>
                          </button>
                        )}

                        {report.status === 'resolved' && (
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 pr-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Kaam Ho Gaya</span>
                          </span>
                        )}

                        {/* Work order docket */}
                        <button
                          onClick={() => onOpenExportModal(report)}
                          title="Print official municipal work order docket"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Publish Municipal Status Dialog */}
      {selectedReportForUpdate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Publish Municipal Status to Janta (स्थिति अपडेट)
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    Docket ID: {selectedReportForUpdate.id}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedReportForUpdate(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveStatus} className="p-6 space-y-4">
              
              {/* Target Status Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Select Status to Publish (चुनें)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewStatus('in_progress');
                      setOfficerNotes(`Nagar Nigam & PWD Quick Response Unit assigned. Safety barricades placed and roadwork crews deployed at ${selectedReportForUpdate.location.address}.`);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      newStatus === 'in_progress'
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold ring-1 ring-amber-400'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">Kaam Chalu Hai (Under Process)</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">Crew deployed, repair ongoing</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewStatus('resolved');
                      setOfficerNotes(`Remediation completed by Nagar Nigam crew. Work verified to meet municipal civil code standards.`);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      newStatus === 'resolved'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">Kaam Ho Gaya (Work Done)</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">Repairs complete, site inspected</div>
                  </button>
                </div>
              </div>

              {/* Officer Dispatch Notes */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Official Municipal Dispatch Note (सरकारी टिप्पणी)
                </label>
                <textarea
                  rows={3}
                  required
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Enter work gang details, timeline, or repair summary..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-slate-500 resize-none"
                />
              </div>

              {/* Photo Evidence of Fix (Only needed or shown for Work Done) */}
              {newStatus === 'resolved' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Kaam Ka Saboot Photo (Before vs After Public Display)
                  </label>
                  <input
                    type="url"
                    required
                    value={proofImageUrl}
                    onChange={(e) => setProofImageUrl(e.target.value)}
                    placeholder="URL of repaired site..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-slate-500"
                  />

                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-slate-500">Pick verified repair sample photo:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SAMPLE_REPAIR_PHOTOS.map((photo) => (
                        <button
                          type="button"
                          key={photo.label}
                          onClick={() => setProofImageUrl(photo.url)}
                          className={`text-left text-xs p-2 rounded-lg border truncate transition-all ${
                            proofImageUrl === photo.url
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {photo.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Transparency Notice */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  This action immediately updates the Live Public Feed, the Ward Radar Map, and the Leadership Scoreboard for all citizens.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReportForUpdate(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPublishing ? 'Publishing...' : 'Publish to Janta (सार्वजनिक करें)'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
