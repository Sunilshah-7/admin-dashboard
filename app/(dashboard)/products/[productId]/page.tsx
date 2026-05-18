import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, Package } from "lucide-react";

import { LegacyStatusBadge } from "@/components/legacy/legacy-status-badge";
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
import {
  getLegacyProduct,
  getLegacyProducts,
  getProductSales,
} from "@/mocks/data/legacy-dashboard";

export function generateStaticParams() {
  return getLegacyProducts().map((product) => ({
    productId: String(product.id),
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = getLegacyProduct(productId);
  const sales = getProductSales();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Product</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Static replacement for the previous product performance/edit screen.
          </p>
        </div>
        <Button asChild>
          <Link href="/products/newProduct">Create</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Sales performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-3 rounded-md border p-4">
              {sales.map((entry) => (
                <div key={entry.month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{ height: `${Math.max(16, entry.sales / 60)}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{entry.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="size-7" />
              </div>
              <div>
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-muted-foreground">ID {product.id}</div>
              </div>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sales</span>
                <span className="font-medium">2,223</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">In stock</span>
                <span className="font-medium">{product.stock}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <LegacyStatusBadge status={product.status} />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="size-4" />
                Migrated from old product chart data.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit product</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="productName" className="text-sm font-medium">
                Product name
              </label>
              <Input id="productName" defaultValue={product.name} />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <Input id="price" defaultValue={product.price} />
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
              <Select defaultValue={product.status === "active" ? "yes" : "no"}>
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
              <Button type="button">Update</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
