import { handleError, handleResult } from "@packages/db/utils";
const orgInclude = {
    projects: {
        include: {
            flags: true,
        },
    },
    memberships: true,
};
export default async function dashboardRoutes(fastify) {
    fastify.get("/dashboard", async (request, reply) => {
        const orgId = request?.user ? request.user?.activeOrgId : null;
        if (!orgId)
            return reply.send(handleError("organization missing"));
        try {
            const data = await fastify.prisma.organization.findUnique({
                where: {
                    id: orgId,
                },
                include: orgInclude,
            });
            if (!data) {
                return reply.send(handleResult(data));
            }
            const { name, id } = data;
            const totalMembership = data?.memberships.length;
            const totalProjects = data?.projects.length;
            const totalFlags = data?.projects.reduce((flagTotal, prev) => {
                return (flagTotal += prev.flags.length);
            }, 0);
            return reply.send(handleResult({
                id,
                name,
                totalFlags,
                totalProjects,
                totalMembership,
            }));
        }
        catch (err) {
            return reply.send(handleError(err));
        }
    });
}
//# sourceMappingURL=dashboard.routes.js.map