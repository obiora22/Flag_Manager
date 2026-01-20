// apps/api/src/routes/bootstrap.ts
import { hashGenerator } from "@api/lib/hashCompare.ts";
import { Role } from "@db/prisma/generated/enums.ts";
import { narrowError } from "@repo/utils/narrowError.ts";
import { AccountInputSchema } from "@schema/account.schema.ts";
import { FastifyInstance } from "fastify";

export async function accountRegistrationRoutes(fastify: FastifyInstance) {
  fastify.post("/accounts", async (req, reply) => {
    const input = AccountInputSchema.parse(req.body);

    console.log({ input });

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
            firstname: input.firstName,
            lastname: input.lastName,
          },
        });

        await tx.credential.create({
          data: {
            userId: user.id,
            passwordHash: await hashGenerator(input.password),
          },
        });

        console.log({ user });

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
      return {
        ok: true,
        data: result,
        error: null,
      };
    } catch (error) {
      console.error("Registration failed.", error);
      return {
        ok: false,
        data: null,
        error: narrowError(error),
      };
    }
  });
}
