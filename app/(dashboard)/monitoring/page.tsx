"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  BellRing,
  Bot,
  CheckCircle2,
  CircleAlert,
  Eye,
  Gauge,
  Radio,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type AlertSeverity = "critical" | "info" | "warning";
type AlertRuleStatus = "active" | "disabled" | "muted";
type AnomalyStatus = "investigating" | "resolved" | "watching";

type Alert = {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  source: string;
};

type AlertRule = {
  id: string;
  condition: string;
  threshold: string;
  channel: string;
  status: AlertRuleStatus;
};

type AnomalyEvent = {
  id: string;
  model: string;
  signal: string;
  severity: AlertSeverity;
  confidence: number;
  status: AnomalyStatus;
  detectedAt: string;
};

const initialAlerts: Alert[] = [
  {
    id: "alert_gpu_temp",
    severity: "critical",
    title: "GPU temperature above policy",
    description: "h100-pool-a reported sustained temperatures over 82C for 9 minutes.",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    source: "GPU cluster",
  },
  {
    id: "alert_latency",
    severity: "warning",
    title: "p95 latency drift",
    description: "reflect-70b-chat p95 latency is 22% above the 24 hour baseline.",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    source: "Inference gateway",
  },
  {
    id: "alert_eval",
    severity: "info",
    title: "Evaluation run completed",
    description: "nightly safety eval completed with no critical regressions.",
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    source: "Evaluation pipeline",
  },
  {
    id: "alert_queue",
    severity: "warning",
    title: "Training queue elevated",
    description: "Queue wait time exceeded 30 minutes for three consecutive samples.",
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    source: "Scheduler",
  },
];

const alertRules: AlertRule[] = [
  {
    id: "rule_gpu_utilization",
    condition: "Average GPU utilization",
    threshold: "> 92% for 10 min",
    channel: "PagerDuty · Platform",
    status: "active",
  },
  {
    id: "rule_latency",
    condition: "Production p95 latency",
    threshold: "> 450ms for 5 min",
    channel: "Slack · #model-serving",
    status: "active",
  },
  {
    id: "rule_error_rate",
    condition: "Inference error rate",
    threshold: "> 1.5% for 3 min",
    channel: "Email · Eng leads",
    status: "muted",
  },
  {
    id: "rule_drift",
    condition: "Model accuracy drift",
    threshold: "> 4% from baseline",
    channel: "Slack · #ml-quality",
    status: "active",
  },
  {
    id: "rule_budget",
    condition: "Daily spend forecast",
    threshold: "> 110% of budget",
    channel: "Email · Finance ops",
    status: "disabled",
  },
];

const anomalyEvents: AnomalyEvent[] = [
  {
    id: "anom_prompt_spike",
    model: "Reflect LLM 70B",
    signal: "Prompt length spike in enterprise workspace traffic",
    severity: "warning",
    confidence: 91,
    status: "investigating",
    detectedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "anom_embedding_drop",
    model: "Vector Embed 8B",
    signal: "Embedding cosine similarity distribution shifted",
    severity: "critical",
    confidence: 96,
    status: "watching",
    detectedAt: new Date(Date.now() - 33 * 60 * 1000).toISOString(),
  },
  {
    id: "anom_tool_errors",
    model: "Agent Tool Router",
    signal: "Tool call timeout cluster in us-west-2",
    severity: "warning",
    confidence: 87,
    status: "investigating",
    detectedAt: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
  },
  {
    id: "anom_vision_recovered",
    model: "Atlas Vision 12B",
    signal: "OCR confidence dip recovered after cache warmup",
    severity: "info",
    confidence: 78,
    status: "resolved",
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

const severityIcon = {
  critical: CircleAlert,
  info: CheckCircle2,
  warning: TriangleAlert,
} satisfies Record<AlertSeverity, typeof CircleAlert>;

function getSeverityStyles(severity: AlertSeverity) {
  if (severity === "critical") {
    return "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/25 dark:text-rose-100";
  }

  if (severity === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-100";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-100";
}

function getSeverityBadgeVariant(severity: AlertSeverity) {
  return severity === "critical" ? "destructive" : severity === "warning" ? "outline" : "secondary";
}

function getRuleStatusVariant(status: AlertRuleStatus) {
  return status === "active" ? "secondary" : status === "muted" ? "outline" : "destructive";
}

function getAnomalyStatusVariant(status: AnomalyStatus) {
  return status === "resolved" ? "secondary" : status === "watching" ? "outline" : "destructive";
}

function timeAgo(timestamp: string) {
  return `${formatDistanceToNow(new Date(timestamp))} ago`;
}

function buildDriftSeries() {
  const reflect70bBaseline = 94.1;
  const embed8bBaseline = 91.8;

  return Array.from({ length: 14 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (13 - index));

    return {
      day: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      reflect70b: Number((reflect70bBaseline - index * 0.18 - Math.sin(index) * 0.25).toFixed(2)),
      embed8b: Number((embed8bBaseline - index * 0.26 - Math.cos(index) * 0.2).toFixed(2)),
    };
  });
}

function buildAlertVolumeSeries(alerts: Alert[]) {
  return Array.from({ length: 8 }, (_, index) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (7 - index), 0, 0, 0);

    return {
      hour: hour.toLocaleTimeString("en-US", { hour: "numeric" }),
      critical: index === 6 ? 2 : index === 3 ? 1 : 0,
      warning: index + 1 + (index % 2),
      info: Math.max(1, alerts.length - index),
    };
  });
}

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const driftSeries = useMemo(() => buildDriftSeries(), []);
  const alertVolumeSeries = useMemo(() => buildAlertVolumeSeries(alerts), [alerts]);
  const criticalCount = alerts.filter((alert) => alert.severity === "critical").length;
  const warningCount = alerts.filter((alert) => alert.severity === "warning").length;
  const activeRuleCount = alertRules.filter((rule) => rule.status === "active").length;

  function dismissAlert(alertId: string) {
    setAlerts((current) => current.filter((alert) => alert.id !== alertId));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Monitoring</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Track live alerts, alerting policy, model quality drift, and anomaly detection.
          </p>
        </div>
        <Badge className="w-fit rounded-md" variant="secondary">
          <Radio className="size-3" />
          Live mock stream
        </Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm text-muted-foreground">Open alerts</div>
              <div className="mt-1 text-2xl font-semibold">{alerts.length}</div>
            </div>
            <BellRing className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm text-muted-foreground">Critical</div>
              <div className="mt-1 text-2xl font-semibold">{criticalCount}</div>
            </div>
            <CircleAlert className="size-5 text-rose-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm text-muted-foreground">Warnings</div>
              <div className="mt-1 text-2xl font-semibold">{warningCount}</div>
            </div>
            <TriangleAlert className="size-5 text-amber-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm text-muted-foreground">Active rules</div>
              <div className="mt-1 text-2xl font-semibold">{activeRuleCount}</div>
            </div>
            <Gauge className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-4" />
              Alert Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <div className="rounded-md border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                All alerts have been dismissed.
              </div>
            ) : null}
            {alerts.map((alert) => {
              const Icon = severityIcon[alert.severity];

              return (
                <div
                  key={alert.id}
                  className={cn("rounded-md border p-4", getSeverityStyles(alert.severity))}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <Icon className="mt-0.5 size-4 shrink-0" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-medium">{alert.title}</div>
                          <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm opacity-85">{alert.description}</div>
                        <div className="mt-3 text-xs opacity-75">
                          {alert.source} · {timeAgo(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                    <Button
                      aria-label={`Dismiss ${alert.title}`}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-4" />
              Alert Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-80"
              config={{
                critical: { color: "var(--chart-5)", label: "Critical" },
                info: { color: "var(--chart-2)", label: "Info" },
                warning: { color: "var(--chart-4)", label: "Warning" },
              }}
            >
              <AreaChart data={alertVolumeSeries}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="info"
                  fill="var(--color-info)"
                  fillOpacity={0.2}
                  stackId="alerts"
                  stroke="var(--color-info)"
                  type="monotone"
                />
                <Area
                  dataKey="warning"
                  fill="var(--color-warning)"
                  fillOpacity={0.25}
                  stackId="alerts"
                  stroke="var(--color-warning)"
                  type="monotone"
                />
                <Area
                  dataKey="critical"
                  fill="var(--color-critical)"
                  fillOpacity={0.35}
                  stackId="alerts"
                  stroke="var(--color-critical)"
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="size-4" />
            Alert Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Condition</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Notification channel</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.condition}</TableCell>
                  <TableCell>{rule.threshold}</TableCell>
                  <TableCell>{rule.channel}</TableCell>
                  <TableCell>
                    <Badge variant={getRuleStatusVariant(rule.status)}>{rule.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-4" />
              Model Drift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-80"
              config={{
                embed8b: { color: "var(--chart-3)", label: "Embed 8B accuracy" },
                reflect70b: { color: "var(--chart-1)", label: "Reflect 70B accuracy" },
              }}
            >
              <LineChart data={driftSeries}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis domain={[86, 96]} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="reflect70b"
                  dot={false}
                  stroke="var(--color-reflect70b)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="embed8b"
                  dot={false}
                  stroke="var(--color-embed8b)"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-4" />
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {anomalyEvents.map((event) => (
              <div key={event.id} className="rounded-md border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{event.model}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{event.signal}</div>
                  </div>
                  <Badge variant={getSeverityBadgeVariant(event.severity)}>{event.severity}</Badge>
                </div>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="font-medium">{event.confidence}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <Badge variant={getAnomalyStatusVariant(event.status)}>{event.status}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Detected</div>
                    <div className="font-medium">{timeAgo(event.detectedAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
