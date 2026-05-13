import { narrowError } from "./narrowError.js";
export async function healthCheck(prismaInstance) {
    const queryStart = Date.now();
    try {
        const result = await prismaInstance.$queryRaw `
    SELECT current_database()
  `;
        const latency = Date.now() - queryStart;
        return {
            healthy: true,
            latency,
            dbQueryResult: result[0]?.current_databse,
            error: null,
        };
    }
    catch (err) {
        return {
            healthy: false,
            latency: null,
            dbQueryResult: null,
            error: narrowError(err).message,
        };
    }
}
//# sourceMappingURL=healthCheck.js.map