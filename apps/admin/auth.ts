import NextAuth, { type DefaultSession, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareHash } from "@admin/lib/hashAndCompare.ts";
import { getUserCredentials } from "./actions/users";
import { Role } from "@db/prisma/generated/client";

interface ExtendedUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  memberships: {
    org: {
      name: string;
    };
    id: string;
    role: Role;
    userId: string;
    orgId: string;
  }[];
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser & DefaultSession["user"];
    email: string;
    activeOrgId: string;
    activeRole: Role;
  }

  interface User extends ExtendedUser {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    memberships: {
      org: {
        name: string;
      };
      id: string;
      role: Role;
      userId: string;
      orgId: string;
    }[];
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
        const userCredentials = credentials as { email: string; password: string };

        const { data: user } = await getUserCredentials(userCredentials.email);

        if (!user) return null;

        const { credential } = user;
        const match = await compareHash(userCredentials.password, credential?.passwordHash);

        const { id, firstname, lastname, email, memberships } = user;
        if (match)
          return {
            id,
            firstname,
            lastname,
            email,
            memberships,
          };

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
      const { user, token, trigger, session } = ctx;

      if (user) {
        token.user = user;

        token.activeOrgId = user.memberships[0].orgId;
        token.activeRole = user.memberships[0].role;
        token.membership = user.memberships;
      }

      if (trigger === "update" && session?.activeOrgId && session?.activeRole) {
        console.log("Token update triggered: " + token.activeOrgId + " " + token.activeRole);
        token.activeOrgId = session.activeOrgId;
        token.activeRole = session.activeRole;
      }

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
