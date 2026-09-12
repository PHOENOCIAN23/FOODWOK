'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChefHat, UtensilsCrossed, BarChart3, Store, ShieldAlert, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const role = user?.role || 'ADMIN';

  const handleAdminLogout = () => {
    logout();
    // Clear middleware role cookie
    document.cookie = 'foodwok_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login?notice=logged_out');
  };

  // Role guard check - restricts admin portal to authenticated staff/admin users
  if (!user || role === 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md w-full text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-100 text-[#EB3223] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">403 Forbidden</h2>
            <p className="text-slate-500 text-sm font-medium">
              You are currently logged in as a <strong>CUSTOMER</strong>. Admin & Kitchen routes are restricted to Kitchen Staff and Admins only.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="block w-full bg-[#EB3223] text-white font-bold py-3.5 rounded-2xl shadow-md hover:bg-[#d62819] transition-all text-sm"
            >
              Sign In as Staff / Admin
            </Link>
            <Link
              href="/"
              className="block w-full bg-slate-100 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-200 transition-all text-sm"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      href: '/admin/kds',
      label: 'Kitchen KDS',
      icon: ChefHat,
      roles: ['ADMIN', 'KITCHEN_STAFF'],
    },
    {
      href: '/admin/menu',
      label: 'Menu Manager',
      icon: UtensilsCrossed,
      roles: ['ADMIN', 'KITCHEN_STAFF'],
    },
    {
      href: '/admin/accounting',
      label: 'Accounting Ledger',
      icon: BarChart3,
      roles: ['ADMIN'],
    },
  ].filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Brand Logo */}
            <Link href="/admin/kds" className="flex items-center gap-2">
              <div className="bg-[#EB3223] text-white font-black px-2.5 py-1 rounded-xl text-base tracking-wider shadow-sm">
                FW
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Foodwok <span className="text-xs font-bold text-red-400 uppercase tracking-widest ml-1">Admin</span>
              </span>
            </Link>

            {/* Admin Nav Tabs */}
            <nav className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
              {navItems.map((item) => {
                const isSelected = pathname === item.href;
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      isSelected
                        ? 'bg-[#EB3223] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                  >
                    <ItemIcon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Role Badge, Storefront Link & Admin Log Out Sequence */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="bg-slate-800 border border-slate-700 text-amber-400 px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>ROLE: {role}</span>
            </span>



            {/* Admin Log Out Button */}
            <button
              onClick={handleAdminLogout}
              className="bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-300 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
              title="Log out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin View Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
