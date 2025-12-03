import { User } from "@db/prisma/generated/client";
import { prismaClientInstance } from "@db/lib/prismaClient";
import { narrowError } from "@repo/utils/narrowError";
import { BaseUser, UpdateUser } from "@repo/packages/schema/user.schema";
import { PrismaClient } from "@prisma/client";

export class UserServices {
  static async getUsers(prismaClientInstance: PrismaClient) {
    try {
      const users = await prismaClientInstance.user.findMany();
      return {
        data: users,
        ok: true,
        error: null,
      } as const;
    } catch (err) {
      return {
        data: null,
        ok: false,
        error: narrowError(err).message,
      } as const;
    }
  }

  static async getUser(id: string, prismaClientInstance: PrismaClient) {
    try {
      const user = await prismaClientInstance.user.findUnique({
        where: { id },
      });
      if (!user)
        return {
          ok: false,
          data: null,
          error: "user could not be found",
        } as const;

      return {
        ok: true,
        data: user,
        error: null,
      } as const;
    } catch (err) {
      return {
        ok: false,
        data: null,
        error: narrowError(err).message,
      } as const;
    }
  }

  static async createUser(data: BaseUser, prismaClientInstance: PrismaClient) {
    try {
      const newUser = await prismaClientInstance.user.create({
        data,
      });
      if (!newUser)
        return {
          ok: false,
          data: null,
          error: "user could not be created",
        } as const;

      return {
        ok: true,
        data: newUser,
        error: null,
      } as const;
    } catch (err) {
      return {
        ok: false,
        data: null,
        error: narrowError(err).message,
      } as const;
    }
  }

  static async updateUser(
    data: UpdateUser,
    prismaClientInstance: PrismaClient
  ) {
    try {
      const updatedUser = await prismaClientInstance.user.update({
        where: { id: data.id },
        data,
      });
      if (!updatedUser)
        return {
          ok: false,
          data: null,
          error: "user could not be created",
        } as const;

      return {
        ok: true,
        data: updatedUser,
        error: null,
      } as const;
    } catch (err) {
      return {
        ok: false,
        data: null,
        error: narrowError(err).message,
      } as const;
    }
  }

  static async deleteUser(id: string) {
    try {
      const user = await prismaClientInstance.user.delete({
        where: { id },
      });

      return {
        ok: false,
        data: user,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        data: null,
        error: narrowError(err),
      };
    }
  }
}
