/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  SlidersHorizontal,
  Flame,
  FileText,
  Mail,
  Copy,
  Check,
  X,
  Compass,
  Building2
} from 'lucide-react';

import { DamageReport, FilterState, HazardCategory, HazardSeverity, ReportStatus, CouncilOfficial } from './types';
import { INITIAL_REPORTS, DEPARTMENTS, COUNCIL_OFFICIALS } from './data/seedData';
import { CATEGORY_LABELS, SEVERITY_CONFIG } from './utils/formatters';

import { Navbar } from './components/Navbar';
import { IncidentCard } from './components/IncidentCard';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { ReportModal } from './components/ReportModal';
import { InteractiveMap } from './components/InteractiveMap';
import { LeadershipScoreboard } from './components/LeadershipScoreboard';
import { AnonymousTrackerDrawer } from './components/AnonymousTrackerDrawer';
import { WorkOrderExportModal } from './components/WorkOrderExportModal';
import { AuthPage } from './components/AuthPage';
import { MunicipalityPortal } from './components/MunicipalityPortal';
import { auth, onAuthStateChanged, firebaseSignOut, User } from './services/firebase';

const STORAGE_KEY_REPORTS = 'fixora_reports_india_v1';
const STORAGE_KEY_TOKENS = 'fixora_user_tokens_india_v1';

export default function App() {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'leadership' | 'trackers' | 'municipality'>('feed');

  // Municipal officer identification
  const isMunicipality = currentUser?.email?.trim().toLowerCase() === 'mayank54421@gmail.com';

  // Primary reports state with LocalStorage persistence & automatic migration to Indian data
  const [reports, setReports] = useState<DamageReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If contains legacy non-Indian addresses, refresh with Indian initial data
          const isLegacy = parsed.some((p: any) => p.location?.address?.includes('Southgate') || p.location?.address?.includes('Market Plaza'));
          if (!isLegacy) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved reports from localStorage:', e);
    }
    return INITIAL_REPORTS;
  });

  // User's own anonymous report tracking IDs
  const [userTokenIds, setUserTokenIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TOKENS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse user tokens from localStorage:', e);
    }
    return ['DL-9412-W2']; // Initial sample tracked ticket
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    severity: 'all',
    status: 'all',
    district: 'all',
    sortBy: 'urgency',
  });

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportForDossier, setSelectedReportForDossier] = useState<DamageReport | null>(null);
  const [selectedReportForExport, setSelectedReportForExport] = useState<DamageReport | null>(null);
  const [petitionOfficial, setPetitionOfficial] = useState<CouncilOfficial | null>(null);
  const [copiedPetition, setCopiedPetition] = useState(false);

  // Quick toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firebase Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user?.email?.trim().toLowerCase() === 'mayank54421@gmail.com') {
        setActiveTab('municipality');
      } else {
        setActiveTab((prev) => (prev === 'municipality' ? 'feed' : prev));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      setCurrentUser(null);
      setActiveTab('feed');
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
      showToast('Signed out from Fixora.');
    } catch (err: any) {
      console.error('Sign out error:', err);
      setCurrentUser(null);
      setActiveTab('feed');
      showToast('Signed out from Fixora.');
    }
  };

  // Direct municipal officer authentication handler
  const handleMunicipalityDirectAuth = (email: string) => {
    setCurrentUser({
      email,
      uid: 'muni_officer_mayank',
      displayName: 'Adhikari Mayank (Nagar Nigam)',
    } as any);
    setActiveTab('municipality');
    showToast('Signed in as Municipal Corporation Officer (Mayank Ji).');
  };

  // Municipal Corporation: Publish status update (Kaam Chalu or Kaam Ho Gaya)
  const handleUpdateReportStatusByMunicipality = (
    reportId: string,
    newStatus: ReportStatus,
    officerNotes: string,
    proofImageUrl?: string
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const newTimelineEvent = {
            id: `tl-muni-${Date.now()}`,
            status: newStatus,
            timestamp: new Date().toISOString(),
            author: 'Nagar Nigam Cell (Officer Mayank)',
            notes: officerNotes || (newStatus === 'in_progress' ? 'Repairs under process by municipal PWD work crew.' : 'Work completed and verified by Nagar Nigam Zonal Inspector.'),
            proofImageUrl: proofImageUrl,
          };

          return {
            ...r,
            status: newStatus,
            afterImageUrl: proofImageUrl || r.afterImageUrl,
            lastUpdatedAt: new Date().toISOString(),
            verifiedFixedCount: newStatus === 'resolved' ? r.verifiedFixedCount + 1 : r.verifiedFixedCount,
            timeline: [...r.timeline, newTimelineEvent],
          };
        }
        return r;
      })
    );

    const statusLabel = newStatus === 'in_progress' ? 'Kaam Chalu Hai (Under Process)' : 'Kaam Ho Gaya (Work Done & Cleared)';
    showToast(`Published to public: Ticket ${reportId} is now ${statusLabel}!`);
  };

  // Sync reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed to save reports to localStorage:', e);
    }
  }, [reports]);

  // Sync user tokens to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TOKENS, JSON.stringify(userTokenIds));
    } catch (e) {
      console.warn('Failed to save user tokens to localStorage:', e);
    }
  }, [userTokenIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handler: submit new anonymous report
  const handleAddNewReport = (newReport: DamageReport) => {
    setReports((prev) => [newReport, ...prev]);
    setUserTokenIds((prev) => [newReport.id, ...prev]);
    showToast(`Hazard ${newReport.id} lodged anonymously. Pauti saved in your vault!`);
  };

  // Handler: Community vote confirmation
  const handleVoteConfirm = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, confirmationsCount: r.confirmationsCount + 1 };
        }
        return r;
      })
    );
    showToast('Hazard confirmed (+1 Hai Ji vote added).');
  };

  // Handler: Community report still broken
  const handleVoteStillBroken = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, stillBrokenCount: r.stillBrokenCount + 1 };
        }
        return r;
      })
    );
    showToast('Marked as Abhi Bhi Toota. Added to Ward Backlog Watch.');
  };

  // Handler: Community submission of proof of repair
  const handleMarkResolvedWithProof = (reportId: string, proofImageUrl: string, notes: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updatedTimeline = [
            ...r.timeline,
            {
              id: `tl-res-${Date.now()}`,
              status: 'resolved' as ReportStatus,
              timestamp: new Date().toISOString(),
              author: 'Citizen Inspector (जागरूक नागरिक)',
              notes: notes || 'Verified fixed with photographic proof on the ground.',
              proofImageUrl,
            },
          ];
          return {
            ...r,
            status: 'resolved',
            afterImageUrl: proofImageUrl,
            verifiedFixedCount: r.verifiedFixedCount + 1,
            lastUpdatedAt: new Date().toISOString(),
            timeline: updatedTimeline,
          };
        }
        return r;
      })
    );
    showToast('Repair verified and marked Kaam Ho Gaya on public record!');
  };

  // Clear tracked tickets in user storage
  const handleClearTrackers = () => {
    setUserTokenIds([]);
    showToast('Local anonymous ticket vault cleared.');
  };

  // Filter and sort reports
  const filteredReports = reports.filter((report) => {
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        report.title.toLowerCase().includes(q) ||
        report.description.toLowerCase().includes(q) ||
        report.id.toLowerCase().includes(q) ||
        report.location.address.toLowerCase().includes(q) ||
        report.location.district.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category
    if (filters.category !== 'all' && report.category !== filters.category) {
      return false;
    }

    // Severity
    if (filters.severity !== 'all' && report.severity !== filters.severity) {
      return false;
    }

    // Status
    if (filters.status !== 'all' && report.status !== filters.status) {
      return false;
    }

    // District
    if (filters.district !== 'all' && !report.location.district.includes(filters.district)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'urgency') {
      const scoreA = a.aiAssessment?.hazardScore || 50;
      const scoreB = b.aiAssessment?.hazardScore || 50;
      return scoreB - scoreA;
    }
    if (filters.sortBy === 'confirmations') {
      return b.confirmationsCount - a.confirmationsCount;
    }
    if (filters.sortBy === 'newest') {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    }
    return 0;
  });

  const openIssuesCount = reports.filter((r) => r.status !== 'resolved').length;
  const criticalIssuesCount = reports.filter((r) => r.severity === 'critical' && r.status !== 'resolved').length;

  // 1. Loading state while Firebase Auth initializes
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 shadow-xl">
          <AlertTriangle className="w-6 h-6 text-amber-400 stroke-[2.2] animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>Connecting to Fixora Nagar Nigam Grid...</span>
        </div>
      </div>
    );
  }

  // 2. Authentication Gate: Show Sign In / Sign Up page if not logged in
  if (!currentUser) {
    return <AuthPage onMunicipalityDirectAuth={handleMunicipalityDirectAuth} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        savedTokensCount={userTokenIds.length}
        openIssuesCount={openIssuesCount}
        currentUser={currentUser}
        isMunicipality={isMunicipality}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Civic Headline Pulse Bar (Shown on Feed & Map) */}
        {(activeTab === 'feed' || activeTab === 'map') && (
          <section className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                    <span>Nagar Nigam Ward Hazard Radar</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                      दिल्ली / NCR
                    </span>
                  </h1>
                  <span className="text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                    {criticalIssuesCount} Khatarnak Issues
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Citizens submit anonymous photo evidence of potholes, water leaks, and hanging wires. Nagar Nigam & PWD are held to strict Citizen Charter SLA rules.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-end">
              <div className="text-right hidden sm:block">
                <div className="font-mono font-bold text-slate-900">3.4 Din (Days)</div>
                <div className="text-[11px] text-slate-400">Avg City Niptara</div>
              </div>
              <div className="h-7 w-[1px] bg-slate-200 hidden sm:block" />
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Report Gadda (बिना लॉगिन)</span>
              </button>
            </div>
          </section>
        )}

        {/* VIEW 1: Live Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            
            {/* Filter & Search Toolbar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search query */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    placeholder="Search by gadda, colony, chowk, nukkad, or ticket ID (e.g. DL-9412-W2)..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-slate-500"
                  />
                  {filters.searchQuery && (
                    <button
                      onClick={() => setFilters({ ...filters, searchQuery: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 shrink-0 hidden sm:inline">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-500"
                  >
                    <option value="urgency">Highest Hazard Risk (सबसे गंभीर)</option>
                    <option value="confirmations">Most Janta Votes (सर्वाधिक वोट)</option>
                    <option value="newest">Most Recent (ताज़ा शिकायतें)</option>
                  </select>
                </div>
              </div>

              {/* Segmented Filter Selectors */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {/* District Filter */}
                <select
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">All Wards / Zones (सारे वार्ड)</option>
                  <option value="Ward 1">Ward 1 - Central Zone (Connaught Place)</option>
                  <option value="Ward 2">Ward 2 - South Zone (Lajpat Nagar)</option>
                  <option value="Ward 3">Ward 3 - West Zone (Karol Bagh)</option>
                  <option value="Ward 4">Ward 4 - North Zone (Chandni Chowk)</option>
                  <option value="Ward 5">Ward 5 - Rohini Zone (Pitampura)</option>
                </select>

                {/* Category Filter */}
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value as any })}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">All Categories (सारे मुद्दे)</option>
                  {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>

                {/* Severity Filter */}
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value as any })}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">All Severity (जोखिम स्तर)</option>
                  <option value="critical">Khatarnak (अति गंभीर)</option>
                  <option value="high">Jaldi Dhyan (उच्च प्राथमिकता)</option>
                  <option value="moderate">Madhyam (सामान्य)</option>
                  <option value="low">Halka Kam (अल्प)</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">All Statuses (सभी स्थितियां)</option>
                  <option value="reported">Grievance Lodged (दर्ज)</option>
                  <option value="dispatched">Crew Rawana (रवाना)</option>
                  <option value="in_progress">Kaam Chalu Hai (प्रगति पर)</option>
                  <option value="resolved">Kaam Ho Gaya (पूर्ण)</option>
                </select>

                {/* Reset Filters */}
                {(filters.searchQuery || filters.district !== 'all' || filters.category !== 'all' || filters.severity !== 'all' || filters.status !== 'all') && (
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        category: 'all',
                        severity: 'all',
                        status: 'all',
                        district: 'all',
                        sortBy: 'urgency',
                      })
                    }
                    className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 ml-auto"
                  >
                    Reset all filters (फ़िल्टर हटाएं)
                  </button>
                )}
              </div>
            </div>

            {/* Incidents Grid */}
            {filteredReports.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800">Koi Shikayat Nahi Mili</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No public reports matched your current ward or category filters. Try adjusting your search query.
                </p>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                >
                  Naya Gadda / Hazard Report Karein
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <IncidentCard
                    key={report.id}
                    report={report}
                    onSelectReport={(r) => setSelectedReportForDossier(r)}
                    onVoteConfirm={handleVoteConfirm}
                    onVoteStillBroken={handleVoteStillBroken}
                    onOpenExportModal={(r) => setSelectedReportForExport(r)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: Ward Interactive Radar Map */}
        {activeTab === 'map' && (
          <InteractiveMap
            reports={reports}
            onSelectReport={(r) => setSelectedReportForDossier(r)}
          />
        )}

        {/* VIEW 3: Leadership Scoreboard */}
        {activeTab === 'leadership' && (
          <LeadershipScoreboard
            departments={DEPARTMENTS}
            officials={COUNCIL_OFFICIALS}
            reports={reports}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectOfficialPetition={(official) => setPetitionOfficial(official)}
          />
        )}

        {/* VIEW 4: Anonymous Trackers / My Tickets */}
        {activeTab === 'trackers' && (
          <AnonymousTrackerDrawer
            reports={reports}
            userTokenIds={userTokenIds}
            onSelectReport={(r) => setSelectedReportForDossier(r)}
            onClearTrackers={handleClearTrackers}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {/* VIEW 5: Municipality Corporation Portal - Restricted strictly to mayank54421@gmail.com */}
        {activeTab === 'municipality' && (
          isMunicipality ? (
            <MunicipalityPortal
              reports={reports}
              officerEmail={currentUser.email || 'mayank54421@gmail.com'}
              onUpdateReportStatus={handleUpdateReportStatusByMunicipality}
              onSelectReportForDossier={(r) => setSelectedReportForDossier(r)}
              onOpenExportModal={(r) => setSelectedReportForExport(r)}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-xl text-slate-900">
                  403 Forbidden: Municipal Access Denied (केवल अधिकारी)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The Municipality Portal can only be accessed by the authorized Municipal Corporation Officer (<strong className="text-slate-900">mayank54421@gmail.com</strong>). Regular citizen accounts cannot access this command cell.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                >
                  Return to Citizen Dashboard (नागरिक डैशबोर्ड)
                </button>
              </div>
            </div>
          )
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200/90 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Fixora · Nagar Nigam Public Registry</span>
            <span>·</span>
            <span>Anonymous Civic Grievance & Ward Parshad Accountability Portal</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Zero Personal Logs (100% Anonymous)</span>
            <span>·</span>
            <span>EXIF Sanitized</span>
            <span>·</span>
            <span>Swachhata & Jan-Seva Transparency</span>
          </div>
        </div>
      </footer>

      {/* MODAL: Report Damage */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddNewReport}
      />

      {/* MODAL: Incident Dossier Details */}
      <IncidentDetailModal
        report={selectedReportForDossier}
        onClose={() => setSelectedReportForDossier(null)}
        onVoteConfirm={handleVoteConfirm}
        onVoteStillBroken={handleVoteStillBroken}
        onMarkResolvedWithProof={handleMarkResolvedWithProof}
        onOpenExportModal={(r) => setSelectedReportForExport(r)}
      />

      {/* MODAL: Work Order / PDF Export */}
      <WorkOrderExportModal
        report={selectedReportForExport}
        onClose={() => setSelectedReportForExport(null)}
      />

      {/* MODAL: Petition Ward Official */}
      {petitionOfficial && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900">
                Official Jan-Yachika Petition (वार्ड पार्षद ज्ञापन)
              </h3>
              <button
                onClick={() => setPetitionOfficial(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-slate-900">{petitionOfficial.name}</div>
              <div className="text-slate-600">{petitionOfficial.role}</div>
              <div className="text-slate-500 font-mono">Public Helpline Desk: {petitionOfficial.publicPhone}</div>
            </div>

            <div className="text-xs text-slate-700 space-y-2 bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 leading-relaxed font-mono">
              <p>SEVA MEIN (सेवा में): Respected Ward Parshad {petitionOfficial.name} Ji,</p>
              <p>Subject: Citizen Demand for Immediate Public Infrastructure Hazard Remediation in {petitionOfficial.district}</p>
              <p>
                As residents of {petitionOfficial.district}, we formally alert your office to unaddressed public hazards recorded on the Fixora Nagar Nigam registry. We kindly request an immediate PWD / Municipal inspection and time-bound SLA redressal.
              </p>
              <p>Pranam & Regards: Concerned Ward Citizens (जागरूक नागरिक)</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const petitionText = `SEVA MEIN (सेवा में):\nRespected Ward Parshad ${petitionOfficial.name} Ji,\n\nSubject: Citizen Demand for Hazard Remediation in ${petitionOfficial.district}\n\nAs residents of ${petitionOfficial.district}, we formally bring to your notice unaddressed public hazards recorded on the Fixora Nagar Nigam registry. We request an immediate PWD / Municipal inspection and time-bound SLA redressal.\n\nPranam & Regards,\nConcerned Ward Citizens (जागरूक नागरिक)`;
                  navigator.clipboard.writeText(petitionText);
                  setCopiedPetition(true);
                  setTimeout(() => setCopiedPetition(false), 2500);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedPetition ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPetition ? 'Copied Petition Memo' : 'Copy Formal Notice Memo (कॉपी करें)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
