import { authorize } from '@/lib/auth';
import { getPost } from '@/lib/db/actions';
import { ReturnPost } from '@/lib/zodSchema/dbTypes';

export async function GET(req: Request) {
  const isAuthorized = authorize(req);

  if (!isAuthorized) {
    return Response.json('Unauthorized', { status: 401 });
  }

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
