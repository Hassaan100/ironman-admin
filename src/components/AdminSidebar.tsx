'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  LayoutDashboard,
  Building2,
  TrendingUp,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { useAdminLogoutMutation } from '../redux/baseApi';
import { toast } from 'sonner';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logout] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      toast.success('Signed out of console');
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const navItems = [
    { href: '/', label: 'Platform Overview', icon: LayoutDashboard },
    { href: '/gyms', label: 'Gym Fleet & Tenants', icon: Building2 },
    { href: '/analytics', label: 'MRR & Revenue', icon: TrendingUp },
    { href: '/subscriptions', label: 'SaaS Plan Master', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between p-4 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Logo Header */}
        <Link href="/" className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-zinc-900 block hover:opacity-90 transition">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-600/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
              IRON MAN
            </h1>
            <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider mt-1">
              SuperAdmin SaaS
            </p>
          </div>
        </Link>

        {/* Navigation Routes */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User & Logout section */}
      <div className="pt-4 border-t border-zinc-900 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2 bg-zinc-900/50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xs">
            SA
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-zinc-200">Super Administrator</p>
            <p className="text-[10px] text-zinc-500 truncate">Platform Master</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out Console
        </button>
      </div>
    </aside>
  );
}
