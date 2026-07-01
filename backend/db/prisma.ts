// Single shared Prisma Client, connected through the node-postgres driver adapter
// (required in Prisma 7's Rust-free client).
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { config } from '../config.ts';

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is not set. Add it to server/.env');
}

// The pg driver adapter ignores the `?schema=` URL param (Prisma issue #28770),
// so we read it ourselves and pass it as the adapter's `schema` option. Prisma then
// schema-qualifies every query (e.g. prodomatix_app.users), keeping this app isolated
// from any other tables in the same database.
function schemaFromUrl(url: string): string {
  try {
    return new URL(url).searchParams.get('schema') || 'public';
  } catch {
    return 'public';
  }
}

const schema = schemaFromUrl(config.databaseUrl);

const adapter = new PrismaPg({ connectionString: config.databaseUrl }, { schema });

export const prisma = new PrismaClient({ adapter });
