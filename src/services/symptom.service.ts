/**
 * Symptom Analysis Service
 * Phase 1-2: AI Symptom Analysis
 */

import { PrismaClient, UrgencyLevel } from '@prisma/client';
import { SymptomAnalysisInput, SymptomAnalysisResponse, UrgencyLevel as UrgencyLevelEnum } from '../models/pet';

const prisma = new PrismaClient();

interface AIAnalysisResult {
  symptoms: string;
  urgencyLevel: UrgencyLevelEnum;
  recommendation: string;
}

function mockAIAnalysis(_imageUrl: string): AIAnalysisResult {
  const symptoms = '피부 발적, 가려움증 의심';
  const urgencyLevel = UrgencyLevelEnum.YELLOW;
  const recommendation = '24시간 이내 동물병원 방문을 권장합니다. 증상이 악화될 경우 즉시 진료를 받아주세요.';

  return { symptoms, urgencyLevel, recommendation };
}

export async function analyzeSymptom(
  userId: string,
  input: SymptomAnalysisInput
): Promise<SymptomAnalysisResponse | null> {
  const pet = await prisma.pet.findUnique({
    where: { id: input.petId },
  });

  if (!pet || pet.userId !== userId) {
    return null;
  }

  const aiResult = mockAIAnalysis(input.photoUrl);

  const analysis = await prisma.symptomAnalysis.create({
    data: {
      petId: input.petId,
      photoUrl: input.photoUrl,
      symptoms: aiResult.symptoms,
      urgencyLevel: aiResult.urgencyLevel as UrgencyLevel,
      recommendation: aiResult.recommendation,
    },
  });

  return {
    id: analysis.id,
    petId: analysis.petId,
    photoUrl: analysis.photoUrl,
    symptoms: analysis.symptoms,
    urgencyLevel: analysis.urgencyLevel as UrgencyLevelEnum,
    recommendation: analysis.recommendation,
    createdAt: analysis.createdAt,
  };
}

export async function getSymptomAnalysesByPet(
  petId: string,
  userId: string
): Promise<SymptomAnalysisResponse[]> {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
  });

  if (!pet || pet.userId !== userId) {
    return [];
  }

  const analyses = await prisma.symptomAnalysis.findMany({
    where: { petId },
    orderBy: { createdAt: 'desc' },
  });

  return analyses.map((a) => ({
    id: a.id,
    petId: a.petId,
    photoUrl: a.photoUrl,
    symptoms: a.symptoms,
    urgencyLevel: a.urgencyLevel as UrgencyLevelEnum,
    recommendation: a.recommendation,
    createdAt: a.createdAt,
  }));
}