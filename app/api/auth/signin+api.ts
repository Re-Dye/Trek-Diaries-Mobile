import { loginSchema } from '@/lib/zodSchema/login';
import { compare } from 'bcryptjs';
import { findUser } from '@/lib/db/actions';
import { sign } from 'jsonwebtoken';
import { getAuthSecret } from '@/lib/secrets';
import { Session, SessionPayload, sessionSchema } from '@/lib/zodSchema/session';

export async function POST(req: Request) {
  try {
    let email: string, password: string;

    try {
      const body = await req.json();
      ({ email, password } = loginSchema.parse(body)); // Validate the credentials
    } catch (error) {
      return new Response(JSON.stringify('Bad request.'), { status: 400 });
    }

    // Check on database here
    const result = await findUser(email);

    if (!result) {
      return new Response(JSON.stringify('Invalid credentials.'), { status: 400 });
    }

    const isMatch = await compare(password, result.password);

    if (!isMatch) {
      return new Response(JSON.stringify('Invalid credentials'), { status: 400 });
    }

    const payload: SessionPayload = {
      id: result.id,
      name: result.name,
      email: result.email,
      dob: result.dob,
      picture: result.image ?? undefined,
      iat: Math.floor(Date.now() / 1000), // iat should be in seconds
    };

    const token = sign(payload, getAuthSecret(), {
      algorithm: 'HS256',
      expiresIn: '30d', // Use a string to specify the time span
    });

    const res: Session = sessionSchema.parse({ token, ...payload });

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify('Server Error'), { status: 500 });
  }
}
