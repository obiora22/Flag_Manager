import { handleResult, handleError } from "@packages/db/utils";
const flagInclude = {
    environments: true,
};
export class FlagService {
    static async getFlags(dbClientInstance, projectId) {
        try {
            const flags = await dbClientInstance.flag.findMany({
                where: {
                    projectId,
                },
                include: flagInclude,
            });
            return handleResult(flags);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async getFlag(dbClientInstance, id) {
        try {
            const flag = await dbClientInstance.flag.findUnique({
                where: {
                    id,
                },
                include: flagInclude,
            });
            return handleResult(flag);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async createFlag(dbClientInstance, data) {
        try {
            const newFlag = await dbClientInstance.flag.create({
                data: {
                    ...data,
                    rules: data.rules,
                    defaultValue: data.defaultValue,
                },
            });
            return handleResult(newFlag);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async updateFlag(dbClientInstance, data, flagId) {
        const { ...payload } = data;
        try {
            const updatedFlag = await dbClientInstance.flag.update({
                where: {
                    id: flagId,
                },
                data: {
                    ...payload,
                    rules: data.rules,
                    defaultValue: data.defaultValue,
                },
            });
            return handleResult(updatedFlag);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async deleteFlag(dbClientInstance, id) {
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
        }
        catch (err) {
            return handleError(err);
        }
    }
}
//# sourceMappingURL=flagService.js.map