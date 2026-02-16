export const getCartFromStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const clearCartFromStorage = () => {
  localStorage.removeItem('cart');
};

export const getWishlist = (userId) => {
  const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
  return wishlists[userId] || [];
};

export const addToWishlist = (userId, product) => {
  const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
  const userWishlist = wishlists[userId] || [];
  
  if (!userWishlist.some(item => item.id === product.id)) {
    userWishlist.push(product);
    wishlists[userId] = userWishlist;
    localStorage.setItem('wishlists', JSON.stringify(wishlists));
  }
};

export const removeFromWishlist = (userId, productId) => {
  const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
  const userWishlist = wishlists[userId] || [];
  const updatedWishlist = userWishlist.filter(item => item.id !== productId);
  
  wishlists[userId] = updatedWishlist;
  localStorage.setItem('wishlists', JSON.stringify(wishlists));
  return updatedWishlist;
};

export const preventDuplicateProducts = (products, newProduct) => {
  return products.some(product => 
    product.name.toLowerCase() === newProduct.name.toLowerCase() &&
    product.category === newProduct.category
  );
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};