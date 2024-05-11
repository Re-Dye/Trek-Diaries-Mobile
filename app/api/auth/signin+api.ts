import { ExpoResponse } from "expo-router/server";
import { loginSchema } from "../../../lib/zodSchema/login";
import { compare } from "bcryptjs";
import { findUser } from "../../../lib/db/actions";

export async function GET() {
  return ExpoResponse.json({ message: "Hello from the API!" });
}

export async function POST(req: Request) {
  try {
    const { email, password } = loginSchema.parse(await req.json()); // validating the credentials

    /* check on database here */
    const result = await findUser(email);

    if (!result) {
      //if the email is unregistered...
      return ExpoResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await compare(password, result.password);

    if (!isMatch) {
      // if password is incorrect
      return ExpoResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    return ExpoResponse.json(
      {
        id: result.id,
        name: result.name,
        email: result.email,
        dob: result.dob,
        picture: result.image,
      },
      { status: 200 }
    );
  } catch {
    console.error(Error);
    return ExpoResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }
}
