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
import PortalHeaderActions from '@/components/portal-header-actions';
import PortalSidebar from '@/components/portal-sidebar';
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

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans">
      <PortalSidebar user={session.user} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
          <div className="flex items-center gap-2.5">
            <Link href="/portal" className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground lg:hidden">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-md font-bold text-foreground tracking-tight">Shipment Logs</h1>
              <p className="text-[11px] text-muted-foreground">Historical order fulfillment tracking list.</p>
            </div>
          </div>
          <PortalHeaderActions
            user={session.user}
            franchise={franchise}
            notifications={notifications}
          />
        </header>

        <div className="p-6 space-y-5 max-w-7xl w-full mx-auto">
          <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-4">
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
                <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="pb-2.5 pt-1 w-32">Order ID</th>
                      <th className="pb-2.5 pt-1 w-32">Date Placed</th>
                      <th className="pb-2.5 pt-1 w-28 text-right">Items Quantity</th>
                      <th className="pb-2.5 pt-1 w-32 text-right">Fulfillment Total</th>
                      <th className="pb-2.5 pt-1 w-28 text-center">Fulfillment</th>
                      <th className="pb-2.5 pt-1 text-center w-52">Operational Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {orders.map((order) => {
                      const qty = order.orderItems.reduce((sum, it) => sum + it.quantity, 0);
                      return (
                        <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 font-bold font-mono text-xs text-foreground">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="py-2.5 text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                            <Calendar size={12} />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-2.5 text-right font-bold text-muted-foreground font-mono">
                            {qty} units
                          </td>
                          <td className="py-2.5 text-right font-extrabold text-foreground font-mono">
                            ₹{Number(order.finalAmount).toFixed(2)}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <div className="flex items-center justify-center gap-2">
                              <Link 
                                href={`/portal/orders/${order.id}`}
                                className="px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
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
                                <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold">Unpaid</span>
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
