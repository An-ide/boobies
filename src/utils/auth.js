const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const users = await response.json();
    
    const user = Array.isArray(users) 
      ? users.find(u => u.email === email && u.password === password)
      : null;
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.isActive === false) {
      throw new Error('Account is blocked. Please contact support.');
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    if (!userData.name?.trim() || !userData.email?.trim() || !userData.password) {
      throw new Error('All fields are required');
    }

    const checkResponse = await fetch(`${API_BASE_URL}/users`);
    if (!checkResponse.ok) throw new Error(`HTTP ${checkResponse.status}`);
    
    const allUsers = await checkResponse.json();
    const existingUsers = Array.isArray(allUsers) 
      ? allUsers.filter(u => u.email === userData.email.trim())
      : [];
    
    if (existingUsers.length > 0) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const createdUser = await response.json();
    
    localStorage.setItem('currentUser', JSON.stringify(createdUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    return { success: true, user: createdUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: error.message || 'Registration failed. Please try again.' 
    };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};