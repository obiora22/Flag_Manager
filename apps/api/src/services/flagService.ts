import { Prisma, PrismaClient } from "@db/prisma/generated/client.ts";
import { handleError, handleResult } from "@repo/utils/serviceReturn.ts";
import { BaseFlag, UpdateFlag } from "@schema/flag.schema.ts";

export class FlagService {
  static async getFlags(dbClientInstance: PrismaClient, projectId: string) {
    try {
      const flags = await dbClientInstance.flag.findMany({
        where: {
          projectId,
        },
      });

      return handleResult(flags);
    } catch (err) {
      return handleError(err);
    }
  }

  static async getFlag(dbClientInstance: PrismaClient, id: string) {
    try {
      const flag = await dbClientInstance.flag.findUnique({
        where: {
          id,
        },
      });
      return handleResult(flag);
    } catch (err) {
      return handleError(err);
    }
  }

  static async createFlag(dbClientInstance: PrismaClient, data: BaseFlag) {
    try {
      const response = await dbClientInstance.flag.create({
        data: {
          ...data,
          rules: data.rules as Prisma.InputJsonValue,
          defaultValue: data.defaultValue as Prisma.InputJsonValue,
        },
      });
      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }

  static async updateFlag(dbClientInstance: PrismaClient, data: UpdateFlag) {
    const { id, ...payload } = data;
    try {
      const response = await dbClientInstance.flag.update({
        where: {
          id,
        },
        data: {
          ...payload,
          rules: data.rules as Prisma.InputJsonValue,
          defaultValue: data.defaultValue as Prisma.InputJsonValue,
        },
      });
      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }

  static async deleteFlag(dbClientInstance: PrismaClient, id: string) {
    try {
      const response = await dbClientInstance.flag.delete({
        where: { id },
      });
      return handleResult(response);
    } catch (err) {
      return handleError(err);
    }
  }
}
