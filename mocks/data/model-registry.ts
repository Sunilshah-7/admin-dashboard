import { faker } from "@faker-js/faker";

import type {
  DeploymentEnvironment,
  Model,
  ModelDeployment,
  ModelStatus,
  ModelType,
  ModelVersion,
} from "@/types/api";

const MODEL_TYPES: ModelType[] = ["LLM", "Vision", "Embedding", "Audio", "Multimodal"];
const MODEL_STATUSES: ModelStatus[] = ["deployed", "training", "archived", "failed", "draft"];
const ENVIRONMENTS: DeploymentEnvironment[] = ["development", "staging", "production"];

function generateModelVersion(modelId: string, index: number): ModelVersion {
  const version = `v${faker.number.int({ min: 1, max: 3 })}.${index}.${faker.number.int({ min: 0, max: 9 })}`;

  return {
    id: `${modelId}_version_${index}`,
    version,
    changelog: faker.helpers.arrayElement([
      "Improved reasoning stability and context retention.",
      "Reduced inference latency through quantization tuning.",
      "Added expanded multilingual evaluation coverage.",
      "Updated safety filters and regression suite.",
    ]),
    createdAt: faker.date.recent({ days: 120 }).toISOString(),
    createdBy: faker.internet.email({ provider: "imd.ai" }),
    artifactUri: `s3://imd-model-registry/${modelId}/${version}`,
  };
}

function generateModelDeployment(modelId: string, version: ModelVersion): ModelDeployment {
  const environment = faker.helpers.arrayElement(ENVIRONMENTS);

  return {
    id: `${modelId}_${environment}_deployment`,
    modelId,
    modelVersionId: version.id,
    environment,
    status: faker.helpers.arrayElement(["pending", "deploying", "healthy", "degraded", "failed"]),
    endpointUrl: `https://${environment}.api.imd.ai/models/${modelId}`,
    replicas: faker.number.int({ min: 1, max: environment === "production" ? 12 : 4 }),
    lastDeployedAt: faker.date.recent({ days: 45 }).toISOString(),
  };
}

function generateModels(count = 16): Model[] {
  faker.seed(2202);

  return Array.from({ length: count }, (_, index) => {
    const id = `model_${faker.string.alphanumeric({ length: 8, casing: "lower" })}_${index + 1}`;
    const type = faker.helpers.arrayElement(MODEL_TYPES);
    const versions = Array.from(
      { length: faker.number.int({ min: 2, max: 5 }) },
      (_, versionIndex) => generateModelVersion(id, versionIndex + 1),
    );
    const latestVersion = versions.at(-1);
    const status = faker.helpers.arrayElement(MODEL_STATUSES);
    const deployments =
      latestVersion && status !== "draft"
        ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
            generateModelDeployment(id, latestVersion),
          )
        : [];

    return {
      id,
      name: `${faker.helpers.arrayElement(["Reflect", "Atlas", "Vector", "Nimbus", "Forge"])} ${type} ${faker.number.int({ min: 7, max: 90 })}B`,
      description: faker.company.catchPhrase(),
      type,
      status,
      currentVersion: latestVersion?.version ?? "v1.0.0",
      versions,
      deployments,
      latencyP95Ms: faker.number.int({ min: 80, max: 850 }),
      errorRatePercent: Number(faker.number.float({ min: 0.01, max: 2.8 }).toFixed(2)),
      lastDeployedAt: deployments[0]?.lastDeployedAt,
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 20 }).toISOString(),
    };
  });
}

function getModelById(modelId: string, models = generateModels()) {
  return models.find((model) => model.id === modelId) ?? null;
}

export { generateModels, getModelById };
