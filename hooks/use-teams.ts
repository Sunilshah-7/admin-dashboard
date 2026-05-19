"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  apiClient,
  type InviteMemberPayload,
  type PaginationParams,
  type UpdateRolePayload,
} from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";

function useTeams(pagination?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.teams.list(pagination),
    queryFn: () => apiClient.teams.list(pagination),
  });
}

function useInviteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteMemberPayload) =>
      apiClient.teams.invite(payload).then((response) => response.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.teams.all });
    },
  });
}

function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      apiClient.teams.updateRole(id, payload).then((response) => response.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.teams.all });
    },
  });
}

export { useInviteTeamMember, useTeams, useUpdateTeamMemberRole };
