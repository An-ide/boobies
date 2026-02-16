const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const addProduct = async (product) => {
  console.log('Mock: Adding product', product);
  return { ...product, id: Date.now() };
};

export const updateProduct = async (id, updates) => {
  console.log('Mock: Updating product', id, updates);
  return { id, ...updates };
};

export const softDeleteProduct = async (id) => {
  console.log('Mock: Soft deleting product', id);
  return { id, isActive: false };
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUserStatus = async (id, status) => {
  console.log('Mock: Updating user status', id, status);
  return { id, isActive: status };
};

export const syncCartWithServer = async (userId, cart = null) => {
  try {
    if (cart !== null) {
      try {
        const response = await fetch(`${API_BASE_URL}/carts?userId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, items: cart })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (error) {
        console.log('Cart endpoint not available, using localStorage only');
        return { userId, items: cart };
      }
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/carts?userId=${userId}`);
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.log('Cart endpoint not available, using localStorage');
        return [];
      }
    }
  } catch (error) {
    console.error('Error syncing cart:', error);
    return [];
  }
};

export const fetchCart = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/carts?userId=${userId}`);
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.log('Error fetching cart, using empty cart:', error);
    return [];
  }
};

export const createOrder = async (order) => {
  console.log('Mock: Creating order', order);
  return { ...order, id: Date.now() };
};

export const fetchUserOrders = async (userId) => {
  return [];
};

export const fetchAllOrders = async () => {
  return [];
};

export const updateOrderStatus = async (id, status) => {
  console.log('Mock: Updating order status', id, status);
  return { id, status };
};

export const fetchWishlist = async (userId) => {
  return [];
};

export const addToWishlist = async (userId, productId) => {
  console.log('Mock: Adding to wishlist', userId, productId);
  return { userId, productId };
};

export const removeFromWishlist = async (userId, productId) => {
  console.log('Mock: Removing from wishlist', userId, productId);
  return { success: true };
};