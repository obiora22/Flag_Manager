import { PrismaClient } from "../prisma/generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
// import { User } from "../prisma/generated/models.js"
const log = [
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
const globalPrisma = global;
export const prismaClientInstance = globalPrisma.prisma ?? singleton();
if (prismaClientInstance) {
    prismaClientInstance.$on("query", (e) => {
        console.log(e);
    });
}
if (process.env.NODE_ENV !== "production")
    globalPrisma.prisma = prismaClientInstance;
//# sourceMappingURL=prismaClient.js.map