"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  variantId?: string; // Shopify variant GID
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
        // Verify and fetch latest Shopify cart
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

    // Optimistic UI update
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id || (product.variantId && item.variantId === product.variantId));
      if (existing) {
        return prev.map((item) =>
          item.id === product.id || (product.variantId && item.variantId === product.variantId)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });

    // Shopify Cart sync
    try {
      const merchandiseId = product.variantId || (product.id.startsWith("gid://shopify/") ? product.id : null);
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
        }
      }
    } catch (e) {
      console.warn("Shopify cart add failed, using local cart state:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    const itemToRemove = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (cartId && itemToRemove?.lineId) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "remove",
            cartId,
            lineIds: [itemToRemove.lineId],
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

    const itemToUpdate = items.find((i) => i.id === id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
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
