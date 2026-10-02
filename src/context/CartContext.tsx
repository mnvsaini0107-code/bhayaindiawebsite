"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  variantId?: string; // Shopify variant GID
  variantTitle?: string; // e.g. "Small / Blue"
  lineId?: string; // Shopify Cart line GID
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  clearCart: () => void;
  createCheckout: () => Promise<string | null>;
  totalCount: number;
  totalPrice: number;
  checkoutUrl: string | null;
  isShopify: boolean;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isShopify, setIsShopify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchShopifyCart = async (cId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", cartId: cId }),
      });
      const data = await res.json();
      if (data.success && data.isShopify && data.cart) {
        setIsShopify(true);
        setCheckoutUrl(data.cart.checkoutUrl);

        // Update items with latest lineId from Shopify cart lines
        const lines = data.cart.lines?.edges || [];
        setItems((prev) =>
          prev.map((item) => {
            const matchedLine = lines.find(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (edge: any) =>
                edge.node.merchandise?.id === item.variantId ||
                edge.node.merchandise?.id === item.id
            );
            return matchedLine ? { ...item, lineId: matchedLine.node.id } : item;
          })
        );
      } else if (!data.success || !data.cart) {
        // Stale or expired cart session, clean up
        setCartId(null);
        setCheckoutUrl(null);
        localStorage.removeItem("bhaya_shopify_cart_id");
      }
    } catch (err) {
      console.warn("Could not sync with Shopify cart:", err);
    }
  };

  // Initialize cart from localStorage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("bhaya_cart");
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      const savedCartId = localStorage.getItem("bhaya_shopify_cart_id");
      if (savedCartId) {
        setCartId(savedCartId);
        fetchShopifyCart(savedCartId);
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save items and cartId to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("bhaya_cart", JSON.stringify(items));
        if (cartId) {
          localStorage.setItem("bhaya_shopify_cart_id", cartId);
        } else {
          localStorage.removeItem("bhaya_shopify_cart_id");
        }
      } catch (e) {
        console.error("Failed to save cart to storage", e);
      }
    }
  }, [items, cartId, isLoaded]);

  const addItem = async (product: Omit<CartItem, "quantity">, qty = 1) => {
    setIsLoading(true);

    const matchFn = (item: CartItem) => {
      if (product.variantId && item.variantId) {
        return item.variantId === product.variantId;
      }
      return item.id === product.id;
    };

    // Optimistic UI update
    setItems((prev) => {
      const existing = prev.find(matchFn);
      if (existing) {
        return prev.map((item) =>
          matchFn(item) ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });

    // Shopify Cart sync
    try {
      const merchandiseId =
        product.variantId ||
        (product.id.startsWith("gid://shopify/") ? product.id : null);

      if (merchandiseId) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add",
            cartId,
            lines: [{ merchandiseId, quantity: qty }],
          }),
        });
        const data = await res.json();
        if (data.success && data.isShopify && data.cart) {
          setIsShopify(true);
          setCartId(data.cart.id);
          setCheckoutUrl(data.cart.checkoutUrl);

          // Update items with lineId from returned Shopify cart
          const lines = data.cart.lines?.edges || [];
          setItems((prev) =>
            prev.map((item) => {
              const matchedLine = lines.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (edge: any) =>
                  edge.node.merchandise?.id === item.variantId ||
                  edge.node.merchandise?.id === item.id
              );
              if (matchedLine) {
                return { ...item, lineId: matchedLine.node.id };
              }
              return item;
            })
          );
        }
      }
    } catch (e) {
      console.warn("Shopify cart add failed, using local cart state:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    const itemToRemove = items.find((i) => i.id === id || i.variantId === id);
    setItems((prev) => prev.filter((item) => item.id !== id && item.variantId !== id));

    const lineIdToRemove = itemToRemove?.lineId;
    if (cartId && lineIdToRemove) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "remove",
            cartId,
            lineIds: [lineIdToRemove],
          }),
        });
        const data = await res.json();
        if (data.success && data.cart) {
          setCheckoutUrl(data.cart.checkoutUrl);
        }
      } catch (e) {
        console.warn("Shopify cart remove error:", e);
      }
    }
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty <= 0) {
      await removeItem(id);
      return;
    }

    const itemToUpdate = items.find((i) => i.id === id || i.variantId === id);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id || item.variantId === id ? { ...item, quantity: qty } : item
      )
    );

    if (cartId && itemToUpdate?.lineId) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            cartId,
            lines: [{ id: itemToUpdate.lineId, quantity: qty }],
          }),
        });
        const data = await res.json();
        if (data.success && data.cart) {
          setCheckoutUrl(data.cart.checkoutUrl);
        }
      } catch (e) {
        console.warn("Shopify cart update error:", e);
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    setCartId(null);
    setCheckoutUrl(null);
    localStorage.removeItem("bhaya_cart");
    localStorage.removeItem("bhaya_shopify_cart_id");
  };

  const createCheckout = async (): Promise<string | null> => {
    if (checkoutUrl) return checkoutUrl;
    if (items.length === 0) return null;

    setIsLoading(true);
    try {
      const lines = items
        .filter((i) => i.variantId || i.id.startsWith("gid://shopify/"))
        .map((i) => ({
          merchandiseId: (i.variantId || i.id) as string,
          quantity: i.quantity,
        }));

      if (lines.length > 0) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create", lines }),
        });
        const data = await res.json();
        if (data.success && data.cart) {
          setCartId(data.cart.id);
          setCheckoutUrl(data.cart.checkoutUrl);
          setIsShopify(true);
          return data.cart.checkoutUrl;
        }
      }
    } catch (e) {
      console.warn("Failed to create checkout URL:", e);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        createCheckout,
        totalCount,
        totalPrice,
        checkoutUrl,
        isShopify,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

