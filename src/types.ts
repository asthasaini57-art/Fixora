export type HazardSeverity = 'critical' | 'high' | 'moderate' | 'low';

export type ReportStatus = 
  | 'reported' 
  | 'triaged' 
  | 'dispatched' 
  | 'in_progress' 
  | 'resolved' 
  | 'community_verified';

export type HazardCategory = 
  | 'roads_potholes' 
  | 'electrical_power' 
  | 'water_sewage' 
  | 'parks_playgrounds' 
  | 'traffic_signals' 
  | 'sanitation_dumping' 
  | 'structural_sidewalk';

export interface LocationData {
  address: string;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  landmark?: string;
}

export interface TimelineEvent {
  id: string;
  status: ReportStatus;
  timestamp: string;
  author: string;
  notes: string;
  proofImageUrl?: string;
}

export interface AIAssessment {
  hazardScore: number; // 1 - 100
  urgencyLevel: HazardSeverity;
  riskFactors: string[];
  estimatedRepairHours: number;
  estimatedCostRange: string;
  suggestedDepartment: string;
  safetyAdvisory: string;
  officialDispatchCode: string;
  grievanceLetterSummary: string;
}

export interface DamageReport {
  id: string; // e.g. CW-8492-W4
  anonymousToken: string; // Cryptographic tracking token
  title: string;
  description: string;
  category: HazardCategory;
  severity: HazardSeverity;
  status: ReportStatus;
  location: LocationData;
  imageUrl: string;
  afterImageUrl?: string;
  reportedAt: string;
  lastUpdatedAt: string;
  assignedDepartmentId: string;
  councilRepresentativeId: string;
  confirmationsCount: number;
  stillBrokenCount: number;
  verifiedFixedCount: number;
  aiAssessment?: AIAssessment;
  timeline: TimelineEvent[];
  isAnonymousExifStripped: boolean;
}

export interface Department {
  id: string;
  name: string;
  shortCode: string;
  headOfficial: string;
  title: string;
  contactEmail: string;
  emergencyPhone: string;
  totalReports: number;
  resolvedReports: number;
  averageResolutionDays: number;
  slaComplianceRate: number; // e.g. 88%
  budgetAllocation: string;
  responsivenessGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
}

export interface CouncilOfficial {
  id: string;
  name: string;
  role: string;
  district: string;
  officeLocation: string;
  publicPhone: string;
  totalDistrictReports: number;
  resolvedReports: number;
  avgResponseDays: number;
  citizenApprovalRating: number; // 0 - 100%
  avatarUrl: string;
}

export interface FilterState {
  searchQuery: string;
  category: HazardCategory | 'all';
  severity: HazardSeverity | 'all';
  status: ReportStatus | 'all';
  district: string | 'all';
  sortBy: 'urgency' | 'newest' | 'confirmations' | 'resolution_speed';
}
