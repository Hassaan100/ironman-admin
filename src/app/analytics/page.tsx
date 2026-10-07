'use client';

import React from 'react';
import { AdminLayoutShell } from '../../components/AdminLayoutShell';
import { useGetPlatformStatsQuery } from '../../redux/baseApi';
import { TrendingUp, DollarSign, PieChart, Users, Building2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function AnalyticsPage() {
  const { data: statsData, isLoading } = useGetPlatformStatsQuery({});

  const metrics = statsData?.metrics || {
    totalGyms: 0,
    activeGyms: 0,
    totalPlatformMembers: 0,
    totalMRR: 0,
  };

  return (
    <AdminLayoutShell>
      <div className="pb-6 border-b border-zinc-900">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          MRR Growth & Revenue Analytics
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          SaaS subscription performance, revenue breakdown, and fleet utilization metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Platform MRR</p>
          <p className="text-3xl font-black text-emerald-400 mt-2">{formatCurrency(metrics.totalMRR)}</p>
          <p className="text-xs text-zinc-500 mt-1">Annual Run Rate: {formatCurrency(metrics.totalMRR * 12)}</p>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Average Revenue Per Gym (ARPU)</p>
          <p className="text-3xl font-black text-white mt-2">
            {formatCurrency(metrics.activeGyms ? metrics.totalMRR / metrics.activeGyms : 0)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Per active tenant subscription</p>
        </div>

        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Tenant Ratio</p>
          <p className="text-3xl font-black text-sky-400 mt-2">
            {metrics.totalGyms ? Math.round((metrics.activeGyms / metrics.totalGyms) * 100) : 100}%
          </p>
          <p className="text-xs text-zinc-500 mt-1">{metrics.activeGyms} of {metrics.totalGyms} accounts active</p>
        </div>
      </div>

      {/* Plan Tier Distribution */}
      <div className="mt-6 bg-[#121215] border border-zinc-800/80 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-red-500" /> Subscription Plan Breakdown
        </h3>
        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading plan metrics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsData?.planBreakdown?.map((plan: any) => (
              <div key={plan._id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400">{plan._id}</p>
                <p className="text-2xl font-black text-white mt-1">{plan.count} Accounts</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {Math.round((plan.count / (metrics.totalGyms || 1)) * 100)}% of total fleet
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
