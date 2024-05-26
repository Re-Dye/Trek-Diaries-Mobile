import { likePostSchema, LikePost } from "@/lib/zodSchema/likePost";
import { isPostLiked, likePost, postExists } from "@/lib/db/actions";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const data: LikePost = likePostSchema.parse(await req.json());
    
    // const exists = await postExists(data.postId);
    // if (!exists) {
    //   return Response.json("Post does not exist", { status: 404 });
    // }
    
    // const isLiked = await isPostLiked(data);
    // if (isLiked) {
    //   return Response.json("Post already liked", { status: 409 });
    // }
    console.log("liking")
    const likes: number = await likePost(data);
    return Response.json({ likes }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json("Invalid request", { status: 400 });
    }
    console.error(error);
    return Response.json("Internal server error", { status: 500 });
  }
} 

export async function GET(req: Request) { 
  try {
    const searchParams = new URL(req.url).searchParams;
    const userId: string | null = searchParams.get("userId");
    const postId: string | null = searchParams.get("postId");
    
    if (!userId || !postId) {
      return Response.json("Invalid Request", { status: 400 });
    }

    const data: LikePost = { userId, postId };
    const isLiked: boolean = await isPostLiked(data);
    return Response.json({ isLiked }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}