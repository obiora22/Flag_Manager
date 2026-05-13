import { prismaClientInstance } from "@packages/db/utils";
import fp from "fastify-plugin";
export default fp(async (fastify) => {
    // Make available to the rest of Fastify
    fastify.decorate("prisma", prismaClientInstance);
    // Graceful shutdown
    fastify.addHook("onClose", async () => {
        await prismaClientInstance.$disconnect();
    });
});
//# sourceMappingURL=prisma.js.map