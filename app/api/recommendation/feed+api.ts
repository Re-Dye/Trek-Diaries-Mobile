import { authorize } from '@/lib/auth';
import { getExploreFeed } from '@/lib/db/actions';

export async function GET(req: Request) {
  try {
    const isAuth = authorize(req);

    if (!isAuth) {
      return Response.json('Unauthorized', { status: 401 });
    }

    const params = new URL(req.url).searchParams;
    const _locations = params.get('location');
    const _limit = params.get('limit');
    const last = params.get('last');

    if (!_locations || !_limit || !last) {
      return Response.json('Invalid Request', { status: 400 });
    } else {
      const limit = +_limit;
      
      if (isNaN(limit)) {
        return Response.json('Invalid Request', { status: 400 });
      }
      
      const locations: string[] = JSON.parse(_locations);

      const { posts, next } = await getExploreFeed(locations, limit, last);

      return Response.json(
        { posts, next },
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
