import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { Prisma, PrismaClient, type User } from "../prisma/generated/client.js";
import { LogDefinition, LogLevel } from "../prisma/generated/internal/prismaNamespace.js";

const log: (LogLevel | LogDefinition)[] = [
  {
    level: "query",
    emit: "event",
  },
];

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const singleton = () => new PrismaClient({ adapter, log });

const globalPrisma = global as unknown as { prisma: PrismaClient };

export const prismaClientInstance = globalPrisma.prisma ?? singleton();

if (prismaClientInstance) {
  prismaClientInstance.$on("query" as never, (e) => {
    console.log(e);
  });
}

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prismaClientInstance;
