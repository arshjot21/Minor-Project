import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('fdtrend_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  // Modals & UI States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Show Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch current user if token exists
  useEffect(() => {
    const initUser = async () => {
      if (token) {
        try {
          const data = await api.getMe(token);
          setUser(data.user);
          setBookmarksCount(data.user.bookmarkCount || 0);
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('fdtrend_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${data.user.name}`);
    return data;
  };

  const register = async (name, username, email, password, interests) => {
    const data = await api.register({ name, username, email, password, interests });
    localStorage.setItem('fdtrend_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);
    showToast(`Account created! Welcome to FD Trend, ${data.user.name}`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fdtrend_token');
    setToken(null);
    setUser(null);
    setBookmarksCount(0);
    showToast('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    if (!token) return;
    const res = await api.updateProfile(profileData, token);
    setUser(res.user);
    showToast('Profile updated successfully');
    return res;
  };

  const toggleBookmark = async (itemType, itemId) => {
    if (!user) {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      showToast('Please log in to save items to your fashion library.', 'info');
      return false;
    }

    try {
      const res = await api.toggleBookmark(itemType, itemId, token);
      showToast(res.message);
      setBookmarksCount(prev => res.bookmarked ? prev + 1 : Math.max(0, prev - 1));
      return res.bookmarked;
    } catch (err) {
      showToast(err.message || 'Failed to update bookmark', 'error');
      return false;
    }
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      loading,
      bookmarksCount,
      login,
      register,
      logout,
      updateProfile,
      toggleBookmark,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalTab,
      openAuthModal,
      isSearchOpen,
      setIsSearchOpen,
      isOnboardingOpen,
      setIsOnboardingOpen,
      toast,
      showToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
