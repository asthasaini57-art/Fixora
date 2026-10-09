import React, { useState } from 'react';
import { 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Building2, 
  ArrowRight, 
  FileText, 
  Shield, 
  UserCheck
} from 'lucide-react';
import { DamageReport } from '../types';
import { CATEGORY_LABELS, SEVERITY_CONFIG, STATUS_CONFIG, formatTimeAgo } from '../utils/formatters';
import { DEPARTMENTS, COUNCIL_OFFICIALS } from '../data/seedData';

interface IncidentCardProps {
  report: DamageReport;
  onSelectReport: (report: DamageReport) => void;
  onVoteConfirm: (reportId: string) => void;
  onVoteStillBroken: (reportId: string) => void;
  onOpenExportModal: (report: DamageReport) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  report,
  onSelectReport,
  onVoteConfirm,
  onVoteStillBroken,
  onOpenExportModal,
}) => {
  const [showAfterImage, setShowAfterImage] = useState(false);
  const dept = DEPARTMENTS.find((d) => d.id === report.assignedDepartmentId);
  const rep = COUNCIL_OFFICIALS.find((c) => c.id === report.councilRepresentativeId);
  const severityInfo = SEVERITY_CONFIG[report.severity];
  const statusInfo = STATUS_CONFIG[report.status];

  return (
    <article className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col group">
      
      {/* Visual Image Banner with Before/After Toggle if resolved */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
        <img
          src={showAfterImage && report.afterImageUrl ? report.afterImageUrl : report.imageUrl}
          alt={report.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Top Floating Overlay */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Severity & Anonymous ID */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="font-mono text-[11px] font-bold bg-slate-900/85 text-white backdrop-blur-xs px-2 py-0.5 rounded-md">
              {report.id}
            </span>
            <span className={`text-[11px] font-semibold backdrop-blur-xs px-2 py-0.5 rounded-md bg-white/90 ${severityInfo.textClass}`}>
              {severityInfo.label}
            </span>
          </div>

          {/* Anonymity Shield Marker */}
          {report.isAnonymousExifStripped && (
            <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md pointer-events-auto">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Bilkul Anonymous</span>
            </div>
          )}
        </div>

        {/* Before / After toggle button if resolved */}
        {report.afterImageUrl && (
          <div className="absolute bottom-3 left-3 pointer-events-auto">
            <button
              onClick={() => setShowAfterImage(!showAfterImage)}
              className="px-2.5 py-1 bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-xs rounded-lg text-[11px] font-medium shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>{showAfterImage ? 'Showing: Kaam Ho Gaya' : 'Showing: Pehle Ka Defect'}</span>
              <span className="text-[10px] text-slate-300">· Click to switch</span>
            </button>
          </div>
        )}

        {/* Hazard Score indicator if available */}
        {report.aiAssessment && (
          <div className="absolute bottom-3 right-3 pointer-events-auto bg-white/95 backdrop-blur-xs text-slate-900 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold shadow-2xs">
            Risk: {report.aiAssessment.hazardScore}/100
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        
        <div>
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-700">{CATEGORY_LABELS[report.category]}</span>
            <span aria-hidden="true">·</span>
            <span>{report.location.district.split(' - ')[0]}</span>
            <span aria-hidden="true">·</span>
            <span>{formatTimeAgo(report.reportedAt)}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectReport(report)}
            className="font-display font-bold text-base text-slate-900 hover:text-slate-700 cursor-pointer transition-colors line-clamp-2 leading-snug"
          >
            {report.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* Location & Assigned Dept/Council Rep */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{report.location.address}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[210px]">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{dept?.shortCode || 'PWD / Nagar Nigam'}</span>
              <span>·</span>
              <span className="truncate">{rep?.name || 'Ward Parshad'}</span>
            </div>
            
            {/* Status indicator */}
            <span className={`font-medium ${statusInfo.textClass}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Interactive Civic Action Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          
          {/* Community Votes */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onVoteConfirm(report.id)}
              title="Confirm hazard is real and dangerous (+1 Hai Ji)"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
              <span>{report.confirmationsCount} Hai Ji</span>
            </button>

            {report.status !== 'resolved' && (
              <button
                onClick={() => onVoteStillBroken(report.id)}
                title="Mark that this is still unresolved on the street"
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Abhi Toota</span>
                <span className="font-mono text-[11px]">({report.stillBrokenCount})</span>
              </button>
            )}

            {report.status === 'resolved' && (
              <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{report.verifiedFixedCount} satyapit</span>
              </div>
            )}
          </div>

          {/* Details CTA */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenExportModal(report)}
              title="Print Official Municipal Karyadesh"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectReport(report)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700 pl-1 py-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Vivaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </article>
  );
};
