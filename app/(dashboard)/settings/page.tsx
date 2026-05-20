import { Settings } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Organization-level controls and platform policy settings.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-4" />
            Admin settings
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This route is available to admins only.
        </CardContent>
      </Card>
    </div>
  );
}
