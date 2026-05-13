import { Prisma } from "../prisma/generated/client.js";
export const narrowError = (error) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = error;
        return new Error(`${prismaError.code}: ${prismaError.message}`);
    }
    if (error instanceof Error) {
        return error;
    }
    return new Error(String(error));
};
export const narrowClientError = (error) => {
    if (error instanceof Error)
        return error;
    return new Error(String(error));
};
//# sourceMappingURL=narrowError.js.map