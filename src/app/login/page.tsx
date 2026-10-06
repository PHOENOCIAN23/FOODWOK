'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams ? searchParams.toString() : '';
    router.replace(`/auth/signin${qs ? `?${qs}` : ''}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-slate-500 text-sm font-semibold">
      Redirecting to sign in...
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-slate-500">Loading...</div>}>
      <LoginRedirect />
    </Suspense>
  );
}
