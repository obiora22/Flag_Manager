export { Prisma, ReturnValueType } from "./prisma/generated/client.js";
import { Flag } from "./prisma/generated/client.js";
import type { FlagGetPayload, ProjectGetPayload, UserGetPayload } from "./prisma/generated/models.js";
import type { Rule } from "@packages/schema";
export type APIResult<T> = {
    status: "success";
    data: T;
} | {
    status: "not-found";
} | {
    status: "error";
    error: string;
};
declare const flagInclude: {
    environments: true;
};
declare const projectInclude: {
    users: true;
    flags: {
        include: {
            environments: true;
        };
    };
};
declare const userInclude: {
    credential: true;
    memberships: {
        include: {
            org: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
};
export type FlagWithEnvironment = FlagGetPayload<{
    include: typeof flagInclude;
}>;
export type BasicFlag = Flag;
export type CompositeFlag = Omit<FlagWithEnvironment, "rules"> & {
    rules: Rule[];
};
export type ProjectData = ProjectGetPayload<{
    include: typeof projectInclude;
}> & {
    userCount: number;
    flagCount: number;
};
export type UserIncludeCredentials = UserGetPayload<{
    include: typeof userInclude;
}>;
export interface DashboardData {
    id: string;
    name: string;
    totalFlags: string;
    totalProjects: string;
    totalMembership: string;
}
//# sourceMappingURL=contracts.d.ts.map