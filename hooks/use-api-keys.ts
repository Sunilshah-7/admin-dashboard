"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/query-keys";
import { apiClient, type CreateApiKeyPayload, type PaginationParams } from "@/lib/api-client";

function useApiKeys(pagination?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.apiKeys.list(pagination),
    queryFn: () => apiClient.apiKeys.list(pagination),
  });
}

function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) =>
      apiClient.apiKeys.create(payload).then((response) => response.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all });
    },
  });
}

function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.apiKeys.revoke(id).then((response) => response.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all });
    },
  });
}

export { useApiKeys, useCreateApiKey, useRevokeApiKey };
