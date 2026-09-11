'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SavedAddress, UserRole } from '@/types/foodwok';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  signup: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  addAddress: (newAddr: Omit<SavedAddress, 'id'>) => SavedAddress;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-chidi-001',
  firstName: 'Chidi',
  lastName: 'Okeke',
  email: 'chidi@example.com',
  phone: '+234 800 000 0000',
  role: 'ADMIN',
  addresses: [
    {
      id: 'addr-001',
      label: 'Home',
      address: '12 Adeola Odeku Street, Victoria Island, Lagos',
      landmark: 'Near GTBank branch',
      isDefault: true,
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('foodwok_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const currentAddresses: SavedAddress[] = Array.isArray(parsed.addresses)
            ? parsed.addresses
            : parsed.defaultAddress
            ? [
                {
                  id: 'addr-legacy',
                  label: 'Home',
                  address: parsed.defaultAddress,
                  landmark: parsed.landmark || '',
                  isDefault: true,
                },
              ]
            : [];
          setUser({
            ...parsed,
            role: parsed.role || 'ADMIN',
            addresses: currentAddresses,
          });
        }
      } catch {
        // Fallback
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (user) {
        localStorage.setItem('foodwok_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('foodwok_user');
      }
    }
  }, [user, isMounted]);

  const login = (email: string) => {
    setUser({
      ...DEFAULT_USER,
      email,
    });
    setIsAuthModalOpen(false);
  };

  const signup = (userData: Partial<UserProfile>) => {
    // New signups start with empty addresses list per user requirements!
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      firstName: userData.firstName || 'Chidi',
      lastName: userData.lastName || 'Okeke',
      email: userData.email || 'chidi@example.com',
      phone: userData.phone || '+234 800 000 0000',
      role: userData.role || 'CUSTOMER',
      addresses: [],
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const addAddress = (newAddr: Omit<SavedAddress, 'id'>): SavedAddress => {
    const created: SavedAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };

    setUser((prev) => {
      if (!prev) return null;
      const existingAddresses = Array.isArray(prev.addresses) ? prev.addresses : [];
      const hasAddresses = existingAddresses.length > 0;
      const updatedAddresses = existingAddresses.map((a) =>
        created.isDefault ? { ...a, isDefault: false } : a
      );

      return {
        ...prev,
        addresses: [...updatedAddresses, { ...created, isDefault: !hasAddresses || created.isDefault }],
      };
    });

    return created;
  };

  const removeAddress = (addressId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const existingAddresses = Array.isArray(prev.addresses) ? prev.addresses : [];
      const filtered = existingAddresses.filter((a) => a.id !== addressId);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return { ...prev, addresses: filtered };
    });
  };

  const setDefaultAddress = (addressId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const existingAddresses = Array.isArray(prev.addresses) ? prev.addresses : [];
      return {
        ...prev,
        addresses: existingAddresses.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        })),
      };
    });
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
