import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between mb-8"><h1 className="text-3xl font-bold">Products</h1><Link href="/admin/products/new"><Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button></Link></div>
      <div className="rounded-lg border"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{products.map(p => <TableRow key={p.id}><TableCell className="font-medium">{p.name}</TableCell><TableCell>{p.category.name}</TableCell><TableCell>${Number(p.price).toFixed(2)}</TableCell><TableCell>{p.stock}</TableCell><TableCell className="text-right space-x-2"><Link href={`/admin/products/${p.id}/edit`}><Button size="sm" variant="outline"><Pencil className="h-4 w-4 mr-1" /> Edit</Button></Link><DeleteProductButton productId={p.id} /></TableCell></TableRow>)}{products.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No products found</TableCell></TableRow>}</TableBody></Table></div>
    </div>
  );
}
