import { Prisma, PrismaClient } from "@packages/db/prisma/server";
import { handleError, handleResult } from "@packages/db/utils";
import {
  baseEnvironmentSchema,
  type BaseEnvironment,
  type UpdateEnvironment,
} from "@packages/schema";

export class EnvironmentServices {
  static async findAll(dbClientInstance: PrismaClient) {
    try {
      const response = await dbClientInstance.flagEnvironment.findMany();
      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }
  static async findUnique(dbClientInstance: PrismaClient, id: string) {
    try {
      const response = await dbClientInstance.flagEnvironment.findUnique({
        where: { id },
      });
      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }
  static async create(dbClientInstance: PrismaClient, data: BaseEnvironment) {
    const { data: d, error } = baseEnvironmentSchema.safeParse(data);
    if (error) {
      return handleError(error);
    }
    try {
      const response = await dbClientInstance.flagEnvironment.create({
        data: {
          ...d,
          overrides: d.overrides as Prisma.InputJsonValue,
        },
      });

      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }
  static async delete(dbClientInstance: PrismaClient, id: string) {
    try {
      const response = await dbClientInstance.flagEnvironment.delete({
        where: { id },
      });
      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }
}
