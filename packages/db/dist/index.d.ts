import { healthCheck } from "./lib/healthCheck.js";
export * as typeContracts from "./contracts.js";
export * as ruleEngine from "./rules.js";
export * as models from "./prisma/generated/models.js";
export * as prismaEnums from "./prisma/generated/enums.js";
export * as generatedPrismaBrowserTypes from "./prisma/generated/browser.js";
export * as generatedPrismaServerTypes from "./prisma/generated/client.js";
export declare const utils: {
    healthCheck: typeof healthCheck;
    narrowError: (error: unknown) => Error;
    prismaClientInstance: import("./prisma/generated/client.js").PrismaClient;
    handleError: (error: unknown) => {
        status: string;
        error: string;
    };
    handleResult: <T>(result: T | null) => {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: T & ({} | undefined);
    };
};
//# sourceMappingURL=index.d.ts.map