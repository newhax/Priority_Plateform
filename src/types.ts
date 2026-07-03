export interface Submission {
  id: string;
  name: string;
  phone?: string;
  language: 'en' | 'ml' | 'hi' | 'ta';
  inputType: 'text' | 'voice' | 'photo' | 'whatsapp';
  originalText: string;
  translatedText: string;
  category: 'Education' | 'Healthcare' | 'Roads & Transport' | 'Sanitation' | 'Water Supply' | 'Vocations';
  ward: string;
  urgency: 'High' | 'Medium' | 'Low';
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  impactCount: number; // estimated people affected
  audioUrl?: string;
  photoUrl?: string;
  status: 'Received' | 'Reviewed' | 'Approved' | 'Actioned' | 'Rejected';
  aiSummary: string;
}

export interface WardData {
  id: string;
  name: string;
  population: number;
  avgIncome: 'Low' | 'Medium' | 'High';
  elderlyRatio: number; // percentage
  studentRatio: number; // percentage
  primaryNeeds: string[];
  infrastructureGaps: {
    schools: number; // deficit metric
    clinics: number;
    waterAccess: number; // % without coverage
    roadQuality: number; // scale 1-10 (lower is worse)
  };
}

export interface ProposedProject {
  id: string;
  title: string;
  category: 'Education' | 'Healthcare' | 'Roads & Transport' | 'Sanitation' | 'Water Supply' | 'Vocations';
  ward: string;
  estimatedCost: number; // in INR (Lakhs)
  infrastructureBenefitScore: number; // 0 - 100 based on gap filled
  demographicNeedScore: number; // 0 - 100 based on population composition
  demandIndex: number; // 0 - 100 based on citizen submissions count & urgency
  citizenSubmissionsCount: number;
  description: string;
}

export interface PrioritizationWeights {
  citizenDemand: number; // weight 0-1
  infrastructureGap: number; // weight 0-1
  demographicNeed: number; // weight 0-1
  costEfficiency: number; // weight 0-1
}
