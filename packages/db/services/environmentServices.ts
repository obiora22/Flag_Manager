import { PrismaClient } from "@db/prisma/generated/client";
import { handleError, handleResults } from "@repo/utils/serviceReturn";
import { BaseEnvironment, UpdateEnvironment } from "@schema/environment.schema";

export class EnvironmentServices {
  static async findAll(dbClientInstance: PrismaClient) {
    try {
      const response = await dbClientInstance.flagEnvironment.findMany();
      return handleResults(response);
    } catch (err) {
      return handleError(err);
    }
  }
  static async findUnique(dbClientInstance: PrismaClient, id: string) {
    try {
      const response = await dbClientInstance.flagEnvironment.findUnique({
        where: { id },
      });
      return handleResults(response);
    } catch (err) {
      return handleError(err);
    }
  }
  static async create(dbClientInstance: PrismaClient, data: BaseEnvironment) {
    try {
      const response = await dbClientInstance.flagEnvironment.create({
        data,
      });

      return handleResults(response);
    } catch (err) {
      return handleError(err);
    }
  }
  static async delete(dbClientInstance: PrismaClient, id: string) {
    try {
      const response = await dbClientInstance.flagEnvironment.delete({
        where: { id },
      });
      return handleResults(response);
    } catch (err) {
      return handleError(err);
    }
  }
}
