import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
export default async function AdminDashboard() {
  const [totalProducts, totalOrders, revResult, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "PAID" } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } } }),
  ]);
  const totalRevenue = revResult._sum.total || 0;
  const statusCounts = await prisma.order.groupBy({ by: ["status"], _count: true });
  const map = Object.fromEntries(statusCounts.map(s => [s.status, s._count]));
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${Number(totalRevenue).toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalOrders}</div><div className="mt-2 flex gap-2 text-xs"><Badge variant="outline">Pending: {map.PENDING || 0}</Badge><Badge variant="outline">Paid: {map.PAID || 0}</Badge><Badge variant="outline">Shipped: {map.SHIPPED || 0}</Badge></div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalProducts}</div></CardContent></Card>
      </div>
      <div className="mt-8"><h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>
        <div className="rounded-lg border"><Table><TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{recentOrders.map(order => <TableRow key={order.id}><TableCell className="font-mono text-xs">{order.id.slice(-8)}</TableCell><TableCell>{order.user.name || order.user.email}</TableCell><TableCell>${Number(order.total).toFixed(2)}</TableCell><TableCell><Badge variant={order.status === "PAID" ? "default" : order.status === "SHIPPED" ? "secondary" : "outline"}>{order.status}</Badge></TableCell><TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell></TableRow>)}{recentOrders.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No orders yet</TableCell></TableRow>}</TableBody></Table></div>
      </div>
    </div>
  );
}
