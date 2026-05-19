import { faker } from "@faker-js/faker";

import { generateModels } from "@/mocks/data/model-registry";
import type {
  Deployment,
  DeploymentEnvironment,
  DeploymentLog,
  DeploymentStage,
  DeploymentStageStatus,
  DeploymentStatus,
} from "@/types/api";

const DEPLOYMENT_STATUSES: DeploymentStatus[] = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "canceled",
];
const STAGE_NAMES = ["Build", "Test", "Deploy", "Verify"] as const;
const ENVIRONMENTS: DeploymentEnvironment[] = ["development", "staging", "production"];

function getStageStatus(
  deploymentStatus: DeploymentStatus,
  stageIndex: number,
): DeploymentStageStatus {
  if (deploymentStatus === "queued") {
    return stageIndex === 0 ? "pending" : "pending";
  }

  if (deploymentStatus === "running") {
    return stageIndex < 2 ? "succeeded" : stageIndex === 2 ? "running" : "pending";
  }

  if (deploymentStatus === "failed") {
    return stageIndex < 2 ? "succeeded" : stageIndex === 2 ? "failed" : "skipped";
  }

  if (deploymentStatus === "canceled") {
    return stageIndex === 0 ? "succeeded" : "skipped";
  }

  return "succeeded";
}

function generateStages(
  deploymentId: string,
  status: DeploymentStatus,
  startedAt: Date,
): DeploymentStage[] {
  return STAGE_NAMES.map((name, index) => {
    const stageStatus = getStageStatus(status, index);
    const offsetSeconds = index * faker.number.int({ min: 80, max: 220 });
    const durationSeconds =
      stageStatus === "pending" || stageStatus === "skipped"
        ? undefined
        : faker.number.int({ min: 45, max: 420 });
    const stageStartedAt =
      stageStatus === "pending" || stageStatus === "skipped"
        ? undefined
        : new Date(startedAt.getTime() + offsetSeconds * 1000).toISOString();

    return {
      id: `${deploymentId}_stage_${index + 1}`,
      name,
      status: stageStatus,
      startedAt: stageStartedAt,
      completedAt:
        stageStartedAt && durationSeconds && stageStatus !== "running"
          ? new Date(new Date(stageStartedAt).getTime() + durationSeconds * 1000).toISOString()
          : undefined,
      durationSeconds,
    };
  });
}

function generateLogs(deploymentId: string, stages: DeploymentStage[]): DeploymentLog[] {
  return stages
    .filter((stage) => stage.status !== "pending" && stage.status !== "skipped")
    .flatMap((stage) =>
      Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, index) => ({
        id: `${stage.id}_log_${index + 1}`,
        deploymentId,
        stageId: stage.id,
        timestamp: faker.date.recent({ days: 10 }).toISOString(),
        level: stage.status === "failed" ? faker.helpers.arrayElement(["warn", "error"]) : "info",
        message: faker.helpers.arrayElement([
          `${stage.name} started`,
          `${stage.name} completed dependency checks`,
          `${stage.name} uploaded artifacts`,
          `${stage.name} emitted metrics`,
          `${stage.name} finished`,
        ]),
      })),
    );
}

function generateDeployments(count = 24): Deployment[] {
  faker.seed(2303);

  const models = generateModels(12);

  return Array.from({ length: count }, (_, index) => {
    const model = faker.helpers.arrayElement(models);
    const status = faker.helpers.arrayElement(DEPLOYMENT_STATUSES);
    const startedAt = faker.date.recent({ days: 30 });
    const id = `deployment_${faker.string.alphanumeric({ length: 10, casing: "lower" })}_${index + 1}`;
    const stages = generateStages(id, status, startedAt);
    const completedStages = stages.filter((stage) => stage.completedAt);
    const completedAt = completedStages.at(-1)?.completedAt;

    return {
      id,
      modelId: model.id,
      modelName: model.name,
      commitSha: faker.git.commitSha({ length: 8 }),
      branch: faker.helpers.arrayElement([
        "main",
        "release/model-serving",
        "feature/latency-tuning",
      ]),
      environment: faker.helpers.arrayElement(ENVIRONMENTS),
      status,
      stages,
      logs: generateLogs(id, stages),
      triggeredBy: faker.person.fullName(),
      startedAt: startedAt.toISOString(),
      completedAt,
      durationSeconds: completedAt
        ? Math.round((new Date(completedAt).getTime() - startedAt.getTime()) / 1000)
        : undefined,
    };
  });
}

function getDeploymentById(deploymentId: string, deployments = generateDeployments()) {
  return deployments.find((deployment) => deployment.id === deploymentId) ?? null;
}

export { generateDeployments, getDeploymentById };
