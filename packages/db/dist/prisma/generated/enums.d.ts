export declare const Role: {
    readonly VIEWER: "VIEWER";
    readonly EDITOR: "EDITOR";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const ReturnValueType: {
    readonly BOOLEAN: "BOOLEAN";
    readonly NUMBER: "NUMBER";
    readonly STRING: "STRING";
    readonly JSON: "JSON";
};
export type ReturnValueType = (typeof ReturnValueType)[keyof typeof ReturnValueType];
export declare const FlagEnvironmentType: {
    readonly DEVELOPMENT: "DEVELOPMENT";
    readonly STAGING: "STAGING";
    readonly PRODUCTION: "PRODUCTION";
};
export type FlagEnvironmentType = (typeof FlagEnvironmentType)[keyof typeof FlagEnvironmentType];
//# sourceMappingURL=enums.d.ts.map