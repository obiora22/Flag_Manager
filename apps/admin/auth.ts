import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      password: string;
    } & DefaultSession["user"];
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // async authorize(credentials) {
      //  // 1: Extract user email
      //  // 2: Fetch user from DB
      //  // 3: compare user password has with credentials password
      //  // 4: If match is true, return user object and null otherwise
      //   return { email, password };
      // },
    }),
  ],
});
