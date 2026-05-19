import { faker } from "@faker-js/faker";

import type { GpuMetric, GpuMetricSeries, TimeRange } from "@/types/api";

const DEFAULT_CLUSTER_ID = "cluster_reflection_primary";
const GPU_IDS = ["h100-01", "h100-02", "h100-03", "h100-04", "a100-01", "a100-02"];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getRangeHours(range: TimeRange) {
  if (range === "7d") {
    return 7 * 24;
  }

  if (range === "30d") {
    return 30 * 24;
  }

  return 24;
}

function generateGpuMetrics({
  clusterId = DEFAULT_CLUSTER_ID,
  gpuIds = GPU_IDS,
  range = "24h",
  intervalMinutes = 5,
}: {
  clusterId?: string;
  gpuIds?: string[];
  range?: TimeRange;
  intervalMinutes?: number;
} = {}): GpuMetricSeries {
  faker.seed(2101);

  const intervalMs = intervalMinutes * 60 * 1000;
  const pointCount = Math.floor((getRangeHours(range) * 60) / intervalMinutes);
  const start = Date.now() - pointCount * intervalMs;
  const metrics: GpuMetric[] = [];

  for (let pointIndex = 0; pointIndex <= pointCount; pointIndex += 1) {
    const timestamp = new Date(start + pointIndex * intervalMs).toISOString();
    const wave = Math.sin(pointIndex / 12) * 14;

    gpuIds.forEach((gpuId, gpuIndex) => {
      const memoryTotalGb = gpuId.startsWith("h100") ? 80 : 40;
      const utilizationPercent = Math.round(
        clamp(64 + wave + gpuIndex * 3 + faker.number.int({ min: -8, max: 8 }), 12, 98),
      );
      const memoryUsedGb = Number(
        clamp(
          memoryTotalGb * (utilizationPercent / 100) + faker.number.float({ min: -4, max: 4 }),
          2,
          memoryTotalGb,
        ).toFixed(1),
      );

      metrics.push({
        timestamp,
        clusterId,
        gpuId,
        utilizationPercent,
        memoryUsedGb,
        memoryTotalGb,
        temperatureCelsius: Math.round(
          clamp(42 + utilizationPercent * 0.35 + faker.number.int({ min: -4, max: 5 }), 35, 87),
        ),
        powerWatts: Math.round(
          clamp(120 + utilizationPercent * 4.6 + faker.number.int({ min: -25, max: 35 }), 95, 690),
        ),
      });
    });
  }

  return {
    clusterId,
    range,
    intervalMinutes,
    metrics,
  };
}

function generateGpuSummary(series = generateGpuMetrics()) {
  const latestTimestamp = series.metrics.at(-1)?.timestamp;
  const latestMetrics = series.metrics.filter((metric) => metric.timestamp === latestTimestamp);
  const memoryUsedGb = latestMetrics.reduce((total, metric) => total + metric.memoryUsedGb, 0);
  const memoryTotalGb = latestMetrics.reduce((total, metric) => total + metric.memoryTotalGb, 0);
  const utilization =
    latestMetrics.reduce((total, metric) => total + metric.utilizationPercent, 0) /
    Math.max(latestMetrics.length, 1);

  return {
    clusterId: series.clusterId,
    utilization: Math.round(utilization),
    memoryUsedGb: Math.round(memoryUsedGb),
    memoryTotalGb,
    activeJobs: faker.number.int({ min: 10, max: 22 }),
    alerts: faker.number.int({ min: 0, max: 3 }),
    sampledAt: latestTimestamp ?? new Date().toISOString(),
  };
}

export { generateGpuMetrics, generateGpuSummary };
