const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const product = data.products.find(p => p.id === parseInt(id));
    return product || null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.users) ? data.users : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUserStatus = async (id, status) => {
  return { id, isActive: status };
};

export const syncCartWithServer = async (userId, cart = null) => {
  return [];
};

export const createOrder = async (order) => {
  return { ...order, id: Date.now() };
};

export const fetchUserOrders = async (userId) => {
  return [];
};