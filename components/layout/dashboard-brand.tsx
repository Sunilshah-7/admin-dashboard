import { ShieldCheck } from "lucide-react";

function DashboardBrand() {
  return (
    <>
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ShieldCheck className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">IMD AI</div>
        <div className="truncate text-xs text-muted-foreground">Infrastructure Console</div>
      </div>
    </>
  );
}

function DashboardBrandIcon() {
  return (
    <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <ShieldCheck className="size-5" />
    </div>
  );
}

export { DashboardBrand, DashboardBrandIcon };
