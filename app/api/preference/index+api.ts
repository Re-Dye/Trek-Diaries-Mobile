import { authorize } from '@/lib/auth';
import { getPreference } from '@/lib/db/actions';
import { ReturnPreference } from '@/lib/zodSchema/dbTypes';

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const postId: string | null = params.get('userId');

  const isAuthorized = authorize(req);

  if (!isAuthorized) {
    return Response.json('Unauthorized', { status: 401 });
  }

  try {
    if (!postId) {
      return Response.json('Invalid Request', { status: 400 });
    } else {
      const res: ReturnPreference | null = await getPreference(postId);

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
