import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user || user.role !== 'buyer') {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const data = await cartAPI.get();
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1, color) => {
    const data = await cartAPI.add({ productId, quantity, color });
    setCart(data);
  };

  const updateQuantity = async (itemId, quantity) => {
    const data = await cartAPI.update({ itemId, quantity });
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const data = await cartAPI.remove(itemId);
    setCart(data);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, subtotal, addToCart, updateQuantity, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
