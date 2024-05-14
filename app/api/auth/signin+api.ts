import { loginSchema } from "../../../lib/zodSchema/login";
import { compare } from "bcryptjs";
import { findUser } from "../../../lib/db/actions";
import { sign } from "jsonwebtoken";
import { getAuthSecret } from "../../../lib/secrets";

export async function GET() {
  return new Response("Hello from the API!");
}

export async function POST(req: Request) {
  try {
    const { email, password } = loginSchema.parse(await req.json()); // validating the credentials

    /* check on database here */
    const result = await findUser(email);

    if (!result) {
      //if the email is unregistered...
      return new Response("Invalid credentials", { status: 400 });
    }

    const isMatch = await compare(password, result.password);

    if (!isMatch) {
      // if password is incorrect
      return new Response("Invalid credentials", { status: 400 });
    }

    const session = sign(
      {
        id: result.id,
        name: result.name,
        email: result.email,
        dob: result.dob,
        picture: result.image,
        iat: Date.now(),
      },
      getAuthSecret(),
      { algorithm: "HS256", expiresIn: 30 * 24 * 60 * 60 * 1000 }
    );

    return new Response(JSON.stringify({ session }), { status: 200 });
  } catch {
    console.error(Error);
    return new Response("Invalid credentials", { status: 400 });
  }
}
