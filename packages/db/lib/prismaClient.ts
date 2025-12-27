import { PrismaClient, Prisma } from "@db/prisma/generated/client";
import {
  LogDefinition,
  LogLevel,
} from "@db/prisma/generated/internal/prismaNamespace";
import { PrismaPg } from "@prisma/adapter-pg";

const log: (LogLevel | LogDefinition)[] = [
  {
    level: "query",
    emit: "event",
  },
];

// resolve prisma accelerate
// const config: Prisma.PrismaClientOptions = {
//   accelerateUrl:
//     process.env.PRISMA_ACCELERATE_URL || "your-accelerate-url-here",
//   log
// };

const adapter = new PrismaPg({
  connectiontring: process.env.DATABASE_URL,
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
