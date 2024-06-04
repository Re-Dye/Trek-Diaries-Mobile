import { authorize } from '@/lib/auth';
import { addPost, getPost } from '@/lib/db/actions';
import { addPostRequestSchema } from '@/lib/zodSchema/addPost';
import { ReturnPost } from '@/lib/zodSchema/dbTypes';
import { ZodError } from 'zod';

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const postId: string | null = params.get('postId');

  try {
    if (!postId) {
      return Response.json('Invalid Request', { status: 400 });
    } else {
      const res: ReturnPost = await getPost(postId);

      return Response.json(
        { res },
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
