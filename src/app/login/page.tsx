'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useAdminLoginMutation } from '../../redux/baseApi';
import { setAdminCredentials } from '../../redux/authSlice';
import { ShieldAlert, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('superadmin@ironman.com');
  const [password, setPassword] = useState('Admin@123456');
  const [login, { isLoading }] = useAdminLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      if (res.user?.role !== 'superadmin') {
        toast.error('Access denied. SuperAdmin privileges required.');
        return;
      }
      if (res.token) {
        localStorage.setItem('ironman_admin_token', res.token);
      }
      dispatch(setAdminCredentials({ user: res.user, token: res.token }));
      toast.success('Welcome back, SuperAdmin!');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow nodes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#121215] border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-red-600/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            IRON MAN SAAS
          </h1>
          <p className="text-xs uppercase font-bold text-red-500 tracking-widest mt-1">
            SuperAdmin Command Console
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            Sign in to manage client gym accounts, fleet health, and recurring subscriptions.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              SuperAdmin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="superadmin@ironman.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Console Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating Console...
              </>
            ) : (
              <>
                Access Command Center <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center">
          <p className="text-xs text-zinc-500">
            Default Credentials: <code className="text-zinc-300">superadmin@ironman.com</code> / <code className="text-zinc-300">Admin@123456</code>
          </p>
        </div>
      </div>
    </div>
  );
}
