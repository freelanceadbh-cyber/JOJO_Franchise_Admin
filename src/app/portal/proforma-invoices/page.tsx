import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  IceCream, 
  CreditCard, 
  ShoppingBag, 
  History, 
  MessageSquare, 
  LogOut, 
  ArrowLeft,
  FileText,
  Printer,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';

async function getProformaInvoices(userId: string) {
  // Find mapped franchise profile first
  const franchise = await prisma.franchise.findUnique({
    where: { userId }
  });

  if (!franchise) return { franchise: null, proformas: [] };

  const proformas = await prisma.proformaInvoice.findMany({
    where: {
      order: {
        franchiseId: franchise.id
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  return { franchise, proformas };
}

export default async function ProformaInvoicesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { franchise, proformas } = await getProformaInvoices(session.user.id);
  if (!franchise) {
    redirect('/portal');
  }

  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans">
      
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
            <IceCream size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold tracking-tight text-md uppercase text-foreground">
            JoJo <span className="text-brand-crimson">Portal</span>
          </span>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          <Link href="/portal" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <CreditCard size={18} />
            Dashboard
          </Link>
          <Link href="/portal/catalog" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <ShoppingBag size={18} />
            Order Catalog
          </Link>
          <Link href="/portal/orders" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <History size={18} />
            Order History
          </Link>
          <Link href="/portal/proforma-invoices" className="flex items-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
            <FileText size={18} />
            Proforma Invoices
          </Link>
          <Link href="/portal/messages" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <MessageSquare size={18} />
            HQ Messages
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-3 bg-muted/40 rounded-2xl border border-border/50 flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-crimson text-white flex items-center justify-center text-xs font-bold shadow-inner">
              {session.user.name?.[0] || 'F'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{session.user.name}</p>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Franchise</span>
            </div>
          </div>
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/auth/signin' });
          }}>
            <button type="submit" className="w-full py-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
              <LogOut size={16} />
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-6 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <Link href="/portal" className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground lg:hidden">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">Proforma Invoices</h1>
              <p className="text-xs text-muted-foreground">Draft order payments requests and quotations.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/60">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <FileText size={16} className="text-brand-crimson" />
                Store Proforma Invoices & Quotations
              </h2>
            </div>

            {proformas.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <FileText size={48} className="text-muted-foreground mx-auto opacity-35" />
                <h3 className="text-md font-bold text-foreground">No proforma invoices found</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  You haven&apos;t generated any proforma invoices yet. Navigate to the catalog to place an order.
                </p>
                <Link 
                  href="/portal/catalog"
                  className="inline-block px-5 py-2.5 bg-brand-crimson text-white font-bold rounded-xl text-xs shadow-md shadow-brand-crimson/15 hover:scale-[1.01] transition-transform"
                >
                  Browse Menu Catalog
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border/60 text-xs font-bold text-muted-foreground pb-3">
                      <th className="pb-3 w-36">Proforma No.</th>
                      <th className="pb-3 w-32">Date Generated</th>
                      <th className="pb-3 w-32 text-right">Items</th>
                      <th className="pb-3 w-32 text-right">Grand Total</th>
                      <th className="pb-3 w-28 text-center">Status</th>
                      <th className="pb-3 text-center w-60">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {proformas.map((pi) => {
                      const qty = pi.order.orderItems.reduce((sum, it) => sum + it.quantity, 0);
                      const isPending = pi.status === 'PENDING_PAYMENT';
                      
                      return (
                        <tr key={pi.id} className="hover:bg-muted/5 transition-colors">
                          <td className="py-4 font-bold font-mono text-xs text-foreground">
                            {pi.proformaNumber}
                          </td>
                          <td className="py-4 text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Calendar size={12} />
                            {new Date(pi.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-4 text-right font-semibold text-muted-foreground">
                            {qty} units
                          </td>
                          <td className="py-4 text-right font-extrabold text-foreground">
                            ₹{Number(pi.order.finalAmount).toFixed(2)}
                          </td>
                          <td className="py-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase ${
                              pi.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' :
                              pi.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                              pi.status === 'EXPIRED' ? 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400'
                            }`}>
                              {pi.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-3">
                              <Link 
                                href={`/portal/proforma-invoices/${pi.id}`}
                                className="px-2.5 py-1 bg-secondary text-secondary-foreground hover:text-brand-crimson font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye size={10} />
                                View
                              </Link>
                              
                              <Link 
                                href={`/portal/proforma-invoices/${pi.id}?print=true`}
                                className="px-2.5 py-1 bg-brand-pink/50 hover:bg-brand-pink/80 text-brand-crimson font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Printer size={10} />
                                PDF
                              </Link>
                              
                              {isPending && (
                                <Link 
                                  href={`/portal/checkout?orderId=${pi.orderId}`}
                                  className="px-2.5 py-1 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <DollarSign size={10} />
                                  Pay Now
                                </Link>
                              )}
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
