import type { BaseEnvironment, UpdateEnvironment } from "@schema/environment.schemab.js";
import type { BaseFlag, UpdateFlag } from "@schema/flag.schema.js";
import type { BaseProject, UpdateProject } from "@schema/project.schema.js";
import type { BaseUser, UpdateUser } from "@schema/user.schema";

interface RequestUser {
  id: string;
  activeOrgId: string;
  activeRole: string;
  memberships: string;
}

declare module "fastify" {
  interface FastifyRequest {
    baseUser: BaseUser;
    updateUser: UpdateUser;
    baseProject: BaseProject;
    updateProject: UpdateProject;
    baseFlag: BaseFlag;
    updateFlag: UpdateFlag;
    baseEnvironment: BaseEnvironment;
    updateEnvironment: UpdateEnvironment;
    user: RequestUser;
  }
}

export {};
