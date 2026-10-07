'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { LiquidLogo } from '@/components/ui/LiquidLogo';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUserPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Verify whether an active session or recovery session exists
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasSession(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserPassword(password);
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Password reset update error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes('session') ||
        msg.toLowerCase().includes('auth session missing') ||
        msg.toLowerCase().includes('not logged in')
      ) {
        setErrorMessage(
          'Your password reset session has expired or is invalid. Please request a new reset link.'
        );
      } else {
        setErrorMessage(msg || 'Failed to update password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side: Rich Hero Banner */}
      <div className="relative bg-slate-950 text-white p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[340px] md:min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-[#EB3223]/40" />

        {/* Top Brand Logo with Liquid Metal Shader */}
        <div className="relative z-10 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <LiquidLogo size="md" variant="crimson-chrome" showText={false} />
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
              Foodwok
            </span>
          </Link>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 space-y-4 max-w-md my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Password Update</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-md">
            Set your new password.
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-xs">
            Choose a strong password to keep your Foodwok account secure and ready for your next order.
          </p>
        </div>

        <div className="relative z-10 text-xs font-semibold text-slate-300">
          © {new Date().getFullYear()} Foodwok Cuisine. All rights reserved.
        </div>
      </div>

      {/* Right Side: Clean Form */}
      <div className="bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-md w-full mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create new password
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Enter and confirm your new password below.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{errorMessage}</span>
              {errorMessage.includes('expired') && (
                <div className="pt-1">
                  <Link
                    href="/auth/forgot-password"
                    className="underline text-red-800 hover:text-red-950 font-extrabold"
                  >
                    Request a new reset link &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-8 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Password changed successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your new password has been saved. You can now use it to sign in to your Foodwok account.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/auth/signin"
                className="w-full bg-[#EB3223] hover:bg-[#d62819] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-red-500/25 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In with New Password</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="new-password"
                className="text-xs font-extrabold uppercase tracking-wider text-slate-500"
              >
                NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-11 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-password"
                className="text-xs font-extrabold uppercase tracking-wider text-slate-500"
              >
                CONFIRM NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-11 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Must be at least 6 characters long.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#EB3223] hover:bg-[#d62819] disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                'Update Password'
              )}
            </button>

            <div className="pt-4 text-center">
              <Link
                href="/auth/signin"
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel and return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-slate-500 font-semibold text-sm">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
