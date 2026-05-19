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
import { getLegacyProducts } from "@/mocks/data/legacy-dashboard";

export default function ProductsPage() {
  const products = getLegacyProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Migrated replacement for the old React admin product list.
          </p>
        </div>
        <Button asChild>
          <Link href="/products/newProduct">
            <Plus className="size-4" />
            Create product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs">{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <LegacyStatusBadge status={product.status} />
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/products/${product.id}`}>Edit</Link>
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
