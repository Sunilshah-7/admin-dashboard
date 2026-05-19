"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient, type DeploymentListParams } from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";

function useDeployments(filters?: DeploymentListParams) {
  return useQuery({
    queryKey: queryKeys.deployments.list(filters),
    queryFn: () => apiClient.deployments.list(filters),
  });
}

function useDeploymentDetail(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.deployments.detail(id ?? ""),
    queryFn: () => apiClient.deployments.detail(id ?? "").then((response) => response.data),
    enabled: Boolean(id),
  });
}

export { useDeploymentDetail, useDeployments };
