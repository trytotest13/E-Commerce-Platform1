"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore, CartItem } from "@/store/cart-store";

export function CartSync() {
  const { data: session, status } = useSession();
  const { items } = useCartStore();
  const isSyncing = useRef(false);

  useEffect(() => {
    if (status === "loading" || !session?.user) return;
    const loadAndMerge = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        const dbItems: CartItem[] = data.items || [];
        const localItems = useCartStore.getState().items;
        const mergedMap = new Map<string, CartItem>();
        for (const item of localItems) mergedMap.set(item.productId, { ...item });
        for (const item of dbItems) {
          const existing = mergedMap.get(item.productId);
          if (existing) mergedMap.set(item.productId, { ...existing, quantity: existing.quantity + item.quantity });
          else mergedMap.set(item.productId, item);
        }
        const merged = Array.from(mergedMap.values());
        useCartStore.setState({ items: merged });
        await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: merged }) });
      } catch (e) { console.error("Cart sync error", e); }
    };
    loadAndMerge();
  }, [session, status]);

  useEffect(() => {
    if (!session?.user || isSyncing.current) return;
    const syncToDB = async () => {
      isSyncing.current = true;
      try {
        await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
      } catch (e) { console.error("Cart DB sync error", e); }
      finally { isSyncing.current = false; }
    };
    const timeout = setTimeout(syncToDB, 500);
    return () => clearTimeout(timeout);
  }, [items, session]);

  return null;
}
