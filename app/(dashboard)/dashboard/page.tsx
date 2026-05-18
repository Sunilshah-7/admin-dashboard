import { Activity, Cpu, DollarSign, Gauge } from "lucide-react";

import { MockApiStatus } from "@/components/dashboard/mock-api-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    label: "GPU Utilization",
    value: "72%",
    delta: "+8.2%",
    icon: Gauge,
    tone: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Active Models",
    value: "18",
    delta: "+3",
    icon: Cpu,
    tone: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "P95 Latency",
    value: "184 ms",
    delta: "-12 ms",
    icon: Activity,
    tone: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Compute Spend",
    value: "$42.8k",
    delta: "86% budget",
    icon: DollarSign,
    tone: "text-rose-600 dark:text-rose-400",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Foundation</Badge>
            <MockApiStatus />
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Cluster overview</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            The dashboard shell is ready for GPU metrics, model registry activity, deployments, and
            enterprise controls.
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <Icon className={`size-4 ${metric.tone}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{metric.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{metric.delta}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Deployment activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              Chart surface reserved for deployment and inference trends.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
              Training queue latency is above the weekly baseline.
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
              All production inference endpoints are healthy.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
