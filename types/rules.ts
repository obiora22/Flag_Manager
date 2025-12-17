import { Flag } from "@db/prisma/generated/client";
import { JsonArray } from "@db/prisma/generated/internal/prismaNamespace";
import { RulesSchema } from "@schema/flag.schema";
import { baseRuleSchema } from "@schema/project.schema";
import crypto from "crypto";
type Operator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "startsWith"
  | "endsWith";

type ReturnValue = string | number | boolean | JSON;

type OperatorFn = (userValue: any, ruleValue: any) => boolean;

interface EnvironmentOverrides {
  enabled?: boolean;
  defaultValue: ReturnValue;
  rules?: Rule;
}
interface Rollout {
  attribute: string;
  percentage: number;
  value: unknown;
}

interface Condition {
  attribute: string;
  operator: Operator;
  value: unknown;
}

export interface Rule {
  id: string;
  conditions?: Condition[];
  rollout?: Rollout;
  defaultValue?: ReturnValue;
}

const rule_0 = {
  conditions: [
    { attribute: "country", operator: "equals", value: "CA" },
    { attribute: "role", operator: "equals", value: "ADMIN" },
  ],
  serve: false,
};

const rule_1 = {
  conditions: [],
  serve: false,
};

const rule_2 = {
  rollout: { percentage: 20, value: true },
};

const matchTypes = (type: string, ...args: any[]) => {
  return args.every((arg) => typeof arg === type);
};

export const operatorFns: Record<Operator, OperatorFn> = {
  equals: (a, b) => a === b,
  notEquals: (a, b) => a !== b,
  contains: (a, b) => Array.isArray(b) && b.includes(a),
  notContains: (userValue: any, ruleValue: any) =>
    Array.isArray(ruleValue) && ruleValue.includes(userValue),
  gt: (userValue: any, ruleValue: any): boolean => {
    return matchTypes("number", userValue, ruleValue) && userValue > ruleValue;
  },
  gte: (userValue: any, ruleValue: any): boolean => {
    return matchTypes("number", userValue, ruleValue) && userValue >= ruleValue;
  },
  lt: (userValue: any, ruleValue: any): boolean => {
    return matchTypes("number", userValue, ruleValue) && userValue < ruleValue;
  },
  lte: (userValue: any, ruleValue: any): boolean => {
    return matchTypes("number", userValue, ruleValue) && userValue;
  },
  startsWith: (userValue: any, ruleValue: any): boolean => {
    return (
      matchTypes("string", userValue, ruleValue) &&
      ruleValue.startsWith(userValue)
    );
  },
  endsWith: (userValue: any, ruleValue: any): boolean => {
    return (
      matchTypes("string", userValue, ruleValue) &&
      ruleValue.endsWith(userValue)
    );
  },
};

const user: Record<string, unknown> = {
  id: 100,
  country: "US",
  bucket: 22.3798,
};

function checkConditions(
  conditions: Condition[],
  user: Record<string, unknown>
) {
  return conditions.length === 0
    ? true
    : conditions.every((condition) => {
        return operatorFns[condition.operator](
          user[condition.attribute],
          condition.value
        );
      });
}

function processRollout(userId: string, flagKey: string, rollout: Rollout) {
  const userBucket = getUserBucket(userId, flagKey);
  return userBucket <= rollout.percentage ? rollout.value : null;
}

function getUserBucket(userId: string, flagKey: string) {
  const input = `${userId}${flagKey}`;
  const hash = crypto
    .createHash("sha2")
    .update(input)
    .digest("hex")
    .slice(0, 8);
  const hashInt = BigInt("OX" + hash);
  return Number(hashInt % 100n);
}

function RuleEngine(
  rule: Rule,
  user: Record<string, unknown> & { id: string }
) {
  const { conditions, rollout, defaultValue } = rule;

  if (!conditions) return defaultValue;

  const conditionsPass = checkConditions(conditions, user);

  if (!conditionsPass) return rule.defaultValue;

  if (rollout && user) {
    const result = processRollout(user.id, "api_v2", rollout);

    return result ? result : rule.defaultValue;
  }

  return rule.defaultValue;
}

// Resolve Prisma Json type with schema type
function parseRules(json: unknown): Rule[] {
  return RulesSchema.parse(json);
}

function evaluateFlag(flag: Flag, user: any) {
  if (!flag.rules) return flag.defaultValue;
  const rules = parseRules(flag.rules);
  for (const rule of rules) {
    if (rule.conditions) {
      const allPass = checkConditions(rule.conditions, user);
      if (!allPass) continue;
    }

    if (rule.rollout) {
      const userInRollout = processRollout(user.id, flag.key, rule.rollout);
      if (!userInRollout) continue;
    }

    if (rule.defaultValue !== undefined) return rule.defaultValue;

    return flag.defaultValue;
  }
}
