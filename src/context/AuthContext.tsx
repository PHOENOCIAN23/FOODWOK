'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { UserProfile, SavedAddress, UserRole } from '@/types/foodwok';

export function formatNigerianPhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
  if (cleaned.startsWith('0')) return '+234' + cleaned.slice(1);
  if (cleaned.startsWith('234')) return '+' + cleaned;
  if (!cleaned.startsWith('+')) return '+234' + cleaned;
  return cleaned;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<UserProfile> & { password: string }) => Promise<void>;
  googleLogin: () => Promise<void>;
  phoneLoginSendOTP: (phoneNumber: string) => Promise<string>;
  phoneLoginVerifyOTP: (otpCode: string, phone: string) => Promise<void>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const supabase = createClient();

function mapDbProfile(row: any, authUser: SupabaseUser): UserProfile {
  return {
    id: authUser.id,
    firstName: row?.first_name || '',
    lastName: row?.last_name || '',
    email: authUser.email || row?.email || '',
    phone: row?.phone || authUser.phone || '',
    role: (row?.role as UserRole) || 'CUSTOMER',
    addresses: row?.addresses || [],
    emailVerified: !!authUser.email_confirmed_at,
    phoneVerified: !!authUser.phone_confirmed_at,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const loadProfile = useCallback(async (authUser: SupabaseUser) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!data) {
      // First login after signup (or OAuth first-time) — create the row.
      const seed = {
        id: authUser.id,
        email: authUser.email || '',
        first_name: authUser.user_metadata?.first_name || '',
        last_name: authUser.user_metadata?.last_name || '',
        phone: authUser.phone || '',
        role: 'CUSTOMER' as UserRole,
        addresses: [] as SavedAddress[],
      };
      await supabase.from('user_profiles').upsert(seed, { onConflict: 'id' });
      setUser(mapDbProfile(seed, authUser));
    } else {
      setUser(mapDbProfile(data, authUser));
    }
  }, []);

  useEffect(() => {
  const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
    setSupabaseUser(session?.user ?? null);
    if (session?.user) {
      await loadProfile(session.user);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  });

  return () => sub.subscription.unsubscribe();
}, [loadProfile]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      await loadProfile(data.user);   
    }
    setIsAuthModalOpen(false);
  };

  const signup = async (userData: Partial<UserProfile> & { password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email!,
      password: userData.password,
      options: {
        data: { first_name: userData.firstName, last_name: userData.lastName },
      },
    });
    if (error) throw error;

    if (data.user) {
      await supabase.from('user_profiles').upsert(
        {
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          phone: userData.phone || '',
          role: 'CUSTOMER',
          addresses: [],
        },
        { onConflict: 'id' }
      );
      await loadProfile(data.user);
    }
    setIsAuthModalOpen(false);
  };

  const googleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/`,
    },
  });
  if (error) throw error;
};

  // Requires an SMS provider (e.g. Twilio) configured in Supabase Auth settings.
  const phoneLoginSendOTP = async (phoneNumber: string) => {
    const formatted = formatNigerianPhone(phoneNumber);
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
    if (error) throw error;
    return formatted;
  };

  const phoneLoginVerifyOTP = async (otpCode: string, phone: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone, token: otpCode, type: 'sms' });
    if (error) throw error;
    setIsAuthModalOpen(false);
  };

  const sendEmailVerificationLink = async () => {
    if (!supabaseUser?.email) return;
    const { error } = await supabase.auth.resend({ type: 'signup', email: supabaseUser.email });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!supabaseUser) return;
    setUser((prev) => (prev ? { ...prev, ...updatedData } : prev));
    await supabase
      .from('user_profiles')
      .update({
        first_name: updatedData.firstName,
        last_name: updatedData.lastName,
        phone: updatedData.phone,
        addresses: updatedData.addresses,
        // role intentionally NOT updatable from the client — see note below
      })
      .eq('id', supabaseUser.id);
  };

  const addAddress = async (newAddr: Omit<SavedAddress, 'id'>): Promise<SavedAddress> => {
    const created: SavedAddress = { ...newAddr, id: `addr-${Date.now()}` };
    const existing = user?.addresses || [];
    const nextAddresses = [
      ...existing.map((a) => (created.isDefault ? { ...a, isDefault: false } : a)),
      { ...created, isDefault: existing.length === 0 || created.isDefault },
    ];
    setUser((prev) => (prev ? { ...prev, addresses: nextAddresses } : prev));
    if (supabaseUser) {
      await supabase.from('user_profiles').update({ addresses: nextAddresses }).eq('id', supabaseUser.id);
    }
    return created;
  };

  const removeAddress = async (addressId: string) => {
    const existing = user?.addresses || [];
    const filtered = existing.filter((a) => a.id !== addressId);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) filtered[0].isDefault = true;
    setUser((prev) => (prev ? { ...prev, addresses: filtered } : prev));
    if (supabaseUser) {
      await supabase.from('user_profiles').update({ addresses: filtered }).eq('id', supabaseUser.id);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    const existing = user?.addresses || [];
    const updated = existing.map((a) => ({ ...a, isDefault: a.id === addressId }));
    setUser((prev) => (prev ? { ...prev, addresses: updated } : prev));
    if (supabaseUser) {
      await supabase.from('user_profiles').update({ addresses: updated }).eq('id', supabaseUser.id);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        googleLogin,
        phoneLoginSendOTP,
        phoneLoginVerifyOTP,
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};