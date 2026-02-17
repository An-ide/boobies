export const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

export const saveCartToStorage = (cart) => {
  try {
    const safeCart = Array.isArray(cart) ? cart : [];
    const limitedCart = safeCart.slice(0, 50);
    
    localStorage.setItem('cart', JSON.stringify(limitedCart));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, attempting to save minimal cart...');
      
      try {
        const minimalCart = (Array.isArray(cart) ? cart : []).map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name?.substring(0, 50),
          image: item.images?.[0] || item.image || ''
        })).slice(0, 30);
        
        localStorage.setItem('cart', JSON.stringify(minimalCart));
      } catch (secondError) {
        console.error('Still cannot save cart, clearing old data...');
        try {
          localStorage.removeItem('cart');
          localStorage.removeItem('wishlists');
          
          const emergencyCart = (Array.isArray(cart) ? cart : []).map(item => ({
            id: item.id,
            quantity: item.quantity
          })).slice(0, 20);
          
          localStorage.setItem('cart', JSON.stringify(emergencyCart));
        } catch (finalError) {
          console.error('Failed to save cart even after clearing:', finalError);
        }
      }
    } else {
      console.error('Error saving cart to localStorage:', error);
    }
  }
};

export const clearCartFromStorage = () => {
  try {
    localStorage.removeItem('cart');
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

export const getWishlist = (userId) => {
  try {
    const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
    return wishlists[userId] || [];
  } catch (error) {
    console.error('Error reading wishlist:', error);
    return [];
  }
};

export const addToWishlist = (userId, product) => {
  try {
    const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
    const userWishlist = wishlists[userId] || [];
    
    if (!userWishlist.some(item => item.id === product.id)) {
      const minimalProduct = {
        id: product.id,
        name: product.name?.substring(0, 50),
        price: product.price,
        image: product.images?.[0] || product.image || ''
      };
      userWishlist.push(minimalProduct);
      wishlists[userId] = userWishlist;
      localStorage.setItem('wishlists', JSON.stringify(wishlists));
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
  }
};

export const removeFromWishlist = (userId, productId) => {
  try {
    const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
    const userWishlist = wishlists[userId] || [];
    const updatedWishlist = userWishlist.filter(item => item.id !== productId);
    
    wishlists[userId] = updatedWishlist;
    localStorage.setItem('wishlists', JSON.stringify(wishlists));
    return updatedWishlist;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return [];
  }
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