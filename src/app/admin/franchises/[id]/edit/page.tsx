import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { updateFranchise } from '../../actions';
import { Users, ArrowLeft, Save, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface EditFranchisePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFranchisePage({ params }: EditFranchisePageProps) {
  const session = await auth();

  // Guard routing
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/portal');
  }

  const { id } = await params;

  // Fetch franchise details
  const franchise = await prisma.franchise.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!franchise) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md p-8 bg-card border border-border rounded-3xl text-center space-y-4 shadow-lg">
          <ShieldAlert size={48} className="text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Franchise Not Found</h1>
          <p className="text-sm text-muted-foreground">
            We could not find the franchise record you are attempting to edit. It may have been deleted.
          </p>
          <Link href="/admin/franchises" className="inline-block px-5 py-2.5 bg-brand-crimson text-white font-bold rounded-xl text-xs">
            Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  // Handle Form Submission
  async function submitAction(formData: FormData) {
    'use server';
    const storeName = formData.get('storeName') as string;
    const gstNumber = formData.get('gstNumber') as string;
    const address = formData.get('address') as string;
    const contactNumber = formData.get('contactNumber') as string;
    const status = formData.get('status') as string;

    await updateFranchise(id, {
      storeName,
      gstNumber,
      address,
      contactNumber,
      status
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
            <h2 className="text-md font-bold text-foreground">Edit Franchise: {franchise.storeName}</h2>
            <p className="text-xs text-muted-foreground">Adjust limits, outstanding dues, addresses, and status parameters.</p>
          </div>

          <form action={submitAction} className="space-y-5 text-xs">
            <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-1">1. Store Owner Setup</div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Owner Full Name</label>
                <input
                  type="text"
                  disabled
                  value={franchise.user.name}
                  className="w-full p-3 bg-muted border border-border rounded-xl text-xs text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Business Email</label>
                <input
                  type="email"
                  disabled
                  value={franchise.user.email}
                  className="w-full p-3 bg-muted border border-border rounded-xl text-xs text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-border pb-1 mt-6">2. Store Logistics & Billing</div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Store Outlet Name</label>
                <input
                  type="text"
                  required
                  name="storeName"
                  defaultValue={franchise.storeName}
                  placeholder="e.g. JoJo - Chennai EA Mall"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">GSTIN Number</label>
                <input
                  type="text"
                  required
                  name="gstNumber"
                  defaultValue={franchise.gstNumber}
                  placeholder="e.g. 33AABCJ1234F1Z5"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Contact Phone</label>
                <input
                  type="text"
                  required
                  name="contactNumber"
                  defaultValue={franchise.contactNumber}
                  placeholder="e.g. +91 9876543210"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Outlet Status</label>
                <select
                  required
                  name="status"
                  defaultValue={franchise.user.status}
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson text-xs transition-all"
                >
                  <option value="ACTIVE">Active (Allow Orders & Portal Access)</option>
                  <option value="INACTIVE">Suspended (Lock Account Access)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Compliant Delivery Address</label>
              <textarea
                required
                name="address"
                defaultValue={franchise.address}
                rows={3}
                placeholder="Detail physical store delivery address."
                className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs resize-none transition-all"
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border-0 shadow-md shadow-brand-crimson/15"
              >
                <Save size={12} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
