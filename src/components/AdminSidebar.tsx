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
  X,
} from 'lucide-react';
import { useAdminLogoutMutation } from '../redux/baseApi';
import { useDispatch } from 'react-redux';
import { logoutAdminAction } from '../redux/authSlice';
import { toast } from 'sonner';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch {
      // ignore network errors
    } finally {
      dispatch(logoutAdminAction());
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ironman_admin_token');
      }
      toast.success('Signed out of console');
      router.push('/login');
      onClose?.();
    }
  };

  const navItems = [
    { href: '/', label: 'Platform Overview', icon: LayoutDashboard },
    { href: '/gyms', label: 'Gym Fleet & Tenants', icon: Building2 },
    { href: '/analytics', label: 'MRR & Revenue', icon: TrendingUp },
    { href: '/subscriptions', label: 'SaaS Plan Master', icon: CreditCard },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 select-none">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between gap-3 px-2 py-3 mb-4 border-b border-zinc-900">
          <Link
            href="/"
            onClick={() => onClose?.()}
            className="flex items-center gap-3 hover:opacity-90 transition min-w-0"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-600/30 flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="truncate">
              <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                IRON MAN
              </h1>
              <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider mt-1">
                SuperAdmin SaaS
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close admin menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Routes */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
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
          <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: docked */}
      <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-zinc-950 border-r border-zinc-900 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
