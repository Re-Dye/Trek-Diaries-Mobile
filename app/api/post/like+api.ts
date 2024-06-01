import { likePostSchema, LikePost } from '@/lib/zodSchema/likePost';
import { isPostLiked } from '@/lib/db/actions';
import { ZodError } from 'zod';
import { Pool } from '@neondatabase/serverless';
import { getDbUrl } from '@/lib/secrets';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { and, eq, sql } from 'drizzle-orm';
import { posts, usersLikePosts } from '@/lib/db/schema';
import { authorize } from '@/lib/auth';

export async function POST(req: Request) {
  const isAuthorized = authorize(req);

  if (!isAuthorized) {
    return Response.json('Unauthorized', { status: 401 });
  }

  try {
    const data: LikePost = likePostSchema.parse(await req.json());

    const pool = new Pool({ connectionString: getDbUrl() });

    try {
      const db = drizzle(pool);
      const likePost = db.transaction(async (trx) => {
        /* check if post exists */
        const postExists = await trx
          .select({ count: sql<number>`count(*)` })
          .from(posts)
          .where(eq(posts.id, data.postId))
          .execute();

        if (postExists[0].count < 1) {
          return Response.json('Post does not exist', { status: 404 });
        }

        /* check if post is already liked */
        const isPostLiked = await trx
          .select({ count: sql<number>`count(*)` })
          .from(usersLikePosts)
          .where(
            and(eq(usersLikePosts.user_id, data.userId), eq(usersLikePosts.post_id, data.postId))
          )
          .execute();
        if (isPostLiked[0].count > 0) {
          return Response.json('Post already liked', { status: 409 });
        }

        /* like the post */
        await trx
          .insert(usersLikePosts)
          .values({
            user_id: data.userId,
            post_id: data.postId,
          })
          .execute();
        const res: { likes: number }[] = await trx
          .update(posts)
          .set({
            likes_count: sql<number>`${posts.likes_count} + 1`,
          })
          .where(eq(posts.id, data.postId))
          .returning({ likes: posts.likes_count })
          .execute();
        return Response.json({ likes: res[0].likes }, { status: 201 });
      });

      const res = await likePost;
      pool.end();
      return res;
    } catch (error) {
      console.error('Error in liking post', error);
      pool.end();
      throw new Error('Error in liking post: ' + error);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json('Invalid request', { status: 400 });
    }
    console.error(error);
    return Response.json('Internal server error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const userId: string | null = searchParams.get('userId');
    const postId: string | null = searchParams.get('postId');

    if (!userId || !postId) {
      return Response.json('Invalid Request', { status: 400 });
    }

    const data: LikePost = { userId, postId };
    const isLiked: boolean = await isPostLiked(data);
    return Response.json({ isLiked }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}
