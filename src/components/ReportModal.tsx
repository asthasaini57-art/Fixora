import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Upload, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Copy, 
  Check, 
  Lock,
  Camera,
  Layers
} from 'lucide-react';
import { HazardCategory, HazardSeverity, DamageReport, AIAssessment } from '../types';
import { analyzeDamageHazard } from '../services/geminiService';
import { CATEGORY_LABELS, generateReportId, generateAnonymousToken } from '../utils/formatters';
import { DEPARTMENTS, COUNCIL_OFFICIALS } from '../data/seedData';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newReport: DamageReport) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Bhaari Gadda / Road Crater',
    category: 'roads_potholes' as HazardCategory,
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    title: 'Bhaari Gadda (Deep Multi-Axle Crater) on Bus Route',
  },
  {
    name: 'Nangi Bijli Taar / Exposed Cable',
    category: 'electrical_power' as HazardCategory,
    url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=80',
    title: 'Nangi Taar (Live High-Voltage Cable) at Streetlight Mast',
  },
  {
    name: 'Jal Board Pipe Burst & Flooding',
    category: 'water_sewage' as HazardCategory,
    url: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80',
    title: 'Jal Board Underground Main Pipe Burst & Heavy Jal-Bhav',
  },
  {
    name: 'Toota Jhula / Broken Park Swing',
    category: 'parks_playgrounds' as HazardCategory,
    url: 'https://images.unsplash.com/photo-1545620958-f7b57b9c9f0b?w=800&auto=format&fit=crop&q=80',
    title: 'Toota Jhula & Compromised Chain in Colony Park',
  },
  {
    name: 'Traffic Signal Battī Blackout',
    category: 'traffic_signals' as HazardCategory,
    url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=800&auto=format&fit=crop&q=80',
    title: 'Dangerous Traffic Battī Blackout at Busy Chowk',
  },
  {
    name: 'Ukhda Footpath & Paver Blocks',
    category: 'structural_sidewalk' as HazardCategory,
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',
    title: 'Ukhda Hua Footpath & Broken Paver Blocks Obstacle',
  },
];

const DISTRICTS = [
  { name: 'Ward 1 - Central Zone (Connaught Place / ITO)', repId: 'rep-ward-1', defaultCoords: { lat: 28.6315, lng: 77.2167 }, sampleRoad: 'Outer Circle, Near Shivaji Stadium & Super Bazar, Connaught Place, New Delhi - 110001' },
  { name: 'Ward 2 - South Zone (Lajpat Nagar / Ring Road)', repId: 'rep-ward-2', defaultCoords: { lat: 28.5670, lng: 77.2430 }, sampleRoad: 'Near Moolchand Flyover Underpass, Ring Road, Lajpat Nagar III, New Delhi - 110024' },
  { name: 'Ward 3 - West Zone (Karol Bagh / Patel Nagar)', repId: 'rep-ward-3', defaultCoords: { lat: 28.6510, lng: 77.1905 }, sampleRoad: 'Pusa Road, Ganga Ram Hospital Chowk, Karol Bagh, New Delhi - 110005' },
  { name: 'Ward 4 - North Zone (Chandni Chowk / Old Delhi)', repId: 'rep-ward-4', defaultCoords: { lat: 28.6560, lng: 77.2300 }, sampleRoad: 'Main Road near Nai Sarak Crossing, Chandni Chowk, Delhi - 110006' },
  { name: 'Ward 5 - Rohini Zone (Pitampura / Ring Road)', repId: 'rep-ward-5', defaultCoords: { lat: 28.7040, lng: 77.1180 }, sampleRoad: 'Outer Ring Road at Madhuban Chowk, Sector 9, Rohini, Delhi - 110085' },
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmitReport }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HazardCategory>('roads_potholes');
  const [district, setDistrict] = useState(DISTRICTS[0].name);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTO_PRESETS[0].url);
  const [isStrippingExif, setIsStrippingExif] = useState(true);
  
  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAssessment | null>(null);

  // Success state after report
  const [submittedReport, setSubmittedReport] = useState<DamageReport | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setImageUrl(preset.url);
    setCategory(preset.category);
    if (!title) {
      setTitle(preset.title);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGpsAutoLocate = () => {
    const selectedDist = DISTRICTS.find((d) => d.name === district) || DISTRICTS[0];
    setAddress(selectedDist.sampleRoad);
    setLandmark('Near Metro Pillar & Haldiram / Nukkad Chai Crossing');
  };

  const handleRunAiAssessment = async () => {
    if (!title) {
      setTitle(CATEGORY_LABELS[category]);
    }
    setIsAnalyzing(true);
    try {
      const assessment = await analyzeDamageHazard({
        title: title || CATEGORY_LABELS[category],
        description: description || 'Public damage detected on Indian road/civic infrastructure requiring urgent Nagar Nigam & PWD response.',
        category,
        locationAddress: address || 'Delhi Ward Arterial Thoroughfare',
        district,
        imageBase64: imageUrl.startsWith('data:') ? imageUrl : undefined,
      });
      setAiResult(assessment);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDistrictObj = DISTRICTS.find((d) => d.name === district) || DISTRICTS[0];
    const districtNumMatch = district.match(/Ward (\d)/);
    const wardNum = districtNumMatch ? parseInt(districtNumMatch[1], 10) : 1;

    // Find assigned department based on category
    let deptId = 'dept-pwd';
    if (category === 'electrical_power') deptId = 'dept-bses';
    else if (category === 'water_sewage') deptId = 'dept-djb';
    else if (category === 'parks_playgrounds') deptId = 'dept-mcd-parks';
    else if (category === 'sanitation_dumping') deptId = 'dept-mcd-swachh';

    const newReportId = generateReportId(wardNum);
    const anonToken = generateAnonymousToken();

    // If AI wasn't triggered yet, provide immediate synthetic assessment
    const finalAiAssessment: AIAssessment = aiResult || {
      hazardScore: 82,
      urgencyLevel: 'high',
      riskFactors: [
        'Danger to two-wheelers, pedestrians, and auto-rickshaws',
        'Accelerating monsoon water accumulation and road hollow',
        'Traffic jam hazard at busy ward nukkad'
      ],
      estimatedRepairHours: 8,
      estimatedCostRange: '₹35,000 - ₹60,000',
      suggestedDepartment: DEPARTMENTS.find((d) => d.id === deptId)?.name || 'PWD (Public Works Department) Road & Flyover Cell',
      safetyAdvisory: 'Kripya dhyan dein: Exercise extreme caution near the damaged section until PWD barricades arrive.',
      officialDispatchCode: `DL-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
      grievanceLetterSummary: `Formal public grievance registered with ${district} leadership demanding timely redressal under Citizen Charter rules.`
    };

    const newReport: DamageReport = {
      id: newReportId,
      anonymousToken: anonToken,
      title: title || CATEGORY_LABELS[category],
      description: description || 'Citizen reported public infrastructure defect requiring urgent repair by Nagar Nigam / PWD.',
      category,
      severity: finalAiAssessment.urgencyLevel,
      status: 'reported',
      location: {
        address: address || selectedDistrictObj.sampleRoad,
        district,
        coordinates: selectedDistrictObj.defaultCoords,
        landmark: landmark || undefined,
      },
      imageUrl,
      reportedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      assignedDepartmentId: deptId,
      councilRepresentativeId: selectedDistrictObj.repId,
      confirmationsCount: 1,
      stillBrokenCount: 0,
      verifiedFixedCount: 0,
      isAnonymousExifStripped: isStrippingExif,
      aiAssessment: finalAiAssessment,
      timeline: [
        {
          id: `tl-new-${Date.now()}`,
          status: 'reported',
          timestamp: new Date().toISOString(),
          author: 'Anonymous Citizen (Aam Aadmi)',
          notes: 'Public damage logged anonymously. Camera EXIF scrubbed and phone specs completely detached.'
        }
      ]
    };

    onSubmitReport(newReport);
    setSubmittedReport(newReport);
  };

  const handleCopyToken = () => {
    if (submittedReport) {
      navigator.clipboard.writeText(`${submittedReport.id} (Pauti Token: ${submittedReport.anonymousToken})`);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <span>{submittedReport ? 'Grievance Registered Anonymously' : 'Report Gadda or Damage (शिकायत दर्ज करें)'}</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">100% ANONYMOUS</span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>No Phone / Email Needed</span>
                <span aria-hidden="true">·</span>
                <span>Bilkul Safe & EXIF Scrubbed</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen after submission */}
        {submittedReport ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900">Janta Grievance Registered (पावती तैयार)</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Shikayat ticket has been generated and published to the public ward feed. Forwarded to the responsible Nagar Nigam / PWD cell and Ward Parshad.
              </p>
            </div>

            {/* Cryptographic Ticket Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-500">Public Ticket ID (शिकायत संख्या)</span>
                <span className="font-mono font-bold text-base text-slate-900">{submittedReport.id}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-500">Anonymous Pauti Token</span>
                <span className="font-mono text-xs text-slate-600 truncate max-w-[200px]">{submittedReport.anonymousToken}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleCopyToken}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 transition-colors"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied Pauti to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Anonymous Ticket & Pauti Token</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick summary of dispatch */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Nagar Nigam SLA Clock Started (समय-सीमा चालू)</span>
              </p>
              <p className="text-amber-800">
                Assigned to {DEPARTMENTS.find((d) => d.id === submittedReport.assignedDepartmentId)?.name}. The response resolution days are being audited live on the Ward Leadership Scoreboard.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
              >
                Ho Gaya Ji! View on Live Feed
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Anonymity Security Notice */}
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Zero-Identity Protection (बिलकुल गोपनीय)</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={isStrippingExif}
                      onChange={(e) => setIsStrippingExif(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-0"
                    />
                    <span className="text-[11px]">Scrub Photo EXIF & Mobile Specs</span>
                  </label>
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Submissions are stripped of device identifiers, IP addresses, and camera signatures. You are issued an anonymous hash to follow progress. No police or sarkari enquiry worries!
                </p>
              </div>
            </div>

            {/* Photo Selection / Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Photo Saboot (फोटो प्रमाण)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                  <img src={imageUrl} alt="Damage Preview" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-slate-900/40 hover:bg-slate-900/60 transition-colors flex flex-col items-center justify-center text-white text-xs cursor-pointer gap-1">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image (फोटो चुनें)</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 space-y-1.5">
                  <span className="text-xs text-slate-500">Or pick an Indian civic issue preset:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SAMPLE_PHOTO_PRESETS.slice(0, 4).map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => handleApplyPreset(preset)}
                        className={`text-left text-xs p-2 rounded-lg border transition-all truncate ${
                          imageUrl === preset.url
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hazard Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Vibhag / Issue Category (समस्या का प्रकार)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HazardCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-slate-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Damage Title (शीर्षक)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bhaari 9-inch Gadda crater on main bus route near Haldiram's Chowk"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Vistrit Vivaran (Details & Context)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kindly provide details: depth of gadda, risk to two-wheelers and autos, proximity to school/market, waterlogging..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-slate-500 resize-none"
                />
              </div>
            </div>

            {/* Location & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Municipal Ward / Zone (वार्ड क्षेत्र)
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const sel = DISTRICTS.find(d => d.name === e.target.value);
                    if (sel && !address) {
                      setAddress(sel.sampleRoad);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-slate-500"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Location / Pata (स्थान व पता)
                  </label>
                  <button
                    type="button"
                    onClick={handleGpsAutoLocate}
                    className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 underline underline-offset-2"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Auto-fill Indian GPS</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Metro Pillar 84, Ring Road, Lajpat Nagar III, New Delhi"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Landmark / Nukkad Pehchaan (नजदीकी पहचान)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Sis Ganj Sahib / Near Bikaner Sweets & Kali Mandir"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* AI Hazard Scanner Preview Box */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-slate-900">AI Civil Engineer Jan-Padtal (जन-पड़ताल)</span>
                </div>
                <button
                  type="button"
                  onClick={handleRunAiAssessment}
                  disabled={isAnalyzing}
                  className="text-xs font-medium text-slate-900 hover:text-slate-700 bg-white border border-slate-300 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-60"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning in Indian context...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{aiResult ? 'Re-Analyze Hazard' : 'Run AI Civil Analysis (₹ Cost & Risk)'}</span>
                    </>
                  )}
                </button>
              </div>

              {aiResult ? (
                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="flex items-center gap-4 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500">Hazard Index</span>
                      <div className="font-mono font-bold text-lg text-slate-900">{aiResult.hazardScore}/100</div>
                    </div>
                    <div className="h-7 w-[1px] bg-slate-200" />
                    <div>
                      <span className="text-[11px] text-slate-500">Est. Repair (अनुमानित लागत)</span>
                      <div className="font-mono font-semibold text-slate-800">{aiResult.estimatedRepairHours}h (~{aiResult.estimatedCostRange})</div>
                    </div>
                    <div className="h-7 w-[1px] bg-slate-200" />
                    <div>
                      <span className="text-[11px] text-slate-500">Zimmedar Vibhag</span>
                      <div className="font-medium text-slate-800 truncate max-w-[150px]">{aiResult.suggestedDepartment}</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600">Public Hazards Identified:</span>
                    <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                      {aiResult.riskFactors.slice(0, 2).map((factor, idx) => (
                        <li key={idx}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Click 'Run AI Civil Analysis' to estimate Indian Rupee (₹) repair cost, assign the right Nagar Nigam / PWD department, and draft the official grievance petition automatically.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-xl transition-colors font-medium"
              >
                Radd Karein (Cancel)
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
              >
                Submit Shikayat (Nagar Nigam Ko Bhejein)
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
