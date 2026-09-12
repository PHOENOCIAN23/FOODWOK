'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, MailCheck, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const noticeParam = searchParams.get('notice');

  const { signup } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(emailParam);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await signup({
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      setSuccessMessage(
        `Account created successfully! A verification email link has been sent to ${email}. Check your inbox to verify your account.`
      );

      // Redirect after brief delay
      setTimeout(() => {
        router.push('/profile?firstTime=true&notice=welcome_add_address');
      }, 2500);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side: Warm Banner with clear dish photo */}
      <div className="relative bg-slate-950 text-white p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[360px] md:min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-[#EB3223]/40" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-[#EB3223] text-white font-black px-3 py-1.5 rounded-xl text-lg tracking-wider shadow-md">
            FW
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Foodwok
          </span>
        </div>

        {/* Headline Copy */}
        <div className="relative z-10 space-y-4 max-w-md my-auto py-8">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-md">
            Join thousands<br />of food lovers.
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-xs">
            Order your favourite Nigerian meals in minutes, any day, any time.
          </p>
        </div>

        <div className="relative z-10 text-xs font-semibold text-slate-300">
          © {new Date().getFullYear()} Foodwok Restaurant. All rights reserved.
        </div>
      </div>

      {/* Right Side: Clean White Form */}
      <div className="bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-md w-full mx-auto space-y-6">
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold text-xs transition-colors self-start"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create account
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Start your Foodwok journey today.
          </p>
        </div>

        {/* Notice Banner if unregistered email redirected */}
        {noticeParam === 'not_registered' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold animate-fade-in">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-extrabold text-amber-950">No Account Found</strong>
              We couldn&apos;t find an account registered under <span className="underline">{email}</span>. Create your account below to get started!
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold animate-fade-in">
            <MailCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-extrabold text-emerald-900">Email Verification Sent!</strong>
              {successMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                FIRST NAME
              </label>
              <input
                type="text"
                required
                placeholder="Chidi"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                LAST NAME
              </label>
              <input
                type="text"
                required
                placeholder="Okeke"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              placeholder="chidi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              PHONE NUMBER (NIGERIA)
            </label>
            <input
              type="tel"
              required
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
            />
          </div>

          {/* Warm Red CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EB3223] hover:bg-[#d62819] disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 transition-all text-center mt-2 cursor-pointer"
          >
            {isSubmitting ? 'Creating account...' : 'Create my account'}
          </button>

          <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
            By signing up you agree to our{' '}
            <a href="#" className="text-[#EB3223] hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#EB3223] hover:underline">
              Privacy Policy
            </a>
          </p>
        </form>

        <p className="text-center text-xs font-semibold text-slate-500 pt-2">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-[#EB3223] font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading signup...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
