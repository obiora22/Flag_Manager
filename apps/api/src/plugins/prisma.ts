import fp from "fastify-plugin";

import { prismaClientInstance } from "@db/lib/prismaClient.ts";

export default fp(async (fastify) => {
  // Make available to the rest of Fastify
  fastify.decorate("prisma", prismaClientInstance);

  // Graceful shutdown
  fastify.addHook("onClose", async () => {
    await prismaClientInstance.$disconnect();
  });
});
