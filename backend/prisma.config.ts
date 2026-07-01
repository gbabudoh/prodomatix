import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Runs on `prisma migrate dev` / `prisma migrate reset` / `prisma db seed`.
    seed: 'tsx db/seed.ts'
  },
  datasource: {
    // Used by the CLI for migrations. The runtime client connects via the pg adapter.
    url: env('DATABASE_URL')
  }
});
