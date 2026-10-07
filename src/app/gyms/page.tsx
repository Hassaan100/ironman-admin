'use client';

import React, { useState } from 'react';
import { AdminLayoutShell } from '../../components/AdminLayoutShell';
import { CreateGymWizard } from '../../components/CreateGymWizard';
import {
  useGetAllGymsQuery,
  useDeleteGymMutation,
} from '../../redux/baseApi';
import {
  Building2,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '../../lib/utils';

export default function GymsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGym, setEditingGym] = useState<any>(null);

  const { data: gymsData, isLoading, refetch } = useGetAllGymsQuery({ search: searchQuery });
  const [deleteGym] = useDeleteGymMutation();

  const handleDeleteGym = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete gym "${name}" and deactivate all associated accounts?`)) return;
    try {
      await deleteGym(id).unwrap();
      toast.success(`Gym "${name}" removed`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete gym');
    }
  };

  return (
    <AdminLayoutShell>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Gym Fleet & Tenant Directory
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Create, brand, configure, and manage client gym branches and owner accounts.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingGym(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Provision New Gym
        </button>
      </div>

      {/* Main Table Panel */}
      <div className="mt-6 bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-white">Registered Gym Accounts</h3>
            <span className="text-xs text-zinc-500 font-mono">({gymsData?.gyms?.length || 0} Total)</span>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, branch code, email..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading gym directory...</div>
        ) : gymsData?.gyms?.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 font-semibold">No Gyms Found</p>
            <p className="text-xs text-zinc-600 mt-1">Click "Provision New Gym" to register the first account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-bold text-[10px] tracking-wider bg-zinc-950/40">
                  <th className="py-3 px-4">Gym & Branding</th>
                  <th className="py-3 px-4">Branch Code</th>
                  <th className="py-3 px-4">SaaS Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">MRR</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {gymsData?.gyms?.map((gym: any) => (
                  <tr key={gym._id} className="hover:bg-zinc-900/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-750 flex items-center justify-center overflow-hidden flex-shrink-0 font-bold text-red-400">
                          {gym.logoUrl ? (
                            <img src={gym.logoUrl} alt={gym.name} className="w-full h-full object-cover" />
                          ) : (
                            gym.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-100 text-sm">{gym.name}</p>
                          <p className="text-[10px] text-zinc-500">{gym.email || gym.phone || 'No contact set'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-300">
                      <span className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                        {gym.branchCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 uppercase font-bold text-[10px]">
                      <span className="bg-red-950/40 text-red-400 border border-red-800/40 px-2 py-0.5 rounded-full">
                        {gym.subscriptionPlan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          gym.subscriptionStatus === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {gym.subscriptionStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {formatCurrency(gym.mrrAmount, gym.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{formatDate(gym.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setEditingGym(gym);
                          setShowCreateModal(true);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        title="Edit Gym Details & Branding"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGym(gym._id, gym.name)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete Gym Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Multi-Step Add / Edit Gym Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setEditingGym(null);
              }}
              className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <CreateGymWizard
              initialData={editingGym}
              onSuccess={() => {
                setShowCreateModal(false);
                setEditingGym(null);
                refetch();
              }}
              onCancel={() => {
                setShowCreateModal(false);
                setEditingGym(null);
              }}
            />
          </div>
        </div>
      )}
    </AdminLayoutShell>
  );
}
