import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const existing = state.items.find(i => i.productId === newItem.productId);
        if (existing) {
          return { items: state.items.map(i => i.productId === newItem.productId ? { ...i, quantity: i.quantity + (newItem.quantity || 1) } : i) };
        }
        return { items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.productId !== id) })),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) return get().removeItem(id);
        set((state) => ({ items: state.items.map(i => i.productId === id ? { ...i, quantity } : i) }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
