import React from 'react';
import { ShimmerPulse } from '@/components/skeletons/SkeletonComponents';

export default function SigninLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6">
        <ShimmerPulse className="h-8 w-3/4 mx-auto rounded-xl" />
        <ShimmerPulse className="h-12 w-full rounded-2xl" />
        <ShimmerPulse className="h-12 w-full rounded-2xl" />
        <ShimmerPulse className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
