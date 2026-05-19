import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">New user</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Migrated replacement for the old user creation form. Submission is still UI-only.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input id="username" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full name
              </label>
              <Input id="fullName" placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="john@gmail.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input id="password" type="password" placeholder="password" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input id="phone" placeholder="+1 234 567" />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Input id="address" placeholder="New York" />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">
                Gender
              </label>
              <Select>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="active" className="text-sm font-medium">
                Active
              </label>
              <Select defaultValue="yes">
                <SelectTrigger id="active" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Button type="button">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
