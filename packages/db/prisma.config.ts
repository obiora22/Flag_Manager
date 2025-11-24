import "dotenv/config";
import { defineConfig, env, PrismaConfig } from "prisma/config";

console.log(process.env);
export default defineConfig({
  schema: "./schema.prisma",
  migrations: {
    path: "./prisma/migrations",
    seed: "./prisma/seed.ts",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
