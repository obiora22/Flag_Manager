import { narrowError, narrowClientError } from "./narrowError.js";
export const handleResult = (result) => {
    return result === null
        ? {
            status: "not-found",
        }
        : {
            status: "success",
            data: result,
        };
};
export const handleClientError = (error) => {
    return {
        status: "error",
        error: narrowClientError(error).message,
    };
};
export const handleError = (error) => {
    return {
        status: "error",
        error: narrowError(error).message,
    };
};
//# sourceMappingURL=serviceReturn.js.map