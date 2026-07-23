import { CartContent } from "@/components/cart/cart-content";
import { ShopPage } from "@/components/layout/shop-page";
export default function CartPage() {
  return <ShopPage><main className="mx-auto max-w-7xl px-4 py-8"><h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1><CartContent /></main></ShopPage>;
}
