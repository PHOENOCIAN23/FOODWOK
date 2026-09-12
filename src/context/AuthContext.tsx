'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SavedAddress, UserRole } from '@/types/foodwok';
import { auth, db, googleProvider } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (userData: Partial<UserProfile> & { password?: string }) => Promise<void>;
  googleLogin: () => Promise<void>;
  sendEmailVerificationLink: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  addAddress: (newAddr: Omit<SavedAddress, 'id'>) => Promise<SavedAddress>;
  removeAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-chidi-001',
  firstName: 'Chidi',
  lastName: 'Okeke',
  email: 'chidi@example.com',
  phone: '+234 800 000 0000',
  role: 'ADMIN',
  emailVerified: true,
  phoneVerified: true,
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

const syncUserToSupabase = async (profile: UserProfile) => {
  try {
    await fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  } catch (err) {
    console.warn('Supabase profile sync call failed silently:', err);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const loadedProfile: UserProfile = {
              id: fbUser.uid,
              firstName: data.firstName || fbUser.displayName?.split(' ')[0] || 'Customer',
              lastName: data.lastName || fbUser.displayName?.split(' ').slice(1).join(' ') || '',
              email: fbUser.email || data.email || '',
              phone: data.phone || fbUser.phoneNumber || '',
              role: (data.role as UserRole) || 'CUSTOMER',
              addresses: data.addresses || [],
              emailVerified: fbUser.emailVerified,
              phoneVerified: !!fbUser.phoneNumber,
            };
            setUser(loadedProfile);
            syncUserToSupabase(loadedProfile);
          } else {
            // Initial Firestore User Profile creation
            const newProfile: UserProfile = {
              id: fbUser.uid,
              firstName: fbUser.displayName?.split(' ')[0] || 'Customer',
              lastName: fbUser.displayName?.split(' ').slice(1).join(' ') || '',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '',
              role: 'CUSTOMER',
              addresses: [],
              emailVerified: fbUser.emailVerified,
              phoneVerified: !!fbUser.phoneNumber,
            };
            await setDoc(userDocRef, newProfile);
            setUser(newProfile);
            syncUserToSupabase(newProfile);
          }
        } catch {
          // Fallback to local memory session if Firestore offline/unconfigured
          const fallbackProfile: UserProfile = {
            id: fbUser.uid,
            firstName: fbUser.displayName?.split(' ')[0] || 'Customer',
            lastName: fbUser.displayName?.split(' ').slice(1).join(' ') || '',
            email: fbUser.email || '',
            phone: '',
            role: 'CUSTOMER',
            addresses: [],
            emailVerified: fbUser.emailVerified,
          };
          setUser(fallbackProfile);
          syncUserToSupabase(fallbackProfile);
        }
      } else {
        // Fallback check from localStorage if offline demo mode
        const saved = localStorage.getItem('foodwok_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setUser(parsed);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (user) {
        try {
          localStorage.setItem('foodwok_user', JSON.stringify(user));
        } catch {}
      } else {
        try {
          localStorage.removeItem('foodwok_user');
        } catch {}
      }
    }
  }, [user, isMounted]);

  const login = async (email: string, password?: string) => {
    if (password) {
      const credential = await firebaseSignInWithEmail(auth, email, password);
      setFirebaseUser(credential.user);
      const loadedProfile: UserProfile = {
        id: credential.user.uid,
        firstName: credential.user.displayName?.split(' ')[0] || 'Customer',
        lastName: credential.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: credential.user.email || email,
        phone: credential.user.phoneNumber || '',
        role: 'CUSTOMER',
        addresses: [],
        emailVerified: credential.user.emailVerified,
      };
      setUser(loadedProfile);
      syncUserToSupabase(loadedProfile);
    } else {
      const demoUser = { ...DEFAULT_DEMO_USER, email };
      setUser(demoUser);
      syncUserToSupabase(demoUser);
    }
    setIsAuthModalOpen(false);
  };

  const signup = async (userData: Partial<UserProfile> & { password?: string }) => {
    let newProfile: UserProfile;
    if (userData.email && userData.password) {
      const credential = await firebaseCreateUserWithEmail(auth, userData.email, userData.password);
      
      // Trigger email verification
      try {
        await firebaseSendEmailVerification(credential.user);
      } catch (e) {
        console.warn('Could not send email verification link:', e);
      }

      newProfile = {
        id: credential.user.uid,
        firstName: userData.firstName || 'Customer',
        lastName: userData.lastName || '',
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role || 'CUSTOMER',
        addresses: [],
        emailVerified: credential.user.emailVerified,
        phoneVerified: !!userData.phone,
      };

      try {
        await setDoc(doc(db, 'users', credential.user.uid), newProfile);
      } catch {}
    } else {
      newProfile = {
        id: `usr-${Date.now()}`,
        firstName: userData.firstName || 'Chidi',
        lastName: userData.lastName || 'Okeke',
        email: userData.email || 'chidi@example.com',
        phone: userData.phone || '+234 800 000 0000',
        role: userData.role || 'CUSTOMER',
        addresses: [],
        emailVerified: false,
        phoneVerified: false,
      };
    }
    setUser(newProfile);
    syncUserToSupabase(newProfile);
    setIsAuthModalOpen(false);
  };

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setFirebaseUser(result.user);
    setIsAuthModalOpen(false);
  };

  const sendEmailVerificationLink = async () => {
    if (auth.currentUser) {
      await firebaseSendEmailVerification(auth.currentUser);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem('foodwok_user');
    } catch {}
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updatedData };
      if (firebaseUser) {
        updateDoc(doc(db, 'users', firebaseUser.uid), updatedData).catch(() => {});
      }
      return next;
    });
  };

  const addAddress = async (newAddr: Omit<SavedAddress, 'id'>): Promise<SavedAddress> => {
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
      const nextAddresses = [...updatedAddresses, { ...created, isDefault: !hasAddresses || created.isDefault }];
      
      if (firebaseUser) {
        updateDoc(doc(db, 'users', firebaseUser.uid), { addresses: nextAddresses }).catch(() => {});
      }

      return {
        ...prev,
        addresses: nextAddresses,
      };
    });

    return created;
  };

  const removeAddress = async (addressId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const existingAddresses = Array.isArray(prev.addresses) ? prev.addresses : [];
      const filtered = existingAddresses.filter((a) => a.id !== addressId);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }

      if (firebaseUser) {
        updateDoc(doc(db, 'users', firebaseUser.uid), { addresses: filtered }).catch(() => {});
      }

      return { ...prev, addresses: filtered };
    });
  };

  const setDefaultAddress = async (addressId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const existingAddresses = Array.isArray(prev.addresses) ? prev.addresses : [];
      const updated = existingAddresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));

      if (firebaseUser) {
        updateDoc(doc(db, 'users', firebaseUser.uid), { addresses: updated }).catch(() => {});
      }

      return {
        ...prev,
        addresses: updated,
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
        firebaseUser,
        isAuthenticated: !!user,
        login,
        signup,
        googleLogin,
        sendEmailVerificationLink,
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
