import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";

import { LegacyStatusBadge } from "@/components/legacy/legacy-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLegacyUser, getLegacyUsers } from "@/mocks/data/legacy-dashboard";

export function generateStaticParams() {
  return getLegacyUsers().map((user) => ({
    userId: String(user.id),
  }));
}

export default async function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = getLegacyUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Edit user</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Static replacement for the previous user profile/edit screen.
          </p>
        </div>
        <Button asChild>
          <Link href="/users/newUser">Create</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRound className="size-7" />
              </div>
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-muted-foreground">Software Engineer</div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                +1 234 567
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                New York, USA
              </div>
              <LegacyStatusBadge status={user.status} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  defaultValue={user.username.toLowerCase().replaceAll(" ", "")}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full name
                </label>
                <Input id="fullName" defaultValue={user.username} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input id="phone" defaultValue="+1 234 567" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input id="address" defaultValue="New York, USA" />
              </div>
              <div className="sm:col-span-2">
                <Button type="button">Update</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
