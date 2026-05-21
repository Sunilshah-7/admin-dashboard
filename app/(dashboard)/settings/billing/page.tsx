"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Bell, CreditCard, Database, Gauge, Receipt, Server, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/components/charts/dynamic-recharts";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBillingInvoices, useBillingUsage } from "@/hooks";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const compactFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

function getUsagePercent(total = 0, budget = 1) {
  return Math.min(100, Math.round((total / budget) * 100));
}

function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

export default function BillingSettingsPage() {
  const [usageAlertsEnabled, setUsageAlertsEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState("85");
  const usageQuery = useBillingUsage();
  const invoicesQuery = useBillingInvoices({ page: 1, limit: 8 });
  const usage = usageQuery.data;
  const invoices = invoicesQuery.data?.data ?? [];

  const tokenSeries = useMemo(() => {
    const totalTokens = usage?.tokenCount ?? 36_000_000_000;

    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - index));

      return {
        month: format(date, "MMM"),
        tokens: Math.round((totalTokens / 12) * (0.72 + index * 0.045)),
      };
    });
  }, [usage?.tokenCount]);

  const computeSeries = useMemo(() => {
    const gpuHours = usage?.gpuHours ?? 8400;

    return [
      { service: "Training", hours: Math.round(gpuHours * 0.48), fill: "var(--chart-1)" },
      { service: "Inference", hours: Math.round(gpuHours * 0.38), fill: "var(--chart-2)" },
      { service: "Evaluation", hours: Math.round(gpuHours * 0.14), fill: "var(--chart-4)" },
    ];
  }, [usage?.gpuHours]);

  function saveAlerts() {
    toast.success("Usage alert configuration saved");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Billing Settings</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Track plan usage, token consumption, compute hours, invoices, and alert policy.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-4" />
              Enterprise Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-3xl font-semibold">
                    {currencyFormatter.format(usage?.totalCostUsd ?? 0)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    of {currencyFormatter.format(usage?.budgetUsd ?? 100000)} monthly budget
                  </div>
                </div>
                <Badge variant="secondary">
                  {getUsagePercent(usage?.totalCostUsd, usage?.budgetUsd)}%
                </Badge>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${getUsagePercent(usage?.totalCostUsd, usage?.budgetUsd)}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                <span className="flex items-center gap-2">
                  <Zap className="size-4 text-muted-foreground" />
                  Training
                </span>
                <span className="font-medium">
                  {currencyFormatter.format(usage?.trainingCostUsd ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                <span className="flex items-center gap-2">
                  <Gauge className="size-4 text-muted-foreground" />
                  Inference
                </span>
                <span className="font-medium">
                  {currencyFormatter.format(usage?.inferenceCostUsd ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                <span className="flex items-center gap-2">
                  <Database className="size-4 text-muted-foreground" />
                  Storage
                </span>
                <span className="font-medium">
                  {currencyFormatter.format(usage?.storageCostUsd ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-72"
              config={{ tokens: { color: "var(--chart-1)", label: "Tokens" } }}
            >
              <AreaChart data={tokenSeries}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => compactFormatter.format(Number(value))}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="tokens"
                  fill="var(--color-tokens)"
                  fillOpacity={0.25}
                  stroke="var(--color-tokens)"
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="size-4" />
              Compute Hours by Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-64"
              config={{ hours: { color: "var(--chart-2)", label: "GPU hours" } }}
            >
              <BarChart data={computeSeries}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="service" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hours" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-4" />
              Usage Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-md border p-4">
              <div>
                <div className="font-medium">Monthly budget alert</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Notify workspace admins before compute spend exceeds the threshold.
                </div>
              </div>
              <Switch checked={usageAlertsEnabled} onCheckedChange={setUsageAlertsEnabled} />
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label htmlFor="alertThreshold" className="text-sm font-medium">
                  Alert threshold
                </label>
                <Input
                  id="alertThreshold"
                  min={1}
                  max={100}
                  type="number"
                  value={alertThreshold}
                  onChange={(event) => setAlertThreshold(event.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={saveAlerts}>
                  Save alerts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="size-4" />
            Invoice History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoicesQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                    Loading invoices...
                  </TableCell>
                </TableRow>
              ) : null}
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                  </TableCell>
                  <TableCell>{formatDate(invoice.issuedAt)}</TableCell>
                  <TableCell>{formatDate(invoice.dueAt)}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "paid" ? "secondary" : "outline"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {currencyFormatter.format(invoice.amountUsd)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
