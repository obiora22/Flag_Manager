import NextAuth, { type DefaultSession, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareHash } from "@admin/lib/hashAndCompare.ts";
import { getUserByEmail, getUserCredentials } from "./actions/users";

declare module "next-auth" {
  interface Session {
    user: {
      firstname: string;
      lastname: string;
      email: string;
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

        console.log("AUTHORIZE", { user });

        if (!user) return null;
        const { credential } = user;
        const match = await compareHash(password, credential?.passwordHash);

        console.log(user, { match });
        if (match) return user;

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn(ctx) {
      console.log({ ctx });
      return !!ctx?.user;
    },
    jwt(ctx) {
      const { user, token } = ctx;
      console.log("JWT", { ctx }, ctx?.token?.user);
      if (user) token.user = user;
      return token;
    },
    session(ctx) {
      const { token, session } = ctx;
      return { ...session, ...token };
    },
  },
  pages: {
    signIn: "/signIn",
  },
});

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth: () => Promise<Session | null> = nextAuth.auth;
