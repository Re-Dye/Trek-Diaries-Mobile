import { ExpoRequest, ExpoResponse } from "expo-router/server";
import { loginSchema } from "../../../lib/zodSchema/login";
import { compare } from "bcrypt";
import { findUser } from "../../../lib/db/actions";

export async function GET() {
  return ExpoResponse.json({ message: "Hello from the API!" });
}

export async function POST(req: ExpoRequest) {
  try {
    const { email, password } = loginSchema.parse(await req.json()); // validating the credentials

    /* check on database here */
    const result = await findUser(email);

    if (!result) {
      //if the email is unregistered...
      return null;
    }

    const isMatch = await compare(password, result.password);

    if (!isMatch) {
      // if password is incorrect
      return null;
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
    return ExpoResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }
}
