'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldAlert, ChefHat, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/foodwok';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = searchParams.get('notice');

  const { login, updateProfile } = useAuth();

  const [email, setEmail] = useState('admin@foodwok.ng');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(email);
    updateProfile({ role: selectedRole });

    // Set cookie for middleware guard
    document.cookie = `foodwok_role=${selectedRole}; path=/`;

    // Redirection for staff/admin portal
    router.push('/admin/kds');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F9FAFB]">
      {/* Left Side: Hero Banner using exact image & overlay parameters from customer sign in page */}
      <div className="relative bg-slate-950 text-white p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[380px] md:min-h-screen overflow-hidden">
        {/* Background Image using exact customer sign in parameters */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80")',
          }}
        />

        {/* Gradient Overlay using exact customer sign in parameters */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-[#EB3223]/40" />

        {/* Top Left Logo & Title */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-white text-[#EB3223] font-black px-3 py-1.5 rounded-xl text-lg tracking-wider shadow-md">
            FW
          </div>
          <span className="text-2xl font-black tracking-tight text-white drop-shadow-xs">
            Foodwok Staff Portal
          </span>
        </div>

        {/* Main Headline ONLY */}
        <div className="relative z-10 my-auto py-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-md">
            Kitchen KDS &amp;<br />Admin Management
          </h1>
        </div>

        {/* Copyright Footer */}
        <div className="relative z-10 text-xs font-semibold text-white/80">
          © {new Date().getFullYear()} Foodwok Operations. Protected Route.
        </div>
      </div>

      {/* Right Side: Staff Login Form */}
      <div className="bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-md w-full mx-auto space-y-6">
        {notice === 'forbidden_admin' && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold animate-fade-in">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-extrabold">403 Forbidden Access</strong>
              You must be logged in as Kitchen Staff or Admin to access admin routes.
            </div>
          </div>
        )}

        {notice === 'logged_out' && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-extrabold">Logged Out Successfully</strong>
              You have been logged out of the Foodwok admin portal.
            </div>
          </div>
        )}

        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Staff Sign In
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Select your staff role to access operations.
          </p>
        </div>

        {/* Role Selector Toggle: 2 Staff Options Only (Admin & Kitchen Staff) */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            SELECT ACCESS ROLE
          </label>

          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setSelectedRole('ADMIN')}
              className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bg-[#EB3223] text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('KITCHEN_STAFF')}
              className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                selectedRole === 'KITCHEN_STAFF'
                  ? 'bg-[#EB3223] text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ChefHat className="w-4 h-4 shrink-0" />
              <span>Kitchen Staff</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#EB3223] hover:bg-[#d62819] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>
              Sign In as {selectedRole === 'ADMIN' ? 'Admin' : 'Kitchen Staff'}
            </span>
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-slate-500 pt-2">
          Want to browse meals as a customer?{' '}
          <Link href="/" className="text-[#EB3223] font-bold hover:underline">
            Go to Storefront
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading auth...</div>}>
      <LoginContent />
    </Suspense>
  );
}
