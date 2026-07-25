import LogoutButton from '@/components/logout-button';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import ThemeToggle from '@/components/theme-toggle';
import AdminSidebar from '@/components/admin-sidebar';
import {
  CheckCircle,
  Clock,
  DollarSign,
  IceCream,
  Layers,
  LogOut,
  MessageSquare,
  Package,
  Percent,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  FileText
} from 'lucide-react';

// Server Action to update order status dynamically
async function updateStatus(orderId: string, newStatus: string) {
  'use server';
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });
    revalidatePath('/admin');
    revalidatePath('/admin/orders');
  } catch (err) {
    console.error('Failed to update status:', err);
  }
}

async function getAdminData() {
  try {
    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' }
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.finalAmount), 0);

    const pendingOrdersCount = await prisma.order.count({
      where: { status: 'PENDING' }
    });

    const activeFranchiseCount = await prisma.franchise.count();

    const productCatalogCount = await prisma.product.count();

    // Calculate MOM revenue growth
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthPaidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: currentMonthStart }
      }
    });
    const currentMonthRevenue = currentMonthPaidOrders.reduce((sum, o) => sum + Number(o.finalAmount), 0);

    const lastMonthPaidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
      }
    });
    const lastMonthRevenue = lastMonthPaidOrders.reduce((sum, o) => sum + Number(o.finalAmount), 0);

    let growthPercentage = 0;
    if (lastMonthRevenue > 0) {
      growthPercentage = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      growthPercentage = 100;
    }

    const revenueGrowth = {
      text: growthPercentage >= 0 
        ? `+${growthPercentage.toFixed(1)}% vs last month` 
        : `${growthPercentage.toFixed(1)}% vs last month`,
      isPositive: growthPercentage >= 0
    };

    const franchisesData = await prisma.franchise.findMany({
      take: 5,
      include: { user: true }
    });

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        franchise: true,
        invoice: true,
        proformaInvoice: true,
        orderItems: {
          include: { product: true }
        }
      }
    });

    const categoriesCount = {
      ICE_CREAM: await prisma.product.count({ where: { category: 'ICE_CREAM' } }),
      MILKSHAKE: await prisma.product.count({ where: { category: 'MILKSHAKE' } }),
      EXOTIC_CUP: await prisma.product.count({ where: { category: 'EXOTIC_CUP' } }),
    };

    return {
      totalRevenue,
      revenueGrowth,
      pendingOrdersCount,
      activeFranchiseCount,
      productCatalogCount,
      orders,
      franchises: franchisesData,
      categoriesCount
    };
  } catch (error) {
    console.error('Database connection failed. Using fallback data.', error);
    return {
      totalRevenue: 0,
      revenueGrowth: { text: 'Lifetime settled payouts', isPositive: true },
      pendingOrdersCount: 0,
      activeFranchiseCount: 0,
      productCatalogCount: 0,
      orders: [],
      franchises: [],
      categoriesCount: { ICE_CREAM: 0, MILKSHAKE: 0, EXOTIC_CUP: 0 }
    };
  }
}

export default async function AdminDashboard() {
  const session = await auth();

  // Guard routing
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/portal');
  }

  const {
    totalRevenue,
    revenueGrowth,
    pendingOrdersCount,
    activeFranchiseCount,
    productCatalogCount,
    orders,
    franchises,
    categoriesCount
  } = await getAdminData();

  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans">
      <AdminSidebar user={session.user} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-card">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
              Operations Control Panel
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-subtle" />
            </h1>
            <p className="text-xs text-muted-foreground">HQ Headquarters management console.</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/admin/products/new" 
              className="px-5 py-2.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer border-0"
            >
              Add New Flavor
            </Link>
          </div>
        </header>

        <div className="p-8 space-y-7 w-full max-w-[1600px] mx-auto">
          {/* Statistics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Settled Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400">
                  <DollarSign size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-mono text-foreground">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {revenueGrowth.isPositive ? (
                    <TrendingUp size={14} className="text-green-600" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                  {revenueGrowth.text}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Franchise Outlets</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Users size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{activeFranchiseCount} Stores</h3>
                <p className="text-xs text-muted-foreground mt-1">100% active state</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Catalog Products</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <IceCream size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{productCatalogCount} Items</h3>
                <p className="text-xs text-muted-foreground mt-1">Available in ordering catalog</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Dispatches</span>
                <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{pendingOrdersCount} Requests</h3>
                <p className="text-xs text-muted-foreground mt-1">Awaiting HQ packaging approval</p>
              </div>
            </div>
          </div>

          {/* Category Distribution & Quick Status Row */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">Menu Category Spread</h3>
                <p className="text-xs text-muted-foreground">Product catalog division and inventory representation.</p>
              </div>
              <Link href="/admin/products" className="text-xs font-bold text-brand-crimson hover:underline">
                Manage Catalog
              </Link>
            </div>

            {/* Custom Bar Chart */}
            <div className="grid md:grid-cols-3 gap-5 py-1">
              {[
                { label: 'Ice Creams', count: categoriesCount.ICE_CREAM, color: 'bg-brand-crimson' },
                { label: 'Milkshakes', count: categoriesCount.MILKSHAKE, color: 'bg-brand-maroon' },
                { label: 'Exotic Cups', count: categoriesCount.EXOTIC_CUP, color: 'bg-[#FF8A9F]' }
              ].map((item, idx) => {
                const total = categoriesCount.ICE_CREAM + categoriesCount.MILKSHAKE + categoriesCount.EXOTIC_CUP || 1;
                const percent = (item.count / total) * 100;
                return (
                  <div key={idx} className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs font-bold text-foreground">
                      <span>{item.label}</span>
                      <span className="font-mono text-xs">{item.count} items ({percent.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Table Layouts */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Real-time Order Action Queue */}
            <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
              <div className="pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Wholesale Order Operations</h3>
                <p className="text-xs text-muted-foreground">Process, accept, package, and dispatch orders from the outlets.</p>
              </div>

              {orders.length === 0 ? (
                <div className="py-14 text-center space-y-2 border border-dashed border-border rounded-xl bg-muted/10">
                  <ShoppingBag size={36} className="text-muted-foreground mx-auto opacity-30" />
                  <p className="text-sm font-semibold text-muted-foreground">Order queue is empty</p>
                  <p className="text-xs text-muted-foreground">Pending orders from partner stores will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="pb-2.5 pt-1 w-28">Order ID</th>
                        <th className="pb-2.5 pt-1 w-36">Store Outlet</th>
                        <th className="pb-2.5 pt-1 w-20 text-right">Items</th>
                        <th className="pb-2.5 pt-1 w-28 text-right">Total Price</th>
                        <th className="pb-2.5 pt-1 w-28 text-center">Status</th>
                        <th className="pb-2.5 pt-1 w-32 text-center">Tax Invoice</th>
                        <th className="pb-2.5 pt-1 text-center">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 font-bold font-mono text-xs text-foreground">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="py-2.5">
                            <span className="font-bold text-foreground block truncate max-w-[140px]">{order.franchise.storeName}</span>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">{order.franchise.gstNumber}</span>
                          </td>
                          <td className="py-2.5 text-right font-semibold text-muted-foreground font-mono">
                            {order.orderItems.reduce((acc, it) => acc + it.quantity, 0)} units
                          </td>
                          <td className="py-2.5 text-right font-extrabold text-foreground font-mono">
                            ₹{Number(order.finalAmount).toFixed(2)}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            {order.invoice ? (
                              <Link
                                href={`/portal/orders/${order.id}/invoice`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-pink/60 hover:bg-brand-pink text-brand-crimson font-bold rounded-lg text-[10px] transition-colors border border-brand-pink/80"
                                title="View & Download Tax Invoice"
                              >
                                <FileText size={11} />
                                <span className="font-mono">{order.invoice.invoiceNumber}</span>
                              </Link>
                            ) : order.proformaInvoice ? (
                              <Link
                                href={`/portal/proforma-invoices/${order.proformaInvoice.id}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold rounded-lg text-[10px] transition-colors"
                                title="View Proforma Invoice"
                              >
                                <FileText size={11} />
                                <span className="font-mono">{order.proformaInvoice.proformaNumber}</span>
                              </Link>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">N/A</span>
                            )}
                          </td>
                          <td className="py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              {order.status === 'PENDING' && (
                                <form action={updateStatus.bind(null, order.id, 'CONFIRMED')}>
                                  <button type="submit" className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg text-[10px] cursor-pointer flex items-center gap-1">
                                    <CheckCircle size={10} />
                                    Confirm
                                  </button>
                                </form>
                              )}
                              {order.status === 'CONFIRMED' && (
                                <form action={updateStatus.bind(null, order.id, 'PACKED')}>
                                  <button type="submit" className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-[10px] cursor-pointer flex items-center gap-1">
                                    <Package size={10} />
                                    Pack
                                  </button>
                                </form>
                              )}
                              {order.status === 'PACKED' && (
                                <form action={updateStatus.bind(null, order.id, 'DISPATCHED')}>
                                  <button type="submit" className="px-2.5 py-1 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-lg text-[10px] cursor-pointer flex items-center gap-1">
                                    <Truck size={10} />
                                    Dispatch
                                  </button>
                                </form>
                              )}
                              {order.status === 'DISPATCHED' && (
                                <form action={updateStatus.bind(null, order.id, 'DELIVERED')}>
                                  <button type="submit" className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[10px] cursor-pointer flex items-center gap-1">
                                    <CheckCircle size={10} />
                                    Deliver
                                  </button>
                                </form>
                              )}
                              {order.status === 'DELIVERED' && (
                                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-0.5">
                                  <CheckCircle size={10} className="text-green-600" /> Finished
                                </span>
                              )}
                              {order.status === 'CANCELLED' && (
                                <span className="text-[10px] text-red-500 font-semibold">Cancelled</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Registered Franchise Outlets Directory */}
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-bold text-foreground">Registered Franchise Outlets</h3>
                  <p className="text-xs text-muted-foreground">Active partner stores registered on portal.</p>
                </div>
                <Link href="/admin/franchises" className="text-xs font-bold text-brand-crimson hover:underline">
                  View All
                </Link>
              </div>

              {franchises.length === 0 ? (
                <div className="py-8 text-center space-y-1">
                  <UserCheck size={28} className="text-muted-foreground mx-auto opacity-30" />
                  <p className="text-xs font-semibold text-muted-foreground">No franchise outlets registered</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {franchises.map((f) => {
                    return (
                      <div key={f.id} className="flex justify-between items-center border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-foreground truncate">{f.storeName}</h4>
                          <p className="text-[10px] text-muted-foreground truncate">{f.user.name} • {f.contactNumber}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
