import { addCommentFormSchema, addCommentFormData } from '@/lib/zodSchema/addComment';
import { addComment, getComments } from '@/lib/db/actions';
import { ZodError } from 'zod';
import { Pool } from '@neondatabase/serverless';
import { getDbUrl } from '@/lib/secrets';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { and, eq, sql } from 'drizzle-orm';
import { posts, comments } from '@/lib/db/schema';
import { authorize } from '@/lib/auth';

export async function POST(req: Request) {
  const isAuthorized = authorize(req);

  if (!isAuthorized) {
    return Response.json('Unauthorized', { status: 401 });
  }

  try {
    const data: addCommentFormData = addCommentFormSchema.parse(await req.json());
    const pool = new Pool({ connectionString: getDbUrl() });

    try {
      const db = drizzle(pool);
      const addComment = db.transaction(async (trx) => {
        /* check if post exists */
        const postExists = await trx
          .select({ count: sql<number>`count(*)` })
          .from(posts)
          .where(eq(posts.id, data.post_id))
          .execute();

        if (postExists[0].count < 1) {
          return Response.json('Post does not exist', { status: 404 });
        }

        /**add the comment to the post */
        const insertedComments = await trx
          .insert(comments)
          .values({
            post_id: data.post_id,
            content: data.content,
            user_id: data.user_id,
          })
          .returning({
            id: comments.id,
            post_id: comments.post_id,
            content: comments.content,
            user_id: comments.user_id,
            registered_time: comments.registered_time,
          })
          .execute();
        return Response.json(insertedComments[0], { status: 201 });
      });

      const res = await addComment;
      pool.end();
      return res;
    } catch (error) {
      console.error('Error in adding comment on the post', error);
      pool.end();
      throw new Error('Error in adding comment on the post: ' + error);
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
  const searchParams = new URL(req.url).searchParams;
  const postId = searchParams.get('postId');
  const _limit = searchParams.get('limit');
  const last = searchParams.get('last');

  try {
    /* if type is paginated and locationId is not given */
    if (!postId || !_limit || !last) {
      return new Response('Invalid Request', { status: 400 });
    } else {
      const limit = +_limit;

      if (isNaN(limit)) {
        return new Response('Invalid Request', { status: 400 });
      }

      const { comments, next } = await getComments(postId, limit, last);

      return Response.json(
        { comments, next },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}
