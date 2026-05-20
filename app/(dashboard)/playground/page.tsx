import { Play } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Playground</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Engineers can test model prompts and serving behavior here.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="size-4" />
            Engineer playground
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This route is hidden from admins and viewers in the role-based sidebar.
        </CardContent>
      </Card>
    </div>
  );
}
