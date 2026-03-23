import { Condition, Rule } from "@db/types/rules.ts";
import {
  Flag,
  FlagEnvironment,
  FlagEnvironmentType,
  ReturnValueType,
} from "@db/prisma/generated/client.ts";

type FlagWithRules = Omit<Flag, "rules"> & {
  environments: FlagEnvironment[];
  rules: Rule[];
};

function generateRandomReturnType() {
  const returnValueType = ["BOOLEAN", "STRING", "NUMBER", "JSON"];
  return returnValueType[Math.floor(Math.random() * returnValueType.length)] as ReturnValueType;
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function randomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toISOString();
}

// Generate mock conditions
function generateMockConditions(): Condition[] {
  const templates = [
    { attribute: "userId", operator: "in" as const, value: ["user_123", "user_456"] },
    { attribute: "email", operator: "endsWith" as const, value: "@company.com" },
    { attribute: "plan", operator: "equals" as const, value: "enterprise" },
    { attribute: "country", operator: "in" as const, value: ["US", "CA", "UK"] },
    { attribute: "beta_tester", operator: "equals" as const, value: true },
    { attribute: "accountAge", operator: "greaterThan" as const, value: 30 },
    { attribute: "feature_group", operator: "equals" as const, value: "early_access" },
  ];

  const numConditions = Math.floor(Math.random() * 3) + 1;
  
  return templates
    .sort(() => Math.random() - 0.5)
    .slice(0, numConditions)
    .map((template) => ({
      id: generateId("cond"),
      ...template,
    }));
}

// Generate mock rules
function generateMockRules(flagId: string, returnValueType: ReturnValueType): Rule[] {
  const rules: Rule[] = [];
  const numRules = Math.floor(Math.random() * 4) + 1;

  for (let i = 0; i < numRules; i++) {
    const hasConditions = Math.random() > 0.3;
    const hasRollout = Math.random() > 0.5;

    let returnValue: string | number | object | JSON | boolean | undefined = undefined;
    switch (returnValueType) {
      case "BOOLEAN":
        returnValue = true;
        break;
      case "STRING":
        returnValue = ["variant-a", "variant-b", "variant-c"][Math.floor(Math.random() * 3)];
        break;
      case "NUMBER":
        returnValue = Math.floor(Math.random() * 100);
        break;
      case "JSON":
        returnValue = {
          theme: "dark",
          layout: "grid",
          itemsPerPage: 20,
        };
        break;
    }

    rules.push({
      key: `Rule ${i + 1}: ${hasConditions ? "Targeted Users" : "General Rollout"}`,
      conditions: hasConditions ? generateMockConditions() : undefined,
      rollout: hasRollout
        ? {
            percentage: Math.floor(Math.random() * 100),
            attribute: "userId",
          }
        : undefined,
      serve: returnValue,
    });
  }

  return rules;
}

// Generate mock environments
function generateMockEnvironment(
  flagId: string,
  environmentType: FlagEnvironmentType,
): FlagEnvironment {
  const createdAt = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)) as unknown as Date;
  const updatedAt = randomDate(new Date(createdAt), new Date()) as unknown as Date;
  return {
    flagId,
    environment: environmentType,
    createdAt,
    updatedAt,
    overrides: null,
    id: generateId("flagEnvironment"),
  };
}

function generateMockEnvironments(flagId: string) {
  const environmentTypes = ["DEVELOPMENT", "STAGING", "PRODUCTION"];
  const flagCount = Math.floor(Math.random() * 3);

  const result: FlagEnvironment[] = [];
  for (let i = 0; i < flagCount; i++) {
    const selectedEnvironmentType = environmentTypes[
      Math.floor(Math.random() * environmentTypes.length)
    ] as FlagEnvironmentType;
    result.push(generateMockEnvironment(flagId, selectedEnvironmentType));
  }

  return result;
}

/**
 * Generate a complete flag with rules for detail view
 */
export function generateMockFlagDetail(projectId: string, flagId?: string): FlagWithRules {
  const id = flagId || generateId("flag");
  const returnValueType = generateRandomReturnType();

  let defaultValue: boolean | string | number | JSON;
  switch (returnValueType) {
    case "BOOLEAN":
      defaultValue = false;
      break;
    case "STRING":
      defaultValue = "default";
      break;
    case "NUMBER":
      defaultValue = 0;
      break;
    case "JSON":
      defaultValue = { enabled: false, config: {} };
      break;
  }

  const createdAt = new Date(2023, 0, 1);
  const updatedAt = new Date(createdAt);

  return {
    id,
    key: "new_checkout_flow",
    description:
      "Redesigned checkout experience with one-click purchase and improved payment methods",
    defaultValue,
    returnValueType,
    environments: generateMockEnvironments(id),
    projectId,
    archived: false,
    createdAt,
    updatedAt,
    rules: generateMockRules(id, returnValueType),
  };
}

/**
 * Generate specific scenario flags for demo
 */
// export function generateScenarioFlagDetail(
//   projectId: string,
//   scenario: 'simple' | 'complex' | 'rollout' | 'targeting'
// ): FlagWithRules {
//   const baseFlag: FlagWithRules = {
//     id: generateId('flag'),
//     key: 'demo_flag',
//     name: 'Demo Feature Flag',
//     description: 'Example feature flag for demonstration',
//     type: 'boolean',
//     defaultValue: false,
//     projectId,
//     enabled: true,
//     archived: false,
//     permanent: false,
//     tags: ['demo'],
//     createdBy: 'user_demo',
//     createdAt: new Date(2024, 0, 1).toISOString(),
//     updatedAt: new Date().toISOString(),
//     archivedAt: null,
//     rules: [],
//   };
//
//   switch (scenario) {
//     case 'simple':
//       // No rules, just default value
//       return {
//         ...baseFlag,
//         key: 'simple_feature',
//         name: 'Simple Feature Toggle',
//         description: 'Basic on/off feature flag with no rules',
//       };
//
//     case 'rollout':
//       // Percentage rollout
//       return {
//         ...baseFlag,
//         key: 'gradual_rollout',
//         name: 'Gradual Feature Rollout',
//         description: 'Feature being rolled out to 50% of users',
//         rules: [
//           {
//             id: generateId('rule'),
//             flagId: baseFlag.id,
//             name: 'Gradual Rollout',
//             description: '50% of users get the new feature',
//             priority: 0,
//             rollout: {
//               percentage: 50,
//               attribute: 'userId',
//             },
//             returnValue: true,
//             enabled: true,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           },
//         ],
//       };
//
//     case 'targeting':
//       // User targeting with conditions
//       return {
//         ...baseFlag,
//         key: 'enterprise_feature',
//         name: 'Enterprise-Only Feature',
//         description: 'Feature available only to enterprise customers',
//         rules: [
//           {
//             id: generateId('rule'),
//             flagId: baseFlag.id,
//             name: 'Enterprise Customers',
//             description: 'Enable for enterprise plan users',
//             priority: 0,
//             conditions: [
//               {
//                 id: generateId('cond'),
//                 attribute: 'plan',
//                 operator: 'equals',
//                 value: 'enterprise',
//               },
//             ],
//             returnValue: true,
//             enabled: true,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           },
//           {
//             id: generateId('rule'),
//             flagId: baseFlag.id,
//             name: 'Beta Testers',
//             description: 'Also enable for beta testers',
//             priority: 1,
//             conditions: [
//               {
//                 id: generateId('cond'),
//                 attribute: 'beta_tester',
//                 operator: 'equals',
//                 value: true,
//               },
//             ],
//             returnValue: true,
//             enabled: true,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           },
//         ],
//       };
//
//     case 'complex':
//       // Multiple rules with conditions and rollouts
//       return {
//         ...baseFlag,
//         key: 'ab_test_experiment',
//         name: 'A/B Test Experiment',
//         description: 'Complex experiment with multiple variants and targeting',
//         type: 'string',
//         defaultValue: 'control',
//         rules: [
//           {
//             id: generateId('rule'),
//             flagId: baseFlag.id,
//             name: 'Internal Users - Variant A',
//             description: 'All internal users see variant A',
//             priority: 0,
//             conditions: [
//               {
//                 id: generateId('cond'),
//                 attribute: 'email',
//                 operator: 'ends_with',
//                 value: '@company.com',
//               },
//             ],
//             returnValue: 'variant-a',
//             enabled: true,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           },
//           {
//             id: generateId('rule'),
//             flagId: baseFlag.id,
//             name: 'Enterprise - Variant B (30%)',
//             description: '30% of enterprise users see variant B',
//             priority: 1,
//             conditions: [
//               {
//                 id: generateId('cond'),
//                 attribute: 'plan',
//                 operator: 'equals',
//                 value: 'enterprise',
//               },
//             ],
//             rollout: {
//               percentage: 30,
//               attribute: 'userId',
//             },
//             returnValue: 'variant-b',
//             enabled: true,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           },
//           {
//             id: generateId('rule'),
//             flagId: baseFlag.id,
//             name: 'General Rollout - Variant A (50%)',
//             description: '50% of remaining users see variant A',
//             priority: 2,
//             rollout: {
//               percentage: 50,
//               attribute: 'userId',
//             },
//             returnValue: 'variant-a',
//             enabled: true,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           },
//         ],
//       };
//   }
// }

// Export convenience object
export const mockFlagDetail = {
  generate: generateMockFlagDetail,
  // scenario: generateScenarioFlagDetail,
  environments: generateMockEnvironments,
};

// Usage examples
/*
// Random flag with rules
const flag = generateMockFlagDetail('proj_123');

// Specific scenarios
const simpleFlag = generateScenarioFlagDetail('proj_123', 'simple');
const rolloutFlag = generateScenarioFlagDetail('proj_123', 'rollout');
const targetingFlag = generateScenarioFlagDetail('proj_123', 'targeting');
const complexFlag = generateScenarioFlagDetail('proj_123', 'complex');

// Environments
const environments = generateMockEnvironments('proj_123');
*/
