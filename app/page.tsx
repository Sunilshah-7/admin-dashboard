"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

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
import { ROLE_PERMISSIONS, useAuthStore, type Role } from "@/stores/auth-store";

function getNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "User";

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState<Role>("admin");
  const [error, setError] = useState("");

  function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Enter an email address and password.");
      return;
    }

    login({
      user: {
        id: `manual_${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        name: getNameFromEmail(email),
        email,
      },
      roles: [role],
      permissions: ROLE_PERMISSIONS[role],
    });
    router.replace("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">IMD</div>
            <div className="text-xs text-muted-foreground">Infrastructure Management Dashboard</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="size-4" />
              Sign in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Demo role
              </label>
              <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger id="role" className="w-full capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error ? <div className="text-sm text-destructive">{error}</div> : null}

            <Button className="w-full" type="button" onClick={handleLogin}>
              Sign in
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
