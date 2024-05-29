import { followLocationSchema } from '@/lib/zodSchema/followLocation';
import { ZodError } from 'zod';
import { getFollowedLocations } from '@/lib/db/actions';
import { authorize } from '@/lib/auth';
import { ReturnFollowedLocation } from '@/lib/zodSchema/dbTypes';
import { Pool } from '@neondatabase/serverless';
import { getDbUrl } from '@/lib/secrets';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { and, eq, sql } from 'drizzle-orm';
import { usersToLocations } from '@/lib/db/schema';

export async function POST(req: Request) {
  const isAuth = authorize(req);

  if (!isAuth) {
    return Response.json('Unauthorized', { status: 401 });
  }

  try {
    const data = followLocationSchema.parse(await req.json());
    const pool = new Pool({ connectionString: getDbUrl() });

    try {
      const db = drizzle(pool);
      /* check if location is followed */
      const toggleFollow = db.transaction(async (trx) => {
        let hasFollowed: boolean = false;
        try {
          const checkFollowLocation = await trx
            .select({ count: sql<number>`count(*)` })
            .from(usersToLocations)
            .where(
              and(
                eq(usersToLocations.userId, data.userId),
                eq(usersToLocations.locationId, data.locationId)
              )
            )
            .execute();

          hasFollowed = checkFollowLocation[0].count > 0;
        } catch (error) {
          console.error('Error in checking follow location', error);
          throw new Error('Error in checking follow location: ' + error);
        }

        /* if follow but already followed */
        if (data.action === 'follow' && hasFollowed) {
          return Response.json('User has already followed this location', {
            status: 409,
          });
        }

        /* if unfollow but not followed */
        if (data.action === 'unfollow' && !hasFollowed) {
          return Response.json('User has not followed this location', {
            status: 409,
          });
        }

        if (data.action === 'follow') {
          try {
            await trx
              .insert(usersToLocations)
              .values({
                userId: data.userId,
                locationId: data.locationId,
              })
              .execute();
            return Response.json('Follow location success', { status: 201 });
          } catch (error) {
            console.error('Error in following location', error);
            throw new Error('Error in following location: ' + error);
          }
        } else {
          try {
            await trx
              .delete(usersToLocations)
              .where(
                and(
                  eq(usersToLocations.userId, data.userId),
                  eq(usersToLocations.locationId, data.locationId)
                )
              )
              .execute();
            return Response.json('Unfollow location success', { status: 201 });
          } catch (error) {
            console.error('Error in unfollowing location', error);
            throw new Error('Error in unfollowing location: ' + error);
          }
        }
      });
      const res = await toggleFollow;
      pool.end();
      return res;
    } catch (error) {
      console.error('Error in liking post', error);
      pool.end();
      throw new Error('Error in liking post: ' + error);
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
  console.log('GET');
  const isAuth = authorize(req);

  if (!isAuth) {
    return Response.json('Unauthorized', { status: 401 });
  }
  console.log('auhtorized');
  const params = new URL(req.url).searchParams;
  console.log(params);
  const userId: string | null = params.get('userId');
  console.log(userId);

  if (!userId || userId.length === 0) {
    console.log('Invalid Request');
    return Response.json('Invalid Request', { status: 400 });
  }

  try {
    console.log('getFollowedLocations');
    const locations: Array<ReturnFollowedLocation> = await getFollowedLocations(userId);

    console.log(locations);
    return Response.json(locations, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}
