import {
  PrismaClient,
  Role,
  ReturnValueType,
  FlagEnvironmentType,
} from "@db/prisma/generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt-ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data (optional - remove in production)
  await prisma.auditLog.deleteMany();
  await prisma.flagEnvironment.deleteMany();
  await prisma.flag.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.project.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleaned existing data");

  // Create Users
  const passwordHash = await hash("Password123!", 12);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      firstname: "Adam",
      lastname: "Smith",
      credential: {
        create: {
          passwordHash,
        },
      },
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      email: "editor@example.com",
      firstname: "John",
      lastname: "Locke",
      credential: {
        create: {
          passwordHash,
        },
      },
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      email: "viewer@example.com",
      firstname: "John",
      lastname: "Stuart Mill",
      credential: {
        create: {
          passwordHash,
        },
      },
    },
  });

  console.log("👥 Created users");

  // Create Organizations
  const organizationOne = await prisma.organization.create({
    data: {
      name: "Acme Corporation",
      memberships: {
        create: [
          { userId: adminUser.id, role: Role.ADMIN },
          { userId: editorUser.id, role: Role.EDITOR },
          { userId: viewerUser.id, role: Role.VIEWER },
        ],
      },
    },
  });

  const organizationTwo = await prisma.organization.create({
    data: {
      name: "Startup Inc",
      memberships: {
        create: [{ userId: adminUser.id, role: Role.ADMIN }],
      },
    },
  });

  console.log("🏢 Created organizations");

  // Create Projects
  const mobileProject = await prisma.project.create({
    data: {
      name: "Mobile App",
      slug: "mobile-app",
      organizationId: organizationOne.id,
      users: {
        connect: [{ id: adminUser.id }, { id: editorUser.id }],
      },
    },
  });

  const webProject = await prisma.project.create({
    data: {
      name: "Web Platform",
      slug: "web-platform",
      organizationId: organizationOne.id,
      users: {
        connect: [{ id: adminUser.id }, { id: editorUser.id }, { id: viewerUser.id }],
      },
    },
  });

  const apiProject = await prisma.project.create({
    data: {
      name: "API Service",
      slug: "api-service",
      organizationId: organizationOne.id,
      users: {
        connect: [{ id: adminUser.id }],
      },
    },
  });

  const startupProject = await prisma.project.create({
    data: {
      name: "MVP Product",
      slug: "mvp-product",
      organizationId: organizationTwo.id,
      users: {
        connect: [{ id: adminUser.id }],
      },
    },
  });

  console.log("📦 Created projects");

  // Create Feature Flags

  // 1. Simple Boolean Flag - New Checkout Flow
  const checkoutFlag = await prisma.flag.create({
    data: {
      key: "new-checkout-flow",
      description: "Enable the redesigned checkout experience",
      returnValueType: ReturnValueType.BOOLEAN,
      defaultValue: false,
      projectId: mobileProject.id,
      rules: [
        {
          key: "rule-1",
          conditions: [
            {
              attribute: "plan",
              operator: "equals",
              value: "premium",
            },
          ],
          serve: true,
        },
        {
          key: "rule-2",
          rollout: {
            percentage: 10,
            attribute: "userId",
          },
          serve: true,
        },
      ],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: {
              enabled: true,
              defaultValue: true,
            },
          },
          {
            environment: FlagEnvironmentType.STAGING,
            overrides: {
              enabled: true,
              rules: [
                {
                  id: "staging-rule-1",
                  rollout: {
                    percentage: 50,
                    attribute: "userId",
                  },
                  serve: true,
                },
              ],
            },
          },
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: {
              enabled: false,
            },
          },
        ],
      },
    },
  });

  // 2. Number Flag - Max Cart Items
  const maxCartItemsFlag = await prisma.flag.create({
    data: {
      key: "max-cart-items",
      description: "Maximum number of items allowed in cart",
      returnValueType: ReturnValueType.NUMBER,
      defaultValue: 10,
      projectId: mobileProject.id,
      rules: [
        {
          id: "rule-1",
          conditions: [
            {
              attribute: "userType",
              operator: "equals",
              value: "premium",
            },
          ],
          serve: 50,
        },
        {
          id: "rule-2",
          conditions: [
            {
              attribute: "region",
              operator: "in",
              value: ["US", "CA", "UK"],
            },
          ],
          serve: 25,
        },
      ],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: { defaultValue: 100 },
          },
          {
            environment: FlagEnvironmentType.STAGING,
            overrides: { defaultValue: 20 },
          },
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: { defaultValue: 10 },
          },
        ],
      },
    },
  });

  // 3. String Flag - Theme
  const themeFlag = await prisma.flag.create({
    data: {
      key: "app-theme",
      description: "Application theme configuration",
      returnValueType: ReturnValueType.STRING,
      defaultValue: "light",
      projectId: webProject.id,
      rules: [
        {
          id: "rule-1",
          conditions: [
            {
              attribute: "betaTester",
              operator: "equals",
              value: true,
            },
          ],
          serve: "dark",
        },
      ],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: { defaultValue: "debug" },
          },
          {
            environment: FlagEnvironmentType.STAGING,
            overrides: { defaultValue: "dark" },
          },
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: { defaultValue: "light" },
          },
        ],
      },
    },
  });

  // 4. JSON Flag - Feature Configuration
  const featureConfigFlag = await prisma.flag.create({
    data: {
      key: "advanced-analytics",
      description: "Advanced analytics feature configuration",
      returnValueType: ReturnValueType.JSON,
      defaultValue: {
        enabled: false,
        trackingLevel: "basic",
        features: [],
      },
      projectId: webProject.id,
      rules: [
        {
          id: "rule-1",
          conditions: [
            {
              attribute: "plan",
              operator: "in",
              value: ["enterprise", "business"],
            },
          ],
          serve: {
            enabled: true,
            trackingLevel: "advanced",
            features: ["heatmaps", "session-replay", "funnel-analysis"],
          },
        },
        {
          id: "rule-2",
          conditions: [
            {
              attribute: "plan",
              operator: "equals",
              value: "pro",
            },
          ],
          serve: {
            enabled: true,
            trackingLevel: "intermediate",
            features: ["heatmaps", "session-replay"],
          },
        },
      ],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: {
              defaultValue: {
                enabled: true,
                trackingLevel: "debug",
                features: ["all"],
              },
            },
          },
          {
            environment: FlagEnvironmentType.STAGING,
            overrides: {
              defaultValue: {
                enabled: true,
                trackingLevel: "advanced",
                features: ["heatmaps", "session-replay"],
              },
            },
          },
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: {
              defaultValue: {
                enabled: false,
                trackingLevel: "basic",
                features: [],
              },
            },
          },
        ],
      },
    },
  });

  // 5. Gradual Rollout Flag
  const darkModeFlag = await prisma.flag.create({
    data: {
      key: "dark-mode",
      description: "Enable dark mode UI",
      returnValueType: ReturnValueType.BOOLEAN,
      defaultValue: false,
      projectId: webProject.id,
      rules: [
        {
          id: "rule-1",
          conditions: [
            {
              attribute: "email",
              operator: "endsWith",
              value: "@acme.com",
            },
          ],
          serve: true,
        },
        {
          id: "rule-2",
          rollout: {
            percentage: 25,
            attribute: "userId",
          },
          serve: true,
        },
      ],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: { defaultValue: true },
          },
          {
            environment: FlagEnvironmentType.STAGING,
            overrides: {
              rules: [
                {
                  id: "staging-rollout",
                  rollout: {
                    percentage: 75,
                    attribute: "userId",
                  },
                  serve: true,
                },
              ],
            },
          },
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: {
              rules: [
                {
                  id: "prod-rollout",
                  rollout: {
                    percentage: 10,
                    attribute: "userId",
                  },
                  serve: true,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 6. API Rate Limiting Flag
  const rateLimitFlag = await prisma.flag.create({
    data: {
      key: "api-rate-limit",
      description: "API rate limit per user",
      returnValueType: ReturnValueType.NUMBER,
      defaultValue: 100,
      projectId: apiProject.id,
      rules: [
        {
          id: "rule-1",
          conditions: [
            {
              attribute: "apiTier",
              operator: "equals",
              value: "enterprise",
            },
          ],
          serve: 10000,
        },
        {
          id: "rule-2",
          conditions: [
            {
              attribute: "apiTier",
              operator: "equals",
              value: "business",
            },
          ],
          serve: 1000,
        },
      ],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: { defaultValue: 999999 },
          },
          {
            environment: FlagEnvironmentType.STAGING,
            overrides: { defaultValue: 500 },
          },
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: { defaultValue: 100 },
          },
        ],
      },
    },
  });

  // 7. Feature Kill Switch
  const paymentProcessingFlag = await prisma.flag.create({
    data: {
      key: "payment-processing-enabled",
      description: "Emergency kill switch for payment processing",
      returnValueType: ReturnValueType.BOOLEAN,
      defaultValue: true,
      projectId: mobileProject.id,
      rules: [],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: { defaultValue: true },
          },
          {
            environment: FlagEnvironmentType.STAGING,
            overrides: { defaultValue: true },
          },
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: { defaultValue: true },
          },
        ],
      },
    },
  });

  // 8. Regional Feature Flag
  const shippingOptionsFlag = await prisma.flag.create({
    data: {
      key: "premium-shipping",
      description: "Enable premium shipping options",
      returnValueType: ReturnValueType.BOOLEAN,
      defaultValue: false,
      projectId: mobileProject.id,
      rules: [
        {
          id: "rule-1",
          conditions: [
            {
              attribute: "country",
              operator: "in",
              value: ["US", "CA", "UK", "DE", "FR"],
            },
            {
              attribute: "userType",
              operator: "equals",
              value: "premium",
            },
          ],
          serve: true,
        },
      ],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: { defaultValue: true },
          },
          {
            environment: FlagEnvironmentType.STAGING,
            overrides: { defaultValue: true },
          },
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: { defaultValue: false },
          },
        ],
      },
    },
  });

  // 9. Archived Flag (deprecated feature)
  await prisma.flag.create({
    data: {
      key: "old-ui-legacy",
      description: "Legacy UI (deprecated)",
      returnValueType: ReturnValueType.BOOLEAN,
      defaultValue: false,
      projectId: webProject.id,
      archived: true,
      rules: [],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.PRODUCTION,
            overrides: { defaultValue: false },
          },
        ],
      },
    },
  });

  // 10. Startup Project Flag
  await prisma.flag.create({
    data: {
      key: "beta-features",
      description: "Enable beta features for early adopters",
      returnValueType: ReturnValueType.BOOLEAN,
      defaultValue: false,
      projectId: startupProject.id,
      rules: [
        {
          id: "rule-1",
          conditions: [
            {
              attribute: "betaTester",
              operator: "equals",
              value: true,
            },
          ],
          serve: true,
        },
      ],
      environments: {
        create: [
          {
            environment: FlagEnvironmentType.DEVELOPMENT,
            overrides: { defaultValue: true },
          },
        ],
      },
    },
  });

  console.log("🚩 Created feature flags");

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        projectId: mobileProject.id,
        flagId: checkoutFlag.id,
        actor: adminUser.id,
        action: "create_flag",
        payload: { key: "new-checkout-flow" },
      },
      {
        projectId: mobileProject.id,
        flagId: checkoutFlag.id,
        actor: editorUser.id,
        action: "update_rules",
        payload: { changes: "Added rollout rule" },
      },
      {
        projectId: webProject.id,
        flagId: darkModeFlag.id,
        actor: adminUser.id,
        action: "toggle_env",
        payload: { environment: "staging", enabled: true },
      },
    ],
  });

  console.log("📝 Created audit logs");

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`  - Users: 3 (admin, editor, viewer)`);
  console.log(`  - Organizations: 2`);
  console.log(`  - Projects: 4`);
  console.log(`  - Feature Flags: 10`);
  console.log(`  - Environments per flag: 1-3`);
  console.log(`  - Audit Logs: 3`);
  console.log("\n🔑 Login credentials:");
  console.log(`  - admin@example.com / Password123!`);
  console.log(`  - editor@example.com / Password123!`);
  console.log(`  - viewer@example.com / Password123!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
