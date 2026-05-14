import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../prisma/generated/client.js";
const log = [
    {
        level: "query",
        emit: "event",
    },
];
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
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