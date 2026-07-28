import React from 'react';
import LogoutButton from '@/components/logout-button';
import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { 
  IceCream, 
  Layers, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  LogOut, 
  CheckCircle,
  Truck,
  Package,
  XCircle,
  DollarSign,
  History,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin-sidebar';

// Server Action to update order status dynamically
async function updateStatus(orderId: string, newStatus: string) {
  'use server';
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    if (newStatus === 'DELIVERED') {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID' }
      });
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
}

// Server Action to cancel an order
async function cancelOrder(orderId: string) {
  'use server';
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });

    if (!order) return;

    await prisma.$transaction(async (tx) => {
      // 1. Mark status as cancelled
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' }
      });

      // 2. Re-credit stock levels
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
  } catch (error) {
    console.error('Failed to cancel order:', error);
  }
}

export default async function AdminOrdersPage() {
  const session = await auth();

  // Guard routing
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/portal');
  }

  // Fetch all orders
  const orders = await prisma.order.findMany({
    include: {
      franchise: true,
      payments: true,
      orderItems: true,
      invoice: true,
      proformaInvoice: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans">
      <AdminSidebar user={session.user} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-card flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Logistics Order Queue</h1>
            <p className="text-xs text-muted-foreground">Monitor branch replenishments and verify merchant gateway settlements.</p>
          </div>
        </header>

        {/* Orders Queue table */}
        <div className="p-6 w-full max-w-6xl mx-auto space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border/80">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
                <History size={17} className="text-brand-crimson" />
                Network Order Registry
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-muted/60 text-muted-foreground">{orders.length} Total</span>
            </div>
          </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <ShoppingBag size={40} className="text-muted-foreground mx-auto opacity-35" />
                <p className="text-sm font-semibold text-muted-foreground">Order ledger is empty</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Replenishment requests from franchise stores will appear in this queue.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="pb-3 pt-1 w-28">Order ID</th>
                      <th className="pb-3 pt-1 w-44">Franchise Store</th>
                      <th className="pb-3 pt-1 w-28">Date Placed</th>
                      <th className="pb-3 pt-1 w-20 text-right">Items</th>
                      <th className="pb-3 pt-1 w-28 text-right">Invoice Total</th>
                      <th className="pb-3 pt-1 w-28 text-center">Fulfillment</th>
                      <th className="pb-3 pt-1 w-40 text-center">Gateway Payment ID</th>
                      <th className="pb-3 pt-1 w-36 text-center">Tax Invoice</th>
                      <th className="pb-3 pt-1 text-center">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {orders.map((order) => {
                      const qty = order.orderItems.reduce((sum, it) => sum + it.quantity, 0);
                      const payment = order.payments[0];
                      return (
                        <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 font-bold font-mono text-sm text-foreground">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="py-2.5">
                            <span className="font-bold text-foreground block truncate max-w-[170px]">{order.franchise.storeName}</span>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">{order.franchise.gstNumber}</span>
                          </td>
                          <td className="py-2.5 text-xs text-muted-foreground font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-2.5 text-right font-bold text-muted-foreground font-mono">
                            {qty} units
                          </td>
                          <td className="py-2.5 text-right font-extrabold text-brand-crimson font-mono">
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
                          <td className="py-4 text-center font-mono text-xs text-foreground">
                            {payment ? (
                              <span className="text-green-600 font-bold block">{payment.paymentId}</span>
                            ) : (
                              <span className="text-yellow-600 font-bold block">PENDING</span>
                            )}
                          </td>
                          <td className="py-4 text-center">
                            {order.invoice ? (
                              <Link
                                href={`/portal/orders/${order.id}/invoice`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-pink/60 hover:bg-brand-pink text-brand-crimson font-bold rounded-xl text-[10px] transition-colors border border-brand-pink/80 shadow-2xs"
                                title="View & Print / Download Official Tax Invoice"
                              >
                                <FileText size={12} />
                                <span className="font-mono">{order.invoice.invoiceNumber}</span>
                              </Link>
                            ) : order.proformaInvoice ? (
                              <Link
                                href={`/portal/proforma-invoices/${order.proformaInvoice.id}`}
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold rounded-xl text-[10px] transition-colors"
                                title="View Proforma Invoice"
                              >
                                <FileText size={12} />
                                <span className="font-mono">{order.proformaInvoice.proformaNumber}</span>
                              </Link>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">N/A</span>
                            )}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {order.status === 'PENDING' && (
                                <form action={updateStatus.bind(null, order.id, 'CONFIRMED')}>
                                  <button type="submit" className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg text-[9px] cursor-pointer border-0">
                                    Confirm
                                  </button>
                                </form>
                              )}
                              {order.status === 'CONFIRMED' && (
                                <form action={updateStatus.bind(null, order.id, 'PACKED')}>
                                  <button type="submit" className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-[9px] cursor-pointer border-0">
                                    Pack
                                  </button>
                                </form>
                              )}
                              {order.status === 'PACKED' && (
                                <form action={updateStatus.bind(null, order.id, 'DISPATCHED')}>
                                  <button type="submit" className="px-2 py-1 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-lg text-[9px] cursor-pointer border-0">
                                    Dispatch
                                  </button>
                                </form>
                              )}
                              {order.status === 'DISPATCHED' && (
                                <form action={updateStatus.bind(null, order.id, 'DELIVERED')}>
                                  <button type="submit" className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[9px] cursor-pointer border-0">
                                    Deliver
                                  </button>
                                </form>
                              )}
                              
                              {/* Option to cancel active orders */}
                              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                <form action={cancelOrder.bind(null, order.id)}>
                                  <button type="submit" className="px-2 py-1 bg-muted hover:bg-red-50 hover:text-red-600 text-muted-foreground font-bold rounded-lg text-[9px] cursor-pointer border-0 transition-colors">
                                    Cancel
                                  </button>
                                </form>
                              )}

                              {order.status === 'DELIVERED' && (
                                <span className="text-[9px] text-muted-foreground font-semibold flex items-center gap-0.5">
                                  <CheckCircle size={10} className="text-green-600" /> Complete
                                </span>
                              )}
                              {order.status === 'CANCELLED' && (
                                <span className="text-[9px] text-red-500 font-semibold">Cancelled</span>
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
      </main>
    </div>
  );
}
