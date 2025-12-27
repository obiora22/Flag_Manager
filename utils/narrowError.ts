import { Prisma } from "@db/prisma/generated/client";

export const narrowError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return new Error(`${error.code}: ${error.message}`);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
};
