'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAdminMeQuery } from '../redux/baseApi';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: meData, isLoading, isError } = useGetAdminMeQuery({});

  useEffect(() => {
    if (!isLoading && (isError || meData?.user?.role !== 'superadmin')) {
      router.push('/login');
    }
  }, [meData, isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
            Loading SuperAdmin Console...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
