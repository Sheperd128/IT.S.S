import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- Added loading state

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false); // <-- Tell React it's safe to render the page now
  }, []);

  const register = async (userData) => {
    try {
      const response = await axios.post('https://itss-backend-upy6.onrender.com/api/auth/register', userData);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (userData) => {
    try {
      const response = await axios.post('https://itss-backend-upy6.onrender.com/api/auth/login', userData);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Invalid email or password' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

 return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};