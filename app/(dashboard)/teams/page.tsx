"use client";

import { useMemo, useState } from "react";
import { Edit, MailPlus, ShieldCheck, UserX } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInviteTeamMember, useTeams, useUpdateTeamMemberRole } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Permission, Role, TeamMember } from "@/types/api";

const roles: Role[] = ["admin", "engineer", "viewer"];
const workspaces = ["Production AI", "Research Lab", "Platform Ops"];

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "dashboard:read",
    "models:read",
    "models:write",
    "deployments:read",
    "deployments:write",
    "teams:read",
    "teams:write",
    "monitoring:read",
    "integrations:manage",
    "settings:manage",
  ],
  engineer: [
    "dashboard:read",
    "models:read",
    "models:write",
    "deployments:read",
    "deployments:write",
    "monitoring:read",
  ],
  viewer: ["dashboard:read", "models:read", "deployments:read", "monitoring:read"],
};

const permissionGroups: Array<{ label: string; permission: Permission }> = [
  { label: "Dashboard", permission: "dashboard:read" },
  { label: "Models read", permission: "models:read" },
  { label: "Models write", permission: "models:write" },
  { label: "Deployments read", permission: "deployments:read" },
  { label: "Deployments write", permission: "deployments:write" },
  { label: "Teams read", permission: "teams:read" },
  { label: "Teams write", permission: "teams:write" },
  { label: "Monitoring", permission: "monitoring:read" },
  { label: "Integrations", permission: "integrations:manage" },
  { label: "Settings", permission: "settings:manage" },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value?: string) {
  if (!value) {
    return "Never";
  }

  return dateFormatter.format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleBadgeClassName(role: Role) {
  if (role === "admin") {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300";
  }

  if (role === "engineer") {
    return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300";
  }

  return "border-border bg-muted text-muted-foreground";
}

function getStatusBadgeVariant(status: TeamMember["status"]) {
  if (status === "disabled") {
    return "destructive" as const;
  }

  if (status === "active") {
    return "secondary" as const;
  }

  return "outline" as const;
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge className={cn("rounded-md capitalize", getRoleBadgeClassName(role))} variant="outline">
      {role}
    </Badge>
  );
}

function PermissionMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Access</TableHead>
              {roles.map((role) => (
                <TableHead key={role} className="capitalize">
                  {role}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionGroups.map((item) => (
              <TableRow key={item.permission}>
                <TableCell className="font-medium">{item.label}</TableCell>
                {roles.map((role) => {
                  const allowed = rolePermissions[role].includes(item.permission);

                  return (
                    <TableCell key={role}>
                      <Badge className="rounded-md" variant={allowed ? "secondary" : "outline"}>
                        {allowed ? "Allowed" : "Denied"}
                      </Badge>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function TeamsPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("viewer");
  const [inviteWorkspace, setInviteWorkspace] = useState(workspaces[0]);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [draftRole, setDraftRole] = useState<Role>("viewer");
  const [disabledMemberIds, setDisabledMemberIds] = useState<Set<string>>(new Set());
  const teamsQuery = useTeams({ limit: 100 });
  const inviteMutation = useInviteTeamMember();
  const updateRoleMutation = useUpdateTeamMemberRole();

  const members = useMemo(() => {
    return (teamsQuery.data?.data ?? []).map((member) => ({
      ...member,
      status: disabledMemberIds.has(member.id) ? ("disabled" as const) : member.status,
    }));
  }, [disabledMemberIds, teamsQuery.data?.data]);

  function openEditMember(member: TeamMember) {
    setEditingMember(member);
    setDraftRole(member.role);
  }

  function handleInviteMember() {
    if (!inviteEmail.trim()) {
      return;
    }

    inviteMutation.mutate(
      {
        email: inviteEmail,
        role: inviteRole,
      },
      {
        onSuccess: () => {
          setInviteOpen(false);
          setInviteEmail("");
          setInviteRole("viewer");
          setInviteWorkspace(workspaces[0]);
        },
      },
    );
  }

  function handleUpdateRole() {
    if (!editingMember) {
      return;
    }

    updateRoleMutation.mutate(
      {
        id: editingMember.id,
        payload: {
          role: draftRole,
        },
      },
      {
        onSuccess: () => {
          setEditingMember(null);
        },
      },
    );
  }

  function handleDeactivateMember() {
    if (!editingMember) {
      return;
    }

    setDisabledMemberIds((current) => new Set(current).add(editingMember.id));
    setEditingMember(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Teams</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage workspace members, roles, and enterprise access policies.
          </p>
        </div>
        <Button type="button" onClick={() => setInviteOpen(true)}>
          <MailPlus className="size-4" />
          Invite member
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Team Members</CardTitle>
          <div className="text-sm text-muted-foreground">{members.length} members</div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={member.role} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="rounded-md capitalize"
                      variant={getStatusBadgeVariant(member.status)}
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(member.lastActiveAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => openEditMember(member)}
                    >
                      <Edit className="size-3.5" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PermissionMatrix />

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>
              Add a teammate to a workspace with a scoped enterprise role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="inviteEmail" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="teammate@reflection.ai"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="inviteRole" className="text-sm font-medium">
                Role
              </label>
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as Role)}>
                <SelectTrigger id="inviteRole" className="w-full capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="inviteWorkspace" className="text-sm font-medium">
                Workspace
              </label>
              <Select value={inviteWorkspace} onValueChange={setInviteWorkspace}>
                <SelectTrigger id="inviteWorkspace" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace} value={workspace}>
                      {workspace}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              disabled={!inviteEmail.trim() || inviteMutation.isPending}
              onClick={handleInviteMember}
            >
              <MailPlus className="size-4" />
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet
        open={Boolean(editingMember)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingMember(null);
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit member</SheetTitle>
            <SheetDescription>
              Change role assignment or deactivate access for this account.
            </SheetDescription>
          </SheetHeader>
          {editingMember ? (
            <div className="space-y-5 px-4">
              <div className="flex items-center gap-3 rounded-md border p-3">
                <Avatar className="size-10">
                  <AvatarFallback>{getInitials(editingMember.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate font-medium">{editingMember.name}</div>
                  <div className="truncate text-sm text-muted-foreground">
                    {editingMember.email}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="editRole" className="text-sm font-medium">
                  Role
                </label>
                <Select value={draftRole} onValueChange={(value) => setDraftRole(value as Role)}>
                  <SelectTrigger id="editRole" className="w-full capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role} className="capitalize">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4" />
                  Effective permissions
                </div>
                <div className="flex flex-wrap gap-2">
                  {rolePermissions[draftRole].map((permission) => (
                    <Badge key={permission} className="rounded-md" variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  disabled={updateRoleMutation.isPending}
                  onClick={handleUpdateRole}
                >
                  Save role
                </Button>
                <Button type="button" variant="destructive" onClick={handleDeactivateMember}>
                  <UserX className="size-4" />
                  Deactivate account
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
