import { getCurrentUser } from '@/auth/auth';
import { analyzeSymptom } from '@/services/symptom.service';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const petId = formData.get('petId') as string;
    const photoUrl = formData.get('photoUrl') as string;

    if (!petId || !photoUrl) {
      return Response.json(
        { error: 'petId and photoUrl are required' },
        { status: 400 }
      );
    }

    const result = await analyzeSymptom(user.id, { petId, photoUrl });

    if (!result) {
      return Response.json(
        { error: 'Pet not found or access denied' },
        { status: 404 }
      );
    }

    return Response.json({
      id: result.id,
      petId: result.petId,
      photoUrl: result.photoUrl,
      symptoms: result.symptoms,
      urgencyLevel: result.urgencyLevel,
      recommendation: result.recommendation,
      createdAt: result.createdAt.toISOString(),
      disclaimer: '본 분석 결과는 참고용이며, 전문 수의사 진단의 대체가 아닙니다.',
    });
  } catch (error) {
    console.error('Symptom analysis error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}