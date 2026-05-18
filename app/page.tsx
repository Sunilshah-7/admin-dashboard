import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">
          Reflection AI Infrastructure Console
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Enterprise dashboard foundation for monitoring GPU capacity, model deployments, team
          access, and platform operations.
        </p>
        <Button asChild className="mt-8">
          <Link href="/dashboard">
            Open dashboard
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
