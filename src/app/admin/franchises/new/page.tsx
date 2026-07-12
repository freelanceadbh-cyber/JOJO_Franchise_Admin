import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { createFranchise } from '../actions';
import { Users, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default async function NewFranchisePage() {
  const session = await auth();

  // Guard routing
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/portal');
  }

  // Handle Form Submission via Server Action
  async function submitAction(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const passwordRaw = formData.get('passwordRaw') as string;
    const storeName = formData.get('storeName') as string;
    const gstNumber = formData.get('gstNumber') as string;
    const address = formData.get('address') as string;
    const contactNumber = formData.get('contactNumber') as string;
    const creditLimit = parseFloat(formData.get('creditLimit') as string);

    await createFranchise({
      name,
      email,
      passwordRaw,
      storeName,
      gstNumber,
      address,
      contactNumber,
      creditLimit
    });

    redirect('/admin/franchises');
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0E0709] font-sans pb-16">
      
      {/* Header bar */}
      <header className="h-20 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-40">
        <Link 
          href="/admin/franchises"
          className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-brand-crimson transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Registry
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
            <Users size={16} />
          </div>
          <span className="font-extrabold text-sm uppercase text-foreground">
            HQ Franchise Registry
          </span>
        </div>
        <div className="w-16" />
      </header>

      {/* Form Container */}
      <div className="p-6 max-w-2xl mx-auto mt-6">
        <div className="p-8 rounded-[32px] border border-border bg-card shadow-sm space-y-6">
          <div>
            <h2 className="text-md font-bold text-foreground">Register New Franchise Store</h2>
            <p className="text-xs text-muted-foreground">Map billing details, corporate entities, and credit parameters.</p>
          </div>

          <form action={submitAction} className="space-y-5 text-xs">
            <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-1">1. User Profile Setup</div>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Owner Full Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="e.g. Nandha Kumar"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Business Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="e.g. store1@jojo.com"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Temporary Password</label>
                <input
                  type="password"
                  required
                  name="passwordRaw"
                  placeholder="••••••••"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>
            </div>

            <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-1 mt-6">2. Store Logistics & Credit</div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Store Outlet Name</label>
                <input
                  type="text"
                  required
                  name="storeName"
                  placeholder="e.g. JoJo - Chennai EA Mall"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">GST Number (GSTIN)</label>
                <input
                  type="text"
                  required
                  name="gstNumber"
                  placeholder="e.g. 33AABCJ1234F1Z5"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  name="contactNumber"
                  placeholder="e.g. +91 9876543210"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Allocated Credit Limit (INR)</label>
                <input
                  type="number"
                  required
                  name="creditLimit"
                  placeholder="e.g. 150000.00"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Compliant Delivery Address</label>
              <textarea
                required
                name="address"
                rows={3}
                placeholder="Detail the physical store address where cold chain delivery vans will unload stock."
                className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs resize-none transition-all"
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border-0 shadow-md shadow-brand-crimson/15"
              >
                <Save size={12} />
                Register Outlet
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
