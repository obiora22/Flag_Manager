import { User, PrismaClient, Prisma } from "@db/prisma/generated/client";
import { narrowError } from "@repo/utils/narrowError";
import { BaseUser, UpdateUser } from "@repo/packages/schema/user.schema";
import { prismaClientInstance as pCI } from "@db/lib/prismaClient";
type ServiceResult<T> =
  | {
      ok: true;
      data: T | null;
      error: null;
    }
  | {
      ok: false;
      data: null;
      error: string;
    };

async function checkDatabase(prismaClientInstance: PrismaClient) {
  // Call on your existing instance
  const [db] = await prismaClientInstance.$queryRaw<
    [{ current_database: string }]
  >`
    SELECT current_database()
  `;
  console.log("Connected to:", db.current_database);
}

export class UserServices {
  static async getUsers(prismaClientInstance: PrismaClient) {
    // checkDatabase(prismaClientInstance);
    try {
      const users = await pCI.user.findMany();
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

  static async getUserByEmail(
    email: string,
    prismaClientInstance: PrismaClient
  ): Promise<ServiceResult<User>> {
    try {
      const user = await prismaClientInstance.user.findUnique({
        where: { email },
      });
      if (!user)
        return {
          ok: true,
          data: null,
          error: null,
        };

      return {
        ok: true,
        data: user,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        data: null,
        error: narrowError(err).message,
      };
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
