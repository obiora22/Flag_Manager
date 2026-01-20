import { prismaClientInstance } from "@db/lib/prismaClient.ts";
import { Project, PrismaClient } from "@db/prisma/generated/client.ts";
// import { PrismaClient } from "@prisma/client";
import { narrowError } from "@repo/utils/narrowError.ts";
import { handleResult, handleError } from "@repo/utils/serviceReturn.ts";
import { BaseProject, UpdateProject } from "@schema/project.schema.ts";

export class ProjectServices {
  static async getProjects(dbClientInstance: PrismaClient) {
    try {
      const projects = await dbClientInstance.project.findMany();
      return {
        ok: true,
        data: projects,
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

  static async createProject(dbClientInstance: PrismaClient, formBody: BaseProject) {
    try {
      const response = await dbClientInstance.project.create({
        data: formBody,
      });

      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }
  static async updateProject(dbClientInstance: PrismaClient, id: string, formBody: BaseProject) {
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
