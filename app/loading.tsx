import { RouteSkeleton } from "@/components/route-skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <RouteSkeleton />
    </main>
  );
}
