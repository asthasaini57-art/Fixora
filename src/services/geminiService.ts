import { GoogleGenAI } from '@google/genai';
import { AIAssessment, HazardCategory, HazardSeverity } from '../types';

export async function analyzeDamageHazard(params: {
  title: string;
  description: string;
  category: HazardCategory;
  locationAddress: string;
  district: string;
  imageBase64?: string;
}): Promise<AIAssessment> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  // If API key is available, leverage Gemini 2.5 Flash for multimodal / text hazard synthesis
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are a Senior Superintending Civil Engineer for the Nagar Nigam (Municipal Corporation) and Public Works Department (PWD) in India.
Analyze the following citizen-reported Indian public infrastructure defect / grievance:
- Title: "${params.title}"
- Description: "${params.description}"
- Category: "${params.category}"
- Location: "${params.locationAddress}", District: "${params.district}"

Use authentic Indian civic context, Indian terminology (e.g. gadda, nangi taar, jal board leakage, malba, auto-rickshaw, chowk, nukkad, sariya, footpath), and Indian Rupee (₹) estimates.

Respond strictly with valid JSON conforming to this schema (no extra formatting or markdown codeblocks):
{
  "hazardScore": <integer between 20 and 99 representing public safety danger>,
  "urgencyLevel": <"critical" | "high" | "moderate" | "low">,
  "riskFactors": [<array of 3-4 specific concise technical public safety hazards in Indian traffic/monsoon context>],
  "estimatedRepairHours": <integer reasonable estimate of work hours>,
  "estimatedCostRange": "<string in Indian Rupees like '₹25,000 - ₹55,000' or '₹1.2 Lakhs - ₹2.5 Lakhs'>",
  "suggestedDepartment": "<appropriate Indian department name like PWD Road & Flyover Cell, Delhi Jal Board, BSES Street Lighting Grid, Nagar Nigam Udyan Vibhag, or Nagar Nigam Swachhata Vibhag>",
  "safetyAdvisory": "<1-2 sentence actionable warning in Indian English like 'Kripya dhyan dein: Maintain safe distance near chowk...'>",
  "officialDispatchCode": "<technical code like 'PWD-DEL-RD-CRIT' or 'DJB-MAIN-LEAK-W4'>",
  "grievanceLetterSummary": "<a formal 2-sentence official grievance notice addressed to the respected Ward Parshad and Zonal Chief Engineer demanding prompt rectification under the Nagar Nigam Citizen Charter / Right to Public Services Act>"
}
`;

      const parts: any[] = [{ text: prompt }];

      if (params.imageBase64) {
        // Remove data URI prefix if present
        const cleanBase64 = params.imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64,
          },
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: parts,
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        hazardScore: Math.min(99, Math.max(15, Number(parsed.hazardScore) || 75)),
        urgencyLevel: (['critical', 'high', 'moderate', 'low'].includes(parsed.urgencyLevel) 
          ? parsed.urgencyLevel 
          : 'high') as HazardSeverity,
        riskFactors: Array.isArray(parsed.riskFactors) && parsed.riskFactors.length > 0 
          ? parsed.riskFactors 
          : ['Direct danger to two-wheelers, cyclists, and autos', 'Severe monsoon waterlogging and roadbed subsidence'],
        estimatedRepairHours: Number(parsed.estimatedRepairHours) || 8,
        estimatedCostRange: parsed.estimatedCostRange || '₹35,000 - ₹65,000',
        suggestedDepartment: parsed.suggestedDepartment || 'PWD (Public Works Department) Road & Flyover Cell',
        safetyAdvisory: parsed.safetyAdvisory || 'Kripya dhyan dein: Please maintain safe speed and avoid the damaged section.',
        officialDispatchCode: parsed.officialDispatchCode || 'DL-HAZ-AUTO-99',
        grievanceLetterSummary: parsed.grievanceLetterSummary || `Formal notice registered with ${params.district} leadership regarding public safety hazard at ${params.locationAddress}.`
      };
    } catch (err) {
      console.warn('Gemini API query encountered error, switching to deterministic Indian civil engineering engine:', err);
    }
  }

  // Deterministic Civil Engineering Assessment Engine (Guaranteed zero-failure fallback)
  return fallbackAssessment(params);
}

function fallbackAssessment(params: {
  title: string;
  description: string;
  category: HazardCategory;
  locationAddress: string;
  district: string;
}): AIAssessment {
  const text = `${params.title} ${params.description}`.toLowerCase();
  
  let score = 65;
  let urgency: HazardSeverity = 'moderate';
  let hours = 8;
  let cost = '₹35,000 - ₹60,000';
  let dept = 'PWD (Public Works Department) Road & Flyover Cell';
  let codePrefix = 'PWD-DEL';

  if (params.category === 'electrical_power' || text.includes('wire') || text.includes('taar') || text.includes('voltage') || text.includes('spark') || text.includes('shock') || text.includes('pole')) {
    score = 96;
    urgency = 'critical';
    hours = 4;
    cost = '₹12,000 - ₹25,000';
    dept = 'BSES & Nagar Nigam Street Lighting Grid Division';
    codePrefix = 'BSES-GRID';
  } else if (params.category === 'traffic_signals' || text.includes('signal') || text.includes('batti') || text.includes('chowk') || text.includes('light')) {
    score = 92;
    urgency = 'critical';
    hours = 6;
    cost = '₹28,000 - ₹50,000';
    dept = 'PWD (Public Works Department) Road & Flyover Cell';
    codePrefix = 'PWD-SIG';
  } else if (params.category === 'water_sewage' || text.includes('water') || text.includes('jal') || text.includes('leak') || text.includes('pipe') || text.includes('flood') || text.includes('sewer')) {
    score = 84;
    urgency = 'high';
    hours = 16;
    cost = '₹75,000 - ₹1,30,000';
    dept = 'Delhi Jal Board (DJB) & Underground Sewerage Authority';
    codePrefix = 'DJB-JAL';
  } else if (params.category === 'roads_potholes' || text.includes('pothole') || text.includes('gadda') || text.includes('crater') || text.includes('road') || text.includes('sadak')) {
    score = text.includes('deep') || text.includes('bhaari') || text.includes('sariya') || text.includes('axle') ? 88 : 72;
    urgency = score > 80 ? 'critical' : 'high';
    hours = 12;
    cost = '₹45,000 - ₹80,000';
    dept = 'PWD (Public Works Department) Road & Flyover Cell';
    codePrefix = 'PWD-RD';
  } else if (params.category === 'sanitation_dumping' || text.includes('malba') || text.includes('kachra') || text.includes('dump') || text.includes('waste') || text.includes('trash')) {
    score = 75;
    urgency = 'high';
    hours = 6;
    cost = '₹20,000 - ₹40,000';
    dept = 'Nagar Nigam Sanitation & Swachhata Vibhag (Safai Cell)';
    codePrefix = 'MCD-SWACHH';
  } else if (params.category === 'parks_playgrounds' || text.includes('jhula') || text.includes('park') || text.includes('bagh')) {
    score = 68;
    urgency = 'moderate';
    hours = 6;
    cost = '₹10,000 - ₹22,000';
    dept = 'Nagar Nigam Horticulture & Parks Department (Udyan Vibhag)';
    codePrefix = 'MCD-UDYAN';
  } else {
    score = 74;
    urgency = 'high';
    hours = 10;
    cost = '₹25,000 - ₹50,000';
    dept = 'PWD (Public Works Department) Road & Flyover Cell';
    codePrefix = 'PWD-FOOTPATH';
  }

  const riskFactorsList: Record<HazardCategory, string[]> = {
    electrical_power: [
      'High risk of fatal electrocution (current shock) from live naked wires during rain or waterlogging',
      'Immediate hazard to nukkad pedestrians, children, and stray cattle',
      'Sudden feeder short-circuit causing local transformer trip and blackout'
    ],
    roads_potholes: [
      'Severe two-wheeler and auto-rickshaw overturning & suspension rim damage',
      'Sudden braking leading to rear-end collision on busy arterial road',
      'Deepening gadda crater undermining foundation tarmac during heavy showers'
    ],
    traffic_signals: [
      'Major 4-way chowk chaos with blind collision risk between buses and autos',
      'Complete gridlock blocking emergency ambulance and fire vehicle movement',
      'School students and pedestrians unable to cross crowded thoroughfare'
    ],
    water_sewage: [
      'Massive loss of treated drinking water (peene ka paani) and road waterlogging',
      'Underground soil wash-out creating hollow cavities and sudden sinkholes',
      'Ganda paani seepage into adjacent underground supply pipelines'
    ],
    parks_playgrounds: [
      'Child fall, sharp sariya/metal cuts, or broken chain accident in colony park',
      'Structural iron crossbeam collapse during evening play hours',
      'Safety hazard for walking senior citizens and young toddlers'
    ],
    sanitation_dumping: [
      'Heavy obstruction of gali, emergency egress, and pedestrian footpath',
      'Severe mosquito, dengue, and malaria vector breeding hotspot',
      'Toxic malba dust and open chemical stench polluting residential air'
    ],
    structural_sidewalk: [
      'Broken paver blocks forcing senior citizens and wheelchairs into traffic lane',
      'Severe trip-and-fall injuries for pedestrians during morning and evening walks',
      'Open uncovered nali (drain) hazard during darkness and power cuts'
    ],
  };

  const risks = riskFactorsList[params.category] || [
    'Public safety hazard for commuters and pedestrians',
    'Traffic disruption and vehicle rim damage',
    'Civic infrastructure deterioration'
  ];

  return {
    hazardScore: score,
    urgencyLevel: urgency,
    riskFactors: risks,
    estimatedRepairHours: hours,
    estimatedCostRange: cost,
    suggestedDepartment: dept,
    safetyAdvisory: `Kripya dhyan dein: Maintain safe distance from ${params.locationAddress}. Do not attempt manual clearance without municipal PWD equipment.`,
    officialDispatchCode: `${codePrefix}-AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
    grievanceLetterSummary: `Official Jan-Shikayat petition registered with ${params.district} leadership for time-bound resolution under the Nagar Nigam Citizen Charter.`
  };
}
