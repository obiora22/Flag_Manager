import { handleError, handleResult } from "@packages/db/utils";
import { baseEnvironmentSchema, } from "@packages/schema";
export class EnvironmentServices {
    static async findAll(dbClientInstance) {
        try {
            const response = await dbClientInstance.flagEnvironment.findMany();
            return handleResult(response);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async findUnique(dbClientInstance, id) {
        try {
            const response = await dbClientInstance.flagEnvironment.findUnique({
                where: { id },
            });
            return handleResult(response);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async create(dbClientInstance, data) {
        const { data: d, error } = baseEnvironmentSchema.safeParse(data);
        if (error) {
            return handleError(error);
        }
        try {
            const response = await dbClientInstance.flagEnvironment.create({
                data: {
                    ...d,
                    overrides: d.overrides,
                },
            });
            return handleResult(response);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async delete(dbClientInstance, id) {
        try {
            const response = await dbClientInstance.flagEnvironment.delete({
                where: { id },
            });
            return handleResult(response);
        }
        catch (err) {
            return handleError(err);
        }
    }
}
//# sourceMappingURL=environmentServices.js.map