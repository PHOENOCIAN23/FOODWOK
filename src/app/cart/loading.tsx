import React from 'react';
import { ShimmerPulse } from '@/components/skeletons/SkeletonComponents';

export default function CartLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 w-full">
      <ShimmerPulse className="h-10 w-48 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          {[1, 2, 3].map((i) => (
            <ShimmerPulse key={i} className="h-28 w-full rounded-3xl" />
          ))}
        </div>
        <div className="lg:col-span-5">
          <ShimmerPulse className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
