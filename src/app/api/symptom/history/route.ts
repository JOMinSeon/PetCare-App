import { getCurrentUser } from '@/auth/auth';
import { getSymptomAnalysesByPet } from '@/services/symptom.service';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const petId = searchParams.get('petId');

    if (!petId) {
      return Response.json(
        { error: 'petId is required' },
        { status: 400 }
      );
    }

    const analyses = await getSymptomAnalysesByPet(petId, user.id);

    return Response.json({
      analyses: analyses.map((a) => ({
        id: a.id,
        petId: a.petId,
        photoUrl: a.photoUrl,
        symptoms: a.symptoms,
        urgencyLevel: a.urgencyLevel,
        recommendation: a.recommendation,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Get symptom history error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}