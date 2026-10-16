'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAdminMeQuery } from '../redux/baseApi';
import { AdminSidebar } from './AdminSidebar';
import { Menu, ShieldAlert } from 'lucide-react';

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
      <AdminSidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 border-b border-zinc-900 bg-zinc-950 px-4 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
              aria-label="Open SuperAdmin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span className="text-xs font-black tracking-wider text-white uppercase">SuperAdmin Console</span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
            Root
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-8 max-w-7xl mx-auto w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
