const flagInclude = {
    environments: true,
};
const projectInclude = {
    users: true,
    flags: {
        include: {
            environments: true,
        },
    },
};
const userInclude = {
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
};
export {};
//# sourceMappingURL=contracts.js.map