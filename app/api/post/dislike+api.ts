import { likePostSchema, LikePost } from "@/lib/zodSchema/likePost";
import { dislikePost, isPostLiked, postExists } from "@/lib/db/actions";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const data: LikePost = likePostSchema.parse(await req.json());

    // if (!(await postExists(data.postId))) {
    //   return Response.json("Post does not exist", { status: 404 });
    // }

    // if (!(await isPostLiked(data))) {
    //   return Response.json("Post already disliked", { status: 409 });
    // }
    console.log("disliking")

    const likes: number = await dislikePost(data);
    return Response.json({ likes }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json("Invalid request", { status: 400 });
    }
    console.error(error);
    return Response.json("Internal server error", { status: 500 });
  }
} 