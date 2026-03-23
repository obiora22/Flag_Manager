import { Project, PrismaClient } from "@db/prisma/generated/client.ts";
import {
  ProjectGetPayload,
  ProjectInclude,
} from "@db/prisma/generated/models.ts";

import { narrowError } from "@repo/utils/narrowError.ts";
import { handleResult, handleError } from "@repo/utils/serviceReturn.ts";
import { BaseProject, UpdateProject } from "@schema/project.schema.ts";
import { includes } from "zod";

const projectInclude = {
  users: true,
  flags: {
    include: {
      environments: true,
    },
  },
} satisfies ProjectInclude;

export type ProjectData = ProjectGetPayload<{
  include: typeof projectInclude;
}> & {
  userCount: number;
  flagCount: number;
};

export class ProjectServices {
  static async getProjects(dbClientInstance: PrismaClient, orgId: string) {
    try {
      const projects = await dbClientInstance.project.findMany({
        where: {
          organizationId: orgId,
        },
        include: projectInclude,
      });
      const transformData = projects.map((project) => {
        const userCount = project.users.length;
        const flagCount = project.flags.length;

        return {
          ...project,
          userCount,
          flagCount,
        };
      });

      console.log({ transformData });
      return {
        ok: true,
        data: transformData,
        error: null,
      } as const;
    } catch (err) {
      return { ok: false, data: null, error: narrowError(err) } as const;
    }
  }

  static async getProject(dbClientInstance: PrismaClient, id: string) {
    try {
      const project = await dbClientInstance.project.findUnique({
        where: { id },
      });

      return handleResult<Project>(project);
    } catch (err) {
      return handleError(err);
    }
  }

  static async createProject(
    dbClientInstance: PrismaClient,
    formBody: BaseProject
  ) {
    try {
      const response = await dbClientInstance.project.create({
        data: formBody,
      });

      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }

  static async updateProject(
    dbClientInstance: PrismaClient,
    id: string,
    formBody: BaseProject
  ) {
    console.log({ formBody });
    try {
      const response = await dbClientInstance.project.update({
        where: { id },
        data: formBody,
      });

      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }

  static async deleteProject(dbClientInstance: PrismaClient, id: string) {
    try {
      const r = await dbClientInstance.project.delete({
        where: { id },
      });
      return handleResult(r);
    } catch (err) {
      return handleError(err);
    }
  }
}
