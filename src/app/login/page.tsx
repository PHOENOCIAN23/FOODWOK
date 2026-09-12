'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password || undefined);
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const code = err?.code || '';
      const msg = err?.message || '';

      let isUnregistered = code === 'auth/user-not-found' || msg.includes('user-not-found');

      if (!isUnregistered && email) {
        try {
          const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          if (data && !data.exists) {
            isUnregistered = true;
          }
        } catch {}
      }

      if (isUnregistered) {
        router.push(`/auth/signup?email=${encodeURIComponent(email)}&notice=not_registered`);
        return;
      }

      setErrorMessage('Incorrect email or password. Please check your details or create an account below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    try {
      await googleLogin();
      router.push('/');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setErrorMessage(err.message || 'Google sign in failed.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F9FAFB]">
      {/* Left Side: Hero Banner */}
      <div className="relative bg-slate-950 text-white p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[380px] md:min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80")',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-[#EB3223]/40" />

        {/* Top Left Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-white text-[#EB3223] font-black px-3 py-1.5 rounded-xl text-lg tracking-wider shadow-md">
            FW
          </div>
          <span className="text-2xl font-black tracking-tight text-white drop-shadow-xs">
            Foodwok
          </span>
        </div>

        {/* Main Headline */}
        <div className="relative z-10 my-auto py-8 space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-md">
            Delicious meals,<br />delivered hot.
          </h1>
          <p className="text-slate-200 text-sm sm:text-base drop-shadow-xs">
            Sign in to access your saved addresses, track orders, and order your favorite Nigerian meals.
          </p>
        </div>

        {/* Copyright Footer */}
        <div className="relative z-10 text-xs font-semibold text-white/80">
          © {new Date().getFullYear()} Foodwok Systems. Secured &amp; Protected.
        </div>
      </div>

      {/* Right Side: Customer Sign In Form */}
      <div className="bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-md w-full mx-auto space-y-6">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Sign In
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Welcome back! Please sign in to your Foodwok account.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EB3223] hover:bg-[#d62819] disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isSubmitting ? 'Authenticating...' : 'Sign In to Order'}
            </span>
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-100 w-full" />
          <span className="bg-white px-3 text-slate-400 text-xs font-semibold uppercase absolute">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs font-semibold text-slate-500 pt-2">
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/signup" className="text-[#EB3223] font-bold hover:underline">
            Create an account
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
