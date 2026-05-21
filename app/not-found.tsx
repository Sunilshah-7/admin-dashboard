import Link from "next/link";
import Image from "next/image";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="size-5" />
            Page not found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Image
            alt=""
            aria-hidden
            className="opacity-70 dark:invert"
            height={48}
            src="/globe.svg"
            width={48}
          />
          <p className="text-sm text-muted-foreground">
            This route is not part of the Reflection AI infrastructure console.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
