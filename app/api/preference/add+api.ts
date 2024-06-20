import { addPreference, updatePreference } from '@/lib/db/actions';
import { InsertPreference, insertPreferenceSchema } from '@/lib/zodSchema/dbTypes';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const data: InsertPreference = insertPreferenceSchema.parse(await req.json());

    await addPreference(data);

    return Response.json('Preference added...', { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json('Invalid request', { status: 400 });
    }
    console.error(error);
    return Response.json('Internal server error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data: InsertPreference = insertPreferenceSchema.parse(await req.json());

    await updatePreference(data);

    return Response.json('Preference update...', { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json('Invalid request', { status: 400 });
    }
    console.error(error);
    return Response.json('Internal server error', { status: 500 });
  }
}
