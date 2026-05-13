const flagInclude = {
    environments: true,
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
const projectInclude = {
    users: true,
    flags: {
        include: {
            environments: true,
        },
    },
};
export {};
//# sourceMappingURL=sharedTypes.js.map