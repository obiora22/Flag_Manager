import fp from "fastify-plugin";

import { prismaClientInstance } from "./lib/prismaClient";
export default fp(async (fastify) => {
  // const prisma = new PrismaClient();

  // Make available to the rest of Fastify
  fastify.decorate("prisma", prismaClientInstance);

  // Graceful shutdown
  fastify.addHook("onClose", async () => {
    await prismaClientInstance.$disconnect();
  });
});
