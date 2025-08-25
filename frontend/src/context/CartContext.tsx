import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { MenuItem } from "../types";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string | null;
};


export type CartCtx = {
  items: CartLine[];
  add: (m: MenuItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartCtx | undefined>(undefined);
const CART_KEY = "cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const api = useMemo<CartCtx>(() => {
    const add = (m: MenuItem) =>
      setItems((prev) => {
        const id = String((m as any)._id ?? (m as any).id ?? m.name);
        const ix = prev.findIndex((p) => p.id === id);
        if (ix >= 0) {
          const copy = [...prev];
          copy[ix] = { ...copy[ix], qty: copy[ix].qty + 1 };
          return copy;
        }
        return [
          ...prev,
          {
            id,
            name: m.name,
            price: Number((m as any).price ?? 0),
            qty: 1,
            imageUrl: (m as any).imageUrl ?? (m as any).image ?? (m as any).img ?? null,
          },
        ];
      });

    const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

    const setQty = (id: string, qty: number) =>
      setItems((prev) =>
        prev
          .map((p) => (p.id === id ? { ...p, qty } : p))
          .filter((p) => p.qty > 0)
      );

    const clear = () => setItems([]);

    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);

    return { items, add, remove, setQty, clear, count, total };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
