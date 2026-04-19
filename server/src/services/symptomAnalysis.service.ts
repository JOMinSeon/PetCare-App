/**
 * Symptom Analysis Service
 * 
 * Rule-based symptom pattern matching engine for AI risk assessment.
 * Analyzes symptom patterns and creates high-risk alerts when needed.
 */

import prisma from '../config/database.js';
import { calculateRiskScore, RiskCalculationResult, Symptom } from '../utils/riskCalculator.js';
import { generateRecommendationFromPatterns, RiskLevel } from '../utils/recommendations.js';

export interface SymptomAnalysisResponse {
  symptomId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendation: string;
  disclaimer: string;
  triggeredPatterns: {
    type: string;
    description: string;
  }[];
  alertCreated: boolean;
  alertId?: string;
}

export interface CreateSymptomInput {
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: Date;
  petId: string;
}

class SymptomAnalysisService {
  /**
   * Analyze symptoms for a pet and return risk assessment
   */
  async analyzeSymptoms(petId: string): Promise<RiskCalculationResult> {
    // Fetch last 30 days of symptoms
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const symptoms = await prisma.symptom.findMany({
      where: {
        petId,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Convert Prisma results to Symptom interface
    const symptomData: Symptom[] = symptoms.map(sym => ({
      id: sym.id,
      description: sym.description,
      severity: sym.severity as 'mild' | 'moderate' | 'severe',
      date: sym.date,
      petId: sym.petId,
    }));

    return calculateRiskScore(symptomData);
  }

  /**
   * Analyze a single symptom in context of pet's history and create alert if needed
   */
  async analyzeAndCreateAlert(input: CreateSymptomInput): Promise<SymptomAnalysisResponse> {
    const { petId } = input;

    // First analyze the symptom in context of existing symptoms
    const analysisResult = await this.analyzeSymptoms(petId);

    // Generate recommendation based on patterns
    const recommendation = generateRecommendationFromPatterns(
      analysisResult.triggeredPatterns,
      analysisResult.riskLevel
    );

    // Create alert if high risk (>= 70)
    let alertCreated = false;
    let alertId: string | undefined;

    if (analysisResult.riskScore >= 70) {
      const alert = await prisma.alert.create({
        data: {
          petId,
          symptomSummary: input.description,
          riskScore: analysisResult.riskScore,
          riskLevel: analysisResult.riskLevel,
          recommendation: recommendation.recommendation,
        },
      });
      alertCreated = true;
      alertId = alert.id;
    }

    return {
      symptomId: '', // Will be set by caller
      riskScore: analysisResult.riskScore,
      riskLevel: analysisResult.riskLevel,
      riskFactors: analysisResult.riskFactors,
      recommendation: recommendation.recommendation,
      disclaimer: recommendation.disclaimer,
      triggeredPatterns: analysisResult.triggeredPatterns,
      alertCreated,
      alertId,
    };
  }

  /**
   * Re-analyze symptoms after an update/delete and update alerts accordingly
   */
  async reanalyzeAndUpdateAlerts(petId: string): Promise<RiskCalculationResult> {
    // Get current analysis
    const analysisResult = await this.analyzeSymptoms(petId);

    // If there are active high-risk alerts but no longer high risk, dismiss them
    if (analysisResult.riskScore < 70) {
      await prisma.alert.updateMany({
        where: {
          petId,
          isDismissed: false,
          riskLevel: 'high',
        },
        data: {
          isDismissed: true,
        },
      });
    }

    return analysisResult;
  }

  /**
   * Get active alert for a pet
   */
  async getActiveAlert(petId: string) {
    return prisma.alert.findFirst({
      where: {
        petId,
        isDismissed: false,
        riskLevel: 'high',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Dismiss an alert
   */
  async dismissAlert(alertId: string) {
    return prisma.alert.update({
      where: { id: alertId },
      data: { isDismissed: true },
    });
  }

  /**
   * Get all active alerts for a pet
   */
  async getActiveAlerts(petId: string) {
    return prisma.alert.findMany({
      where: {
        petId,
        isDismissed: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const symptomAnalysisService = new SymptomAnalysisService();
export default symptomAnalysisService;
