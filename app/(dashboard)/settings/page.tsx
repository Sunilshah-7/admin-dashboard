import Link from "next/link";
import { BadgeCheck, FileText, Receipt, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const settingsSections = [
  {
    href: "/settings/security",
    icon: BadgeCheck,
    title: "Security",
    description: "Compliance posture, data processing, active sessions, and 2FA enrollment.",
  },
  {
    href: "/settings/billing",
    icon: Receipt,
    title: "Billing",
    description: "Plan usage, token consumption, compute hours, invoices, and usage alerts.",
  },
  {
    href: "/settings/audit",
    icon: FileText,
    title: "Audit Logs",
    description: "Filter organization activity and export compliance-ready CSV records.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Organization-level controls and platform policy settings.
          </p>
        </div>
        <Badge className="w-fit rounded-md" variant="secondary">
          Admin only
        </Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = section.icon;

          return (
            <Link key={section.href} href={section.href}>
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="size-4" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {section.description}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-4" />
            Admin settings
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Use the settings sections above to manage security, billing, and audit readiness.
        </CardContent>
      </Card>
    </div>
  );
}
