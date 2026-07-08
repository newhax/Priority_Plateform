export interface Submission {
  id: string;
  name: string;
  phone?: string;
  language: 'en' | 'ml' | 'hi' | 'ta';
  inputType: 'text' | 'voice' | 'photo' | 'whatsapp';
  originalText: string;
  translatedText: string;
  category: 'Education' | 'Healthcare' | 'Roads & Transport' | 'Sanitation' | 'Water Supply' | 'Vocations';
  urgency: 'High' | 'Medium' | 'Low';
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  impactCount: number; // estimated people affected
  audioUrl?: string;
  photoUrls?: string[];
  status: 'Received' | 'Reviewed' | 'Approved' | 'Actioned' | 'Rejected';
  aiSummary: string;
  targetDepartment?: string;
  suggestedActions?: string[];
  latitude?: number;
  longitude?: number;
  locationVerified?: boolean;
  state?: string;
  constituency?: string;
  isProposal?: boolean;
}

export interface ProposedProject {
  id: string;
  title: string;
  category: 'Education' | 'Healthcare' | 'Roads & Transport' | 'Sanitation' | 'Water Supply' | 'Vocations';
  estimatedCost: number; // in INR (Lakhs)
  infrastructureBenefitScore: number; // 0 - 100 based on gap filled
  demographicNeedScore: number; // 0 - 100 based on population composition
  demandIndex: number; // 0 - 100 based on citizen submissions count & urgency
  citizenSubmissionsCount: number;
  description: string;
  state?: string;
  constituency?: string;
  latitude?: number;
  longitude?: number;
}

export interface PrioritizationWeights {
  citizenDemand: number; // weight 0-1
  infrastructureGap: number; // weight 0-1
  demographicNeed: number; // weight 0-1
  costEfficiency: number; // weight 0-1
}
