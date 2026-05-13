import { PrismaClient } from "@packages/db/prisma/server";
import { BaseProject, UpdateProject } from "@packages/schema";
export declare class ProjectServices {
    static getProjects(dbClientInstance: PrismaClient, orgId: string): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            userCount: number;
            flagCount: number;
            flags: ({
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
            users: {
                id: string;
                createdAt: Date;
                firstname: string;
                lastname: string;
                email: string;
                updatedAt: Date;
            }[];
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            organizationId: string;
        }[];
    }>;
    static getProject(dbClientInstance: PrismaClient, id: string): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            organizationId: string;
        };
    }>;
    static createProject(dbClientInstance: PrismaClient, formBody: BaseProject): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            organizationId: string;
        };
    }>;
    static updateProject(dbClientInstance: PrismaClient, id: string, formBody: UpdateProject): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            organizationId: string;
        };
    }>;
    static deleteProject(dbClientInstance: PrismaClient, id: string): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            organizationId: string;
        };
    }>;
}
//# sourceMappingURL=projectServices.d.ts.map