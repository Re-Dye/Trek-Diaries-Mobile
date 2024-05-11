import { ExpoRequest, ExpoResponse } from "expo-router/server";
import { loginSchema } from "../../../lib/zodSchemas/login";

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

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      dob: result.dob,
      picture: result.image
    }
  } catch {
    return null;
  }
}
