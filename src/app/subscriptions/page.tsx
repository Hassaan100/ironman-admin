'use client';

import React from 'react';
import { AdminLayoutShell } from '../../components/AdminLayoutShell';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function SubscriptionsPage() {
  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 2999,
      currency: 'PKR',
      popular: false,
      features: [
        'Single Reception Desk',
        'Up to 250 Active Members',
        'Instant Search Admission',
        'Basic Payment Receipts',
        'Daily Cash Drawer Closing',
      ],
    },
    {
      id: 'pro',
      name: 'Professional Pro',
      price: 4999,
      currency: 'PKR',
      popular: true,
      features: [
        'Unlimited Reception Desks',
        'Up to 1,000 Active Members',
        'Personal Trainer Assignments',
        'Equipment Maintenance Logs',
        'Financial Analytics & Cashflow',
        'Automated WhatsApp Reminders',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Multi-Floor',
      price: 9999,
      currency: 'PKR',
      popular: false,
      features: [
        'Unlimited Members & Desks',
        'Multi-Branch Consolidated BI',
        'Custom Domain & Brand Logo',
        'Priority 24/7 Dedicated Support',
        'Cloudinary HD Asset Storage',
      ],
    },
  ];

  return (
    <AdminLayoutShell>
      <div className="pb-6 border-b border-zinc-900">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          SaaS Pricing & Plan Master
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Configured subscription tiers and feature entitlements for client gym accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`bg-[#121215] border rounded-2xl p-6 relative flex flex-col justify-between shadow-xl ${
              p.popular ? 'border-red-500/60 shadow-red-600/10' : 'border-zinc-800/80'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 right-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-red-600/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most Popular
              </span>
            )}

            <div>
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="text-3xl font-black text-white mt-3 font-mono">
                {formatCurrency(p.price, p.currency)}
                <span className="text-xs text-zinc-500 font-normal"> / month</span>
              </p>

              <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
                {p.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-850">
              <span className="block text-center text-xs font-bold text-zinc-400">
                Tier Code: <code className="text-zinc-200 font-mono">{p.id}</code>
              </span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayoutShell>
  );
}
