import { FlagGetPayload, ProjectGetPayload, UserGetPayload } from "./prisma/generated/models.js";
export type APIResult<T> = {
    status: "success";
    data: T;
} | {
    status: "not-found";
} | {
    status: "error";
    error: string;
};
export interface Condition {
    attribute: string;
    operator: "equals" | "notEquals" | "contains" | "notContains" | "gt" | "gte" | "lt" | "lte" | "startsWith" | "endsWith" | "in";
    value: unknown;
}
export interface Rule {
    key: string;
    conditions: Condition[];
    rollout: {
        attribute: string;
        percentage: number;
        value: unknown;
    };
    serve: unknown;
}
declare const flagInclude: {
    environments: true;
};
export type FlagData = Omit<FlagGetPayload<{
    include: typeof flagInclude;
}>, "rules"> & {
    rules: Rule[];
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
declare const projectInclude: {
    users: true;
    flags: {
        include: {
            environments: true;
        };
    };
};
export type UserIncludeCredentials = UserGetPayload<{
    include: typeof userInclude;
}>;
export type ProjectData = ProjectGetPayload<{
    include: typeof projectInclude;
}> & {
    userCount: number;
    flagCount: number;
};
export interface DashboardData {
    id: string;
    orgName: string;
    totalFlags: string;
    totalProjects: string;
    totalMembership: string;
}
export {};
//# sourceMappingURL=sharedTypes.d.ts.map