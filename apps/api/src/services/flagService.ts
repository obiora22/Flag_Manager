import { UserModel, FlagModel } from "@packages/db/models";
import { Prisma, PrismaClient } from "@packages/db/prisma/server";
import { Flag } from "@packages/db/prisma/server";
import { BaseFlag, UpdateFlag, Rule } from "@packages/schema";
import { handleResult, handleError } from "@packages/db/utils";

const flagInclude = {
  environments: true,
} satisfies Prisma.FlagInclude;

export class FlagService {
  static async getFlags(dbClientInstance: PrismaClient, projectId: string) {
    try {
      const flags = await dbClientInstance.flag.findMany({
        where: {
          projectId,
        },
        include: flagInclude,
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
        include: flagInclude,
      });
      return handleResult(flag);
    } catch (err) {
      return handleError(err);
    }
  }

  static async createFlag(dbClientInstance: PrismaClient, data: BaseFlag) {
    try {
      const newFlag = await dbClientInstance.flag.create({
        data: {
          ...data,
          rules: data.rules as Prisma.InputJsonValue,
          defaultValue: data.defaultValue as Prisma.InputJsonValue,
        },
      });
      return handleResult(newFlag);
    } catch (err) {
      return handleError(err);
    }
  }

  static async updateFlag(dbClientInstance: PrismaClient, data: UpdateFlag, flagId: string) {
    const { ...payload } = data;
    try {
      const updatedFlag = await dbClientInstance.flag.update({
        where: {
          id: flagId,
        },
        data: {
          ...payload,
          rules: data.rules as Prisma.InputJsonValue,
          defaultValue: data.defaultValue as Prisma.InputJsonValue,
        },
      });
      return handleResult(updatedFlag);
    } catch (err) {
      return handleError(err);
    }
  }

  static async deleteFlag(dbClientInstance: PrismaClient, id: string) {
    try {
      const [deletedFlagEnvironment, deletedFlag] = await dbClientInstance.$transaction([
        dbClientInstance.flagEnvironment.deleteMany({
          where: {
            flagId: id,
          },
        }),
        dbClientInstance.flag.delete({
          where: {
            id,
          },
        }),
      ]);
      return handleResult({ deletedFlagEnvironment, deletedFlag });
    } catch (err) {
      return handleError(err);
    }
  }
}
