"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient, type PaginationParams } from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";

function useBillingUsage() {
  return useQuery({
    queryKey: queryKeys.billing.usage(),
    queryFn: () => apiClient.billing.usage().then((response) => response.data),
  });
}

function useBillingInvoices(pagination?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.billing.invoices(pagination),
    queryFn: () => apiClient.billing.invoices(pagination),
  });
}

export { useBillingInvoices, useBillingUsage };
