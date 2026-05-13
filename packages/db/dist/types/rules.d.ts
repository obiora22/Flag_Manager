type Operator = "equals" | "greaterThan" | "notEquals" | "contains" | "notContains" | "gt" | "gte" | "lt" | "lte" | "startsWith" | "endsWith" | "in";
type OperatorFn = (userValue: any, ruleValue: any) => boolean;
interface Rollout {
    attribute: string;
    percentage: number;
}
export interface Condition {
    attribute: string;
    operator: Operator;
    value: unknown;
}
export interface Rule {
    key: string;
    conditions?: Condition[];
    rollout?: Rollout;
    serve: unknown;
}
export declare const operatorFns: Record<Operator, OperatorFn>;
export {};
//# sourceMappingURL=rules.d.ts.map