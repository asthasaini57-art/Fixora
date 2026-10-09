import React, { useState } from 'react';
import { 
  BarChart3, 
  Award, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Send, 
  ChevronRight, 
  TrendingUp,
  FileText,
  Mail,
  Phone,
  ShieldAlert
} from 'lucide-react';
import { Department, CouncilOfficial, DamageReport } from '../types';
import { DEPARTMENTS, COUNCIL_OFFICIALS } from '../data/seedData';

interface LeadershipScoreboardProps {
  departments: Department[];
  officials: CouncilOfficial[];
  reports: DamageReport[];
  onOpenReportModal: () => void;
  onSelectOfficialPetition: (official: CouncilOfficial) => void;
}

export const LeadershipScoreboard: React.FC<LeadershipScoreboardProps> = ({
  departments,
  officials,
  reports,
  onOpenReportModal,
  onSelectOfficialPetition,
}) => {
  const [selectedTab, setSelectedTab] = useState<'departments' | 'representatives'>('departments');

  // Calculate citywide averages
  const totalReportsCount = departments.reduce((acc, d) => acc + d.totalReports, 0);
  const totalResolvedCount = departments.reduce((acc, d) => acc + d.resolvedReports, 0);
  const avgCitywideResolutionDays = (
    departments.reduce((acc, d) => acc + d.averageResolutionDays, 0) / departments.length
  ).toFixed(1);
  const avgSla = Math.round(
    departments.reduce((acc, d) => acc + d.slaComplianceRate, 0) / departments.length
  );

  // Sorted departments by SLA
  const sortedDepts = [...departments].sort((a, b) => b.slaComplianceRate - a.slaComplianceRate);
  const sortedOfficials = [...officials].sort((a, b) => b.citizenApprovalRating - a.citizenApprovalRating);

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Executive Civic Pulse */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Nagar Nigam Accountability Dashboard</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-600 font-medium">Live Citizen SLA Audit Cycle 2026 (जनता रिपोर्ट कार्ड)</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Ward Parshad & Department Response Scoreboard</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every citizen complaint sets the government clock running. PWD, Jal Board, BSES, and Ward Parshads (Corporators) are audited publicly on their resolution speed, backlog clearance, and Citizen Charter compliance.
          </p>
        </div>

        {/* High-level Metric Stat Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Citywide Kaam Ho Gaya</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              {Math.round((totalResolvedCount / totalReportsCount) * 100)}%
            </div>
            <span className="text-[11px] text-slate-500">{totalResolvedCount} of {totalReportsCount} solved</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Avg Niptara (Fix Time)</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              {avgCitywideResolutionDays} <span className="text-base font-normal text-slate-400">days</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Citizen Target: &lt; 5 days</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">On-Time SLA Rate</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              {avgSla}%
            </div>
            <span className="text-[11px] text-slate-500">Citizen Charter compliance</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Top Performing Vibhag</span>
            <div className="font-display font-bold text-lg text-slate-900 truncate">
              {sortedDepts[0].shortCode}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">{sortedDepts[0].averageResolutionDays}d avg ({sortedDepts[0].responsivenessGrade})</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedTab('departments')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              selectedTab === 'departments'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nagar Nigam Vibhag ({departments.length})
          </button>
          <button
            onClick={() => setSelectedTab('representatives')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              selectedTab === 'representatives'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ward Parshads & Corporators ({officials.length})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Ranked by citizen verified resolution & responsiveness (जनता रेटिंग)
        </div>
      </div>

      {/* View: Municipal Agencies Table */}
      {selectedTab === 'departments' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Vibhag & Chief Engineer</th>
                  <th className="px-6 py-4">Responsiveness</th>
                  <th className="px-6 py-4">Avg Niptara (Days)</th>
                  <th className="px-6 py-4">SLA Compliance</th>
                  <th className="px-6 py-4">Kaam Ho Gaya vs Active</th>
                  <th className="px-6 py-4 text-right">Helpline & Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedDepts.map((dept, idx) => {
                  const resolutionPct = Math.round((dept.resolvedReports / dept.totalReports) * 100);
                  const openCount = dept.totalReports - dept.resolvedReports;

                  let gradeColor = 'bg-slate-100 text-slate-800';
                  if (dept.responsivenessGrade === 'A+' || dept.responsivenessGrade === 'A') {
                    gradeColor = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
                  } else if (dept.responsivenessGrade === 'B+' || dept.responsivenessGrade === 'B') {
                    gradeColor = 'bg-sky-50 text-sky-800 border border-sky-200';
                  } else {
                    gradeColor = 'bg-amber-50 text-amber-800 border border-amber-200';
                  }

                  return (
                    <tr key={dept.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Official */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs text-slate-400 font-bold mt-1">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{dept.name}</div>
                            <div className="text-xs text-slate-500">
                              Adhikari: {dept.headOfficial} ({dept.title})
                            </div>
                            <span className="font-mono text-[11px] text-slate-400">Budget: {dept.budgetAllocation}</span>
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="px-6 py-4">
                        <span className={`inline-block font-mono font-bold text-xs px-2.5 py-1 rounded-md ${gradeColor}`}>
                          Grade {dept.responsivenessGrade}
                        </span>
                      </td>

                      {/* Avg Fix Time */}
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-slate-900">{dept.averageResolutionDays} days</div>
                        <span className="text-[11px] text-slate-400">from complaint to verified fix</span>
                      </td>

                      {/* SLA Compliance */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                dept.slaComplianceRate >= 90 ? 'bg-emerald-500' : dept.slaComplianceRate >= 80 ? 'bg-sky-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${dept.slaComplianceRate}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-xs text-slate-800">{dept.slaComplianceRate}%</span>
                        </div>
                      </td>

                      {/* Counts */}
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-700">
                          <span className="font-semibold text-emerald-600">{dept.resolvedReports} kaam ho gaya</span>
                          <span className="text-slate-300 mx-1">/</span>
                          <span className="text-slate-500">{openCount} bacha hai</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{resolutionPct}% clearance rate</div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 text-right">
                        <div className="text-xs space-y-0.5">
                          <div className="font-mono text-slate-800 font-semibold">{dept.emergencyPhone}</div>
                          <a href={`mailto:${dept.contactEmail}`} className="text-slate-500 hover:text-slate-900 truncate block text-[11px]">
                            {dept.contactEmail}
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Ward Council Representatives Grid */}
      {selectedTab === 'representatives' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOfficials.map((rep, idx) => {
            const clearanceRate = Math.round((rep.resolvedReports / rep.totalDistrictReports) * 100);
            return (
              <div
                key={rep.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Avatar & Rank */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rep.avatarUrl}
                        alt={rep.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                          {rep.district}
                        </span>
                        <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                          {rep.name}
                        </h3>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2">
                    {rep.role}
                  </p>
                </div>

                {/* Scorecard metrics */}
                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Janta Vishwas (Citizen Approval)</span>
                    <span className="font-mono font-bold text-slate-900">{rep.citizenApprovalRating}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Ward Niptara Time</span>
                    <span className="font-mono font-bold text-slate-900">~{rep.avgResponseDays} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Shikayat Kaam Ho Gaya</span>
                    <span className="font-mono font-bold text-slate-900">
                      {rep.resolvedReports} / {rep.totalDistrictReports} ({clearanceRate}%)
                    </span>
                  </div>
                </div>

                {/* Contact info & Action button */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate">{rep.officeLocation}</span>
                    <span className="font-mono text-slate-700">{rep.publicPhone}</span>
                  </div>

                  <button
                    onClick={() => onSelectOfficialPetition(rep)}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Jan-Yachika Petition to Parshad Ji</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Backlog Alert & Whistleblower Notice */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 sm:p-6 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm text-amber-900">Ward 4 (Chandni Chowk / Old Delhi) Pendency Watch</h4>
            <p className="text-amber-800 leading-relaxed max-w-xl">
              Average resolution turnaround in Ward 4 is currently 7.2 days, exceeding the 5-day Nagar Nigam SLA benchmark. Citizens can escalate unaddressed pothole and water leakage reports to Ward Parshad Gurpreet Singh Bhasin.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl font-medium shrink-0 shadow-sm transition-colors"
        >
          Report Unrepaired Gadda / Defect
        </button>
      </div>

    </div>
  );
};
