"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Download, FileText, Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuditLogs } from "@/hooks";
import type { AuditAction, AuditLogEntry } from "@/types/api";

const auditActions: Array<AuditAction | "all"> = [
  "all",
  "auth.login",
  "auth.logout",
  "team.invite",
  "team.role_changed",
  "model.created",
  "model.deployed",
  "deployment.started",
  "deployment.failed",
  "settings.updated",
  "api_key.created",
  "api_key.revoked",
];

const actionLabels: Record<AuditAction | "all", string> = {
  all: "All actions",
  "auth.login": "Login",
  "auth.logout": "Logout",
  "team.invite": "Team invite",
  "team.role_changed": "Role changed",
  "model.created": "Model created",
  "model.deployed": "Model deployed",
  "deployment.started": "Deployment started",
  "deployment.failed": "Deployment failed",
  "settings.updated": "Settings updated",
  "api_key.created": "API key created",
  "api_key.revoked": "API key revoked",
};

function formatTimestamp(value: string) {
  return format(new Date(value), "MMM d, yyyy h:mm a");
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");

  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(logs: AuditLogEntry[]) {
  const headers = [
    "timestamp",
    "actor",
    "action",
    "resource_type",
    "resource_id",
    "ip_address",
    "user_agent",
  ];
  const rows = logs.map((log) => [
    log.timestamp,
    log.actorName,
    log.action,
    log.resourceType,
    log.resourceId ?? "",
    log.ipAddress,
    log.userAgent,
  ]);

  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

export default function AuditSettingsPage() {
  const [actorQuery, setActorQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<AuditAction | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const auditLogsQuery = useAuditLogs({
    page: 1,
    limit: 100,
    action: selectedAction === "all" ? undefined : selectedAction,
  });
  const logs = auditLogsQuery.data?.data;

  const filteredLogs = useMemo(() => {
    const sourceLogs = logs ?? [];
    const actor = actorQuery.trim().toLowerCase();
    const startTime = startDate ? new Date(startDate).getTime() : null;
    const endTime = endDate ? new Date(`${endDate}T23:59:59`).getTime() : null;

    return sourceLogs.filter((log) => {
      const timestamp = new Date(log.timestamp).getTime();
      const matchesActor = actor ? log.actorName.toLowerCase().includes(actor) : true;
      const matchesStart = startTime ? timestamp >= startTime : true;
      const matchesEnd = endTime ? timestamp <= endTime : true;

      return matchesActor && matchesStart && matchesEnd;
    });
  }, [actorQuery, endDate, logs, startDate]);

  function exportCsv() {
    const blob = new Blob([toCsv(filteredLogs)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `reflection-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Audit CSV exported");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Audit Logs</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Review organization activity with filters for actor, action, and date range.
          </p>
        </div>
        <Button type="button" onClick={exportCsv}>
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_220px_160px_160px]">
          <div className="space-y-2">
            <label htmlFor="actorFilter" className="text-sm font-medium">
              Actor
            </label>
            <Input
              id="actorFilter"
              placeholder="Search by actor"
              value={actorQuery}
              onChange={(event) => setActorQuery(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="actionFilter" className="text-sm font-medium">
              Action
            </label>
            <Select
              value={selectedAction}
              onValueChange={(value) => setSelectedAction(value as AuditAction | "all")}
            >
              <SelectTrigger id="actionFilter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {auditActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {actionLabels[action]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start date
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              End date
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4" />
            Activity
          </CardTitle>
          <Badge variant="outline">{filteredLogs.length} records</Badge>
        </CardHeader>
        <CardContent>
          <Table aria-label="Audit activity">
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP address</TableHead>
                <TableHead>User agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogsQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                    Loading audit logs...
                  </TableCell>
                </TableRow>
              ) : null}
              {!auditLogsQuery.isLoading && filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                    No audit logs match the current filters.
                  </TableCell>
                </TableRow>
              ) : null}
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell className="font-medium">{log.actorName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{actionLabels[log.action]}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.resourceType}</div>
                    <div className="text-xs text-muted-foreground">{log.resourceId ?? "n/a"}</div>
                  </TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>
                    <span className="block max-w-64 truncate text-muted-foreground">
                      {log.userAgent}
                    </span>
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
