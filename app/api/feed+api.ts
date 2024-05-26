import { getFeed } from "@/lib/db/actions";

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const userId = params.get("userId");
    const _limit = params.get("limit");
    const last = params.get("last");

    if (!userId || !_limit || !last) {
      return Response.json("Invalid Request", { status: 400 });
    } else {
      const limit = +_limit;

      if (isNaN(limit)) {
        return Response.json("Invalid Request", { status: 400 });
      }

      const { posts, next } = await getFeed(userId, limit, last);

      return Response.json({ posts, next }, {
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}