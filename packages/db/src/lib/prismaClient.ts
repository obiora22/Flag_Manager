import { PrismaClient, Prisma, type User } from "../prisma/generated/client.js";
import { LogDefinition, LogLevel } from "../prisma/generated/internal/prismaNamespace.js";
import { PrismaPg } from "@prisma/adapter-pg";
// import { User } from "../prisma/generated/models.js"

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

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prismaClientInstance;
