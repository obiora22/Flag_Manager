import { PrismaClient } from "../prisma/generated/client.js";
import { narrowError } from "./narrowError.js";

type Result =
  | {
      healthy: true;
      latency: number | null;
      dbQueryResult: string | null;
      error: null;
    }
  | {
      healthy: false;
      latency: number | null;
      dbQueryResult: string | null;
      error: string;
    };

export async function healthCheck(prismaInstance: PrismaClient): Promise<Result> {
  const queryStart = Date.now();

  try {
    const result = await prismaInstance.$queryRaw<[{ current_databse: string }]>`
    SELECT current_database()
  `;
    const latency = Date.now() - queryStart;

    return {
      healthy: true,
      latency,
      dbQueryResult: result[0]?.current_databse,
      error: null,
    };
  } catch (err) {
    return {
      healthy: false,
      latency: null,
      dbQueryResult: null,
      error: narrowError(err).message,
    };
  }
}
