"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/query-keys";
import { apiClient, type CreateWebhookPayload, type PaginationParams } from "@/lib/api-client";

function useWebhooks(pagination?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.webhooks.list(pagination),
    queryFn: () => apiClient.webhooks.list(pagination),
  });
}

function useWebhookDeliveries(pagination?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.webhooks.deliveries(pagination),
    queryFn: () => apiClient.webhooks.deliveries(pagination),
  });
}

function useCreateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWebhookPayload) =>
      apiClient.webhooks.create(payload).then((response) => response.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.all });
    },
  });
}

export { useCreateWebhook, useWebhookDeliveries, useWebhooks };
