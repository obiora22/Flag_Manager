import {
  BaseProject,
  baseProjectSchema,
  UpdateProject,
  updateProjectSchema,
} from "@packages/schema";
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import z from "zod";
import { ProjectServices } from "../services/projectServices.js";

export async function projectRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/projects", {
    handler: async (
      request: FastifyRequest<{ Querystring: { activeOrgId: string } }>,
      reply: FastifyReply,
    ) => {
      const result = await ProjectServices.getProjects(fastify.prisma, request.query.activeOrgId);
      return reply.send(result);
    },
  });

  fastify.get("/projects/:id", {
    async handler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
      const { id } = request.params;
      const result = await ProjectServices.getProject(fastify.prisma, id);
      return reply.send(result);
    },
  });
  fastify.post("/projects", {
    async preHandler(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
      const body = request.body;
      const { data, error } = baseProjectSchema.safeParse(body);
      if (error)
        return reply.send({
          status: "error",
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
      const result = await ProjectServices.createProject(fastify.prisma, formData);

      return reply.send(result);
    },
  });

  fastify.patch("/projects/:id", {
    async preHandler(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
      const body = request.body;
      const { data, error } = updateProjectSchema.safeParse(body);
      if (error)
        return reply.send({
          status: "error",
          ok: false,
          error: {
            message: "Invalid parameters",
            details: z.flattenError(error),
          },
        });
      request.updateProject = data;
      done();
    },
    async handler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
      const formData = request.updateProject;
      const result = await ProjectServices.updateProject(
        fastify.prisma,
        request.params.id,
        formData,
      );
      return reply.send(result);
    },
  });

  fastify.delete("/project/:id", {
    async handler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
      const { id } = request.params;
      const result = await ProjectServices.deleteProject(fastify.prisma, id);
      return reply.send(result);
    },
  });
}
