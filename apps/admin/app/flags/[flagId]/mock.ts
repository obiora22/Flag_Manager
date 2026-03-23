import {Flag, FlagEnvironment, FlagEnvironmentType, ReturnValueType} from "@db/prisma/generated/client.ts";

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
  | "endsWith"
  | "greaterThan"
  | "in";

type ReturnValue = string | number | boolean | object;

type FlagWithStats = Omit<Flag, "rules"> & {
  environments: FlagEnvironment[];
  rules: Rule[];
  stats: { evaluations24h: number; lastEvaluated: string | null };
};


// type OperatorFn = (userValue: Operator, ruleValue: Operator) => boolean;

// interface EnvironmentOverrides {
//   enabled?: boolean;
//   defaultValue: ReturnValue;
//   rules?: Rule;
// }

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
  defaultValue?: ReturnValue;
  serve: unknown;
}

// Helper to generate random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper to generate random ID
function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

// Common feature flag keys and names by category
const flagTemplates = {
  ui: [
    {
      key: "new_dashboard_ui",
      name: "New Dashboard UI",
      description: "Redesigned dashboard with improved navigation and metrics visualization",
    },
    {
      key: "dark_mode",
      name: "Dark Mode Theme",
      description: "Dark theme support across all pages",
    },
    {
      key: "mobile_app_banner",
      name: "Mobile App Banner",
      description: "Show promotional banner for mobile app download",
    },
    {
      key: "sidebar_redesign",
      name: "Sidebar Redesign",
      description: "New collapsible sidebar with improved organization",
    },
    {
      key: "enhanced_search",
      name: "Enhanced Search",
      description: "AI-powered search with autocomplete and filters",
    },
  ],
  features: [
    {
      key: "real_time_collaboration",
      name: "Real-time Collaboration",
      description: "Enable real-time editing and presence indicators",
    },
    {
      key: "advanced_analytics",
      name: "Advanced Analytics",
      description: "Detailed analytics dashboard with custom reports",
    },
    {
      key: "api_versioning_v2",
      name: "API v2",
      description: "New API version with improved performance and features",
    },
    {key: "export_to_csv", name: "CSV Export", description: "Export data to CSV format"},
    {
      key: "bulk_operations",
      name: "Bulk Operations",
      description: "Perform actions on multiple items at once",
    },
    {
      key: "webhooks",
      name: "Webhooks",
      description: "Send notifications to external services on events",
    },
    {
      key: "sso_integration",
      name: "SSO Integration",
      description: "Single sign-on with SAML and OAuth providers",
    },
  ],
  experiments: [
    {
      key: "checkout_flow_experiment",
      name: "Checkout Flow A/B Test",
      description: "Testing new checkout flow vs. current flow",
    },
    {
      key: "pricing_page_variant",
      name: "Pricing Page Variant",
      description: "Testing different pricing presentation styles",
    },
    {
      key: "onboarding_sequence",
      name: "Onboarding Sequence Test",
      description: "Comparing 3-step vs 5-step onboarding",
    },
    {
      key: "recommendation_algorithm",
      name: "Recommendation Algorithm",
      description: "Testing ML-based recommendations",
    },
  ],
  performance: [
    {
      key: "lazy_loading_images",
      name: "Lazy Load Images",
      description: "Defer loading of below-the-fold images",
    },
    {
      key: "cdn_optimization",
      name: "CDN Optimization",
      description: "Route static assets through CDN",
    },
    {
      key: "database_query_cache",
      name: "Database Query Cache",
      description: "Cache frequent database queries",
    },
    {
      key: "async_processing",
      name: "Async Processing",
      description: "Move heavy operations to background jobs",
    },
  ],
  killSwitch: [
    {
      key: "email_notifications",
      name: "Email Notifications",
      description: "Send email notifications for important events",
    },
    {
      key: "external_api_integration",
      name: "External API Integration",
      description: "Integration with third-party APIs",
    },
    {
      key: "rate_limiting",
      name: "Rate Limiting",
      description: "Limit API requests per user/organization",
    },
    {
      key: "payment_processing",
      name: "Payment Processing",
      description: "Process payments through payment gateway",
    },
  ],
};

// Tags by category
const tagCategories = {
  priority: ["high-priority", "low-priority", "critical"],
  status: ["beta", "experimental", "stable", "deprecated"],
  team: ["frontend", "backend", "mobile", "data", "platform"],
  type: ["feature", "bugfix", "experiment", "killswitch", "performance"],
  customer: ["enterprise", "startup", "internal"],
};

// Generate random tags
function generateTags(): string[] {
  const tags: string[] = [];
  // const numTags = Math.floor(Math.random() * 4);

  if (Math.random() > 0.5) {
    tags.push(tagCategories.priority[Math.floor(Math.random() * tagCategories.priority.length)]);
  }
  if (Math.random() > 0.5) {
    tags.push(tagCategories.status[Math.floor(Math.random() * tagCategories.status.length)]);
  }
  if (Math.random() > 0.6) {
    tags.push(tagCategories.team[Math.floor(Math.random() * tagCategories.team.length)]);
  }
  if (Math.random() > 0.6) {
    tags.push(tagCategories.type[Math.floor(Math.random() * tagCategories.type.length)]);
  }

  return [...new Set(tags)]; // Remove duplicates
}

function generateFlagEnvironment(flagId: string, environmentType: FlagEnvironmentType): FlagEnvironment {
  const createdAt = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
  const updatedAt = randomDate(new Date(createdAt), new Date());
  return {
    flagId,
    environment: environmentType,
    createdAt,
    updatedAt,
    overrides: null,
    id: generateId('flagEnvironment'),
  }
}

function generateEnvironments(flagId: string) {
  const environmentTypes = ['DEVELOPMENT', 'STAGING', 'PRODUCTION']
  const flagCount = Math.floor(Math.random() * 3);

  const result: FlagEnvironment[] = [];
  for (let i = 0; i < flagCount; i++) {
    const selectedEnvironmentType = environmentTypes[Math.floor(Math.random() * environmentTypes.length)] as FlagEnvironmentType;
    result.push(generateFlagEnvironment(flagId, selectedEnvironmentType))
  }

  return result;
}

// Generate mock conditions
function generateConditions(): Condition[] {
  const conditionTemplates = [
    {attribute: "userId", operator: "in" as const, value: ["user_123", "user_456", "user_789"]},
    {attribute: "email", operator: "endsWith" as const, value: "@company.com"},
    {attribute: "plan", operator: "equals" as const, value: "enterprise"},
    {attribute: "country", operator: "in" as const, value: ["US", "CA", "UK"]},
    {attribute: "signupDate", operator: "greaterThan" as const, value: "2024-01-01"},
    {attribute: "beta_tester", operator: "equals" as const, value: true},
    {attribute: "accountAge", operator: "greaterThan" as const, value: 30},
  ];

  const numOfConditions = Math.floor(Math.random() * 3) + 1;
  const conditions: Condition[] = [];

  for (let i = 0; i < numOfConditions; i++) {
    const template = conditionTemplates[Math.floor(Math.random() * conditionTemplates.length)];
    conditions.push(template);
  }

  return conditions;
}

// Generate mock rules
function generateRules(
  flagId: string,
  flagValue: string | number | boolean | object = true,
): Rule[] {
  const numRules = Math.floor(Math.random() * 4);
  const rules: Rule[] = [];

  for (let i = 0; i < numRules; i++) {
    const hasConditions = Math.random() > 0.3;
    const hasRollout = Math.random() > 0.5;

    let returnValue: ReturnValue = true;
    switch (flagValue) {
      case "boolean":
        returnValue = true;
        break;
      case "string":
        returnValue = ["variant-a", "variant-b", "variant-c"][Math.floor(Math.random() * 3)];
        break;
      case "number":
        returnValue = Math.floor(Math.random() * 100);
        break;
      case "json":
        returnValue = {
          theme: "dark",
          layout: "grid",
          itemsPerPage: 20,
        };
        break;
    }

    rules.push({
      key: generateId("rule"),
      conditions: hasConditions ? generateConditions() : undefined,
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

// Generate a single mock flag
function generateMockFlag(
  projectId: string,
  template: { key: string; name: string; description: string },
  overrides?: Partial<FlagWithStats>,
): FlagWithStats {
  const flagId = generateId("flag");
  const returnValueType: ReturnValueType = ["BOOLEAN", "STRING", "NUMBER", "JSON"][
    Math.floor(Math.random() * 4)
    ] as ReturnValueType;

  const enabled = Math.random() > 0.3;
  const archived = Math.random() > 0.85;
  // const permanent = Math.random() > 0.9;

  let defaultValue: ReturnValue = Math.random() > 0.3;

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
      defaultValue = {enabled: false};
      break;
  }

  const createdAt = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
  const updatedAt = randomDate(new Date(createdAt), new Date());

  return {
    id: flagId,
    key: template.key,
    description: template.description,
    rules: generateRules(flagId),
    returnValueType,
    defaultValue,
    projectId,
    archived,
    createdAt,
    updatedAt,
    environments: generateEnvironments(flagId),
    stats: {
      evaluations24h: enabled ? Math.floor(Math.random() * 50000) : 0,
      lastEvaluated: enabled
        ? randomDate(new Date(Date.now() - 86400000), new Date()).toISOString()
        : null,
    },
    ...overrides,
  };
}

/**
 * Generate an array of mock flags
 */
export function generateMockFlags(projectId: string, count: number = 30): FlagWithStats[] {
  const flags: FlagWithStats[] = [];

  // Collect all templates
  const allTemplates = [
    ...flagTemplates.ui,
    ...flagTemplates.features,
    ...flagTemplates.experiments,
    ...flagTemplates.performance,
    ...flagTemplates.killSwitch,
  ];

  // Shuffle templates
  const shuffled = allTemplates.sort(() => Math.random() - 0.5);

  // Generate flags
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    flags.push(generateMockFlag(projectId, shuffled[i]));
  }

  // Ensure we have some specific states for testing
  if (flags.length > 0) {
    // Ensure at least one enabled flag
    flags[0] = {...flags[0], archived: false};

    // Ensure at least one disabled flag
    if (flags.length > 1) {
      flags[1] = {...flags[1], archived: false};
    }

    // Ensure at least one archived flag
    if (flags.length > 2) {
      flags[2] = {
        ...flags[2],
        archived: true,
      };
    }

    // Ensure at least one permanent flag
    if (flags.length > 3) {
      flags[3] = {...flags[3]};
    }
  }

  return flags;
}

/**
 * Generate mock flags with specific scenarios
 */
export function generateScenarioFlags(projectId: string): FlagWithStats[] {
  return [
    // Active production flag
    generateMockFlag(
      projectId,
      {
        key: "new_checkout_flow",
        name: "New Checkout Flow",
        description: "Redesigned checkout with one-click purchase and saved payment methods",
      },
      {
        archived: false,
        // tags: ["frontend", "high-priority", "stable"],
        // type: "boolean",
        stats: {
          evaluations24h: 45230,
          lastEvaluated: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        },
      },
    ),

    // Beta feature in rollout
    generateMockFlag(
      projectId,
      {
        key: "ai_recommendations",
        name: "AI-Powered Recommendations",
        description: "ML-based product recommendations personalized for each user",
      },
      {
        // enabled: true,
        archived: false,
        // permanent: false,
        // tags: ["backend", "beta", "experimental"],
        // type: "boolean",
        // _count: { rules: 3, environments: 4 },
        stats: {
          evaluations24h: 12450,
          lastEvaluated: new Date(Date.now() - 60000).toISOString(), // 1 min ago
        },
      },
    ),

    // Disabled feature being developed
    generateMockFlag(
      projectId,
      {
        key: "social_sharing",
        name: "Social Media Sharing",
        description: "Share content directly to social media platforms",
      },
      {
        // enabled: false,
        archived: false,
        // permanent: false,
        // tags: ["frontend", "low-priority"],
        // type: "boolean",
        stats: {
          evaluations24h: 0,
          lastEvaluated: null,
        },
      },
    ),

    // Permanent kill switch
    generateMockFlag(
      projectId,
      {
        key: "email_service",
        name: "Email Service",
        description: "Master switch for all email notifications",
      },
      {
        // enabled: true,
        archived: false,
        // permanent: true,
        // tags: ["backend", "critical", "killswitch"],
        // type: "boolean",
        stats: {
          evaluations24h: 89340,
          lastEvaluated: new Date(Date.now() - 1000).toISOString(), // 1 sec ago
        },
      },
    ),

    // String variant flag
    generateMockFlag(
      projectId,
      {
        key: "pricing_page_layout",
        name: "Pricing Page Layout",
        description: "A/B test for different pricing page layouts",
      },
      {
        // enabled: true,
        archived: false,
        // type: "string",
        defaultValue: "control",
        // tags: ["frontend", "experiment"],
        // _count: { rules: 2, environments: 3 },
        stats: {
          evaluations24h: 23100,
          lastEvaluated: new Date(Date.now() - 180000).toISOString(), // 3 min ago
        },
      },
    ),

    // Number flag with rollout percentage
    generateMockFlag(
      projectId,
      {
        key: "api_rate_limit",
        name: "API Rate Limit",
        description: "Maximum requests per minute per user",
      },
      {
        // enabled: true,
        archived: false,
        // type: "number",
        defaultValue: 100,
        // tags: ["backend", "performance"],
        stats: {
          evaluations24h: 156780,
          lastEvaluated: new Date(Date.now() - 5000).toISOString(), // 5 sec ago
        },
      },
    ),

    // JSON config flag
    generateMockFlag(
      projectId,
      {
        key: "dashboard_config",
        name: "Dashboard Configuration",
        description: "Dynamic dashboard layout and widget configuration",
      },
      {
        // enabled: true,
        archived: false,
        // type: "json",
        defaultValue: {
          layout: "grid",
          widgets: ["metrics", "activity", "notifications"],
          refreshInterval: 30,
        },
        // tags: ["frontend", "stable"],
        stats: {
          evaluations24h: 8920,
          lastEvaluated: new Date(Date.now() - 120000).toISOString(), // 2 min ago
        },
      },
    ),

    // Recently archived flag
    generateMockFlag(
      projectId,
      {
        key: "old_navigation",
        name: "Old Navigation System",
        description: "Legacy navigation - replaced by new sidebar",
      },
      {
        // enabled: false,
        archived: true,
        // archivedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        // tags: ["frontend", "deprecated"],
        stats: {
          evaluations24h: 0,
          lastEvaluated: new Date(Date.now() - 86400000 * 8).toISOString(),
        },
      },
    ),

    // Enterprise-only feature
    generateMockFlag(
      projectId,
      {
        key: "advanced_reporting",
        name: "Advanced Reporting",
        description: "Custom reports with data export and scheduling",
      },
      {
        // enabled: true,
        archived: false,
        // tags: ["backend", "enterprise", "stable"],
        // _count: { rules: 4, environments: 4 },
        stats: {
          evaluations24h: 3450,
          lastEvaluated: new Date(Date.now() - 600000).toISOString(), // 10 min ago
        },
      },
    ),

    // Mobile-specific flag
    generateMockFlag(
      projectId,
      {
        key: "mobile_push_notifications",
        name: "Mobile Push Notifications",
        description: "Enable push notifications for mobile apps",
      },
      {
        // enabled: true,
        archived: false,
        // tags: ["mobile", "high-priority"],
        // type: "boolean",
        stats: {
          evaluations24h: 67890,
          lastEvaluated: new Date(Date.now() - 30000).toISOString(), // 30 sec ago
        },
      },
    ),
  ];
}

/**
 * Generate flags with all possible tags for filter testing
 */
export function generateFlagsWithAllTags(projectId: string): FlagWithStats[] {
  const flags: FlagWithStats[] = [];

  Object.entries(tagCategories).forEach(([category, tags]) => {
    tags.forEach((tag) => {
      flags.push(
        generateMockFlag(
          projectId,
          {
            key: `${category}_${tag.replace("-", "_")}`,
            name: `${category} ${tag}`,
            description: `Flag demonstrating ${tag} tag`,
          },
          {
            // tags: [tag],
            // enabled: catIndex % 2 === 0,
          },
        ),
      );
    });
  });

  return flags;
}

/**
 * Get mock stats for flags page
 */
export function getMockFlagsStats(flags: FlagWithStats[]) {
  return {
    totalFlags: flags.length,
    // activeFlags: flags.filter((f) => f.enabled && !f.archived).length,
    // inactiveFlags: flags.filter((f) => !f.enabled && !f.archived).length,
    archivedFlags: flags.filter((f) => f.archived).length,
    totalEvaluations24h: flags.reduce((sum, f) => sum + (f.stats?.evaluations24h || 0), 0),
  };
}

// Export for easy use
export const mockFlags = {
  generate: generateMockFlags,
  scenarios: generateScenarioFlags,
  withAllTags: generateFlagsWithAllTags,
  stats: getMockFlagsStats,
};
