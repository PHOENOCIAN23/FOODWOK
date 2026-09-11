import React from 'react';
import { ShimmerPulse } from '@/components/skeletons/SkeletonComponents';

export default function AccountingLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 w-full">
      <ShimmerPulse className="w-full h-36 rounded-3xl" />
      <ShimmerPulse className="w-full h-28 rounded-3xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ShimmerPulse className="w-full h-32 rounded-3xl" />
        <ShimmerPulse className="w-full h-32 rounded-3xl" />
        <ShimmerPulse className="w-full h-32 rounded-3xl" />
      </div>
      <ShimmerPulse className="w-full h-96 rounded-3xl" />
    </div>
  );
}
