import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  syncCartWithServer 
} from '../utils/api';
import { 
  getCartFromStorage, 
  saveCartToStorage, 
  clearCartFromStorage 
} from '../utils/helpers';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      const savedCart = getCartFromStorage();
      setCart(savedCart || []);
      
      if (user) {
        setTimeout(async () => {
          try {
            const serverCart = await syncCartWithServer(user.id);
            if (serverCart && serverCart.length > 0) {
              setCart(serverCart);
              saveCartToStorage(serverCart);
            }
          } catch (error) {
            console.log('Cart sync skipped (server not available)');
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      let newCart;
      
      if (existingItemIndex > -1) {
        newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }

      saveCartToStorage(newCart);
      
      if (user) {
        syncCartWithServer(user.id, newCart).catch(() => {});
      }
      
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(newCart);
      
      if (user) {
        syncCartWithServer(user.id, newCart).catch(() => {});
      }
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      saveCartToStorage(newCart);
      
      if (user) {
        syncCartWithServer(user.id, newCart).catch(() => {});
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    clearCartFromStorage();
    
    if (user) {
      syncCartWithServer(user.id, []).catch(() => {});
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getSavings = () => {
    return cart.reduce((total, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getSavings
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};