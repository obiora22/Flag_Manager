import { handleError, handleResult, narrowError } from "@packages/db/utils";
import { genSalt, hash } from "bcrypt-ts";
export const hashGenerator = async (input) => {
    const salt = await genSalt();
    return await hash(input, salt);
};
export class UserServices {
    static async getUsers(prismaClientInstance) {
        try {
            const users = await prismaClientInstance.user.findMany();
            return handleResult(users);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async getUser(id, prismaClientInstance) {
        try {
            const user = await prismaClientInstance.user.findUnique({
                where: { id },
            });
            return handleResult(user);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async getUserCredentials(email, prismaClientInstance) {
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
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async createUser(data, prismaClientInstance) {
        try {
            const newUser = await prismaClientInstance.user.create({
                data,
            });
            return handleResult(newUser);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async updateUser(data, id, prismaClientInstance) {
        try {
            const updatedUser = await prismaClientInstance.user.update({
                where: { id },
                data,
            });
            return {
                ok: true,
                data: updatedUser,
                error: null,
            };
        }
        catch (err) {
            return {
                ok: false,
                data: null,
                error: narrowError(err).message,
            };
        }
    }
    static async deleteUser(id, prismaClientInstance) {
        try {
            const user = await prismaClientInstance.user.delete({
                where: { id },
            });
            return {
                ok: false,
                data: user,
                error: null,
            };
        }
        catch (err) {
            return {
                ok: false,
                data: null,
                error: narrowError(err),
            };
        }
    }
}
//# sourceMappingURL=userServices.js.map