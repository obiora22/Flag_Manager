import { PrismaClient } from "@packages/db/prisma/server";
import { type BaseEnvironment } from "@packages/schema";
export declare class EnvironmentServices {
    static findAll(dbClientInstance: PrismaClient): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            environment: import("@packages/db/enums").FlagEnvironmentType;
            overrides: import("@prisma/client/runtime/client").JsonValue;
            flagId: string;
        }[];
    }>;
    static findUnique(dbClientInstance: PrismaClient, id: string): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            environment: import("@packages/db/enums").FlagEnvironmentType;
            overrides: import("@prisma/client/runtime/client").JsonValue;
            flagId: string;
        };
    }>;
    static create(dbClientInstance: PrismaClient, data: BaseEnvironment): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            environment: import("@packages/db/enums").FlagEnvironmentType;
            overrides: import("@prisma/client/runtime/client").JsonValue;
            flagId: string;
        };
    }>;
    static delete(dbClientInstance: PrismaClient, id: string): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            environment: import("@packages/db/enums").FlagEnvironmentType;
            overrides: import("@prisma/client/runtime/client").JsonValue;
            flagId: string;
        };
    }>;
}
//# sourceMappingURL=environmentServices.d.ts.map