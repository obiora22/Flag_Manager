import { baseProjectSchema, updateProjectSchema, } from "@packages/schema";
import z from "zod";
import { ProjectServices } from "../services/projectServices.js";
export async function projectRoutes(fastify, options) {
    fastify.get("/projects", {
        handler: async (request, reply) => {
            const result = await ProjectServices.getProjects(fastify.prisma, request.query.activeOrgId);
            return reply.send(result);
        },
    });
    fastify.get("/projects/:id", {
        async handler(request, reply) {
            const { id } = request.params;
            const result = await ProjectServices.getProject(fastify.prisma, id);
            return reply.send(result);
        },
    });
    fastify.post("/projects", {
        async preHandler(request, reply, done) {
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
        async handler(request, reply) {
            const formData = request.baseProject;
            const result = await ProjectServices.createProject(fastify.prisma, formData);
            return reply.send(result);
        },
    });
    fastify.patch("/projects/:id", {
        async preHandler(request, reply, done) {
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
        async handler(request, reply) {
            const formData = request.updateProject;
            const result = await ProjectServices.updateProject(fastify.prisma, request.params.id, formData);
            return reply.send(result);
        },
    });
    fastify.delete("/project/:id", {
        async handler(request, reply) {
            const { id } = request.params;
            const result = await ProjectServices.deleteProject(fastify.prisma, id);
            return reply.send(result);
        },
    });
}
//# sourceMappingURL=project.routes.js.map