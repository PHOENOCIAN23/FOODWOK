'use client';

import React from 'react';

// Shimmer pulse animation container wrapper
export const ShimmerPulse: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`animate-pulse bg-slate-200/80 rounded-2xl ${className}`}>
    {children}
  </div>
);

// 1. Food Card Skeleton
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-2xs">
    <ShimmerPulse className="w-full h-44 rounded-2xl" />
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <ShimmerPulse className="w-20 h-4 rounded-md" />
        <ShimmerPulse className="w-16 h-5 rounded-md" />
      </div>
      <ShimmerPulse className="w-3/4 h-6 rounded-lg" />
      <ShimmerPulse className="w-full h-10 rounded-lg" />
    </div>
    <div className="pt-2 flex items-center justify-between">
      <ShimmerPulse className="w-24 h-6 rounded-lg" />
      <ShimmerPulse className="w-10 h-10 rounded-xl" />
    </div>
  </div>
);

// 2. Homepage Menu Grid Skeleton
export const SkeletonMenuGrid: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 w-full">
    {/* Hero Section Skeleton */}
    <div className="w-full min-h-[420px] rounded-3xl animate-pulse bg-slate-200/90 p-8 sm:p-12 flex flex-col justify-between">
      <div className="space-y-3">
        <ShimmerPulse className="w-28 h-6 rounded-full bg-slate-300" />
        <ShimmerPulse className="w-2/3 h-12 rounded-2xl bg-slate-300" />
        <ShimmerPulse className="w-1/2 h-12 rounded-2xl bg-slate-300" />
      </div>
      <div className="flex gap-4 pt-6">
        <ShimmerPulse className="w-44 h-12 rounded-full bg-slate-300" />
        <ShimmerPulse className="w-36 h-12 rounded-full bg-slate-300" />
      </div>
    </div>

    {/* Category Filters Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <ShimmerPulse className="w-36 h-8 rounded-xl" />
        <div className="flex gap-2">
          <ShimmerPulse className="w-20 h-9 rounded-full" />
          <ShimmerPulse className="w-20 h-9 rounded-full" />
          <ShimmerPulse className="w-20 h-9 rounded-full" />
          <ShimmerPulse className="w-20 h-9 rounded-full" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
);

// 3. Kitchen KDS Board Skeleton
export const SkeletonKds: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
    <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
      <div className="space-y-2">
        <ShimmerPulse className="w-64 h-8 rounded-xl" />
        <ShimmerPulse className="w-96 h-4 rounded-md" />
      </div>
      <ShimmerPulse className="w-48 h-10 rounded-full" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="space-y-4 bg-slate-100/60 p-4 rounded-3xl min-h-[500px]">
          <ShimmerPulse className="w-full h-12 rounded-2xl bg-slate-200" />
          <ShimmerPulse className="w-full h-40 rounded-2xl" />
          <ShimmerPulse className="w-full h-40 rounded-2xl" />
        </div>
      ))}
    </div>
  </div>
);

// 4. Dish Detail Page Skeleton
export const SkeletonDetailPage: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
    <ShimmerPulse className="w-24 h-5 rounded-md" />
    <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-2xs flex flex-col md:flex-row gap-8 lg:gap-12">
      <ShimmerPulse className="md:w-1/2 min-h-[360px] rounded-3xl" />
      <div className="md:w-1/2 space-y-6">
        <ShimmerPulse className="w-32 h-6 rounded-full" />
        <ShimmerPulse className="w-3/4 h-10 rounded-2xl" />
        <ShimmerPulse className="w-full h-20 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <ShimmerPulse className="w-full h-28 rounded-2xl" />
          <ShimmerPulse className="w-full h-28 rounded-2xl" />
        </div>
        <ShimmerPulse className="w-full h-14 rounded-2xl pt-4" />
      </div>
    </div>
  </div>
);

// 5. My Orders Page Skeleton
export const SkeletonOrders: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
    <ShimmerPulse className="w-24 h-5 rounded-md" />
    <ShimmerPulse className="w-48 h-10 rounded-2xl" />
    <div className="space-y-4">
      {[1, 2, 3].map((idx) => (
        <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex justify-between">
            <ShimmerPulse className="w-32 h-6 rounded-lg" />
            <ShimmerPulse className="w-24 h-6 rounded-full" />
          </div>
          <ShimmerPulse className="w-full h-16 rounded-2xl" />
          <div className="flex justify-between items-center pt-2">
            <ShimmerPulse className="w-28 h-6 rounded-lg" />
            <ShimmerPulse className="w-32 h-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 6. Order Tracking Page Skeleton
export const SkeletonTracking: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
    <ShimmerPulse className="w-24 h-5 rounded-md" />
    <div className="flex justify-between items-center">
      <ShimmerPulse className="w-48 h-9 rounded-2xl" />
      <ShimmerPulse className="w-40 h-10 rounded-full" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ShimmerPulse className="w-full h-64 rounded-3xl" />
      <ShimmerPulse className="w-full h-64 rounded-3xl" />
      <ShimmerPulse className="w-full h-40 rounded-3xl" />
      <ShimmerPulse className="w-full h-96 rounded-3xl" />
    </div>
  </div>
);

// 7. Account Profile Skeleton
export const SkeletonProfile: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
    <ShimmerPulse className="w-24 h-5 rounded-md" />
    <ShimmerPulse className="w-48 h-10 rounded-2xl" />
    <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
      <div className="flex items-center gap-4">
        <ShimmerPulse className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <ShimmerPulse className="w-40 h-6 rounded-lg" />
          <ShimmerPulse className="w-56 h-4 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ShimmerPulse className="w-full h-12 rounded-2xl" />
        <ShimmerPulse className="w-full h-12 rounded-2xl" />
      </div>
      <ShimmerPulse className="w-full h-40 rounded-3xl" />
    </div>
  </div>
);

// 8. Checkout Page Skeleton
export const SkeletonCheckout: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
    <ShimmerPulse className="w-24 h-5 rounded-md" />
    <ShimmerPulse className="w-40 h-10 rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <ShimmerPulse className="lg:col-span-7 h-[480px] rounded-3xl" />
      <ShimmerPulse className="lg:col-span-5 h-[480px] rounded-3xl" />
    </div>
  </div>
);
