import { Prisma } from "../prisma/generated/client.js";

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

export const narrowClientError = (error: unknown) => {
  if (error instanceof Error) return error;
  return new Error(String(error));
};
