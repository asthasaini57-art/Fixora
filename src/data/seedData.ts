import { DamageReport, Department, CouncilOfficial } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-pwd',
    name: 'PWD (Public Works Department) Road & Flyover Cell',
    shortCode: 'PWD-DEL',
    headOfficial: 'Er. Rameshwar Sharma (Chief Engineer)',
    title: 'Superintending Engineer (Roads & Bridges Division)',
    contactEmail: 'roads.dispatch@pwd-delhi.gov.in',
    emergencyPhone: '1800-11-0093 / 1077 (Toll-Free)',
    totalReports: 142,
    resolvedReports: 118,
    averageResolutionDays: 3.4,
    slaComplianceRate: 91,
    budgetAllocation: '₹184.5 Cr',
    responsivenessGrade: 'A',
  },
  {
    id: 'dept-djb',
    name: 'Delhi Jal Board (DJB) & Underground Sewerage Authority',
    shortCode: 'DJB-JAL',
    headOfficial: 'Dr. Sunita Deshmukh',
    title: 'Zonal Executive Engineer (Water Supply & Drainage)',
    contactEmail: 'grievances.jalboard@delhi.gov.in',
    emergencyPhone: '1916 (Jal Board 24x7 Helpline)',
    totalReports: 98,
    resolvedReports: 74,
    averageResolutionDays: 5.1,
    slaComplianceRate: 84,
    budgetAllocation: '₹310.2 Cr',
    responsivenessGrade: 'B+',
  },
  {
    id: 'dept-bses',
    name: 'BSES & Nagar Nigam Street Lighting Grid Division',
    shortCode: 'BSES-GRID',
    headOfficial: 'Er. Alok Verma',
    title: 'Superintendent Engineer (High-Voltage & Public Lighting)',
    contactEmail: 'bijli.safety@delhi-power.gov.in',
    emergencyPhone: '19123 (Bijli Helpline)',
    totalReports: 76,
    resolvedReports: 69,
    averageResolutionDays: 2.1,
    slaComplianceRate: 95,
    budgetAllocation: '₹145.8 Cr',
    responsivenessGrade: 'A+',
  },
  {
    id: 'dept-mcd-parks',
    name: 'Nagar Nigam Horticulture & Parks Department (Udyan Vibhag)',
    shortCode: 'MCD-UDYAN',
    headOfficial: 'Smt. Vandana Saxena',
    title: 'Additional Director (Public Parks & Green Belts)',
    contactEmail: 'horticulture.mcd@mcdonline.nic.in',
    emergencyPhone: '155304 (Nagar Nigam Citizen Desk)',
    totalReports: 62,
    resolvedReports: 39,
    averageResolutionDays: 8.7,
    slaComplianceRate: 68,
    budgetAllocation: '₹85.0 Cr',
    responsivenessGrade: 'C',
  },
  {
    id: 'dept-mcd-swachh',
    name: 'Nagar Nigam Sanitation & Swachhata Vibhag (Safai Cell)',
    shortCode: 'MCD-SWACHH',
    headOfficial: 'Shri Rajeshwar Chauhan',
    title: 'Chief Municipal Health Officer & Nodal Swachhata Officer',
    contactEmail: 'swachhata.dispatch@mcdonline.nic.in',
    emergencyPhone: '311 (Swachhata App Helpline)',
    totalReports: 115,
    resolvedReports: 96,
    averageResolutionDays: 4.0,
    slaComplianceRate: 87,
    budgetAllocation: '₹240.0 Cr',
    responsivenessGrade: 'B+',
  },
];

export const COUNCIL_OFFICIALS: CouncilOfficial[] = [
  {
    id: 'rep-ward-1',
    name: 'Ward Parshad Anita Meena',
    role: 'Ward 1 Corporator (Connaught Place & Central Zone)',
    district: 'Ward 1 - Central Zone (Connaught Place / ITO)',
    officeLocation: 'Nagar Nigam Ward Office, Near Minto Road Chowk, New Delhi',
    publicPhone: '+91 98110 42819',
    totalDistrictReports: 88,
    resolvedReports: 79,
    avgResponseDays: 2.8,
    citizenApprovalRating: 92,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'rep-ward-2',
    name: 'Ward Parshad Vikram Malhotra',
    role: 'Ward 2 Corporator (Lajpat Nagar & Defence Colony)',
    district: 'Ward 2 - South Zone (Lajpat Nagar / Ring Road)',
    officeLocation: 'Zonal Municipal Office, Lajpat Nagar IV, New Delhi',
    publicPhone: '+91 98101 55432',
    totalDistrictReports: 114,
    resolvedReports: 82,
    avgResponseDays: 4.6,
    citizenApprovalRating: 78,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'rep-ward-3',
    name: 'Ward Parshad Dr. Preeti Agrawal',
    role: 'Ward 3 Corporator (Karol Bagh & Rajendra Nagar)',
    district: 'Ward 3 - West Zone (Karol Bagh / Patel Nagar)',
    officeLocation: 'MCD Civic Centre Zonal Cell, Pusa Road, New Delhi',
    publicPhone: '+91 98200 91823',
    totalDistrictReports: 73,
    resolvedReports: 66,
    avgResponseDays: 2.4,
    citizenApprovalRating: 94,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'rep-ward-4',
    name: 'Ward Parshad Gurpreet Singh Bhasin',
    role: 'Ward 4 Corporator (Chandni Chowk & Old Delhi)',
    district: 'Ward 4 - North Zone (Chandni Chowk / Old Delhi)',
    officeLocation: 'Historic Town Hall Civic Branch, Chandni Chowk, Delhi',
    publicPhone: '+91 98188 34910',
    totalDistrictReports: 120,
    resolvedReports: 69,
    avgResponseDays: 7.2,
    citizenApprovalRating: 64,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'rep-ward-5',
    name: 'Ward Parshad Manoj Tiwari Sharma',
    role: 'Ward 5 Corporator (Rohini & Pitampura)',
    district: 'Ward 5 - Rohini Zone (Pitampura / Ring Road)',
    officeLocation: 'Sector 9 Nagar Nigam Civic Bhavan, Rohini, Delhi',
    publicPhone: '+91 98711 78201',
    totalDistrictReports: 98,
    resolvedReports: 88,
    avgResponseDays: 3.1,
    citizenApprovalRating: 89,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_REPORTS: DamageReport[] = [
  {
    id: 'DL-9412-W2',
    anonymousToken: 'anon_tx_9412_f7a8b2c',
    title: 'Bhaari Gadda (Severe Road Crater) on Ring Road Bus Corridor',
    description: 'Deep pavement gadda exceeding 9 inches depth on busy DTC bus lane right after flyover descent. Two auto-rickshaws sustained broken suspension axles and a scooterist skidded during morning rush hour. Exposed sariya (rebar rods) visible at base.',
    category: 'roads_potholes',
    severity: 'critical',
    status: 'in_progress',
    location: {
      address: 'Near Moolchand Flyover Underpass, Ring Road, Lajpat Nagar III, New Delhi - 110024',
      district: 'Ward 2 - South Zone (Lajpat Nagar / Ring Road)',
      coordinates: { lat: 28.5670, lng: 77.2430 },
      landmark: 'Beside DMRC Metro Pillar 84, opposite Haldiram’s Chowk',
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    reportedAt: '2026-10-07T14:22:00Z',
    lastUpdatedAt: '2026-10-09T08:15:00Z',
    assignedDepartmentId: 'dept-pwd',
    councilRepresentativeId: 'rep-ward-2',
    confirmationsCount: 46,
    stillBrokenCount: 14,
    verifiedFixedCount: 0,
    isAnonymousExifStripped: true,
    aiAssessment: {
      hazardScore: 94,
      urgencyLevel: 'critical',
      riskFactors: [
        'High-speed auto-rickshaw overturning and two-wheeler rim damage',
        'Heavy DTC bus lane disruption causing 2-km traffic jam',
        'Severe trip hazard for daily pedestrians crossing near bus stand',
        'Monsoon water accumulation causing asphalt foundation hollow'
      ],
      estimatedRepairHours: 12,
      estimatedCostRange: '₹48,000 - ₹75,000',
      suggestedDepartment: 'PWD (Public Works Department) Road & Flyover Cell',
      safetyAdvisory: 'Arre bhai, please slow down immediately near Metro Pillar 84. Heavy traffic cones and barricades urgently needed before sunset.',
      officialDispatchCode: 'PWD-DEL-ASPH-CRIT-04',
      grievanceLetterSummary: 'Formal emergency public grievance notice sent to Chief Engineer Er. Rameshwar Sharma and Ward Parshad Vikram Malhotra citing hazardous pothole crater on major Ring Road artery.'
    },
    timeline: [
      {
        id: 'tl-1',
        status: 'reported',
        timestamp: '2026-10-07T14:22:00Z',
        author: 'Anonymous Citizen (Aam Aadmi)',
        notes: 'Grievance lodged with zero metadata. Photo stripped of EXIF coordinates for complete citizen safety.'
      },
      {
        id: 'tl-2',
        status: 'triaged',
        timestamp: '2026-10-07T15:05:00Z',
        author: 'Fixora AI Civic Engine',
        notes: 'Danger level assessed as CRITICAL (Hazard Index 94/100). Auto-alerted PWD South Division Control Room.'
      },
      {
        id: 'tl-3',
        status: 'in_progress',
        timestamp: '2026-10-08T09:30:00Z',
        author: 'PWD Flying Squad Crew 14B',
        notes: 'Yellow warning barricades and steel trench plate placed on site. Hot-mix bitumen patch work scheduled tonight.'
      }
    ]
  },
  {
    id: 'DL-8821-W1',
    anonymousToken: 'anon_tx_8821_93d84a1',
    title: 'Nangi Taar (Exposed 415V Live Wire) at Streetlight Pole Base',
    description: 'Junction box cover kicked off metal streetlight mast. Live 415V 3-phase naked copper wiring hanging loose at shoulder height adjacent to crowded chaat stall and pedestrian zebra crossing.',
    category: 'electrical_power',
    severity: 'critical',
    status: 'dispatched',
    location: {
      address: 'Outer Circle, Near Super Bazar & Palika Kendra, Connaught Place, New Delhi - 110001',
      district: 'Ward 1 - Central Zone (Connaught Place / ITO)',
      coordinates: { lat: 28.6315, lng: 77.2167 },
      landmark: 'Opposite Shivaji Stadium Bus Terminal & Hanuman Mandir',
    },
    imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=80',
    reportedAt: '2026-10-08T18:40:00Z',
    lastUpdatedAt: '2026-10-09T06:30:00Z',
    assignedDepartmentId: 'dept-bses',
    councilRepresentativeId: 'rep-ward-1',
    confirmationsCount: 68,
    stillBrokenCount: 22,
    verifiedFixedCount: 0,
    isAnonymousExifStripped: true,
    aiAssessment: {
      hazardScore: 98,
      urgencyLevel: 'critical',
      riskFactors: [
        'Extreme current electrocution risk to shoppers, hawkers, and stray animals',
        'Rain puddle conductivity and electric flashover threat',
        'Severe short circuit and transformer blowout danger'
      ],
      estimatedRepairHours: 3,
      estimatedCostRange: '₹12,000 - ₹24,000',
      suggestedDepartment: 'BSES & Nagar Nigam Street Lighting Grid Division',
      safetyAdvisory: 'Kripya dhyan dein! Maintain at least 15 feet safe distance. Do not touch wet iron pole under any circumstances.',
      officialDispatchCode: 'BSES-GRID-LIVE-WIRE-PRIO1',
      grievanceLetterSummary: 'Priority 1 public safety SOS order transmitted directly to Superintendent Engineer Er. Alok Verma with SMS alert to Ward Parshad Anita Meena.'
    },
    timeline: [
      {
        id: 'tl-e1',
        status: 'reported',
        timestamp: '2026-10-08T18:40:00Z',
        author: 'Anonymous Citizen (Shopper)',
        notes: 'Live wire photographed and logged anonymously via mobile phone.'
      },
      {
        id: 'tl-e2',
        status: 'triaged',
        timestamp: '2026-10-08T18:50:00Z',
        author: 'Fixora AI Civic Engine',
        notes: 'High-voltage life hazard flagged. Alerted DISCOM Grid Safety Cell.'
      },
      {
        id: 'tl-e3',
        status: 'dispatched',
        timestamp: '2026-10-09T06:30:00Z',
        author: 'BSES Quick Response Van #09',
        notes: 'Lineman squad dispatched with insulated safety kit and metal lockbox replacement.'
      }
    ]
  },
  {
    id: 'DL-7193-W4',
    anonymousToken: 'anon_tx_7193_c54b1e9',
    title: 'Jal Board Underground Main Pipe Burst & Heavy Jal-Bhav (Flooding)',
    description: 'Sub-surface pressurized drinking water pipeline leaking at massive rate, creating road bubbling, washed-out soil, and asphalt sinkhole formation right in front of busy market chowk.',
    category: 'water_sewage',
    severity: 'high',
    status: 'in_progress',
    location: {
      address: 'Main Road near Nai Sarak Crossing, Chandni Chowk, Delhi - 110006',
      district: 'Ward 4 - North Zone (Chandni Chowk / Old Delhi)',
      coordinates: { lat: 28.6560, lng: 77.2300 },
      landmark: 'Near Sis Ganj Sahib Gurudwara & Town Hall Chowk',
    },
    imageUrl: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80',
    reportedAt: '2026-10-06T10:15:00Z',
    lastUpdatedAt: '2026-10-08T16:00:00Z',
    assignedDepartmentId: 'dept-djb',
    councilRepresentativeId: 'rep-ward-4',
    confirmationsCount: 34,
    stillBrokenCount: 11,
    verifiedFixedCount: 0,
    isAnonymousExifStripped: true,
    aiAssessment: {
      hazardScore: 82,
      urgencyLevel: 'high',
      riskFactors: [
        'Subsidence of underground soil causing sudden sinkhole collapse',
        'Immense wastage of treated drinking water (peene ka paani)',
        'Waterlogging causing slime and skidding risk for two-wheelers and rickshaws'
      ],
      estimatedRepairHours: 18,
      estimatedCostRange: '₹85,000 - ₹1,40,000',
      suggestedDepartment: 'Delhi Jal Board (DJB) & Underground Sewerage Authority',
      safetyAdvisory: 'Avoid driving heavy commercial vehicles over the bulging road surface. Subsurface hollow detected.',
      officialDispatchCode: 'DJB-MAIN-BURST-NORTH-B',
      grievanceLetterSummary: 'Official petition dispatched to Zonal Executive Engineer Dr. Sunita Deshmukh. Citizen SLA clock ticking (Day 3).'
    },
    timeline: [
      {
        id: 'tl-w1',
        status: 'reported',
        timestamp: '2026-10-06T10:15:00Z',
        author: 'Local Vyapaar Mandal Citizen',
        notes: 'Water main fracture reported anonymously via Fixora.'
      },
      {
        id: 'tl-w2',
        status: 'triaged',
        timestamp: '2026-10-06T11:45:00Z',
        author: 'Fixora AI Civic Engine',
        notes: 'Hydraulic soil erosion hazard confirmed from geo-tagged image analysis.'
      },
      {
        id: 'tl-w3',
        status: 'in_progress',
        timestamp: '2026-10-07T13:00:00Z',
        author: 'Delhi Jal Board Dispatcher',
        notes: 'Water pressure valve throttled; road cutting permit issued for cast-iron clamp welding.'
      }
    ]
  },
  {
    id: 'DL-6401-W3',
    anonymousToken: 'anon_tx_6401_8a12c40',
    title: 'Toota Jhula & Damaged Children Swing Set at DDA Colony Park',
    description: 'Heavy gauge steel chain snapped on children swing set. Broken chain has jagged sharp burrs; top iron beam has developed visible stress cracks. Children at risk of serious injury.',
    category: 'parks_playgrounds',
    severity: 'moderate',
    status: 'resolved',
    location: {
      address: 'DDA Community Park, Block B, Karol Bagh, New Delhi - 110005',
      district: 'Ward 3 - West Zone (Karol Bagh / Patel Nagar)',
      coordinates: { lat: 28.6510, lng: 77.1905 },
      landmark: 'Behind Sir Ganga Ram Hospital Chowk, near Arya Samaj Mandir',
    },
    imageUrl: 'https://images.unsplash.com/photo-1545620958-f7b57b9c9f0b?w=800&auto=format&fit=crop&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80',
    reportedAt: '2026-10-04T09:00:00Z',
    lastUpdatedAt: '2026-10-06T14:30:00Z',
    assignedDepartmentId: 'dept-mcd-parks',
    councilRepresentativeId: 'rep-ward-3',
    confirmationsCount: 52,
    stillBrokenCount: 1,
    verifiedFixedCount: 29,
    isAnonymousExifStripped: true,
    aiAssessment: {
      hazardScore: 68,
      urgencyLevel: 'moderate',
      riskFactors: [
        'Toddler and child fall and sharp metal laceration injury hazard',
        'Overhead structural crossbar collapse under child weight load'
      ],
      estimatedRepairHours: 4,
      estimatedCostRange: '₹8,000 - ₹15,000',
      suggestedDepartment: 'Nagar Nigam Horticulture & Parks Department (Udyan Vibhag)',
      safetyAdvisory: 'Jhula area cordoned off with safety tape; parents requested to keep young kids away from damaged frame.',
      officialDispatchCode: 'MCD-UDYAN-JHULA-W3',
      grievanceLetterSummary: 'Logged to Additional Director Smt. Vandana Saxena. Promptly repaired in 2.2 days with new reinforced chain assembly.'
    },
    timeline: [
      {
        id: 'tl-p1',
        status: 'reported',
        timestamp: '2026-10-04T09:00:00Z',
        author: 'Concerned Parent (RWA Member)',
        notes: 'Submitted anonymous hazard report with playground photo.'
      },
      {
        id: 'tl-p2',
        status: 'dispatched',
        timestamp: '2026-10-05T08:00:00Z',
        author: 'MCD Horticulture Maintenance Cell',
        notes: 'Work gang dispatched; broken chain assembly replaced with heavy ISI-marked zinc-coated chains.'
      },
      {
        id: 'tl-p3',
        status: 'resolved',
        timestamp: '2026-10-06T14:30:00Z',
        author: 'Nagar Nigam Parks Inspector',
        notes: 'Inspection cleared. Safety load tested with 80kg weight and opened for kids.',
        proofImageUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'tl-p4',
        status: 'community_verified',
        timestamp: '2026-10-07T11:00:00Z',
        author: '29 Local Colony Residents',
        notes: 'Verified fixed and safe by Karol Bagh Block B RWA parents.'
      }
    ]
  },
  {
    id: 'DL-5910-W5',
    anonymousToken: 'anon_tx_5910_119ae87',
    title: 'Dangerous Traffic Battī (Signal Blackout) at Busy Chowk Junction',
    description: 'Four-way overhead traffic signal lights completely shut down following rainstorm. High-speed vehicles, e-rickshaws, and DTC buses navigating blindly, creating immense chaos and jam.',
    category: 'traffic_signals',
    severity: 'critical',
    status: 'in_progress',
    location: {
      address: 'Outer Ring Road at Madhuban Chowk, Sector 9, Rohini, Delhi - 110085',
      district: 'Ward 5 - Rohini Zone (Pitampura / Ring Road)',
      coordinates: { lat: 28.7040, lng: 77.1180 },
      landmark: 'Below DMRC Metro Pillar 342, near Kali Mata Mandir Crossing',
    },
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=800&auto=format&fit=crop&q=80',
    reportedAt: '2026-10-08T07:10:00Z',
    lastUpdatedAt: '2026-10-09T07:00:00Z',
    assignedDepartmentId: 'dept-pwd',
    councilRepresentativeId: 'rep-ward-5',
    confirmationsCount: 89,
    stillBrokenCount: 41,
    verifiedFixedCount: 0,
    isAnonymousExifStripped: true,
    aiAssessment: {
      hazardScore: 97,
      urgencyLevel: 'critical',
      riskFactors: [
        'Extreme broadside vehicular collision risk at 60 km/h speed zone',
        'Pedestrians and students crossing blindly without pedestrian green light',
        'Critical junction gridlock blocking ambulance passage to nearby hospital'
      ],
      estimatedRepairHours: 6,
      estimatedCostRange: '₹32,000 - ₹55,000',
      suggestedDepartment: 'PWD (Public Works Department) Road & Flyover Cell',
      safetyAdvisory: 'Savdhaan! Treat chowk with extreme caution. Traffic constable deployed temporarily with hand whistles.',
      officialDispatchCode: 'PWD-TRAFFIC-SIG-ROHINI-CRIT',
      grievanceLetterSummary: 'High-alert emergency docket sent to Ward Parshad Manoj Tiwari Sharma and Traffic Engineering Wing for immediate relay board replacement.'
    },
    timeline: [
      {
        id: 'tl-s1',
        status: 'reported',
        timestamp: '2026-10-08T07:10:00Z',
        author: 'Anonymous Daily Commuter',
        notes: 'Logged anonymously during morning office rush hour.'
      },
      {
        id: 'tl-s2',
        status: 'triaged',
        timestamp: '2026-10-08T07:18:00Z',
        author: 'Fixora AI Civic Engine',
        notes: 'Urgency Critical 97/100 indexed. Immediate priority flash sent to Traffic Control.'
      },
      {
        id: 'tl-s3',
        status: 'in_progress',
        timestamp: '2026-10-08T10:00:00Z',
        author: 'Signals Maintenance Van',
        notes: 'Temporary manual traffic control active. Signal microcontroller circuit board being replaced.'
      }
    ]
  },
  {
    id: 'DL-4320-W2',
    anonymousToken: 'anon_tx_4320_e312948',
    title: 'Awaidh Malba (Illegal Construction Debris) & Garbage Dumped in Gali',
    description: 'Truckload of building demolition malba, broken glass shards, and leaking chemical paint buckets dumped in public gali behind market, blocking emergency fire access.',
    category: 'sanitation_dumping',
    severity: 'high',
    status: 'triaged',
    location: {
      address: 'Service Gali behind Defence Colony Flyover, New Delhi - 110024',
      district: 'Ward 2 - South Zone (Lajpat Nagar / Ring Road)',
      coordinates: { lat: 28.5720, lng: 77.2350 },
      landmark: 'Behind Market Post Office, near Sai Mandir Marg',
    },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    reportedAt: '2026-10-08T22:15:00Z',
    lastUpdatedAt: '2026-10-09T01:00:00Z',
    assignedDepartmentId: 'dept-mcd-swachh',
    councilRepresentativeId: 'rep-ward-2',
    confirmationsCount: 19,
    stillBrokenCount: 8,
    verifiedFixedCount: 0,
    isAnonymousExifStripped: true,
    aiAssessment: {
      hazardScore: 79,
      urgencyLevel: 'high',
      riskFactors: [
        'Total blockage of fire engine and ambulance passage through gali',
        'Stray cattle and dog scavenging with toxic paint chemical leaching into drain',
        'Severe mosquito and dengue/malaria breeding ground'
      ],
      estimatedRepairHours: 8,
      estimatedCostRange: '₹22,000 - ₹38,000',
      suggestedDepartment: 'Nagar Nigam Sanitation & Swachhata Vibhag (Safai Cell)',
      safetyAdvisory: 'Kripya malba na chhuyein. Do not touch unmarked solvent tins. Anti-dumping squad informed to issue challan.',
      officialDispatchCode: 'MCD-SWACHH-MALBA-FINE',
      grievanceLetterSummary: 'Sent to Chief Sanitation Officer Shri Rajeshwar Chauhan. Anti-illegal dumping challan initiated under Municipal By-Laws.'
    },
    timeline: [
      {
        id: 'tl-d1',
        status: 'reported',
        timestamp: '2026-10-08T22:15:00Z',
        author: 'Anonymous Local Citizen',
        notes: 'Submitted anonymously with metadata scrubbed.'
      },
      {
        id: 'tl-d2',
        status: 'triaged',
        timestamp: '2026-10-09T01:00:00Z',
        author: 'Fixora AI Civic Engine',
        notes: 'Heavy waste dump verified. JCB earthmover and tipper truck requisitioned.'
      }
    ]
  },
  {
    id: 'DL-3891-W3',
    anonymousToken: 'anon_tx_3891_77b3112',
    title: 'Ukhda Hua Footpath & Broken Paver Blocks Barring Senior Citizens',
    description: 'Pipal tree roots and poor compaction caused footpath paver blocks to heave 5 inches upward outside senior citizen dispensary. Wheelchairs forced onto high-speed vehicle road.',
    category: 'structural_sidewalk',
    severity: 'high',
    status: 'resolved',
    location: {
      address: 'Pusa Road, Opp. Metro Pillar 122, Rajendra Nagar, New Delhi - 110060',
      district: 'Ward 3 - West Zone (Karol Bagh / Patel Nagar)',
      coordinates: { lat: 28.6440, lng: 77.1820 },
      landmark: 'Outside Jan Seva Senior Citizens Clinic & Post Office',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop&q=80',
    reportedAt: '2026-10-02T11:00:00Z',
    lastUpdatedAt: '2026-10-05T16:00:00Z',
    assignedDepartmentId: 'dept-pwd',
    councilRepresentativeId: 'rep-ward-3',
    confirmationsCount: 61,
    stillBrokenCount: 0,
    verifiedFixedCount: 38,
    isAnonymousExifStripped: true,
    aiAssessment: {
      hazardScore: 86,
      urgencyLevel: 'high',
      riskFactors: [
        'Divyangjan (accessible) barrier forcing disabled citizens and elders into bus traffic',
        'High frequency trip-and-fall injuries for walking elders during morning walk',
        'Pedestrian spillover causing traffic bottleneck'
      ],
      estimatedRepairHours: 10,
      estimatedCostRange: '₹28,000 - ₹45,000',
      suggestedDepartment: 'PWD (Public Works Department) Road & Flyover Cell',
      safetyAdvisory: 'Footpath ramps restored with tactile yellow paver blocks for visually impaired pedestrians.',
      officialDispatchCode: 'PWD-DIVYANG-FOOTPATH-FIX',
      grievanceLetterSummary: 'Addressed to Ward Parshad Dr. Preeti Agrawal. Fresh anti-skid paver tiles laid and leveled within 3 days.'
    },
    timeline: [
      {
        id: 'tl-ada1',
        status: 'reported',
        timestamp: '2026-10-02T11:00:00Z',
        author: 'Anonymous Citizen (Senior Resident)',
        notes: 'Submitted anonymously.'
      },
      {
        id: 'tl-ada2',
        status: 'dispatched',
        timestamp: '2026-10-03T09:00:00Z',
        author: 'PWD Footpath Maintenance Squad',
        notes: 'Tree root trimmed safely without harming trunk; sub-base releveled with sand-cement mortar.'
      },
      {
        id: 'tl-ada3',
        status: 'resolved',
        timestamp: '2026-10-05T16:00:00Z',
        author: 'PWD Zonal Inspector',
        notes: 'Kaam ho gaya. Smooth tactile paving installed with wheelchair ramp slope.',
        proofImageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'tl-ada4',
        status: 'community_verified',
        timestamp: '2026-10-06T10:00:00Z',
        author: '38 Local Colony Elders',
        notes: 'Satyapan certified safe by senior residents of Rajendra Nagar Senior Society.'
      }
    ]
  }
];
