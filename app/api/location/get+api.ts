import { getFollowedLocations } from "@/lib/db/actions";
import { ReturnFollowedLocation } from "@/lib/zodSchema/dbTypes";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const userId: string | null = params.get("userId");

  if (!userId) {
    return new Response("Invalid Request", { status: 400 });
  }

  try {
    const locations: Array<ReturnFollowedLocation> = await getFollowedLocations(userId);

    return Response.json(JSON.stringify(locations), { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}
