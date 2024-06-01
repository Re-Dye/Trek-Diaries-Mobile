import { getPreference } from "@/lib/db/actions";
import { getAzureSecret, getAzureRecommendationApiUrl } from "@/lib/secrets";
import { ReturnPreference } from "@/lib/zodSchema/dbTypes";

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json('Invalid Request', { status: 400 });
  }

  try {
    const preference: ReturnPreference | null = await getPreference(userId);
  
    if (!preference) {
      return Response.json('Preference or user not found', { status: 404 });
    }
  
    const apiUrl = new URL(getAzureRecommendationApiUrl());
    apiUrl.searchParams.append('code', getAzureSecret());
    apiUrl.searchParams.append('trail_name', preference.trail);
  
    const res = await fetch(apiUrl, {
      method: 'GET',
    });
    return res
  } catch(error) {
    console.error(error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}