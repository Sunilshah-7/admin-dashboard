"use client";

import { useState } from "react";
import { CheckCircle2, Clipboard, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const signInUrl = "http://localhost:3001/";

export default function IntegrationsPage() {
  const [requireLogin, setRequireLogin] = useState(true);
  const [allowAnyEmail, setAllowAnyEmail] = useState(true);
  const [minPasswordLength, setMinPasswordLength] = useState("8");
  const [sessionTimeout, setSessionTimeout] = useState("8");

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4" />
            Integration Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          API keys and webhooks are still planned for the next integration pass.
        </CardContent>
      </Card>
    </div>
  );
}
