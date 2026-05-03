import type { PrismaClient } from "@db/prisma/generated/client.ts";
import { BaseEnvironment, UpdateEnvironment } from "@schema/environment.schema.js";
import { BaseFlag, UpdateFlag } from "@schema/flag.schema.js";
import { BaseProject, UpdateProject } from "@schema/project.schema.js";
import { BaseUser, UpdateUser } from "@schema/user.schema";

interface RequestUser {
  id: string;
  activeOrgId: string;
  activeRole: string;
  memberships: string;
}
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
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
