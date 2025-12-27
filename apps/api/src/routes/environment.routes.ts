import fastify, {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { EnvironmentServices } from "@db/services/environmentServices";
import {
  BaseEnvironment,
  baseEnvironmentSchema,
  UpdateEnvironment,
  updateEnvironmentSchema,
} from "@schema/environment.schema.js";
import z from "zod";
import { handleResults } from "@repo/utils/serviceReturn";

interface RequestProps {
  Params: { id: string };
}

export async function environmentRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/environments", {
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const { ok, data, error } = await EnvironmentServices.findAll(
        fastify.prisma
      );
      return reply.send({ ok, data, error });
    },
  });
  fastify.get("/environment/:id", {
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const { ok, data, error } = await EnvironmentServices.findUnique(
        fastify.prisma,
        request.params.id
      );
      return reply.send({ ok, data, error });
    },
  });
  fastify.post("/environment", {
    async preHandler(
      request: FastifyRequest<RequestProps & { Body: BaseEnvironment }>,
      reply: FastifyReply,
      done
    ) {
      const { data, error } = baseEnvironmentSchema.safeParse(request.body);

      if (error) {
        return reply.status(400).send({
          ok: false,
          data: null,
          error: {
            message: "Invalid paramters",
            details: z.flattenError(error),
          },
        });
      }
      request.baseEnvironment = data;
      done();
    },
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const { ok, data, error } = await EnvironmentServices.create(
        fastify.prisma,
        request.baseEnvironment
      );
      return reply.send({ ok, data, error });
    },
  });
  fastify.put("/environment/:id", {
    async preHandler(
      request: FastifyRequest<RequestProps & { body: UpdateEnvironment }>,
      reply: FastifyReply,
      done
    ) {
      const { data, error } = updateEnvironmentSchema.safeParse(request.body);

      if (error) {
        return reply.status(400).send({
          ok: false,
          data: null,
          error: {
            message: "Invalid paramters",
            details: z.flattenError(error),
          },
        });
      }
      request.updateEnvironment = data;
      done();
    },
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const { ok, data, error } = await EnvironmentServices.create(
        fastify.prisma,
        request.baseEnvironment
      );
      return reply.send({ ok, data, error });
    },
  });

  fastify.delete("/environments/:id", {
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const response = await EnvironmentServices.delete(
        fastify.prisma,
        request.params.id
      );
    },
  });
}
