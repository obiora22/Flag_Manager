import { Prisma } from "../packages/db/prisma/generated/client";

export const narrowError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    return new Error(`${prismaError.code}: ${prismaError.message}`);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
};
