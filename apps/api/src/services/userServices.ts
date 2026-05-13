import { PrismaClient } from "@packages/db/prisma/server";
import { handleError, handleResult, narrowError } from "@packages/db/utils";
import { BaseUser, UpdateUser } from "@packages/schema";
import { genSalt, hash } from "bcrypt-ts";

export const hashGenerator = async (input: string) => {
  const salt = await genSalt();
  return await hash(input, salt);
};

export class UserServices {
  static async getUsers(prismaClientInstance: PrismaClient) {
    try {
      const users = await prismaClientInstance.user.findMany();
      return handleResult(users);
    } catch (err) {
      return handleError(err);
    }
  }

  static async getUser(id: string, prismaClientInstance: PrismaClient) {
    try {
      const user = await prismaClientInstance.user.findUnique({
        where: { id },
      });

      return handleResult(user);
    } catch (err) {
      return handleError(err);
    }
  }

  static async getUserCredentials(email: string, prismaClientInstance: PrismaClient) {
    try {
      const userData = await prismaClientInstance.user.findUnique({
        where: { email },
        include: {
          credential: true,
          memberships: {
            include: {
              org: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return handleResult(userData);
    } catch (err) {
      return handleError(err);
    }
  }

  static async createUser(data: BaseUser, prismaClientInstance: PrismaClient) {
    try {
      const newUser = await prismaClientInstance.user.create({
        data,
      });
      return handleResult(newUser);
    } catch (err) {
      return handleError(err);
    }
  }

  static async updateUser(data: UpdateUser, id: string, prismaClientInstance: PrismaClient) {
    try {
      const updatedUser = await prismaClientInstance.user.update({
        where: { id },
        data,
      });

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

  static async deleteUser(id: string, prismaClientInstance: PrismaClient) {
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
