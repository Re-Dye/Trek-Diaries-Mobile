import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { getDbUrl } from '../secrets';
import * as schema from './schema';

const sql = neon(getDbUrl());
export const db = drizzle(sql, { schema });
