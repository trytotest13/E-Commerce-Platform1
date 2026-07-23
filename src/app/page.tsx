import { ShopPage } from "@/components/layout/shop-page";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <ShopPage>
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold">Welcome to MyShop</h1>
        <Link href="/products" className="mt-6"><Button size="lg">Browse Products</Button></Link>
      </main>
    </ShopPage>
  );
}
