import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { ProjectServices } from "@api/src/services/projectServices.ts";
import {
  BaseProject,
  baseProjectSchema,
  UpdateProject,
  updateProjectSchema,
} from "@schema/project.schema.js";
import z from "zod";
interface RequestParams {
  Params: {
    id: string;
  };
}
export async function projectRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/projects", {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { ok, data, error } = await ProjectServices.getProjects(fastify.prisma);
      return { ok, data, error };
    },
  });

  fastify.get("/projects/:id", {
    async handler(request: FastifyRequest<RequestParams>, reply: FastifyReply) {
      const { id } = request.params;
      const { ok, data, error } = await ProjectServices.getProject(fastify.prisma, id);
      return {
        ok,
        data,
        error,
      };
    },
  });
  fastify.post("/projects", {
    async preHandler(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
      const body = request.body as BaseProject;
      const { data, error } = baseProjectSchema.safeParse(body);
      if (error)
        return reply.send({
          ok: false,
          data: null,
          error: {
            message: "Invalid parameters",
            details: z.flattenError(error),
          },
        });
      request.baseProject = data;
      done();
    },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const formData = request.baseProject;
      const { ok, data, error } = await ProjectServices.createProject(fastify.prisma, formData);

      return reply.send({ ok, data, error });
    },
  });

  fastify.put("/projects/:id", {
    async preHandler(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
      const body = request.body as BaseProject;
      const { data, error } = baseProjectSchema.safeParse(body);
      if (error)
        return reply.status(400).send({
          ok: false,
          data: null,
          error: {
            message: "Invalide parameters",
            details: z.flattenError(error),
          },
        });
      request.baseProject = data;
      done();
    },
    async handler(request: FastifyRequest<RequestParams>, reply: FastifyReply) {
      const formData = request.baseProject;
      const { id } = request.params;
      const { ok, data, error } = await ProjectServices.updateProject(fastify.prisma, id, formData);

      return reply.send({ ok, data, error });
    },
  });

  fastify.delete("/project/:id", {
    async handler(request: FastifyRequest<RequestParams>, reply: FastifyReply) {
      const { id } = request.params;
      const response = await ProjectServices.deleteProject(fastify.prisma, id);
      return reply.send({
        ok: true,
        data: response,
        error: null,
      });
    },
  });
}
