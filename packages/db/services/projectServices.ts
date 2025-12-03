import { prismaClientInstance } from "@db/lib/prismaClient";
import { Project, PrismaClient } from "@db/prisma/generated/client";
// import { PrismaClient } from "@prisma/client";
import { narrowError } from "@repo/utils/narrowError";
import { handleResults, handleError } from "@repo/utils/serviceReturn";
import { BaseProject, UpdateProject } from "@schema/project.schema";

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

      return handleResults<Project>(project);
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

      return handleResults(response);
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

      return handleResults(response);
    } catch (err) {
      return handleError(err);
    }
  }

  static async deleteProject(dbClientInstance: PrismaClient, id: string) {
    try {
      const r = await dbClientInstance.project.delete({
        where: { id },
      });
      return handleResults(r);
    } catch (err) {
      return handleError(err);
    }
  }
}
