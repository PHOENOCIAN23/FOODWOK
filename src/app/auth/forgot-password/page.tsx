'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, ArrowLeft, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { LiquidLogo } from '@/components/ui/LiquidLogo';

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const { resetPasswordForEmail } = useAuth();

  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordForEmail(email.trim());
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Password reset request error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || 'Failed to send reset link. Please check your email and try again.');
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
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-md">
            Don't worry,
            <br />
            we've got your back.
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-xs">
            Reset your password securely in just a minute and get straight back to your cravings.
          </p>
        </div>

        <div className="relative z-10 text-xs font-semibold text-slate-300">
          © {new Date().getFullYear()} Foodwok Cuisine. All rights reserved.
        </div>
      </div>

      {/* Right Side: Clean Form */}
      <div className="bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-md w-full mx-auto space-y-6">
        <div>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Sign In
          </Link>

          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Forgot password?
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                Check your email
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We've sent a password reset link to <strong className="text-slate-900">{email}</strong>. Please check your inbox (and spam folder) and click the link to set a new password.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setErrorMessage('');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                Send again
              </button>
              <Link
                href="/auth/signin"
                className="block w-full text-center py-2 text-xs font-bold text-[#EB3223] hover:underline"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#EB3223] hover:bg-[#d62819] disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="pt-4 text-center">
              <span className="text-xs text-slate-500">
                Remember your password?{' '}
                <Link
                  href="/auth/signin"
                  className="font-bold text-[#EB3223] hover:underline ml-1"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-slate-500 font-semibold text-sm">
          Loading...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
