import React, { useState } from 'react';
import { 
  Key, 
  Search, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Trash2, 
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { DamageReport } from '../types';
import { CATEGORY_LABELS, STATUS_CONFIG, formatTimeAgo } from '../utils/formatters';

interface AnonymousTrackerDrawerProps {
  reports: DamageReport[];
  userTokenIds: string[]; // List of report IDs saved locally
  onSelectReport: (report: DamageReport) => void;
  onClearTrackers: () => void;
  onOpenReportModal: () => void;
}

export const AnonymousTrackerDrawer: React.FC<AnonymousTrackerDrawerProps> = ({
  reports,
  userTokenIds,
  onSelectReport,
  onClearTrackers,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Filter reports that match userTokenIds
  const myTrackedReports = reports.filter((r) => userTokenIds.includes(r.id));

  const handleSearchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const clean = searchQuery.trim().toUpperCase();
    if (!clean) return;

    const found = reports.find(
      (r) => r.id.toUpperCase() === clean || r.anonymousToken.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (found) {
      onSelectReport(found);
    } else {
      setSearchError(`Koi ticket nahi mila matching "${clean}". Kripya ID check karein (jaise DL-9412-W2 ya DL-8821-W1).`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Intro Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Key className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">Mera Anonymous Grievance Vault (गोपनीय तिजोरी)</span>
          <span>·</span>
          <span>Stored on this device only (बिना किसी लॉगिन के)</span>
        </div>

        <h2 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
          <span>Anonymous Shikayat Tickets & Pauti Trackers</span>
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          Because Fixora does not ask for your mobile number, Aadhaar, or email ID, all your submitted public hazard tickets and tokens remain securely saved in your browser sandbox. You can follow repair updates without any fear of inquiry!
        </p>

        {/* Lookup Bar */}
        <form onSubmit={handleSearchTicket} className="pt-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchError(null);
                }}
                placeholder="Look up ticket by ID (e.g. DL-9412-W2 or DL-8821-W1...)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-slate-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors shrink-0"
            >
              Verify Pauti Status (स्थिति जांचें)
            </button>
          </div>

          {searchError && (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{searchError}</span>
            </p>
          )}
        </form>
      </div>

      {/* Tracked Tickets List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-display font-bold text-base text-slate-900">
            Tickets Logged on This Device ({myTrackedReports.length})
          </h3>
          {myTrackedReports.length > 0 && (
            <button
              onClick={onClearTrackers}
              className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Vault (तिजोरी खाली करें)</span>
            </button>
          )}
        </div>

        {myTrackedReports.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-600">No damage complaints filed yet from this device.</p>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors"
            >
              File a Gadda / Hazard Report Anonymously (शिकायत दर्ज करें)
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myTrackedReports.map((report) => {
              const statusInfo = STATUS_CONFIG[report.status];
              return (
                <div key={report.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-900 px-2 py-0.5 rounded">
                        {report.id}
                      </span>
                      <span className={`text-xs font-semibold ${statusInfo.textClass}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{formatTimeAgo(report.reportedAt)}</span>
                    </div>

                    <h4 
                      onClick={() => onSelectReport(report)}
                      className="font-display font-bold text-base text-slate-900 group-hover:text-slate-700 cursor-pointer"
                    >
                      {report.title}
                    </h4>

                    <div className="text-xs text-slate-500">
                      {report.location.address} · {report.location.district}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectReport(report)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <span>Check Nagar Nigam Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
