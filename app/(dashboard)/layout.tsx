import { DashboardBrand, DashboardBrandIcon } from "@/components/layout/dashboard-brand";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardShell brand={<DashboardBrand />} brandCollapsed={<DashboardBrandIcon />}>
      {children}
    </DashboardShell>
  );
}
