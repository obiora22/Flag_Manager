import { handleError, handleResult } from "@packages/db/utils";
export class ProjectServices {
    static async getProjects(dbClientInstance, orgId) {
        try {
            const projects = await dbClientInstance.project.findMany({
                where: {
                    organizationId: orgId,
                },
                include: {
                    users: true,
                    flags: {
                        include: {
                            environments: true,
                        },
                    },
                },
            });
            const transformData = projects.map((project) => {
                const userCount = project.users.length;
                const flagCount = project.flags.length;
                return {
                    ...project,
                    userCount,
                    flagCount,
                };
            });
            return handleResult(transformData);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async getProject(dbClientInstance, id) {
        try {
            const project = await dbClientInstance.project.findUnique({
                where: { id },
            });
            return handleResult(project);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async createProject(dbClientInstance, formBody) {
        try {
            const newProject = await dbClientInstance.project.create({
                data: formBody,
            });
            return handleResult(newProject);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async updateProject(dbClientInstance, id, formBody) {
        try {
            const updatedProject = await dbClientInstance.project.update({
                where: { id },
                data: formBody,
            });
            return handleResult(updatedProject);
        }
        catch (err) {
            return handleError(err);
        }
    }
    static async deleteProject(dbClientInstance, id) {
        try {
            const deletedProject = await dbClientInstance.project.delete({
                where: { id },
            });
            return handleResult(deletedProject);
        }
        catch (err) {
            return handleError(err);
        }
    }
}
//# sourceMappingURL=projectServices.js.map