import { config } from "dotenv";
import * as path from "path";
import { defineConfig, env, PrismaConfig } from "prisma/config";

// This allows env file loading outside of repo root directory
config({ path: path.resolve(__dirname, "./.env") });

export default defineConfig({
  schema: "./schema.prisma",
  migrations: {
    path: "./prisma/migrations",
    seed: "./prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
}) satisfies PrismaConfig;
