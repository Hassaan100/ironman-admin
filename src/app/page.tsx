'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayoutShell } from '../components/AdminLayoutShell';
import { useGetPlatformStatsQuery } from '../redux/baseApi';
import {
  Building2,
  DollarSign,
  Users,
  Activity,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

export default function SuperAdminDashboardPage() {
  const { data: statsData, isLoading } = useGetPlatformStatsQuery({}, { pollingInterval: 10000 });

  const metrics = statsData?.metrics || {
    totalGyms: 0,
    activeGyms: 0,
    totalPlatformMembers: 0,
    totalMRR: 0,
    systemStatus: 'Operational',
  };

  return (
    <AdminLayoutShell>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-500 border border-red-500/20 text-[10px] font-extrabold uppercase tracking-wider">
              Fleet Telemetry
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live SaaS Cluster
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
            SaaS Platform Overview
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gyms"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Provision New Gym
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Client Gyms</p>
            <div className="w-9 h-9 rounded-xl bg-red-600/15 text-red-500 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{metrics.totalGyms}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> {metrics.activeGyms} Active Accounts
          </div>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Monthly Recurring (MRR)</p>
            <div className="w-9 h-9 rounded-xl bg-emerald-600/15 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-3">
            {formatCurrency(metrics.totalMRR)}
          </p>
          <p className="text-xs text-zinc-500 mt-2">Aggregated active subscription billing</p>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Platform Athletes</p>
            <div className="w-9 h-9 rounded-xl bg-sky-600/15 text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{metrics.totalPlatformMembers}</p>
          <p className="text-xs text-zinc-500 mt-2">Across all gym branches</p>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Cluster Status</p>
            <div className="w-9 h-9 rounded-xl bg-emerald-600/15 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-3">{metrics.systemStatus}</p>
          <p className="text-xs text-zinc-500 mt-2">Unified Node.js API (Port 8000)</p>
        </div>
      </div>

      {/* Recent Gyms & Quick Navigation */}
      <div className="mt-8 bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-500" /> Recently Provisioned Gym Accounts
          </h3>
          <Link
            href="/gyms"
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            Manage Fleet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-zinc-500 text-xs">Loading accounts...</div>
        ) : statsData?.recentGyms?.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">No gym accounts created yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsData?.recentGyms?.map((gym: any) => (
              <div
                key={gym._id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-750 flex items-center justify-center overflow-hidden flex-shrink-0 font-bold text-red-400">
                    {gym.logoUrl ? (
                      <img src={gym.logoUrl} alt={gym.name} className="w-full h-full object-cover" />
                    ) : (
                      gym.name.charAt(0)
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-zinc-100 truncate">{gym.name}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{gym.branchCode}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-950/50 text-red-400 border border-red-800/40">
                    {gym.subscriptionPlan}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatCurrency(gym.mrrAmount, gym.currency)}/mo
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
