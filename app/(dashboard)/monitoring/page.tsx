import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Monitoring</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Operational metrics and alerting views will live here.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-4" />
            Monitoring workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Access is controlled by the active role in the sidebar.
        </CardContent>
      </Card>
    </div>
  );
}
