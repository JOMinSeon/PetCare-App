/**
 * Recommendations Generator
 * 
 * Generates appropriate veterinary recommendations based on risk levels.
 * Always includes mandatory disclaimer that this is not a diagnosis.
 */

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RecommendationResult {
  recommendation: string;
  disclaimer: string;
  requiresVetConsultation: boolean;
}

// Mandatory disclaimer per SYMP-05 and NOTE-02
const MANDATORY_DISCLAIMER = 
  'This is probability-based assessment, not a diagnosis. Please consult a veterinarian for proper evaluation.';

/**
 * Generate recommendation based on risk level
 */
export function generateRecommendation(riskLevel: RiskLevel): RecommendationResult {
  switch (riskLevel) {
    case 'high':
      return {
        recommendation: 'Multiple concerning symptoms detected. Seek veterinary attention immediately.',
        disclaimer: MANDATORY_DISCLAIMER,
        requiresVetConsultation: true,
      };
    
    case 'medium':
      return {
        recommendation: 'Monitor closely. Schedule a veterinary visit if symptoms persist or worsen.',
        disclaimer: MANDATORY_DISCLAIMER,
        requiresVetConsultation: false,
      };
    
    case 'low':
    default:
      return {
        recommendation: 'No specific concerns identified. Continue regular monitoring.',
        disclaimer: MANDATORY_DISCLAIMER,
        requiresVetConsultation: false,
      };
  }
}

/**
 * Generate recommendation from triggered patterns
 */
export function generateRecommendationFromPatterns(
  patterns: { type: string; description: string }[],
  riskLevel: RiskLevel
): RecommendationResult {
  if (patterns.length === 0) {
    return generateRecommendation('low');
  }

  // Build recommendation based on highest risk pattern
  const patternRecommendations: Record<string, string> = {
    single_severe: 'Consult a veterinarian within 24 hours.',
    multiple_moderate: 'Monitor closely. Schedule vet visit if symptoms persist.',
    recurring: 'Recurring symptoms detected. Veterinary examination recommended.',
    escalating: 'Symptoms appear to be worsening. Seek veterinary attention soon.',
    multiple_severe: 'Multiple severe symptoms detected. Immediate veterinary consultation advised.',
  };

  const recommendations = patterns
    .map(p => patternRecommendations[p.type] || p.description)
    .filter(Boolean);

  if (recommendations.length > 0) {
    return {
      recommendation: recommendations.join(' '),
      disclaimer: MANDATORY_DISCLAIMER,
      requiresVetConsultation: riskLevel === 'high',
    };
  }

  return generateRecommendation(riskLevel);
}

export default generateRecommendation;
