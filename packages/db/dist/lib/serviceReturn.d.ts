export type APIResult<T> = {
    status: "success";
    data: T;
} | {
    status: "not-found";
} | {
    status: "error";
    error: string;
};
export declare const handleResult: <T>(result: T | null) => {
    readonly status: "not-found";
    readonly data?: undefined;
} | {
    readonly status: "success";
    readonly data: T & ({} | undefined);
};
export declare const handleClientError: (error: unknown) => {
    readonly status: "error";
    readonly error: string;
};
export declare const handleError: (error: unknown) => {
    status: string;
    error: string;
};
//# sourceMappingURL=serviceReturn.d.ts.map