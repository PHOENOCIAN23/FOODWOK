import React from 'react';
import { ShimmerPulse } from '@/components/skeletons/SkeletonComponents';

export default function ForgotPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F9FAFB]">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 max-w-md w-full space-y-6 shadow-sm">
        <ShimmerPulse className="h-10 w-10 mx-auto rounded-full" />
        <ShimmerPulse className="h-8 w-3/4 mx-auto rounded-xl" />
        <ShimmerPulse className="h-4 w-5/6 mx-auto rounded-md" />
        <div className="space-y-2 pt-2">
          <ShimmerPulse className="h-4 w-28 rounded-md" />
          <ShimmerPulse className="h-12 w-full rounded-2xl" />
        </div>
        <ShimmerPulse className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
