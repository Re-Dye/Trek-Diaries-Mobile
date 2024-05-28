import { authorize } from '@/lib/auth';
import { getLocation } from '@/lib/db/actions';

export async function GET(req: Request) {
  const isAuth = authorize(req);
  if (!isAuth) {
    return Response.json('Unauthorized', { status: 401 });
  }

  const searchParams = new URL(req.url).searchParams;
  const locationId = searchParams.get('locationId');

  if (!locationId) {
    return Response.json('Invalid Request', { status: 400 });
  }

  try {
    const location = await getLocation(locationId);
    return Response.json(location, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}
