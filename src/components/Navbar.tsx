'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useMenu } from '@/context/MenuContext';

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory = 'all',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItemsCount } = useCart();
  const { user, openAuthModal } = useAuth();
  const { categories: contextCategories } = useMenu();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const isAuthPage = pathname?.startsWith('/auth');

  const categories = [
    { id: 'all', label: 'All' },
    ...contextCategories,
  ];

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      router.push(`/?category=${catId}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    } else {
      router.push(`/?search=${encodeURIComponent(localSearch)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo matching reference screenshot */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#EB3223] text-white font-extrabold px-3 py-1.5 rounded-xl text-lg tracking-wider shadow-sm group-hover:scale-105 transition-transform duration-200">
            FW
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Foodwok
          </span>
        </Link>

        {/* Center Category Filters (only on home / menu pages) */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-2 bg-slate-50/80 p-1.5 rounded-full border border-slate-100 overflow-x-auto">
            {categories.map((cat) => {
              const isSelected = activeCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#EB3223] text-white shadow-md shadow-red-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Search, Cart & Profile Actions */}
        <div className="flex items-center gap-3">
          {!isAuthPage && (
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search meals..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent focus:border-slate-300 focus:bg-white text-slate-900 text-sm rounded-full focus:outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </form>
          )}

          {/* Cart Icon matching reference badge */}
          <Link
            href="/cart"
            className="relative p-2.5 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-5 h-5 text-slate-800" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EB3223] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* User Profile Avatar matching reference screenshot */}
          {user ? (
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-[#EB3223] text-white font-bold flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
              title={`${user.firstName} ${user.lastName}`}
            >
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'C'}
            </Link>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
