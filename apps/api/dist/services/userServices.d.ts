import { PrismaClient } from "@packages/db/prisma/server";
import { BaseUser, UpdateUser } from "@packages/schema";
export declare const hashGenerator: (input: string) => Promise<string>;
export declare class UserServices {
    static getUsers(prismaClientInstance: PrismaClient): Promise<{
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
            firstname: string;
            lastname: string;
            email: string;
            updatedAt: Date;
        }[];
    }>;
    static getUser(id: string, prismaClientInstance: PrismaClient): Promise<{
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
            firstname: string;
            lastname: string;
            email: string;
            updatedAt: Date;
        };
    }>;
    static getUserCredentials(email: string, prismaClientInstance: PrismaClient): Promise<{
        status: string;
        error: string;
    } | {
        readonly status: "not-found";
        readonly data?: undefined;
    } | {
        readonly status: "success";
        readonly data: {
            memberships: ({
                org: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                orgId: string;
                userId: string;
                role: import("@packages/db/enums").Role;
            })[];
            credential: {
                userId: string;
                createdAt: Date;
                passwordHash: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            firstname: string;
            lastname: string;
            email: string;
            updatedAt: Date;
        };
    }>;
    static createUser(data: BaseUser, prismaClientInstance: PrismaClient): Promise<{
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
            firstname: string;
            lastname: string;
            email: string;
            updatedAt: Date;
        };
    }>;
    static updateUser(data: UpdateUser, id: string, prismaClientInstance: PrismaClient): Promise<{
        readonly ok: true;
        readonly data: {
            id: string;
            createdAt: Date;
            firstname: string;
            lastname: string;
            email: string;
            updatedAt: Date;
        };
        readonly error: null;
    } | {
        readonly ok: false;
        readonly data: null;
        readonly error: string;
    }>;
    static deleteUser(id: string, prismaClientInstance: PrismaClient): Promise<{
        ok: boolean;
        data: {
            id: string;
            createdAt: Date;
            firstname: string;
            lastname: string;
            email: string;
            updatedAt: Date;
        };
        error: null;
    } | {
        ok: boolean;
        data: null;
        error: Error;
    }>;
}
//# sourceMappingURL=userServices.d.ts.map