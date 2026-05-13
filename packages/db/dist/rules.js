import { rulesSchema } from "@packages/schema";
import { createHash } from "crypto";
const rule_0 = {
    conditions: [
        { attribute: "country", operator: "equals", value: "CA" },
        { attribute: "role", operator: "equals", value: "ADMIN" },
    ],
    serve: false,
    key: "",
};
const rule_1 = {
    conditions: [],
    serve: false,
};
const rule_2 = {
    rollout: { percentage: 20, value: true },
};
const matchTypes = (type, ...args) => {
    return args.every((arg) => typeof arg === type);
};
export const operatorFns = {
    equals: (a, b) => a === b,
    notEquals: (a, b) => a !== b,
    contains: (a, b) => Array.isArray(b) && b.includes(a),
    notContains: (userValue, ruleValue) => Array.isArray(ruleValue) && ruleValue.includes(userValue),
    gt: (userValue, ruleValue) => {
        return matchTypes("number", userValue, ruleValue) && userValue > ruleValue;
    },
    gte: (userValue, ruleValue) => {
        return matchTypes("number", userValue, ruleValue) && userValue >= ruleValue;
    },
    lt: (userValue, ruleValue) => {
        return matchTypes("number", userValue, ruleValue) && userValue < ruleValue;
    },
    lte: (userValue, ruleValue) => {
        return matchTypes("number", userValue, ruleValue) && userValue;
    },
    startsWith: (userValue, ruleValue) => {
        return matchTypes("string", userValue, ruleValue) && ruleValue.startsWith(userValue);
    },
    endsWith: (userValue, ruleValue) => {
        return matchTypes("string", userValue, ruleValue) && ruleValue.endsWith(userValue);
    },
    greaterThan: function (userValue, ruleValue) {
        throw new Error("Function not implemented.");
    },
    in: function (userValue, ruleValue) {
        throw new Error("Function not implemented.");
    },
};
const user = {
    id: 100,
    country: "US",
    bucket: 22.3798,
};
function checkConditions(conditions, user) {
    return conditions.length === 0
        ? true
        : conditions.every((condition) => {
            return operatorFns[condition.operator](user[condition.attribute], condition.value);
        });
}
function processRollout(userId, rollout) {
    const userBucket = getUserBucket(userId);
    return userBucket <= rollout.percentage;
}
function getUserBucket(userId) {
    const input = `${userId}`;
    const hash = createHash("sha2").update(input).digest("hex").slice(0, 8);
    const hashInt = BigInt("OX" + hash);
    return Number(hashInt % 100n);
}
function RuleEngine(rule, user) {
    const { conditions, rollout, serve } = rule;
    if (!conditions)
        return serve;
    const conditionsPass = checkConditions(conditions, user);
    if (!conditionsPass)
        return serve;
    if (rollout && user) {
        const result = processRollout(user.id, rollout);
        return result ? result : rule.serve;
    }
    return rule.serve;
}
// Resolve Prisma JSON type with a schema type
function parseRules(json) {
    return rulesSchema.parse(json);
}
function evaluateFlag(flag, user) {
    if (!flag.rules)
        return flag.defaultValue;
    const rules = parseRules(flag.rules);
    for (const rule of rules) {
        if (rule.conditions) {
            const allPass = checkConditions(rule.conditions, user);
            if (!allPass)
                continue;
        }
        if (rule.rollout) {
            const userInRollout = processRollout(user.id, rule.rollout);
            if (!userInRollout)
                continue;
        }
        if (rule.serve !== undefined)
            return rule.serve;
        return flag.defaultValue;
    }
}
//# sourceMappingURL=rules.js.map