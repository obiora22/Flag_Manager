import { healthCheck } from "./lib/healthCheck.js";
import { narrowError } from "./lib/narrowError.js";
import { prismaClientInstance } from "./lib/prismaClient.js";
import { handleResult, handleError } from "./lib/serviceReturn.js";
export * as typeContracts from "./contracts.js";
export * as ruleEngine from "./rules.js";
export * as models from "./prisma/generated/models.js"; // => [modelName]Model -> e.g UserModel
export * as prismaEnums from "./prisma/generated/enums.js";
export * as generatedPrismaBrowserTypes from "./prisma/generated/browser.js";
export * as generatedPrismaServerTypes from "./prisma/generated/client.js"; // => Prisma, PrismaClient

export const utils = {
  healthCheck,
  narrowError,
  prismaClientInstance,
  handleError,
  handleResult,
};

// export const prismaUtils = {
//   Prisma,
//   PrismaClient,
// };
