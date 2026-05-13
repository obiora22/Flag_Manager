import { PrismaClient } from "@packages/db/prisma/server";
import { handleError, handleResult } from "@packages/db/utils";
import { BaseProject, UpdateProject } from "@packages/schema";

export class ProjectServices {
  static async getProjects(dbClientInstance: PrismaClient, orgId: string) {
    try {
      const projects = await dbClientInstance.project.findMany({
        where: {
          organizationId: orgId,
        },
        include: {
          users: true,
          flags: {
            include: {
              environments: true,
            },
          },
        },
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
      return handleResult(transformData);
    } catch (err) {
      return handleError(err);
    }
  }

  static async getProject(dbClientInstance: PrismaClient, id: string) {
    try {
      const project = await dbClientInstance.project.findUnique({
        where: { id },
      });

      return handleResult(project);
    } catch (err) {
      return handleError(err);
    }
  }

  static async createProject(dbClientInstance: PrismaClient, formBody: BaseProject) {
    try {
      const newProject = await dbClientInstance.project.create({
        data: formBody,
      });

      return handleResult(newProject);
    } catch (err) {
      return handleError(err);
    }
  }

  static async updateProject(dbClientInstance: PrismaClient, id: string, formBody: UpdateProject) {
    try {
      const updatedProject = await dbClientInstance.project.update({
        where: { id },
        data: formBody,
      });

      return handleResult(updatedProject);
    } catch (err) {
      return handleError(err);
    }
  }

  static async deleteProject(dbClientInstance: PrismaClient, id: string) {
    try {
      const deletedProject = await dbClientInstance.project.delete({
        where: { id },
      });
      return handleResult(deletedProject);
    } catch (err) {
      return handleError(err);
    }
  }
}
