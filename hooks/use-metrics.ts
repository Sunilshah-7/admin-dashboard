"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";
import type { TimeRange } from "@/types/api";

function useGpuMetrics(timeRange: TimeRange = "24h", intervalMinutes = 5) {
  return useQuery({
    queryKey: queryKeys.metrics.gpu(timeRange, intervalMinutes),
    queryFn: () =>
      apiClient.metrics
        .gpu({
          range: timeRange,
          intervalMinutes,
        })
        .then((response) => response.data),
    refetchInterval: 30 * 1000,
  });
}

function useGpuSummary() {
  return useQuery({
    queryKey: queryKeys.metrics.gpuSummary(),
    queryFn: () => apiClient.metrics.gpuSummary().then((response) => response.data),
    refetchInterval: 30 * 1000,
  });
}

function useInferenceMetrics() {
  return useQuery({
    queryKey: queryKeys.metrics.inference(),
    queryFn: () => apiClient.metrics.inference().then((response) => response.data),
    refetchInterval: 30 * 1000,
  });
}

export { useGpuMetrics, useGpuSummary, useInferenceMetrics };
