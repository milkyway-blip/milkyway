import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "milkyway_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (flavor, qty = 1, size = "", price = null) => {
    const id = size ? `${flavor.id}|${size}` : flavor.id;
    const unitPrice = price ?? flavor.price;
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i,
        );
      }
      return [
        ...prev,
        {
          id,
          flavor_id: flavor.id,
          name: flavor.name,
          size,
          price: unitPrice,
          image: flavor.image,
          bg_color: flavor.bg_color,
          text_color: flavor.text_color,
          qty,
        },
      ];
    });
  };

  const setQty = (id, qty) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 99) } : i)),
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const total = useMemo(
    () => items.reduce((s, i) => s + i.qty * i.price, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, add, setQty, remove, clear, count, total, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
