"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

async function fetchHealth() {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error("Unable to reach mock API");
  }

  return response.json() as Promise<HealthResponse>;
}

function MockApiStatus() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["mock-api-health"],
    queryFn: fetchHealth,
    refetchInterval: false,
  });

  if (isLoading) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Loader2 className="size-3 animate-spin" />
        Mock API starting
      </Badge>
    );
  }

  if (error || !data) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <TriangleAlert className="size-3" />
        Mock API offline
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1.5">
      <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
      {data.service} {data.status}
    </Badge>
  );
}

export { MockApiStatus };
