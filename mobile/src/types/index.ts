export interface Symptom {
  id: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
  petId: string;
}

export interface CreateSymptomRequest {
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
}

export interface SymptomAnalysis {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendation: string;
  disclaimer: string;
  triggeredPatterns: { type: string; description: string }[];
}

export interface RiskAlertProps {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  onDismiss?: () => void;
}