'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState('Chidi');
  const [lastName, setLastName] = useState('Okeke');
  const [email, setEmail] = useState('chidi@example.com');
  const [phone, setPhone] = useState('+234 800 000 0000');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({
      firstName,
      lastName,
      email,
      phone,
    });
    // Redirect first-time sign ups directly to Profile page to add delivery address first
    router.push('/profile?firstTime=true&notice=welcome_add_address');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side: Warm Banner with clear, vibrant dish photo */}
      <div className="relative bg-slate-950 text-white p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[360px] md:min-h-screen overflow-hidden">
        {/* Clear & Visible Dish Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80")',
          }}
        />
        {/* Gradient Overlay */}
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
          <span>Back</span>
        </Link>

        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create account
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Start your Foodwok journey today.
          </p>
        </div>

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
              PHONE NUMBER
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
            className="w-full bg-[#EB3223] hover:bg-[#d62819] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 transition-all text-center mt-2 cursor-pointer"
          >
            Create my account
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
