import { Prisma, PrismaClient, Flag } from "@db/prisma/generated/client.ts";
import { handleError, handleResult } from "@repo/utils/serviceReturn.ts";
import { BaseFlag, UpdateFlag } from "@schema/flag.schema.ts";
import { Rule } from "@schema/rule.schema.ts";
import { FlagGetPayload, FlagInclude } from "@db/prisma/generated/models.ts";

const flagInclude = {
  environments: true,
} satisfies FlagInclude;

export type FlagWithEnvironment = FlagGetPayload<{
  include: typeof flagInclude;
}>;

export type CompositeFlag = Omit<FlagWithEnvironment, "rules"> & { rules: Rule[] };
export type BasicFlag = Flag;

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
