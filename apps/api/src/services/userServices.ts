import { User, PrismaClient, Prisma } from "@db/prisma/generated/client.ts";
import { narrowError } from "@repo/utils/narrowError.ts";
import BaseUserSchema, { BaseUser, UpdateUser } from "@schema/user.schema.ts";
import { prismaClientInstance as pCI } from "@db/lib/prismaClient.ts";
import z from "zod";
import { genSalt, hash } from "bcrypt-ts";
import { UserGetPayload, UserInclude } from "@db/prisma/generated/models.ts";

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

const userInclude = {
  credential: true,
} satisfies UserInclude;

export type UserIncludeCredentials = UserGetPayload<{ include: typeof userInclude }>;

export const hashGenerator = async (input: string) => {
  const salt = await genSalt();
  return await hash(input, salt);
};

async function checkDatabase(prismaClientInstance: PrismaClient) {
  // Call on your existing instance
  const [db] = await prismaClientInstance.$queryRaw<[{ current_database: string }]>`
    SELECT current_database()
  `;
  console.log("Connected to:", db.current_database);
}

export class UserServices {
  static async getUsers(prismaClientInstance: PrismaClient) {
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

  static async getUserCredentials(
    email: string,
    prismaClientInstance: PrismaClient
  ): Promise<ServiceResult<UserIncludeCredentials>> {
    try {
      const user = await prismaClientInstance.user.findUnique({
        where: { email },
        include: {
          credential: true,
        },
      });

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

  static async createUser(payload: BaseUser, prismaClientInstance: PrismaClient) {
    const { data: user, error } = BaseUserSchema.safeParse(payload);

    if (error) {
      return {
        ok: false,
        data: null,
        error: z.flattenError(error),
      };
    }
    const hash = await hashGenerator(user.password);
    try {
      const newUser = await prismaClientInstance.user.create({
        data: { ...user, password: hash },
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

  static async updateUser(data: UpdateUser, prismaClientInstance: PrismaClient) {
    try {
      const updatedUser = await prismaClientInstance.user.update({
        where: { id: data.id },
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
