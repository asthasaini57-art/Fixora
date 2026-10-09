import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  BarChart3, 
  Plus, 
  Search, 
  FileText, 
  Compass, 
  AlertTriangle, 
  LogOut, 
  User as UserIcon, 
  Building2 
} from 'lucide-react';
import { User } from '../services/firebase';

interface NavbarProps {
  activeTab: 'feed' | 'map' | 'leadership' | 'trackers' | 'municipality';
  setActiveTab: (tab: 'feed' | 'map' | 'leadership' | 'trackers' | 'municipality') => void;
  onOpenReportModal: () => void;
  savedTokensCount: number;
  openIssuesCount: number;
  currentUser?: User | null;
  isMunicipality?: boolean;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  savedTokensCount,
  openIssuesCount,
  currentUser,
  isMunicipality,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Anonymity Assurance */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-slate-800 transition-colors">
                <AlertTriangle className="w-5 h-5 text-amber-400 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg text-slate-900 tracking-tight">Fixora</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">नगर निगम</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none hidden sm:block">Public Damage & Ward Leadership Accountability</p>
              </div>
            </button>

            {/* Guaranteed Anonymity Shield Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Anonymous (गोपनीय)</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">EXIF Scrubbed</span>
            </div>
          </div>

          {/* Navigation Segments */}
          <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'feed'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Janta Complaints</span>
              <span className="hidden md:inline-block font-mono text-xs text-slate-400">({openIssuesCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Ward Radar Map</span>
            </button>

            <button
              onClick={() => setActiveTab('leadership')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'leadership'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Report Card</span>
            </button>

            <button
              onClick={() => setActiveTab('trackers')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'trackers'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Mera Vault</span>
              <span className="sm:hidden">Vault</span>
              {savedTokensCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                  {savedTokensCount}
                </span>
              )}
            </button>

            {/* Municipality Corporation Portal Tab - Strictly restricted to authorized officer */}
            {isMunicipality && (
              <button
                onClick={() => setActiveTab('municipality')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'municipality'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold ring-1 ring-amber-600'
                    : 'text-amber-900 bg-amber-100/90 hover:bg-amber-200/90 font-semibold'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-900" />
                <span className="hidden md:inline">Nagar Nigam Cell</span>
                <span className="md:hidden">Nagar Nigam</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse hidden sm:inline-block" />
              </button>
            )}
          </nav>

          {/* Action Call to Action & Auth Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all hover:shadow active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Report Gadda</span>
              <span className="text-[11px] font-normal text-amber-300 hidden sm:inline">(Anonymous)</span>
            </button>

            {currentUser && onSignOut && (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
                <div 
                  title={currentUser.email || (currentUser.isAnonymous ? 'Anonymous Citizen' : 'Civic Member')}
                  className={`hidden md:flex items-center gap-1.5 text-xs py-1.5 px-2.5 rounded-lg max-w-[170px] truncate ${
                    isMunicipality 
                      ? 'bg-amber-100/90 text-amber-950 font-bold border border-amber-300/80' 
                      : 'bg-slate-100 text-slate-600 font-medium'
                  }`}
                >
                  {isMunicipality ? (
                    <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className="truncate">
                    {isMunicipality 
                      ? 'Adhikari Mayank' 
                      : (currentUser.isAnonymous 
                          ? 'Aam Aadmi (Guest)' 
                          : (currentUser.email ? currentUser.email.split('@')[0] : 'Citizen'))}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSignOut();
                  }}
                  title="Sign out of Fixora"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
