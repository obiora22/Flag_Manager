import { Prisma, PrismaClient } from "@packages/db/prisma/server";
import { BaseFlag, UpdateFlag } from "@packages/schema";
export declare class FlagService {
    static getFlags(dbClientInstance: PrismaClient, projectId: string): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: ({
            environments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                environment: import("@packages/db/enums").FlagEnvironmentType;
                overrides: import("@prisma/client/runtime/client").JsonValue;
                flagId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            description: string | null;
            rules: import("@prisma/client/runtime/client").JsonValue;
            returnValueType: import("@packages/db/enums").ReturnValueType;
            defaultValue: import("@prisma/client/runtime/client").JsonValue;
            archived: boolean;
            enabled: boolean;
            projectId: string;
        })[];
    }>;
    static getFlag(dbClientInstance: PrismaClient, id: string): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            environments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                environment: import("@packages/db/enums").FlagEnvironmentType;
                overrides: import("@prisma/client/runtime/client").JsonValue;
                flagId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            description: string | null;
            rules: import("@prisma/client/runtime/client").JsonValue;
            returnValueType: import("@packages/db/enums").ReturnValueType;
            defaultValue: import("@prisma/client/runtime/client").JsonValue;
            archived: boolean;
            enabled: boolean;
            projectId: string;
        };
    }>;
    static createFlag(dbClientInstance: PrismaClient, data: BaseFlag): Promise<{
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
            key: string;
            description: string | null;
            rules: import("@prisma/client/runtime/client").JsonValue;
            returnValueType: import("@packages/db/enums").ReturnValueType;
            defaultValue: import("@prisma/client/runtime/client").JsonValue;
            archived: boolean;
            enabled: boolean;
            projectId: string;
        };
    }>;
    static updateFlag(dbClientInstance: PrismaClient, data: UpdateFlag, flagId: string): Promise<{
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
            key: string;
            description: string | null;
            rules: import("@prisma/client/runtime/client").JsonValue;
            returnValueType: import("@packages/db/enums").ReturnValueType;
            defaultValue: import("@prisma/client/runtime/client").JsonValue;
            archived: boolean;
            enabled: boolean;
            projectId: string;
        };
    }>;
    static deleteFlag(dbClientInstance: PrismaClient, id: string): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            deletedFlagEnvironment: Prisma.BatchPayload;
            deletedFlag: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                key: string;
                description: string | null;
                rules: import("@prisma/client/runtime/client").JsonValue;
                returnValueType: import("@packages/db/enums").ReturnValueType;
                defaultValue: import("@prisma/client/runtime/client").JsonValue;
                archived: boolean;
                enabled: boolean;
                projectId: string;
            };
        };
    }>;
}
//# sourceMappingURL=flagService.d.ts.map