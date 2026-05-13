import { FastifyPluginAsync } from "fastify";
type Role = "ADMIN" | "VIEWER" | "EDITOR";
interface User {
    id: string;
    activeOrgId: string;
    activeRole: string;
    memberships: {
        org: {
            name: string;
        };
        id: string;
        role: Role;
        userId: string;
        orgId: string;
    }[];
}
declare module "fastify" {
    interface FastifyRequest {
        user: User | null;
    }
}
declare const _default: FastifyPluginAsync;
export default _default;
//# sourceMappingURL=auth.d.ts.map