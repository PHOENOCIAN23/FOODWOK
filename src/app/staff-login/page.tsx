'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldAlert, ChefHat, ShieldCheck, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/foodwok';

function StaffLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = searchParams.get('notice');

  const { login, updateProfile } = useAuth();

  const [selectedStaffRole, setSelectedStaffRole] = useState<UserRole>('ADMIN');
  const [email, setEmail] = useState('admin@foodwok.ng');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedStaffRole(role);
    if (role === 'ADMIN') {
      setEmail('admin@foodwok.ng');
    } else {
      setEmail('kitchen@foodwok.ng');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email || 'admin@foodwok.ng', password || '');
      updateProfile({ role: selectedStaffRole });
      document.cookie = `foodwok_role=${selectedStaffRole}; path=/`;
      router.push('/admin/kds');
    } catch (err: any) {
      console.error('Staff login error:', err);
      setErrorMessage(err.message || 'Failed to sign in. Please check staff credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAutofill = (role: UserRole) => {
    if (role === 'ADMIN') {
      setSelectedStaffRole('ADMIN');
      setEmail('admin@foodwok.ng');
      setPassword('FW-Admin-2026#Secure');
    } else {
      setSelectedStaffRole('KITCHEN_STAFF');
      setEmail('kitchen@foodwok.ng');
      setPassword('FW-Kitchen-2026#Shift');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#0B0F19]">
      {/* Left Side: Dark Operations Banner */}
      <div className="relative bg-slate-950 text-white p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[380px] md:min-h-screen overflow-hidden border-r border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80")',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />

        {/* Top Left Staff Portal Title */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-[#EB3223] text-white font-black px-3 py-1.5 rounded-xl text-lg tracking-wider shadow-md">
            FW
          </div>
          <span className="text-xl font-black tracking-tight text-white drop-shadow-xs flex items-center gap-2">
            Foodwok Operations
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] uppercase font-black px-2 py-0.5 rounded-md">
              Internal Terminal
            </span>
          </span>
        </div>

        {/* Main Headline */}
        <div className="relative z-10 my-auto py-8 space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-md">
            Kitchen KDS &amp;<br />Admin Management
          </h1>
          <p className="text-slate-400 text-sm sm:text-base drop-shadow-xs max-w-md">
            Restricted operations terminal for Foodwok kitchen displays, menu syncing, and financial accounting.
          </p>
        </div>

        {/* Copyright Footer */}
        <div className="relative z-10 text-xs font-semibold text-slate-500">
          © {new Date().getFullYear()} Foodwok Operations System. All Access Logged.
        </div>
      </div>

      {/* Right Side: Staff Form */}
      <div className="bg-slate-900 p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-md w-full mx-auto space-y-6 text-white">
        {notice === 'forbidden_admin' && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold animate-fade-in">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-extrabold text-red-200">403 Restricted Route</strong>
              You must sign in with a valid Staff Pass to access admin pages.
            </div>
          </div>
        )}

        {notice === 'logged_out' && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-extrabold text-emerald-200">Logged Out Successfully</strong>
              You have been logged out of the staff terminal safely.
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Staff Sign In
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Select your assigned role and enter your staff pass.
          </p>
        </div>

        {/* Staff Role Access Selector */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            SELECT OPERATIONAL ROLE
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleChange('ADMIN')}
              className={`py-3 px-3 rounded-2xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedStaffRole === 'ADMIN'
                  ? 'border-[#EB3223] bg-[#EB3223] text-white shadow-lg shadow-red-500/25'
                  : 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('KITCHEN_STAFF')}
              className={`py-3 px-3 rounded-2xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedStaffRole === 'KITCHEN_STAFF'
                  ? 'border-[#EB3223] bg-[#EB3223] text-white shadow-lg shadow-red-500/25'
                  : 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen Staff</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Credentials Autofill Buttons */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>GENERATE / AUTOFILL STAFF PASS</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAutofill('ADMIN')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all text-left truncate cursor-pointer"
            >
              🔑 Fill Admin Pass
            </button>
            <button
              type="button"
              onClick={() => handleQuickAutofill('KITCHEN_STAFF')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all text-left truncate cursor-pointer"
            >
              👨‍🍳 Fill Kitchen Pass
            </button>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="staff-email" className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              STAFF EMAIL ADDRESS
            </label>
            <input
              id="staff-email"
              type="email"
              required
              placeholder={selectedStaffRole === 'ADMIN' ? 'admin@foodwok.ng' : 'kitchen@foodwok.ng'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#EB3223] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="staff-passcode" className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              STAFF PASSCODE
            </label>
            <input
              id="staff-passcode"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#EB3223] font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EB3223] hover:bg-[#d62819] disabled:bg-slate-800 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Authenticating Terminal...'
                : `Authenticate as ${selectedStaffRole === 'ADMIN' ? 'Admin' : 'Kitchen Staff'}`}
            </span>
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-slate-500 pt-2">
          Looking for customer meal orders?{' '}
          <Link href="/" className="text-slate-300 hover:text-white font-bold underline">
            Return to Storefront
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 bg-slate-950 min-h-screen">Loading staff terminal...</div>}>
      <StaffLoginContent />
    </Suspense>
  );
}
