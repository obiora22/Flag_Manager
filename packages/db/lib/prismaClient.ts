import { PrismaClient, Prisma } from "@db/prisma/generated/client";

const config: Prisma.PrismaClientOptions = {
  log: [
    {
      level: "query",
      emit: "event",
    },
  ],
};

const singleton = () => new PrismaClient(config);

const globalPrisma = global as unknown as { prisma: PrismaClient };

export const prismaClientInstance = globalPrisma.prisma ?? singleton();

if (prismaClientInstance) {
  prismaClientInstance.$on("query" as never, (e) => {
    console.log(e);
  });
}

if (process.env.NODE_ENV !== "production")
  globalPrisma.prisma = prismaClientInstance;
