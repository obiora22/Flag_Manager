import { BaseProject, UpdateProject } from "@schema/project.schema";
import { BaseUser, UpdateUser } from "@schema/user.schema";

declare module "fastify" {
  interface FastifyRequest {
    baseUser: BaseUser;
    updateUser: UpdateUser;
    baseProject: BaseProject;
    updateProject: UpdateProject;
  }
}
