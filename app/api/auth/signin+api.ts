import { loginSchema } from "@/lib/zodSchema/login";
import { compare } from "bcryptjs";
import { findUser } from "@/lib/db/actions";
import { sign } from "jsonwebtoken";
import { getAuthSecret } from "@/lib/secrets";
import {
  Session,
  SessionPayload,
  sessionSchema,
} from "@/lib/zodSchema/session";

export async function POST(req: Request) {
  try {
    const { email, password } = loginSchema.parse(await req.json()); // validating the credentials

    /* check on database here */
    const result = await findUser(email);

    if (!result) {
      return Response.json("Invalid credentials", { status: 400 });
    }

    const isMatch = await compare(password, result.password);

    if (!isMatch) {
      return Response.json("Invalid credentials", { status: 400 });
    }

    const payload: SessionPayload = {
      id: result.id,
      name: result.name,
      email: result.email,
      dob: result.dob,
      picture: result.image ?? undefined,
      iat: Date.now(),
    };

    const token = sign(payload, getAuthSecret(), {
      algorithm: "HS256",
      expiresIn: 30 * 24 * 60 * 60 * 1000,
    });

    const res: Session = sessionSchema.parse({ token, ...payload });

    return Response.json(res, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return Response.json("Server Error", { status: 500 });
  }
}
