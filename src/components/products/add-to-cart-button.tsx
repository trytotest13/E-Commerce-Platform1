"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

interface Props {
  productId: string;
  name: string;
  price: number;
  image?: string;
  disabled?: boolean;
}

export function AddToCartButton({ productId, name, price, image, disabled }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  const handle = () => {
    addItem({ productId, quantity: 1, name, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button onClick={handle} disabled={disabled || added} className="w-full sm:w-auto">
      {added ? <><Check className="mr-2 h-4 w-4" /> Added!</> : <><ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart</>}
    </Button>
  );
}
