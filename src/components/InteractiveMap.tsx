import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  Filter,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { DamageReport, HazardCategory, HazardSeverity } from '../types';
import { CATEGORY_LABELS, SEVERITY_CONFIG, formatTimeAgo } from '../utils/formatters';

interface InteractiveMapProps {
  reports: DamageReport[];
  onSelectReport: (report: DamageReport) => void;
  onOpenReportModalWithLocation?: (lat: number, lng: number, district: string) => void;
}

// Bounding box for Delhi / NCR municipal ward coordinates
const MAP_BOUNDS = {
  minLat: 28.520,
  maxLat: 28.720,
  minLng: 77.060,
  maxLng: 77.280,
};

// District zones on the SVG map
const DISTRICT_REGIONS = [
  { id: 'Ward 1', name: 'Ward 1 - Central Zone (Connaught Place / ITO)', x: '45%', y: '36%', width: '24%', height: '22%', color: 'rgba(59, 130, 246, 0.08)', stroke: '#3b82f6' },
  { id: 'Ward 2', name: 'Ward 2 - South Zone (Lajpat Nagar / Ring Road)', x: '52%', y: '60%', width: '30%', height: '32%', color: 'rgba(14, 165, 233, 0.08)', stroke: '#0ea5e9' },
  { id: 'Ward 3', name: 'Ward 3 - West Zone (Karol Bagh / Patel Nagar)', x: '22%', y: '34%', width: '25%', height: '28%', color: 'rgba(34, 197, 94, 0.08)', stroke: '#22c55e' },
  { id: 'Ward 4', name: 'Ward 4 - North Zone (Chandni Chowk / Old Delhi)', x: '46%', y: '16%', width: '26%', height: '22%', color: 'rgba(249, 115, 22, 0.08)', stroke: '#f97316' },
  { id: 'Ward 5', name: 'Ward 5 - Rohini Zone (Pitampura / Ring Road)', x: '12%', y: '10%', width: '32%', height: '25%', color: 'rgba(168, 85, 247, 0.08)', stroke: '#a855f7' },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  reports,
  onSelectReport,
  onOpenReportModalWithLocation,
}) => {
  const [selectedReport, setSelectedReport] = useState<DamageReport | null>(null);
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(true);

  // Filter reports
  const filteredReports = reports.filter((report) => {
    if (districtFilter !== 'all' && !report.location.district.includes(districtFilter)) return false;
    if (categoryFilter !== 'all' && report.category !== categoryFilter) return false;
    if (!showResolved && report.status === 'resolved') return false;
    return true;
  });

  // Calculate percentage positioning based on lat/lng
  const getMapPosition = (lat: number, lng: number) => {
    const latPercent = ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
    const lngPercent = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;

    // Y is inverted because map top = higher latitude
    const top = Math.max(8, Math.min(92, 100 - latPercent));
    const left = Math.max(8, Math.min(92, lngPercent));

    return { top: `${top}%`, left: `${left}%` };
  };

  const criticalCount = filteredReports.filter((r) => r.severity === 'critical').length;
  const highCount = filteredReports.filter((r) => r.severity === 'high').length;

  return (
    <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white min-h-[640px] flex flex-col">
      
      {/* Top Map Control Bar */}
      <div className="z-20 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
              <span>Nagar Nigam Ward Hazard Radar</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">वार्ड रडार</span>
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{filteredReports.length} Public Complaints (जनता शिकायतें)</span>
              <span>·</span>
              <span className="text-red-400 font-medium">{criticalCount} Khatarnak</span>
              <span>·</span>
              <span className="text-amber-400 font-medium">{highCount} Jaldi Dhyan Dein</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* District selector */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-500"
          >
            <option value="all">All Wards (Sabhi Ward)</option>
            <option value="Ward 1">Ward 1 (Connaught Place / Central)</option>
            <option value="Ward 2">Ward 2 (Lajpat Nagar / South)</option>
            <option value="Ward 3">Ward 3 (Karol Bagh / West)</option>
            <option value="Ward 4">Ward 4 (Chandni Chowk / North)</option>
            <option value="Ward 5">Ward 5 (Rohini / Pitampura)</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-500 max-w-[180px] truncate"
          >
            <option value="all">All Categories (सारे मुद्दे)</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Toggle resolved */}
          <button
            onClick={() => setShowResolved(!showResolved)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              showResolved 
                ? 'bg-slate-800 text-slate-300 border-slate-700' 
                : 'bg-slate-800/40 text-slate-500 border-slate-800'
            }`}
          >
            {showResolved ? 'Hide Kaam Ho Gaya' : 'Show Kaam Ho Gaya'}
          </button>
        </div>
      </div>

      {/* Map Canvas / SVG Viewport */}
      <div className="relative flex-1 w-full bg-[#0b1320] overflow-hidden select-none">
        
        {/* Background Grid & Geographical Terrain Elements */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Yamuna River flowing along the East side */}
          <path
            d="M 720 0 C 690 140, 780 280, 750 440 C 730 550, 790 680, 830 800"
            fill="none"
            stroke="rgba(14, 165, 233, 0.35)"
            strokeWidth="14"
          />
          <text x="765" y="240" fill="rgba(56, 189, 248, 0.6)" fontSize="10" fontFamily="sans-serif" letterSpacing="3">
            YAMUNA RIVER (यमुना नदी)
          </text>

          {/* Primary Arterial Roads (Ring Road, Outer Ring Road, GT Road) */}
          {/* Ring Road loop */}
          <ellipse cx="480" cy="400" rx="280" ry="210" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="3.5" fill="none" />
          <text x="230" y="380" fill="rgba(255, 255, 255, 0.35)" fontSize="9" fontFamily="sans-serif">
            INNER RING ROAD
          </text>
          
          {/* Outer Ring Road */}
          <path d="M 50 180 Q 420 80 850 300" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="2.5" fill="none" />
          <text x="120" y="160" fill="rgba(255, 255, 255, 0.3)" fontSize="9" fontFamily="sans-serif">
            OUTER RING ROAD / MADHUBAN CHOWK
          </text>

          {/* Grand Trunk Road / Mathura Road */}
          <path d="M 490 0 L 490 800" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="3" fill="none" />
          <text x="500" y="700" fill="rgba(255, 255, 255, 0.3)" fontSize="9" fontFamily="sans-serif">
            MATHURA ROAD / ASHRAM CHOWK
          </text>

          {/* West-East Pusa Road / Vikas Marg */}
          <path d="M 0 420 Q 480 390 1000 440" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" fill="none" />
          <text x="40" y="440" fill="rgba(255, 255, 255, 0.3)" fontSize="9" fontFamily="sans-serif">
            PUSA ROAD & VIKAS MARG
          </text>
        </svg>

        {/* District Ward Polygons / Labels */}
        {DISTRICT_REGIONS.map((region) => (
          <div
            key={region.id}
            style={{
              position: 'absolute',
              left: region.x,
              top: region.y,
              width: region.width,
              height: region.height,
              backgroundColor: region.color,
              border: `1px dashed ${region.stroke}33`,
              borderRadius: '16px',
            }}
            className="pointer-events-none p-3 transition-opacity opacity-75"
          >
            <span
              style={{ color: region.stroke }}
              className="font-mono text-[10px] uppercase font-bold tracking-wider block"
            >
              {region.name}
            </span>
          </div>
        ))}

        {/* Clickable Hazard Marker Pins */}
        {filteredReports.map((report) => {
          const pos = getMapPosition(report.location.coordinates.lat, report.location.coordinates.lng);
          const isCritical = report.severity === 'critical';
          const isSelected = selectedReport?.id === report.id;
          const isResolved = report.status === 'resolved';

          let pinBg = 'bg-sky-500';
          if (isResolved) pinBg = 'bg-emerald-500';
          else if (isCritical) pinBg = 'bg-red-500';
          else if (report.severity === 'high') pinBg = 'bg-amber-500';

          return (
            <div
              key={report.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
              onClick={() => setSelectedReport(report)}
            >
              {/* Pulsing ring for critical issues */}
              {isCritical && !isResolved && (
                <span className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping opacity-75 pointer-events-none" />
              )}

              {/* Pin circle */}
              <div
                className={`relative w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-125 ${
                  isSelected ? 'ring-4 ring-white scale-125' : ''
                } ${pinBg}`}
              >
                {isResolved ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-white" />
                )}
              </div>

              {/* Floating Mini Hover Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden group-hover:block bg-slate-900/95 backdrop-blur-sm border border-slate-700 text-white px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap shadow-xl pointer-events-none z-40">
                <span className="font-mono font-bold mr-1">{report.id}</span>
                <span>{report.title.slice(0, 26)}...</span>
              </div>
            </div>
          );
        })}

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-4 z-20 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Khatarnak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Jaldi Dhyan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Madhyam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Kaam Ho Gaya</span>
          </div>
        </div>

        {/* Selected Incident Drawer / Card Overlay */}
        {selectedReport && (
          <div className="absolute bottom-4 right-4 z-40 max-w-sm w-full bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            <div className="relative h-28 w-full bg-slate-100">
              <img
                src={selectedReport.imageUrl}
                alt={selectedReport.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 font-mono text-[10px] bg-slate-900/90 text-white px-2 py-0.5 rounded">
                <span>{selectedReport.id}</span>
              </div>
            </div>

            <div className="p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{CATEGORY_LABELS[selectedReport.category]}</span>
                <span>·</span>
                <span>{selectedReport.location.district.split(' - ')[0]}</span>
              </div>

              <h4 className="font-display font-bold text-sm text-slate-900 leading-snug">
                {selectedReport.title}
              </h4>

              <div className="text-xs text-slate-600 flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{selectedReport.location.address}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  {selectedReport.confirmationsCount} confirmations (नागरिक पुष्टि)
                </span>
                <button
                  onClick={() => onSelectReport(selectedReport)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Open Dossier (विवरण)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
