'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Plus, XCircle } from 'lucide-react';
import { MenuItem } from '@/types/foodwok';
import { formatNairaFromKobo } from '@/lib/currency';

interface FoodCardProps {
  item: MenuItem;
  onCustomize?: (item: MenuItem) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80';

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(item.image);

  // Keep image state in sync when admin updates dish image
  useEffect(() => {
    setImgSrc(item.image);
  }, [item.image]);

  const isAvailable = item.isAvailable !== false;

  const handleCardClick = () => {
    if (isAvailable) {
      router.push(`/menu/${item.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group ${
        isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
      }`}
    >
      {/* Image Banner */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100">
        {/* Sold Out Overlay Badge */}
        {!isAvailable ? (
          <span className="absolute top-3 left-3 z-10 bg-slate-900 text-white text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" />
            SOLD OUT
          </span>
        ) : item.badge ? (
          <span className="absolute top-3 left-3 z-10 bg-[#EB3223] text-white text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs">
            {item.badge}
          </span>
        ) : null}

        <img
          src={imgSrc || item.image}
          alt={item.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isAvailable ? 'group-hover:scale-105' : 'grayscale-50'
          }`}
        />
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
          </div>

          {/* Title */}
          <h3 className={`text-lg font-extrabold leading-snug transition-colors ${
            isAvailable ? 'text-slate-900 group-hover:text-[#EB3223]' : 'text-slate-500'
          }`}>
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Bottom Price & Add Action */}
        <div className="pt-2 flex items-center justify-between">
          <span className={`font-extrabold text-lg tracking-tight ${
            isAvailable ? 'text-[#EB3223]' : 'text-slate-400 line-through'
          }`}>
            {formatNairaFromKobo(item.priceInKobo)}
          </span>

          {isAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/menu/${item.id}`);
              }}
              className="bg-[#EB3223] hover:bg-[#d62819] text-white rounded-2xl w-9 h-9 flex items-center justify-center shadow-md shadow-red-500/20 hover:scale-110 active:scale-95 transition-all"
              aria-label={`View ${item.name}`}
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <span className="text-[11px] font-extrabold text-red-600 uppercase bg-red-50 px-2.5 py-1 rounded-xl border border-red-200/60">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
