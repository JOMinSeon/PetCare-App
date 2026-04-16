import { login } from '@/auth/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const result = await login(email, password);

    // Create response with access token
    const response = Response.json(
      {
        user: { id: result.user.id, email: result.user.email },
        accessToken: result.accessToken,
      },
      { status: 200 }
    );

    // Set httpOnly refresh_token cookie (7 day expiry)
    response.headers.append(
      'Set-Cookie',
      `refresh_token=${result.refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    );

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}