'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ArrowRight } from 'lucide-react';
import { MenuItem } from '@/types/foodwok';
import { formatNairaFromKobo } from '@/lib/currency';

interface HeroSectionProps {
  heroItem: MenuItem;
  onExploreMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroItem,
  onExploreMenu,
}) => {
  const router = useRouter();

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[460px] flex items-center bg-slate-950">
        {/* Background Dish Photo with Dark Overlay Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('${heroItem.image}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        {/* Content Box matching reference image */}
        <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-2xl text-white space-y-6">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#EB3223] text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              CHEF SPECIAL
            </span>
            <span className="bg-black/40 backdrop-blur-md text-amber-400 border border-white/10 px-3.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-white font-bold">{heroItem.rating}</span>
              <span className="text-slate-300">· {heroItem.ordersCount || '2,341 orders'}</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-sm">
            {heroItem.name}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-200 text-base sm:text-lg font-normal leading-relaxed max-w-xl drop-shadow-xs">
            {heroItem.fullDescription || heroItem.description}
          </p>

          {/* CTA Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push(`/menu/${heroItem.id}`)}
              className="bg-[#EB3223] hover:bg-[#d62819] text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Order Now — {formatNairaFromKobo(heroItem.priceInKobo)}
            </button>

            <button
              onClick={onExploreMenu}
              className="flex items-center gap-2 text-white hover:text-slate-200 font-semibold text-base py-3 px-4 rounded-full transition-all group"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
