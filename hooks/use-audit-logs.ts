"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient, type AuditLogParams } from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";

function useAuditLogs(pagination?: AuditLogParams) {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(pagination),
    queryFn: () => apiClient.auditLogs.list(pagination),
  });
}

export { useAuditLogs };
