import { PrismaClient, Prisma } from "@db/prisma/generated/client.ts";
import {
  LogDefinition,
  LogLevel,
} from "@db/prisma/generated/internal/prismaNamespace.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const log: (LogLevel | LogDefinition)[] = [
  {
    level: "query",
    emit: "event",
  },
];

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // schema: "public",
});

const singleton = () => new PrismaClient({ adapter, log });

const globalPrisma = global as unknown as { prisma: PrismaClient };

export const prismaClientInstance = globalPrisma.prisma ?? singleton();

if (prismaClientInstance) {
  prismaClientInstance.$on("query" as never, (e) => {
    console.log(e);
  });
}

if (process.env.NODE_ENV !== "production")
  globalPrisma.prisma = prismaClientInstance;
