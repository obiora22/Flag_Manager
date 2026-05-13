import { Role } from "@packages/db/prisma/server";
import { handleError, handleResult } from "@packages/db/utils";
import { AccountInputSchema } from "@packages/schema";
import { FastifyInstance } from "fastify";
import { hashGenerator } from "../lib/hashCompare.js";

export async function accountRegistrationRoutes(fastify: FastifyInstance) {
  fastify.post("/accounts", async (req, reply) => {
    const input = AccountInputSchema.parse(req.body);
    try {
      const result = await fastify.prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name: input.organizationName,
          },
        });

        const user = await tx.user.create({
          data: {
            email: input.email,
            firstname: input.firstname,
            lastname: input.lastname,
          },
        });

        await tx.credential.create({
          data: {
            userId: user.id,
            passwordHash: await hashGenerator(input.password),
          },
        });

        await tx.membership.create({
          data: {
            userId: user.id,
            orgId: org.id,
            role: "ADMIN",
          },
        });

        return {
          orgId: org.id,
          userId: user.id,
        };
      });
      return handleResult(result);
    } catch (error) {
      handleError(error);
    }
  });
}
