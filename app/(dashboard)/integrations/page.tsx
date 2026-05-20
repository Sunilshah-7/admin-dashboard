"use client";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Clipboard,
  KeyRound,
  LockKeyhole,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  Webhook as WebhookIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "@/hooks/use-api-keys";
import { useCreateWebhook, useWebhookDeliveries, useWebhooks } from "@/hooks/use-webhooks";
import type {
  ApiKey,
  ApiKeyEnvironment,
  ApiKeyScope,
  WebhookDeliveryStatus,
  WebhookEvent,
  WebhookStatus,
} from "@/types/api";

const signInUrl = "http://localhost:3001/";
const availableScopes: ApiKeyScope[] = [
  "models:read",
  "models:write",
  "deployments:write",
  "metrics:read",
];

const scopeLabels: Record<ApiKeyScope, string> = {
  "models:read": "Read models",
  "models:write": "Write models",
  "deployments:write": "Deploy models",
  "metrics:read": "Read metrics",
};

const availableWebhookEvents: WebhookEvent[] = [
  "model.deployed",
  "deployment.failed",
  "team.member_invited",
  "billing.threshold_reached",
  "api_key.revoked",
];

const webhookEventLabels: Record<WebhookEvent, string> = {
  "model.deployed": "Model deployed",
  "deployment.failed": "Deployment failed",
  "team.member_invited": "Team member invited",
  "billing.threshold_reached": "Billing threshold reached",
  "api_key.revoked": "API key revoked",
};

function formatDate(value?: string) {
  if (!value) {
    return "Never";
  }

  return format(new Date(value), "MMM d, yyyy");
}

function formatLastUsed(value?: string) {
  if (!value) {
    return "Never used";
  }

  return `${formatDistanceToNow(new Date(value))} ago`;
}

function getApiKeyStatusVariant(status: ApiKey["status"]) {
  return status === "active" ? "secondary" : "destructive";
}

function getWebhookStatusVariant(status: WebhookStatus) {
  return status === "active" ? "secondary" : "outline";
}

function getDeliveryStatusVariant(status: WebhookDeliveryStatus) {
  if (status === "succeeded") {
    return "secondary";
  }

  return status === "pending" ? "outline" : "destructive";
}

export default function IntegrationsPage() {
  const [requireLogin, setRequireLogin] = useState(true);
  const [allowAnyEmail, setAllowAnyEmail] = useState(true);
  const [minPasswordLength, setMinPasswordLength] = useState("8");
  const [sessionTimeout, setSessionTimeout] = useState("8");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [environment, setEnvironment] = useState<ApiKeyEnvironment>("development");
  const [selectedScopes, setSelectedScopes] = useState<ApiKeyScope[]>(["models:read"]);
  const [expiresAt, setExpiresAt] = useState("");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [isWebhookCreateOpen, setIsWebhookCreateOpen] = useState(false);
  const [webhookName, setWebhookName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedWebhookEvents, setSelectedWebhookEvents] = useState<WebhookEvent[]>([
    "model.deployed",
  ]);
  const [createdWebhookSecret, setCreatedWebhookSecret] = useState<string | null>(null);
  const apiKeysQuery = useApiKeys({ page: 1, limit: 20 });
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const webhooksQuery = useWebhooks({ page: 1, limit: 20 });
  const webhookDeliveriesQuery = useWebhookDeliveries({ page: 1, limit: 10 });
  const createWebhook = useCreateWebhook();
  const apiKeys = apiKeysQuery.data?.data ?? [];
  const webhooks = webhooksQuery.data?.data ?? [];
  const webhookDeliveries = webhookDeliveriesQuery.data?.data ?? [];

  function resetCreateForm() {
    setKeyName("");
    setEnvironment("development");
    setSelectedScopes(["models:read"]);
    setExpiresAt("");
  }

  function toggleScope(scope: ApiKeyScope, checked: boolean) {
    setSelectedScopes((current) => {
      if (checked) {
        return Array.from(new Set([...current, scope]));
      }

      const nextScopes = current.filter((item) => item !== scope);
      return nextScopes.length ? nextScopes : ["models:read"];
    });
  }

  function resetWebhookCreateForm() {
    setWebhookName("");
    setWebhookUrl("");
    setSelectedWebhookEvents(["model.deployed"]);
  }

  function toggleWebhookEvent(eventName: WebhookEvent, checked: boolean) {
    setSelectedWebhookEvents((current) => {
      if (checked) {
        return Array.from(new Set([...current, eventName]));
      }

      const nextEvents = current.filter((item) => item !== eventName);
      return nextEvents.length ? nextEvents : ["model.deployed"];
    });
  }

  function handleCreateApiKey() {
    createApiKey.mutate(
      {
        name: keyName,
        environment,
        scopes: selectedScopes,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      },
      {
        onSuccess: (result) => {
          setCreatedSecret(result?.secretKey ?? null);
          setIsCreateOpen(false);
          resetCreateForm();
          toast.success("API key generated");
        },
        onError: () => {
          toast.error("Could not generate API key");
        },
      },
    );
  }

  function handleRevokeApiKey() {
    if (!revokeTarget) {
      return;
    }

    revokeApiKey.mutate(revokeTarget.id, {
      onSuccess: () => {
        toast.success("API key revoked");
        setRevokeTarget(null);
      },
      onError: () => {
        toast.error("Could not revoke API key");
      },
    });
  }

  function handleCreateWebhook() {
    createWebhook.mutate(
      {
        name: webhookName,
        url: webhookUrl,
        events: selectedWebhookEvents,
      },
      {
        onSuccess: (result) => {
          setCreatedWebhookSecret(result?.signingSecret ?? null);
          setIsWebhookCreateOpen(false);
          resetWebhookCreateForm();
          toast.success("Webhook endpoint created");
        },
        onError: () => {
          toast.error("Could not create webhook");
        },
      },
    );
  }

  function copyValue(value: string, message: string) {
    void navigator.clipboard?.writeText(value);
    toast.success(message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Integrations</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Configure lightweight authentication and enterprise integration readiness.
          </p>
        </div>
        <Badge className="w-fit rounded-md" variant="secondary">
          Admin only
        </Badge>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="size-4" />
              Manual Login Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="signInUrl" className="text-sm font-medium">
                  Sign-in URL
                </label>
                <div className="flex gap-2">
                  <Input id="signInUrl" readOnly value={signInUrl} />
                  <Button
                    aria-label="Copy sign-in URL"
                    size="icon"
                    type="button"
                    variant="outline"
                    onClick={() => void navigator.clipboard?.writeText(signInUrl)}
                  >
                    <Clipboard className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="minPasswordLength" className="text-sm font-medium">
                  Minimum password length
                </label>
                <Input
                  id="minPasswordLength"
                  min={4}
                  type="number"
                  value={minPasswordLength}
                  onChange={(event) => setMinPasswordLength(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sessionTimeout" className="text-sm font-medium">
                  Session timeout
                </label>
                <Input
                  id="sessionTimeout"
                  min={1}
                  type="number"
                  value={sessionTimeout}
                  onChange={(event) => setSessionTimeout(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">Hours before users sign in again.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-4 rounded-md border p-3">
                <div>
                  <div className="text-sm font-medium">Require login</div>
                  <div className="text-xs text-muted-foreground">Protect dashboard routes.</div>
                </div>
                <Switch checked={requireLogin} onCheckedChange={setRequireLogin} />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-md border p-3">
                <div>
                  <div className="text-sm font-medium">Allow any email domain</div>
                  <div className="text-xs text-muted-foreground">
                    Accept Gmail, test, and custom emails.
                  </div>
                </div>
                <Switch checked={allowAnyEmail} onCheckedChange={setAllowAnyEmail} />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-md border bg-emerald-50 p-3 text-sm text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
              <CheckCircle2 className="size-4" />
              Manual email and password login is enabled.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Authentication Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="font-medium">Login method</div>
              <div className="mt-1 text-muted-foreground">Manual email and password form.</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="font-medium">Role selection</div>
              <div className="mt-1 text-muted-foreground">
                Demo users can choose Admin, Engineer, or Viewer at sign-in.
              </div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="font-medium">OAuth credentials</div>
              <div className="mt-1 text-muted-foreground">
                No Google OAuth Client ID or Client Secret is required.
              </div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="font-medium">Future integration</div>
              <div className="mt-1 text-muted-foreground">
                API keys, webhooks, and provisioning can still be added later.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-4" />
              API Keys
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Create scoped keys for model, deployment, and metrics access.
            </p>
          </div>
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" />
            Generate key
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeysQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-20 text-center text-muted-foreground">
                    Loading API keys...
                  </TableCell>
                </TableRow>
              ) : null}
              {!apiKeysQuery.isLoading && apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-20 text-center text-muted-foreground">
                    No API keys have been generated.
                  </TableCell>
                </TableRow>
              ) : null}
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <code className="rounded-md bg-muted px-2 py-1 text-xs">{apiKey.prefix}</code>
                  </TableCell>
                  <TableCell className="capitalize">{apiKey.environment}</TableCell>
                  <TableCell>
                    <div className="flex max-w-60 flex-wrap gap-1">
                      {apiKey.scopes.map((scope) => (
                        <Badge key={scope} variant="outline">
                          {scopeLabels[scope]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatLastUsed(apiKey.lastUsedAt)}</TableCell>
                  <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={getApiKeyStatusVariant(apiKey.status)}>{apiKey.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        aria-label={`Copy ${apiKey.name} prefix`}
                        size="icon-sm"
                        type="button"
                        variant="outline"
                        onClick={() => copyValue(apiKey.prefix, "API key prefix copied")}
                      >
                        <Clipboard className="size-4" />
                      </Button>
                      <Button
                        aria-label={`Revoke ${apiKey.name}`}
                        disabled={apiKey.status === "revoked"}
                        size="icon-sm"
                        type="button"
                        variant="destructive"
                        onClick={() => setRevokeTarget(apiKey)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <WebhookIcon className="size-4" />
                Webhooks
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Send platform events to an external HTTPS endpoint.
              </p>
            </div>
            <Button type="button" onClick={() => setIsWebhookCreateOpen(true)}>
              <Plus className="size-4" />
              Add webhook
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Secret</TableHead>
                  <TableHead>Last delivery</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooksQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                      Loading webhooks...
                    </TableCell>
                  </TableRow>
                ) : null}
                {!webhooksQuery.isLoading && webhooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                      No webhook endpoints have been configured.
                    </TableCell>
                  </TableRow>
                ) : null}
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.name}</TableCell>
                    <TableCell>
                      <code className="block max-w-72 truncate rounded-md bg-muted px-2 py-1 text-xs">
                        {webhook.url}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-64 flex-wrap gap-1">
                        {webhook.events.map((eventName) => (
                          <Badge key={eventName} variant="outline">
                            {webhookEventLabels[eventName]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded-md bg-muted px-2 py-1 text-xs">
                        {webhook.secretPrefix}
                      </code>
                    </TableCell>
                    <TableCell>{formatLastUsed(webhook.lastDeliveryAt)}</TableCell>
                    <TableCell>
                      <Badge variant={getWebhookStatusVariant(webhook.status)}>
                        {webhook.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="size-4" />
              Delivery History
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent delivery attempts across configured endpoints.
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Delivered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhookDeliveriesQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                      Loading deliveries...
                    </TableCell>
                  </TableRow>
                ) : null}
                {!webhookDeliveriesQuery.isLoading && webhookDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                      No deliveries have been recorded.
                    </TableCell>
                  </TableRow>
                ) : null}
                {webhookDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{webhookEventLabels[delivery.event]}</TableCell>
                    <TableCell className="font-medium">{delivery.webhookName}</TableCell>
                    <TableCell>
                      <Badge variant={getDeliveryStatusVariant(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {delivery.responseCode ? `${delivery.responseCode} in ` : ""}
                      {delivery.durationMs ?? "--"}ms
                    </TableCell>
                    <TableCell>{formatLastUsed(delivery.deliveredAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate API key</DialogTitle>
            <DialogDescription>The full secret is shown once after generation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="apiKeyName" className="text-sm font-medium">
                Key name
              </label>
              <Input
                id="apiKeyName"
                placeholder="Production inference"
                value={keyName}
                onChange={(event) => setKeyName(event.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="apiKeyEnvironment" className="text-sm font-medium">
                  Environment
                </label>
                <Select
                  value={environment}
                  onValueChange={(value) => setEnvironment(value as ApiKeyEnvironment)}
                >
                  <SelectTrigger id="apiKeyEnvironment" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="apiKeyExpiresAt" className="text-sm font-medium">
                  Expiration
                </label>
                <Input
                  id="apiKeyExpiresAt"
                  type="date"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Scopes</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableScopes.map((scope) => (
                  <label
                    key={scope}
                    className="flex items-center gap-2 rounded-md border p-3 text-sm"
                  >
                    <Checkbox
                      checked={selectedScopes.includes(scope)}
                      onCheckedChange={(checked) => toggleScope(scope, checked === true)}
                    />
                    {scopeLabels[scope]}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={createApiKey.isPending} type="button" onClick={handleCreateApiKey}>
              {createApiKey.isPending ? "Generating..." : "Generate key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={createdSecret !== null}
        onOpenChange={(open) => !open && setCreatedSecret(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>API key generated</DialogTitle>
            <DialogDescription>
              Store this secret now. You will not be able to view it again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input readOnly value={createdSecret ?? ""} />
            <Button
              aria-label="Copy generated API key"
              size="icon"
              type="button"
              variant="outline"
              onClick={() => createdSecret && copyValue(createdSecret, "API key copied")}
            >
              <Clipboard className="size-4" />
            </Button>
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Dialog open={isWebhookCreateOpen} onOpenChange={setIsWebhookCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add webhook</DialogTitle>
            <DialogDescription>
              Select the events this endpoint should receive. The signing secret is shown once.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="webhookName" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="webhookName"
                placeholder="Ops alerts"
                value={webhookName}
                onChange={(event) => setWebhookName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="webhookUrl" className="text-sm font-medium">
                Endpoint URL
              </label>
              <Input
                id="webhookUrl"
                placeholder="https://example.com/reflection/events"
                type="url"
                value={webhookUrl}
                onChange={(event) => setWebhookUrl(event.target.value)}
              />
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Events</div>
              <div className="grid gap-2">
                {availableWebhookEvents.map((eventName) => (
                  <label
                    key={eventName}
                    className="flex items-center gap-2 rounded-md border p-3 text-sm"
                  >
                    <Checkbox
                      checked={selectedWebhookEvents.includes(eventName)}
                      onCheckedChange={(checked) => toggleWebhookEvent(eventName, checked === true)}
                    />
                    {webhookEventLabels[eventName]}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={createWebhook.isPending} type="button" onClick={handleCreateWebhook}>
              {createWebhook.isPending ? "Creating..." : "Create webhook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={createdWebhookSecret !== null}
        onOpenChange={(open) => !open && setCreatedWebhookSecret(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Webhook signing secret</DialogTitle>
            <DialogDescription>
              Use this secret to verify webhook signatures. It will not be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input readOnly value={createdWebhookSecret ?? ""} />
            <Button
              aria-label="Copy webhook signing secret"
              size="icon"
              type="button"
              variant="outline"
              onClick={() =>
                createdWebhookSecret &&
                copyValue(createdWebhookSecret, "Webhook signing secret copied")
              }
            >
              <Clipboard className="size-4" />
            </Button>
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Dialog open={revokeTarget !== null} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API key</DialogTitle>
            <DialogDescription>
              This immediately disables {revokeTarget?.name ?? "this key"} for future requests.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={revokeApiKey.isPending}
              type="button"
              variant="destructive"
              onClick={handleRevokeApiKey}
            >
              {revokeApiKey.isPending ? "Revoking..." : "Revoke key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
