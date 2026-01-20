import NextAuth, { type DefaultSession, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareHash } from "@admin/lib/hashAndCompare.ts";
import { getUserByEmail, getUserCredentials } from "./actions/users";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      password: string;
    } & DefaultSession["user"];
  }
}
const nextAuth = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "Enter email",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "Enter password",
        },
      },
      async authorize(credentials) {
        const { password, email } = credentials as { email: string; password: string };

        console.log({ credentials });
        const { data: user } = await getUserCredentials(email);

        console.log({ user });

        if (!user) return null;
        const { credential } = user;
        const match = await compareHash(password, credential?.passwordHash);

        console.log(user, { match });
        if (match) return user;

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
});

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth: () => Promise<Session | null> = nextAuth.auth;
