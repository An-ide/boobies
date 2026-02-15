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

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const addProduct = async (product) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
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
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: status })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const syncCartWithServer = async (userId, cart = null) => {
  try {
    if (cart !== null) {
      const checkResponse = await fetch(`${API_BASE_URL}/carts?userId=${userId}`);
      if (!checkResponse.ok) throw new Error(`HTTP ${checkResponse.status}`);
      
      const existingCarts = await checkResponse.json();
      
      if (existingCarts.length > 0) {
        const cartId = existingCarts[0].id;
        const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: cartId,
            userId, 
            items: cart 
          })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } else {
        const response = await fetch(`${API_BASE_URL}/carts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            items: cart 
          })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }
    } else {
      const response = await fetch(`${API_BASE_URL}/carts?userId=${userId}`);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`HTTP ${response.status}`);
      }
      
      const carts = await response.json();
      return carts.length > 0 ? carts[0].items : [];
    }
  } catch (error) {
    console.error('Error syncing cart:', error);
    return [];
  }
};

export const createOrder = async (order) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders?userId=${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};