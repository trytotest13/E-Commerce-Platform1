"use client";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CartContent() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
        <p className="mb-4 text-lg font-medium">Your cart is empty</p>
        <Link href="/products"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map(item => (
          <div key={item.productId} className="flex gap-4 rounded-lg border p-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
              <Image src={item.image || "/images/placeholder.jpg"} alt={item.name || "Product"} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">${item.price?.toString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
                  <Input type="number" min="1" value={item.quantity} onChange={e => updateQuantity(item.productId, parseInt(e.target.value) || 1)} className="h-8 w-16 text-center" />
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeItem(item.productId)}><Trash2 className="mr-1 h-4 w-4" /> Remove</Button>
              </div>
            </div>
            <div className="text-right font-medium">${((item.price || 0) * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-6 h-fit">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <Separator className="my-4" />
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>${totalPrice().toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mt-2"><span>Shipping</span><span>Calculated at checkout</span></div>
        <Separator className="my-4" />
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${totalPrice().toFixed(2)}</span></div>
        <Link href="/checkout"><Button className="mt-6 w-full" size="lg">Proceed to Checkout</Button></Link>
      </div>
    </div>
  );
}
