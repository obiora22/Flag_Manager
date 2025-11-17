import { defineConfig, env } from 'prisma/config';

console.log(process.env);
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DEVELOPMENT_DATABASE_URL'),
  },
});
