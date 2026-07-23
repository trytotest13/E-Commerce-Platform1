import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  const nav = [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }, { href: "/admin/products", label: "Products", icon: Package }, { href: "/admin/orders", label: "Orders", icon: ShoppingCart }];
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <div className="mb-8 text-xl font-bold">Admin</div>
        <nav className="space-y-1">{nav.map(item => <Link key={item.href} href={item.href}><Button variant="ghost" className="w-full justify-start gap-2"><item.icon className="h-4 w-4" />{item.label}</Button></Link>)}</nav>
        <div className="absolute bottom-4 left-4"><Link href="/"><Button variant="outline" size="sm">← Back to Store</Button></Link></div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
