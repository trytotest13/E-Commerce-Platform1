import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { ShopPage } from "@/components/layout/shop-page";
export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id }, include: { items: { include: { product: true } } } });
  if (!cart || cart.items.length === 0) redirect("/cart");
  return (
    <ShopPage>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <div><CheckoutForm cartItems={cart.items} /></div>
          <div className="rounded-lg border p-6 h-fit">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-2">{cart.items.map(item => <div key={item.id} className="flex justify-between text-sm"><span>{item.product.name} × {item.quantity}</span><span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span></div>)}</div>
            <div className="mt-4 border-t pt-4 flex justify-between font-bold"><span>Total</span><span>${cart.items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0).toFixed(2)}</span></div>
          </div>
        </div>
      </main>
    </ShopPage>
  );
}
