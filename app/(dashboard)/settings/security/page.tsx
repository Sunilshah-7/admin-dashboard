"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  KeyRound,
  Laptop,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type Session = {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActiveAt: string;
  current?: boolean;
};

const initialSessions: Session[] = [
  {
    id: "session_current",
    device: "MacBook Pro · Chrome",
    location: "New York, US",
    ipAddress: "104.28.32.14",
    lastActiveAt: "Active now",
    current: true,
  },
  {
    id: "session_ci",
    device: "GitHub Actions runner",
    location: "Ashburn, US",
    ipAddress: "52.21.184.9",
    lastActiveAt: "2 hours ago",
  },
  {
    id: "session_tablet",
    device: "iPad · Safari",
    location: "San Francisco, US",
    ipAddress: "172.64.19.22",
    lastActiveAt: "Yesterday",
  },
];

export default function SecuritySettingsPage() {
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sessions, setSessions] = useState(initialSessions);
  const recoveryCodes = useMemo(
    () => ["RA-29KD-71XP", "RA-8QWC-40MV", "RA-55TN-93LA", "RA-1HFR-62ZB"],
    [],
  );

  function revokeSession(sessionId: string) {
    setSessions((current) => current.filter((session) => session.id !== sessionId));
    toast.success("Session revoked");
  }

  function enrollTwoFactor() {
    setTwoFactorEnabled(true);
    toast.success("Two-factor authentication enrolled");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Security Settings</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage compliance posture, data processing policy, active sessions, and MFA.
          </p>
        </div>
        <Badge className="w-fit rounded-md bg-emerald-100 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100">
          <BadgeCheck className="size-3" />
          SOC2 Type II ready
        </Badge>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Compliance Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/30 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">SOC2 evidence collection</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Access reviews, audit logs, and deployment approvals are being retained.
                  </div>
                </div>
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-md border p-4">
              <div>
                <div className="font-medium">GDPR data processing</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Apply EU retention and deletion workflows to customer data.
                </div>
              </div>
              <Switch checked={gdprEnabled} onCheckedChange={setGdprEnabled} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-4" />
              2FA Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[180px_1fr]">
            <div className="flex aspect-square items-center justify-center rounded-md border bg-muted text-xs font-medium text-muted-foreground">
              QR CODE MOCK
            </div>
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="font-medium">Authenticator app</div>
                <div className="mt-1 text-muted-foreground">
                  Scan the mock QR code, then enter a six-digit code to enroll this account.
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  aria-label="2FA verification code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                />
                <Button
                  disabled={twoFactorEnabled || verificationCode.length < 6}
                  type="button"
                  onClick={enrollTwoFactor}
                >
                  {twoFactorEnabled ? "Enrolled" : "Verify"}
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {recoveryCodes.map((code) => (
                  <code key={code} className="rounded-md bg-muted px-2 py-1 text-xs">
                    {code}
                  </code>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="size-4" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table aria-label="Active sessions">
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP address</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {session.device.includes("iPad") ? (
                        <Smartphone className="size-4 text-muted-foreground" />
                      ) : (
                        <LockKeyhole className="size-4 text-muted-foreground" />
                      )}
                      {session.device}
                    </div>
                  </TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.ipAddress}</TableCell>
                  <TableCell>{session.lastActiveAt}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      {session.current ? (
                        <Badge variant="outline">Current</Badge>
                      ) : (
                        <Button
                          aria-label={`Revoke ${session.device}`}
                          size="icon-sm"
                          type="button"
                          variant="destructive"
                          onClick={() => revokeSession(session.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
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
