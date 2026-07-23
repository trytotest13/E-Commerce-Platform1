"use client";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";

export function CartDropdown() {
  const { items, removeItem, totalItems, totalPrice } = useCartStore();
  const itemCount = totalItems();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{itemCount}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        {items.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">Your cart is empty</div>
        ) : (
          <>
            <div className="max-h-60 overflow-auto">
              {items.map(item => (
                <DropdownMenuItem key={item.productId} className="flex gap-3 p-3 cursor-default">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price?.toString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={(e) => { e.stopPropagation(); removeItem(item.productId); }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-4">
              <div className="flex justify-between text-sm font-medium mb-3"><span>Total</span><span>${totalPrice().toFixed(2)}</span></div>
              <Link href="/cart" className="block"><Button variant="outline" className="w-full mb-2">View Cart</Button></Link>
              <Link href="/checkout" className="block"><Button className="w-full">Checkout</Button></Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
