'use client';

import React from 'react';

export interface LiquidLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'crimson-chrome' | 'molten-gold';
  className?: string;
  showText?: boolean;
}

const SIZE_MAP = {
  sm: { box: 'w-8 h-8', text: 'text-xl', badge: 'text-xs' },
  md: { box: 'w-10 h-10', text: 'text-2xl', badge: 'text-sm' },
  lg: { box: 'w-14 h-14', text: 'text-3xl', badge: 'text-base' },
  xl: { box: 'w-18 h-18', text: 'text-4xl', badge: 'text-xl' },
};

export const LiquidLogo: React.FC<LiquidLogoProps> = ({
  size = 'md',
  variant = 'crimson-chrome',
  className = '',
  showText = true,
}) => {
  const dim = SIZE_MAP[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* Foodwok Crisp Logo Crest - Clean, shader-free */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-2xl shadow-sm transition-transform duration-200 group-hover:scale-105 ${dim.box} ${
          variant === 'molten-gold'
            ? 'bg-amber-500 text-white shadow-amber-500/20'
            : 'bg-[#EB3223] text-white shadow-red-500/20'
        }`}
      >
        <span className={`font-black tracking-wider leading-none select-none text-white ${dim.badge}`}>
          FW
        </span>
      </div>

      {/* Brand Typography */}
      {showText && (
        <span className={`font-black tracking-tight text-slate-900 group-hover:text-[#EB3223] transition-colors ${dim.text}`}>
          Foodwok
        </span>
      )}
    </div>
  );
};
