/**
 * Risk Calculator
 * 
 * Calculates risk scores based on symptom patterns.
 * Uses rule-based pattern matching from veterinary triage guidelines.
 */

export interface Pattern {
  type: string;
  description: string;
}

export interface RiskCalculationResult {
  riskScore: number;           // 0-100 probability
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  triggeredPatterns: Pattern[];
}

export interface Symptom {
  id: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: Date;
  petId: string;
}

// Pattern rules based on veterinary triage guidelines
interface PatternRule {
  type: string;
  description: string;
  condition: (symptoms: Symptom[]) => boolean;
  riskLevel: number;  // 0-100
}

const PATTERN_RULES: PatternRule[] = [
  {
    type: 'single_severe',
    description: 'Single severe symptom detected',
    condition: (symptoms) => symptoms.some(sym => sym.severity === 'severe'),
    riskLevel: 60,
  },
  {
    type: 'multiple_moderate',
    description: 'Three or more moderate symptoms in the past 7 days',
    condition: (symptoms) => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentModerate = symptoms.filter(
        sym => sym.severity === 'moderate' && new Date(sym.date) >= sevenDaysAgo
      );
      return recentModerate.length >= 3;
    },
    riskLevel: 50,
  },
  {
    type: 'recurring',
    description: 'Same symptom description logged 3 or more times',
    condition: (symptoms) => {
      const descriptions: Record<string, number> = {};
      symptoms.forEach(sym => {
        const desc = sym.description.toLowerCase().trim();
        descriptions[desc] = (descriptions[desc] || 0) + 1;
      });
      return Object.values(descriptions).some(count => count >= 3);
    },
    riskLevel: 70,
  },
  {
    type: 'escalating',
    description: 'Symptom severity appears to be increasing over time',
    condition: (symptoms) => {
      const severityOrder: Record<string, number> = { mild: 1, moderate: 2, severe: 3 };
      const sorted = [...symptoms]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-5); // Look at most recent 5
      
      for (let i = 1; i < sorted.length; i++) {
        if (severityOrder[sorted[i].severity] > severityOrder[sorted[i - 1].severity]) {
          return true;
        }
      }
      return false;
    },
    riskLevel: 75,
  },
  {
    type: 'multiple_severe',
    description: 'Two or more severe symptoms in the past 30 days',
    condition: (symptoms) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentSevere = symptoms.filter(
        sym => sym.severity === 'severe' && new Date(sym.date) >= thirtyDaysAgo
      );
      return recentSevere.length >= 2;
    },
    riskLevel: 85,
  },
];

/**
 * Calculate risk score based on symptom patterns
 */
export function calculateRiskScore(symptoms: Symptom[]): RiskCalculationResult {
  let highestRisk = 0;
  const triggeredPatterns: Pattern[] = [];
  const riskFactors: string[] = [];

  for (const rule of PATTERN_RULES) {
    if (rule.condition(symptoms)) {
      triggeredPatterns.push({
        type: rule.type,
        description: rule.description,
      });
      riskFactors.push(rule.type);
      
      if (rule.riskLevel > highestRisk) {
        highestRisk = rule.riskLevel;
      }
    }
  }

  // Determine risk level based on score
  let riskLevel: 'low' | 'medium' | 'high';
  if (highestRisk >= 70) {
    riskLevel = 'high';
  } else if (highestRisk >= 40) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  // If no patterns matched, return low risk
  if (triggeredPatterns.length === 0) {
    return {
      riskScore: 0,
      riskLevel: 'low',
      riskFactors: [],
      triggeredPatterns: [],
    };
  }

  return {
    riskScore: highestRisk,
    riskLevel,
    riskFactors,
    triggeredPatterns,
  };
}

export default calculateRiskScore;
