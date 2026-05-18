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

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">New product</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Replacement for the old placeholder product creation route.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create product</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="productName" className="text-sm font-medium">
                Product name
              </label>
              <Input id="productName" placeholder="Airpods" />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <Input id="price" placeholder="$100" />
            </div>
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium">
                In stock
              </label>
              <Select defaultValue="yes">
                <SelectTrigger id="stock" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
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
