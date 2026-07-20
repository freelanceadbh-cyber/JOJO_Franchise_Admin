import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  IceCream, 
  Layers, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck,
  UserCheck,
  CreditCard,
  Percent
} from 'lucide-react';
import Link from 'next/link';
import { deleteFranchise } from './actions';

export default async function AdminFranchisesPage() {
  const session = await auth();

  // Guard routing
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/portal');
  }

  // Fetch all franchises
  const franchises = await prisma.franchise.findMany({
    include: {
      user: true
    },
    orderBy: { storeName: 'asc' }
  });

  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
            <IceCream size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold tracking-tight text-md uppercase text-foreground">
            JoJo <span className="text-brand-crimson">HQ</span>
          </span>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <Layers size={18} />
            Operations Room
          </Link>
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Catalog Management</div>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <IceCream size={18} />
            Ice Cream Flavors
          </Link>
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Store Logistics</div>
          <Link href="/admin/franchises" className="flex items-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
            <Users size={18} />
            Franchise Registry
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <ShoppingBag size={18} />
            Full Order Queue
          </Link>
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">HQ Operations</div>
          <Link href="/admin/messages" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <MessageSquare size={18} />
            Store Support
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-3 bg-muted/40 rounded-2xl border border-border/50 flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-crimson text-white flex items-center justify-center text-xs font-bold shadow-inner">
              {session.user.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{session.user.name}</p>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">HQ Admin</span>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST" className="w-full">
            <button 
              type="submit"
              className="w-full py-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 bg-transparent"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-6 flex items-center justify-between bg-card flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Franchise Outlet Accounts</h1>
            <p className="text-xs text-muted-foreground">Manage active partners, GST details, and lines of credit.</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/admin/franchises/new" 
              className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-transform cursor-pointer shadow-md shadow-brand-crimson/15"
            >
              <Plus size={14} className="stroke-[2.5]" />
              Register Store
            </Link>
          </div>
        </header>

        {/* Franchise Registry table */}
        <div className="p-6 max-w-7xl w-full mx-auto">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/60">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Users size={16} className="text-brand-crimson" />
                Branch Directory
              </h2>
            </div>

            {franchises.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <Users size={48} className="text-muted-foreground mx-auto opacity-35" />
                <p className="text-sm font-bold text-muted-foreground">No stores registered yet</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Click the &ldquo;Register Store&rdquo; button above to map your first partner outlet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border/60 text-xs font-bold text-muted-foreground pb-3">
                      <th className="pb-3">Franchise Store</th>
                      <th className="pb-3 w-32">GST Registry</th>
                      <th className="pb-3 w-36">Owner Contacts</th>
                      <th className="pb-3 w-40 text-right">Credit Allocation</th>
                      <th className="pb-3 w-36 text-right">Outstanding Bal</th>
                      <th className="pb-3 w-28 text-center">Account</th>
                      <th className="pb-3 text-center w-32">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {franchises.map((f) => {
                      const limit = Number(f.creditLimit);
                      const balance = Number(f.outstandingBalance);
                      const usage = Math.min((balance / (limit || 1)) * 100, 100);
                      return (
                        <tr key={f.id} className="hover:bg-muted/5 transition-colors">
                          <td className="py-4">
                            <span className="font-bold text-foreground block">{f.storeName}</span>
                            <span className="text-[10px] text-muted-foreground block truncate max-w-xs mt-0.5">{f.address}</span>
                          </td>
                          <td className="py-4 font-mono text-xs text-foreground font-semibold">
                            {f.gstNumber}
                          </td>
                          <td className="py-4 text-xs text-foreground">
                            <span className="font-bold block">{f.user.name}</span>
                            <span className="text-[10px] text-muted-foreground block">{f.contactNumber}</span>
                          </td>
                          <td className="py-4 text-right font-extrabold text-foreground font-mono">
                            ₹{limit.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 text-right font-mono font-bold">
                            <span className={balance > limit ? 'text-red-500 font-extrabold' : 'text-foreground'}>
                              ₹{balance.toLocaleString('en-IN')}
                            </span>
                            <div className="w-24 ml-auto mt-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  usage > 85 ? 'bg-red-500' : usage > 50 ? 'bg-yellow-500' : 'bg-brand-crimson'
                                }`}
                                style={{ width: `${usage}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                              f.user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            }`}>
                              {f.user.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link 
                                href={`/admin/franchises/${f.id}/edit`}
                                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-brand-crimson transition-colors"
                              >
                                <Edit3 size={14} />
                              </Link>
                              <form action={deleteFranchise.bind(null, f.id)}>
                                <button 
                                  type="submit" 
                                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-muted-foreground hover:text-red-600 transition-colors cursor-pointer border-0 bg-transparent"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
