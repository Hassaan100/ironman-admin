'use client';

import React, { useState, useRef } from 'react';
import {
  useCreateGymMutation,
  useUpdateGymMutation,
  useUploadImageMutation,
} from '../redux/baseApi';
import {
  Building2,
  CreditCard,
  Sliders,
  KeyRound,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateGymWizardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any; // If editing an existing gym
}

export function CreateGymWizard({ onSuccess, onCancel, initialData }: CreateGymWizardProps) {
  const isEditing = Boolean(initialData?._id);
  const [step, setStep] = useState<number>(1);

  const [createGym, { isLoading: isCreating }] = useCreateGymMutation();
  const [updateGym, { isLoading: isUpdating }] = useUpdateGymMutation();
  const [uploadImage, { isLoading: isUploadingLogo }] = useUploadImageMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    branchCode: initialData?.branchCode || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    logoUrl: initialData?.logoUrl || '',
    // Step 2: Subscription & Financials
    subscriptionPlan: initialData?.subscriptionPlan || 'pro',
    subscriptionStatus: initialData?.subscriptionStatus || 'active',
    mrrAmount: initialData?.mrrAmount || 4999,
    currency: initialData?.currency || 'PKR',
    // Step 3: Gym Policies & Rules
    taxRate: initialData?.settings?.taxRate ?? 0,
    allowPartialPayments: initialData?.settings?.allowPartialPayments ?? true,
    freezeFee: initialData?.settings?.freezeFee ?? 500,
    gracePeriodDays: initialData?.settings?.gracePeriodDays ?? 3,
    // Step 4: Owner / Admin Credentials (only for new creation)
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        if (name === 'name' && !prev.slug && !isEditing) {
          updated.slug = value.toLowerCase().replace(/[^a-z0-9]/g, '-');
        }
        return updated;
      });
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    const uploadPayload = new FormData();
    uploadPayload.append('file', file);

    try {
      toast.loading('Uploading gym logo...', { id: 'logo-upload' });
      const res = await uploadImage(uploadPayload).unwrap();
      setFormData((prev) => ({ ...prev, logoUrl: res.file?.url || '' }));
      toast.success('Logo uploaded successfully!', { id: 'logo-upload' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload logo image', { id: 'logo-upload' });
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error('Gym Name is required');
        return;
      }
      if (!formData.branchCode.trim()) {
        toast.error('Branch Code is required (e.g. GYM-001)');
        return;
      }
    }
    if (step === 4 && !isEditing) {
      if (!formData.ownerEmail.trim() || !formData.ownerPassword) {
        toast.error('Owner Email and Password are required');
        return;
      }
      if (formData.ownerPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
    const maxSteps = isEditing ? 3 : 4;
    setStep((prev) => Math.min(prev + 1, maxSteps));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      try {
        await updateGym({
          id: initialData._id,
          name: formData.name,
          slug: formData.slug,
          branchCode: formData.branchCode,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          logoUrl: formData.logoUrl,
          subscriptionPlan: formData.subscriptionPlan,
          subscriptionStatus: formData.subscriptionStatus,
          mrrAmount: Number(formData.mrrAmount),
          currency: formData.currency,
          settings: {
            taxRate: Number(formData.taxRate),
            allowPartialPayments: formData.allowPartialPayments,
            freezeFee: Number(formData.freezeFee),
            gracePeriodDays: Number(formData.gracePeriodDays),
          },
        }).unwrap();

        toast.success(`Gym "${formData.name}" updated successfully!`);
        if (onSuccess) onSuccess();
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to update gym');
      }
      return;
    }

    if (!formData.ownerEmail || !formData.ownerPassword) {
      toast.error('Owner Email and Password are required');
      return;
    }
    if (formData.ownerPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await createGym({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        branchCode: formData.branchCode,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        logoUrl: formData.logoUrl,
        subscriptionPlan: formData.subscriptionPlan,
        mrrAmount: Number(formData.mrrAmount),
        currency: formData.currency,
        settings: {
          taxRate: Number(formData.taxRate),
          allowPartialPayments: formData.allowPartialPayments,
          freezeFee: Number(formData.freezeFee),
          gracePeriodDays: Number(formData.gracePeriodDays),
        },
        ownerName: formData.ownerName || `${formData.name} Owner`,
        ownerEmail: formData.ownerEmail,
        ownerPassword: formData.ownerPassword,
      }).unwrap();

      toast.success(res.message || 'Gym & Owner account provisioned!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create gym');
    }
  };

  const stepsList = isEditing
    ? [
      { num: 1, label: 'Gym Info', icon: Building2 },
      { num: 2, label: 'Plan & MRR', icon: CreditCard },
      { num: 3, label: 'Settings', icon: Sliders },
    ]
    : [
      { num: 1, label: 'Gym Info', icon: Building2 },
      { num: 2, label: 'Plan & MRR', icon: CreditCard },
      { num: 3, label: 'Settings', icon: Sliders },
      { num: 4, label: 'Owner Credentials', icon: KeyRound },
    ];

  const isLoading = isCreating || isUpdating;

  return (
    <div className="bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Stepper Progress Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/60 p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {stepsList.map((s, idx) => {
            const Icon = s.icon;
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isCurrent
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                      }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-xs font-semibold ${isCurrent ? 'text-zinc-100' : isDone ? 'text-zinc-400' : 'text-zinc-600'
                      }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-3 ${step > s.num ? 'bg-emerald-500/50' : 'bg-zinc-800'
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Body */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-2xl mx-auto">
        {/* Step 1: Basic Information & Logo Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-500" /> Basic Gym Details & Brand Logo
            </h3>
            <p className="text-sm text-zinc-400">
              {isEditing ? 'Update profile and branding for this gym branch.' : 'Provide identifying details and logo for the new gym account.'}
            </p>

            {/* Gym Logo Upload Component */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Gym Brand Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-750 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Gym Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-zinc-600" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold border border-zinc-700 transition cursor-pointer"
                    >
                      {isUploadingLogo ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" /> Select / Upload Logo
                        </>
                      )}
                    </button>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                        className="text-xs text-rose-400 hover:text-rose-300 p-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-md px-2.5 py-1 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Gym / Business Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Iron Man Gulberg Branch"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Branch Code (Unique) *
                </label>
                <input
                  type="text"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                  placeholder="e.g. GYM-002"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="ironman-gulberg"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@branchgym.com"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Physical Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address, City, Region"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Subscription & MRR */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" /> SaaS Subscription & Plan Tier
            </h3>
            <p className="text-sm text-zinc-400">
              Configure the SaaS license tier and recurring revenue billed for this gym account.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  SaaS Plan Tier
                </label>
                <select
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="starter">Starter (Single Desk / 250 Members)</option>
                  <option value="pro">Pro (Unlimited Desk / 1000 Members)</option>
                  <option value="enterprise">Enterprise (Multi-Floor / Unlimited)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="PKR">PKR (Pakistani Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="AED">AED (UAE Dirham)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Monthly Recurring Revenue (MRR)
                </label>
                <input
                  type="number"
                  name="mrrAmount"
                  value={formData.mrrAmount}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              {isEditing && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Account Status
                  </label>
                  <select
                    name="subscriptionStatus"
                    value={formData.subscriptionStatus}
                    onChange={handleChange}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="past_due">Past Due</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Gym Policies & Rules */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-red-500" /> Operational Rules & Settings
            </h3>
            <p className="text-sm text-zinc-400">
              Set default business logic for payment dues, grace period, and membership freezes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Grace Period (Days before alert)
                </label>
                <input
                  type="number"
                  name="gracePeriodDays"
                  value={formData.gracePeriodDays}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Freeze Fee (Default)
                </label>
                <input
                  type="number"
                  name="freezeFee"
                  value={formData.freezeFee}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="allowPartialPayments"
                  name="allowPartialPayments"
                  checked={formData.allowPartialPayments}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-zinc-900 border-zinc-700"
                />
                <label htmlFor="allowPartialPayments" className="text-sm text-zinc-300 font-medium">
                  Allow Partial Payments & Dues
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Owner Credentials Setup (Only for new creation) */}
        {step === 4 && !isEditing && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500" /> Primary Owner Account & Credentials
            </h3>
            <p className="text-sm text-zinc-400">
              Create the initial Gym Owner account. The owner will use these credentials to log into the main client portal.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Owner Full Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="e.g. Imran"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Owner Login Email *
                </label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  placeholder="owner@ironman.com"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Account Password *
                  </label>
                  <input
                    type="password"
                    name="ownerPassword"
                    value={formData.ownerPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Controls */}
        <div className="flex items-center justify-between pt-8 border-t border-zinc-800/80 mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-sm transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-sm"
            >
              Cancel
            </button>
          )}

          {step < (isEditing ? 3 : 4) ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-600/20 transition cursor-pointer"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {isEditing ? 'Saving...' : 'Provisioning Gym...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> {isEditing ? 'Save Changes' : 'Create & Provision Gym'}
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
