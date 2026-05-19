"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient, type DeployModelPayload, type ModelListParams } from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";

function useModelRegistry(filters?: ModelListParams) {
  return useQuery({
    queryKey: queryKeys.models.list(filters),
    queryFn: () => apiClient.models.list(filters),
  });
}

function useModelDetail(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.models.detail(id ?? ""),
    queryFn: () => apiClient.models.detail(id ?? "").then((response) => response.data),
    enabled: Boolean(id),
  });
}

function useDeployModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DeployModelPayload }) =>
      apiClient.models.deploy(id, payload).then((response) => response.data),
    onSuccess: (_deployment, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.models.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.models.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.deployments.all });
    },
  });
}

export { useDeployModel, useModelDetail, useModelRegistry };
