import { MapService } from '@/services/map.service';

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const category = searchParams.get('category');
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const radius = searchParams.get('radius') || '3000';

  if (!KAKAO_REST_API_KEY) {
    return Response.json({ error: 'Kakao API key not configured' }, { status: 500 });
  }

  if (!latitude || !longitude) {
    return Response.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    let results;
    if (keyword) {
      results = await MapService.searchByKeyword(
        keyword,
        parseFloat(latitude),
        parseFloat(longitude),
        parseInt(radius),
        KAKAO_REST_API_KEY
      );
    } else if (category) {
      results = await MapService.searchByCategory(
        category,
        parseFloat(latitude),
        parseFloat(longitude),
        parseInt(radius),
        KAKAO_REST_API_KEY
      );
    } else {
      return Response.json({ error: 'Either keyword or category is required' }, { status: 400 });
    }
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: 'Failed to search' }, { status: 500 });
  }
}
