import { followLocationSchema } from '@/lib/zodSchema/followLocation';
import { ZodError } from 'zod';
import { followLocation, checkFollowLocation, unfollowLocation, getFollowedLocations } from '@/lib/db/actions';
import { authorize } from '@/lib/auth';
import { ReturnFollowedLocation } from '@/lib/zodSchema/dbTypes';

export async function POST(req: Request) {
  const isAuth = authorize(req);

  if (!isAuth) {
    return Response.json('Unauthorized', { status: 401 });
  }

  try {
    const data = followLocationSchema.parse(await req.json());

    const hasFollowed: boolean = await checkFollowLocation(data);

    if (data.action === 'follow' && hasFollowed) {
      return Response.json('User has already followed this location', {
        status: 409,
      });
    }

    if (data.action === 'unfollow' && !hasFollowed) {
      return Response.json('User has not followed this location', {
        status: 409,
      });
    }

    if (data.action === 'follow') {
      await followLocation(data);
      return Response.json('Follow location success', { status: 201 });
    }

    if (data.action === 'unfollow') {
      await unfollowLocation(data);
      return Response.json('Unfollow location success', { status: 201 });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Invalid Request', error);
      return Response.json('Invalid Request', { status: 400 });
    }
    console.error('Error in following location', error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  const isAuth = authorize(req);

  if (!isAuth) {
    return Response.json('Unauthorized', { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const userId: string | null = params.get('userId');

  if (!userId) {
    return Response.json('Invalid Request', { status: 400 });
  }

  try {
    const locations: Array<ReturnFollowedLocation> = await getFollowedLocations(userId);

    return Response.json(locations, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}