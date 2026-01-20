import { hash, genSalt, compare } from "bcrypt-ts";

export const hashGenerator = async (input: string) => {
  const salt = await genSalt();
  return await hash(input, salt);
};

export const compareHash = async (input: string, hash?: string) => {
  return hash ? await compare(input, hash) : false;
};
