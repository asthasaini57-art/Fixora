import { HazardCategory, HazardSeverity, ReportStatus } from '../types';

export const CATEGORY_LABELS: Record<HazardCategory, string> = {
  roads_potholes: 'Gadda & Sadak Damage (गड्ढा व सड़क)',
  electrical_power: 'Nangi Taar & Pole (बिजली की नंगी तारें)',
  water_sewage: 'Jal Board Leak & Seepage (जल रिसाव व सीवर)',
  parks_playgrounds: 'Park, Bagh & Toota Jhula (पार्क व झूले)',
  traffic_signals: 'Traffic Battī & Chowk Signal (ट्रैफिक बत्ती)',
  sanitation_dumping: 'Kachra, Malba & Dhalao (कचरा व मलबा)',
  structural_sidewalk: 'Footpath & Paver Blocks (टूटा फुटपाथ)',
};

export const SEVERITY_CONFIG: Record<
  HazardSeverity,
  { label: string; textClass: string; bgClass: string; dotClass: string }
> = {
  critical: {
    label: 'Khatarnak (अति गंभीर)',
    textClass: 'text-red-700',
    bgClass: 'bg-red-50 text-red-700 border-red-200',
    dotClass: 'bg-red-600',
  },
  high: {
    label: 'Jaldi Dhyan Dein (उच्च प्राथमिकता)',
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  moderate: {
    label: 'Madhyam (सामान्य स्थिति)',
    textClass: 'text-sky-700',
    bgClass: 'bg-sky-50 text-sky-700 border-sky-200',
    dotClass: 'bg-sky-500',
  },
  low: {
    label: 'Halka Kam (अल्प मरम्मत)',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
};

export const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; textClass: string; bgClass: string }
> = {
  reported: {
    label: 'Grievance Lodged (दर्ज)',
    textClass: 'text-slate-600',
    bgClass: 'bg-slate-100 text-slate-700',
  },
  triaged: {
    label: 'Adhikari dwara Triaged (जांचा गया)',
    textClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50 text-indigo-700',
  },
  dispatched: {
    label: 'Crew Rawana (दल रवाना)',
    textClass: 'text-amber-600',
    bgClass: 'bg-amber-50 text-amber-800',
  },
  in_progress: {
    label: 'Kaam Chalu Hai (मरम्मत प्रगति पर)',
    textClass: 'text-amber-700 font-bold',
    bgClass: 'bg-amber-50 text-amber-900 border border-amber-300',
  },
  resolved: {
    label: 'Kaam Ho Gaya (Work Done / पूर्ण)',
    textClass: 'text-emerald-700 font-bold',
    bgClass: 'bg-emerald-50 text-emerald-900 border border-emerald-300',
  },
  community_verified: {
    label: 'Janta dwara Verified (सत्यापित)',
    textClass: 'text-teal-700',
    bgClass: 'bg-teal-50 text-teal-800',
  },
};

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'Just abhi (Just now)';
    if (diffMins < 60) return `${diffMins} min pehle`;
    if (diffHours < 24) return `${diffHours} ghante pehle`;
    if (diffDays === 1) return 'Kal (Yesterday)';
    if (diffDays < 30) return `${diffDays} din pehle`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'Holi-me (Recently)';
  }
}

export function generateReportId(districtNum: number = 1): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `DL-${randNum}-W${districtNum}`;
}

export function generateAnonymousToken(): string {
  const chars = '0123456789abcdef';
  let token = 'anon_in_';
  for (let i = 0; i < 16; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
