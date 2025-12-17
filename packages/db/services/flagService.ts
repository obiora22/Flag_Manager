import { Prisma, PrismaClient } from "@db/prisma/generated/client";
import { handleError, handleResults } from "@repo/utils/serviceReturn";
import { BaseFlag, UpdateFlag } from "@schema/flag.schema";
export class FlagService {
  static async getFlags(dbClientInstance: PrismaClient) {
    try {
      const response = await dbClientInstance.flag.findMany();
      return handleResults(response);
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
      return handleResults(flag);
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
      return handleResults(response);
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
      return handleResults(response);
    } catch (err) {
      return handleError(err);
    }
  }
  static async deleteFlag(dbClientInstance: PrismaClient, id: string) {
    try {
      const response = await dbClientInstance.flag.delete({
        where: { id },
      });
      return handleResults(response);
    } catch (err) {
      return handleError(err);
    }
  }
}
