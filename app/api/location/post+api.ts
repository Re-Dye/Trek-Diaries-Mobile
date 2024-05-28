import { authorize } from '@/lib/auth';
import { addPost, getPosts } from '@/lib/db/actions';
import { addPostRequestSchema } from '@/lib/zodSchema/addPost';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  const isAuth = authorize(req);

  if (!isAuth) {
    return Response.json('Unauthorized', { status: 401 });
  }

  try {
    const data = addPostRequestSchema.parse(await req.json());
    await addPost({
      accessibility: data.accessibility,
      description: data.description,
      location_id: data.location_id,
      owner_id: data.owner_id,
      picture_url: data.image_url,
      trail_condition: data.trail_condition,
      weather: data.weather,
    });
    return Response.json('Post added', { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json('Invalid request', { status: 400 });
    }
    return Response.json('Server error', { status: 500 });
  }
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const locationId: string | null = params.get('locationId');
  const _limit: string | null = params.get('limit');
  const last: string | null = params.get('last');

  try {
    /* if type is paginated and locationId is not given */
    if (!locationId || !_limit || !last) {
      return Response.json('Invalid Request', { status: 400 });
    } else {
      const limit = +_limit;

      if (isNaN(limit)) {
        return Response.json('Invalid Request', { status: 400 });
      }

      const { posts, next } = await getPosts(locationId, limit, last);

      return Response.json({ posts, next }, {
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}
