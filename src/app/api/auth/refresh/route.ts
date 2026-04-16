import { refreshAccessToken } from '@/auth/auth';

export async function POST(request: Request) {
  try {
    // Get refresh token from cookie
    const cookieHeader = request.headers.get('Cookie');
    const cookies = cookieHeader?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const refreshToken = cookies?.refresh_token;

    if (!refreshToken) {
      return Response.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    const result = await refreshAccessToken(refreshToken);

    if (!result) {
      return Response.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    return Response.json(
      { accessToken: result.accessToken },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}