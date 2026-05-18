import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function LegacyStatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "active"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
          : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
      )}
    >
      {status}
    </Badge>
  );
}

export { LegacyStatusBadge };
