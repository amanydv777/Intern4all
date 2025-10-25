import api from './api';

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.get('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    // Clear local storage even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user data' };
  }
};

// Update user details
export const updateUserDetails = async (userData) => {
  try {
    const response = await api.put('/auth/updatedetails', userData);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user details' };
  }
};

// Update password
export const updatePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/updatepassword', passwordData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update password' };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get stored user
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Forgot password with security key
export const forgotPassword = async (email, securityKey) => {
  try {
    const response = await api.post('/auth/forgotpassword', { email, securityKey });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify security key' };
  }
};

// Reset password
export const resetPassword = async (resetToken, password) => {
  try {
    const response = await api.put(`/auth/resetpassword/${resetToken}`, { password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};
