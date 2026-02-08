import { Organization } from "@db/prisma/generated/client.ts";
import { OrganizationInclude, OrganizationGetPayload } from "@db/prisma/generated/models.ts";
import { narrowError } from "@repo/utils/narrowError.ts";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const orgInclude = {
  projects: {
    include: {
      flags: true,
    },
  },
  memberships: true,
} satisfies OrganizationInclude;

type OrgInclude = OrganizationGetPayload<{ include: typeof orgInclude }>;

export interface DashboardData {
  id: string;
  name: string;
  totalFlags: string;
  totalProjects: string;
  totalMembership: string;
}

export default async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/dashboard", async (request: FastifyRequest, reply: FastifyReply) => {
    const orgId = request.user?.activeOrgId;
    console.log({ orgId }, request.user);
    try {
      const data = await fastify.prisma.organization.findUnique({
        where: {
          id: orgId,
        },
        include: orgInclude,
      });

      if (!data) {
        return reply.send({
          ok: true,
          data,
          error: null,
        });
      }

      const { name, id } = data;

      const totalMembership = data?.memberships.length;

      const totalProjects = data?.projects.length;

      const totalFlags = data?.projects.reduce((flagTotal, prev) => {
        return (flagTotal += prev.flags.length);
      }, 0);

      return reply.send({
        ok: true,
        data: {
          id,
          name,
          totalFlags,
          totalProjects,
          totalMembership,
        },
        error: null,
      });
    } catch (err) {
      return reply.status(500).send({
        ok: false,
        data: null,
        error: narrowError(err),
      });
    }
  });
}
