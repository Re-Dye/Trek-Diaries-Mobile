import { AddLocationFormSchema } from '@/lib/zodSchema/addLocation';
import { countLocationByAddress, addLocation } from '@/lib/db/actions';
import { ZodError } from 'zod';
import { getAlgoliaAdminKey, getAlgoliaAppId, getDbUrl } from '@/lib/secrets';
import algoliasearch from 'algoliasearch';
import { ReturnLocation } from '@/lib/zodSchema/dbTypes';
import { authorize } from '@/lib/auth';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, sql } from 'drizzle-orm';
import { locations } from '@/lib/db/schema';

export async function POST(req: Request) {
  const isAuth = authorize(req);

  if (!isAuth) {
    return Response.json('Unauthorized', { status: 401 });
  }

  try {
    const client = algoliasearch(getAlgoliaAppId(), getAlgoliaAdminKey());
    const index = client.initIndex('locations');
    const data = AddLocationFormSchema.parse(await req.json());
    const address = `${data.place}, ${data.state}, ${data.country}`;
    const pool = new Pool({ connectionString: getDbUrl() });

    try {
      const db = drizzle(pool);
      const addLocation = db.transaction(async (trx) => {
        const countLocation = await trx
          .select({ count: sql<number>`count(*)` })
          .from(locations)
          .where(eq(locations.address, address))
          .execute();

        if (countLocation[0].count > 0) {
          return Response.json('Location already exists', { status: 409 });
        }

        const addLocation = await trx
          .insert(locations)
          .values({
            address,
            description: data.description,
          })
          .returning()
          .execute();

        const location: ReturnLocation = addLocation[0];

        index.saveObject({
          objectID: location.id,
          address: location.address,
          description: location.description,
          registered_time: location.registered_time,
        });

        return Response.json(location, { status: 201 });
      });
      const res = await addLocation;
      pool.end();
      return res;
    } catch (error) {
      console.error('Error in adding location', error);
      pool.end();
      throw new Error('Error in adding location: ' + error);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json('Invalid Request', { status: 400 });
    } else {
      console.log(error);
      return Response.json('Internal Server Error', { status: 500 });
    }
  }
}
