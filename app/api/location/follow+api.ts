import { followLocationSchema } from '@/lib/zodSchema/followLocation';
import { ZodError } from 'zod';
import { followLocation, checkFollowLocation, unfollowLocation } from '@/lib/db/actions';

export async function POST(req: Request) {
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
