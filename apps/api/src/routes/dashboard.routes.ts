import { OrganizationGetPayload, OrganizationInclude } from "@packages/db/models";
import { handleError, handleResult } from "@packages/db/utils";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const orgInclude = {
  projects: {
    include: {
      flags: true,
    },
  },
  memberships: true,
} satisfies OrganizationInclude;

type OrgData = OrganizationGetPayload<{ include: typeof orgInclude }>;

export default async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/dashboard", async (request: FastifyRequest, reply: FastifyReply) => {
    const orgId = request?.user ? request.user?.activeOrgId : null;
    if (!orgId) return reply.send(handleError("organization missing"));
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

      return reply.send(
        handleResult({
          id,
          name,
          totalFlags,
          totalProjects,
          totalMembership,
        }),
      );
    } catch (err) {
      return reply.send(handleError(err));
    }
  });
}
