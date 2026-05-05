import type { Flag, Prisma } from "@db/prisma/generated/client.ts";
import type {
  FlagGetPayload,
  FlagInclude,
  ProjectGetPayload,
  ProjectInclude,
  UserGetPayload,
  UserInclude,
} from "@db/prisma/generated/models.ts";
import type { Rule } from "@schema/rule.schema.ts";

const flagInclude = {
  environments: true,
} satisfies FlagInclude;

const projectInclude = {
  users: true,
  flags: {
    include: {
      environments: true,
    },
  },
} satisfies ProjectInclude;

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
} satisfies UserInclude;

export type FlagWithEnvironment = FlagGetPayload<{
  include: typeof flagInclude;
}>;

export type BasicFlag = Flag;
export type CompositeFlag = Omit<FlagWithEnvironment, "rules"> & { rules: Rule[] };
export type ProjectData = ProjectGetPayload<{
  include: typeof projectInclude;
}> & {
  userCount: number;
  flagCount: number;
};
export type UserIncludeCredentials = UserGetPayload<{ include: typeof userInclude }>;

export interface DashboardData {
  id: string;
  name: string;
  totalFlags: string;
  totalProjects: string;
  totalMembership: string;
}

export type PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
