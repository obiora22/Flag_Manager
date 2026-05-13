import { hash, genSalt, compare } from "bcrypt-ts";
export const hashGenerator = async (input) => {
    const salt = await genSalt();
    return await hash(input, salt);
};
export const compareHash = async (input, hash) => {
    return await compare(input, hash);
};
//# sourceMappingURL=hashCompare.js.map