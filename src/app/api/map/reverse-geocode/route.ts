import { MapService } from '@/services/map.service';

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!KAKAO_REST_API_KEY) {
    return Response.json({ error: 'Kakao API key not configured' }, { status: 500 });
  }

  if (!latitude || !longitude) {
    return Response.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const address = await MapService.reverseGeocode(
      parseFloat(latitude),
      parseFloat(longitude),
      KAKAO_REST_API_KEY
    );
    return Response.json({ address });
  } catch (error) {
    return Response.json({ error: 'Failed to geocode' }, { status: 500 });
  }
}
