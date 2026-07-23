import React from 'react';
import LogoutButton from '@/components/logout-button';
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
  Truck,
  Eye,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

async function getFranchiseOrders(userId: string) {
  // Find mapped franchise profile first
  const franchise = await prisma.franchise.findUnique({
    where: { userId }
  });

  if (!franchise) return { franchise: null, orders: [] };

  const orders = await prisma.order.findMany({
    where: { franchiseId: franchise.id },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: { product: true }
      }
    }
  });

  return { franchise, orders };
}

export default async function OrderHistoryPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { franchise, orders } = await getFranchiseOrders(session.user.id);
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
          <Link href="/portal/orders" className="flex items-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
            <History size={18} />
            Order History
          </Link>
          <Link href="/portal/proforma-invoices" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
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
          <LogoutButton />
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
              <h1 className="text-lg font-bold text-foreground">Shipment Logs</h1>
              <p className="text-xs text-muted-foreground">Historical order fulfillment tracking list.</p>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/60">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <History size={16} className="text-brand-crimson" />
                Store Invoices & Status Timeline
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag size={48} className="text-muted-foreground mx-auto opacity-35" />
                <h3 className="text-md font-bold text-foreground">No orders tracked yet</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  You haven&apos;t placed any wholesale replenishment orders yet. Navigate to the catalog to get started.
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
                      <th className="pb-3 w-32">Order ID</th>
                      <th className="pb-3 w-32">Date Placed</th>
                      <th className="pb-3 w-28 text-right">Items Quantity</th>
                      <th className="pb-3 w-32 text-right">Fulfillment Total</th>
                      <th className="pb-3 w-28 text-center">Fulfillment</th>
                      <th className="pb-3 text-center w-52">Operational Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {orders.map((order) => {
                      const qty = order.orderItems.reduce((sum, it) => sum + it.quantity, 0);
                      return (
                        <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                          <td className="py-4 font-bold font-mono text-xs text-foreground">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="py-4 text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Calendar size={12} />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-4 text-right font-semibold text-muted-foreground">
                            {qty} tubs / units
                          </td>
                          <td className="py-4 text-right font-extrabold text-foreground">
                            ₹{Number(order.finalAmount).toFixed(2)}
                          </td>
                          <td className="py-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-3">
                              <Link 
                                href={`/portal/orders/${order.id}`}
                                className="px-2.5 py-1 bg-secondary text-secondary-foreground hover:text-brand-crimson font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Truck size={10} />
                                Track Order
                              </Link>
                              {order.paymentStatus === 'PAID' ? (
                                <Link 
                                  href={`/portal/orders/${order.id}/invoice`}
                                  className="px-2.5 py-1 bg-brand-pink/50 hover:bg-brand-pink/80 text-brand-crimson font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <FileText size={10} />
                                  Tax Invoice
                                </Link>
                              ) : (
                                <span className="text-[10px] text-muted-foreground font-semibold">Unpaid</span>
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
