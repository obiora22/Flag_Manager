import { PrismaClient } from "../prisma/generated/client.js";
type Result = {
    healthy: true;
    latency: number | null;
    dbQueryResult: string | null;
    error: null;
} | {
    healthy: false;
    latency: number | null;
    dbQueryResult: string | null;
    error: string;
};
export declare function healthCheck(prismaInstance: PrismaClient): Promise<Result>;
export {};
//# sourceMappingURL=healthCheck.d.ts.map