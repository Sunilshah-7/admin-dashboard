import Link from "next/link";
import { Plus } from "lucide-react";

import { LegacyStatusBadge } from "@/components/legacy/legacy-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLegacyUsers } from "@/mocks/data/legacy-dashboard";

export default function UsersPage() {
  const users = getLegacyUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Migrated replacement for the old React admin user list.
          </p>
        </div>
        <Button asChild>
          <Link href="/users/newUser">
            <Plus className="size-4" />
            Create user
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table aria-label="Sample users">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <LegacyStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>{user.transaction}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/users/${user.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
