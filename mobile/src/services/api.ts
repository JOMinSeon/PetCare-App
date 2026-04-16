import { AnalysisResult, SymptomAnalysis } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL + '/api';

export async function analyzeSymptom(
  petId: string,
  photoUri: string,
  accessToken: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('petId', petId);
  formData.append('photoUrl', {
    uri: photoUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  const response = await fetch(`${API_BASE_URL}/symptom/analyze`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('분석 요청 실패');
  }

  return response.json();
}

export async function getSymptomHistory(
  petId: string,
  accessToken: string
): Promise<SymptomAnalysis[]> {
  const response = await fetch(`${API_BASE_URL}/symptom/history?petId=${petId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('기록 조회 실패');
  }

  const data = await response.json();
  return data.analyses;
}