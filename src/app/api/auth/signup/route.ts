import { signup } from '@/auth/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Validate password length
    if (!password || password.length < 8) {
      return Response.json(
        { error: 'Password too short' },
        { status: 400 }
      );
    }

    const user = await signup(email, password);

    return Response.json(
      { user: { id: user.id, email: user.email, createdAt: user.createdAt } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Email already exists') {
        return Response.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
      if (error.message === 'Invalid email') {
        return Response.json(
          { error: 'Invalid email' },
          { status: 400 }
        );
      }
      if (error.message === 'Password too short') {
        return Response.json(
          { error: 'Password too short' },
          { status: 400 }
        );
      }
    }
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}