type Operator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'in'
  | 'notIn'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'startsWith'
  | 'endsWith';

type ReturnValue = string | number | boolean | JSON;

interface Rollout {
  percentage: number;
  value: ReturnValue;
}

interface Condition {
  attribute: string;
  operator: Operator;
  value: ReturnValue;
}

export interface Rule {
  id: string;
  conditions?: Condition[];
  rollout?: Rollout;
  serve?: ReturnValue;
}
