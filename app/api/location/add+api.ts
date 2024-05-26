import { AddLocationFormSchema } from '@/lib/zodSchema/addLocation';
import { countLocationByAddress, addLocation } from '@/lib/db/actions';
import { ZodError } from 'zod';
import { getAlgoliaAdminKey, getAlgoliaAppId } from '@/lib/secrets';
import algoliasearch from 'algoliasearch';
import { ReturnLocation } from '@/lib/zodSchema/dbTypes';
import { authorize } from '@/lib/auth';

export async function POST(req: Request) {
  const isAuth = authorize(req);

  if (!isAuth) {
    return Response.json('Unauthorized', { status: 401 });
  }
  
  try {
    const client = algoliasearch(getAlgoliaAppId(), getAlgoliaAdminKey());
    // console.log(client);
    const index = client.initIndex('locations');
    // console.log(index);
    const data = AddLocationFormSchema.parse(await req.json());
    const address = `${data.place}, ${data.state}, ${data.country}`;
    // console.log(address);
    // console.log(data.description);

    if ((await countLocationByAddress(address)) > 0) {
      return Response.json('Location already exists', { status: 409 });
    }

    const location: ReturnLocation = await addLocation({
      address,
      description: data.description,
    });

    index.saveObject({
      objectID: location.id,
      address: location.address,
      description: location.description,
      registered_time: location.registered_time,
    });

    return Response.json(location, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json('Invalid Request', { status: 400 });
    } else {
      console.log(error);
      return Response.json('Internal Server Error', { status: 500 });
    }
  }
}
