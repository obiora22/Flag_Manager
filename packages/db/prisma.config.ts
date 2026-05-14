import * as path from "path";
import { config } from "dotenv";
import { defineConfig, env, PrismaConfig } from "prisma/config";

// This allows env file loading outside of repo root directory
config({ path: path.resolve(__dirname, "./.env") });

export default defineConfig({
  schema: "./schema.prisma",
  migrations: {
    path: "./prisma/migrations",
    seed: "tsx ./prisma/seed.js",
  },
  datasource: {
    url: env("DATABASE_DIRECT_URL"),
  },
}) satisfies PrismaConfig;
