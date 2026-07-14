import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import ThemeToggle from '@/components/theme-toggle';
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
  TrendingUp,
  Truck,
  UserCheck,
  Users,
} from 'lucide-react';

// Server Action to update order status dynamically
async function updateStatus(orderId: string, newStatus: string) {
  'use server';
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    // If order is delivered, outstanding balance is updated or payment status changes
    if (newStatus === 'DELIVERED') {
      // For demo purposes, mark payment status as PAID if it's delivered
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID' }
      });
    }

    revalidatePath('/admin');
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
}

// Server Action to adjust outstanding balance of a franchise
async function clearFranchiseBalance(franchiseId: string) {
  'use server';
  try {
    await prisma.franchise.update({
      where: { id: franchiseId },
      data: { outstandingBalance: 0 }
    });
    revalidatePath('/admin');
  } catch (error) {
    console.error('Failed to clear franchise balance:', error);
  }
}

async function getAdminData() {
  // 1. Core Financial and Numerical Stats
  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    select: { finalAmount: true }
  });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.finalAmount), 0);

  const pendingOrdersCount = await prisma.order.count({
    where: { status: 'PENDING' }
  });

  const activeFranchiseCount = await prisma.franchise.count();

  const franchisesData = await prisma.franchise.findMany({
    include: { user: true }
  });
  const totalOutstanding = franchisesData.reduce((sum, f) => sum + Number(f.outstandingBalance), 0);

  // 2. Orders Queue
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      franchise: true,
      orderItems: {
        include: { product: true }
      }
    }
  });

  // 3. Simple static analysis for custom SVG charts
  // Mock monthly sales trend (normally aggregated from DB orders grouped by date)
  const monthlySales = [
    { month: 'Jan', sales: 45000 },
    { month: 'Feb', sales: 58000 },
    { month: 'Mar', sales: 62000 },
    { month: 'Apr', sales: 78000 },
    { month: 'May', sales: 95000 },
    { month: 'Jun', sales: 120000 },
  ];

  // Category counts
  const categoriesCount = {
    ICE_CREAM: await prisma.product.count({ where: { category: 'ICE_CREAM' } }),
    MILKSHAKE: await prisma.product.count({ where: { category: 'MILKSHAKE' } }),
    EXOTIC_CUP: await prisma.product.count({ where: { category: 'EXOTIC_CUP' } }),
  };

  return {
    totalRevenue,
    pendingOrdersCount,
    activeFranchiseCount,
    totalOutstanding,
    orders,
    franchises: franchisesData,
    monthlySales,
    categoriesCount
  };
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
    pendingOrdersCount,
    activeFranchiseCount,
    totalOutstanding,
    orders,
    franchises,
    monthlySales,
    categoriesCount
  } = await getAdminData();

  // Max value for SVG line chart scaling
  const maxSale = Math.max(...monthlySales.map(m => m.sales));

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
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
            <Layers size={18} />
            Operations Room
          </Link>
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Catalog Management</div>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <IceCream size={18} />
            Ice Cream Flavors
          </Link>
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Store Logistics</div>
          <Link href="/admin/franchises" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
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
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              Operations Control Panel
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-subtle" />
            </h1>
            <p className="text-xs text-muted-foreground">HQ Headquarters management console.</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/admin/products/new" 
              className="px-5 py-2.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-full text-xs shadow-md shadow-brand-crimson/15 transition-colors cursor-pointer"
            >
              Add New Flavor
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Statistics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4 hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Settled Revenue</span>
                <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <DollarSign size={18} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp size={12} className="text-green-600" />
                  +12.4% from last month
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4 hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Franchise Outlets</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Users size={18} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">{activeFranchiseCount} Stores</h3>
                <p className="text-xs text-muted-foreground mt-1">100% active state</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4 hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Outstanding Net Balance</span>
                <div className="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                  <Clock size={18} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">₹{totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-xs text-muted-foreground mt-1">Pending bank settlement</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4 hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Dispatches</span>
                <div className="w-9 h-9 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">{pendingOrdersCount} Requests</h3>
                <p className="text-xs text-muted-foreground mt-1">Awaiting HQ packaging approval</p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sales Trend Line Chart */}
            <div className="md:col-span-2 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Revenue Expansion Trend</h3>
                  <p className="text-[10px] text-muted-foreground">Historical B2B wholesale order volumes (INR)</p>
                </div>
                <span className="text-xs font-bold text-brand-crimson px-2.5 py-1 bg-brand-pink rounded-full">
                  Monthly Aggregates
                </span>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="w-full h-56 relative pt-4">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DC143C" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#DC143C" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#f1e5e7" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1e5e7" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#f1e5e7" strokeWidth="0.5" strokeDasharray="4" />

                  {/* SVG Area */}
                  <path
                    d={`
                      M 0 200
                      L 0 ${200 - (monthlySales[0].sales / maxSale) * 150}
                      L 100 ${200 - (monthlySales[1].sales / maxSale) * 150}
                      L 200 ${200 - (monthlySales[2].sales / maxSale) * 150}
                      L 300 ${200 - (monthlySales[3].sales / maxSale) * 150}
                      L 400 ${200 - (monthlySales[4].sales / maxSale) * 150}
                      L 500 ${200 - (monthlySales[5].sales / maxSale) * 150}
                      L 500 200 Z
                    `}
                    fill="url(#chartGradient)"
                  />

                  {/* SVG Line */}
                  <path
                    d={`
                      M 0 ${200 - (monthlySales[0].sales / maxSale) * 150}
                      L 100 ${200 - (monthlySales[1].sales / maxSale) * 150}
                      L 200 ${200 - (monthlySales[2].sales / maxSale) * 150}
                      L 300 ${200 - (monthlySales[3].sales / maxSale) * 150}
                      L 400 ${200 - (monthlySales[4].sales / maxSale) * 150}
                      L 500 ${200 - (monthlySales[5].sales / maxSale) * 150}
                    `}
                    fill="none"
                    stroke="#DC143C"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* SVG Points */}
                  {monthlySales.map((m, idx) => (
                    <circle
                      key={idx}
                      cx={idx * 100}
                      cy={200 - (m.sales / maxSale) * 150}
                      r="5"
                      fill="#FFFFFF"
                      stroke="#DC143C"
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground pt-3 border-t border-border mt-2">
                  {monthlySales.map((m, idx) => (
                    <div key={idx} className="w-12 text-center">{m.month} (₹{(m.sales / 1000).toFixed(0)}k)</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Distribution Bar Chart */}
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Menu Category Spread</h3>
                <p className="text-[10px] text-muted-foreground">Product catalog division</p>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="space-y-4 py-2">
                {[
                  { label: 'Ice Creams', count: categoriesCount.ICE_CREAM, color: 'bg-brand-crimson' },
                  { label: 'Milkshakes', count: categoriesCount.MILKSHAKE, color: 'bg-brand-maroon' },
                  { label: 'Exotic Cups', count: categoriesCount.EXOTIC_CUP, color: 'bg-[#FF8A9F]' }
                ].map((item, idx) => {
                  const total = categoriesCount.ICE_CREAM + categoriesCount.MILKSHAKE + categoriesCount.EXOTIC_CUP || 1;
                  const percent = (item.count / total) * 100;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-foreground">
                        <span>{item.label}</span>
                        <span>{item.count} items ({percent.toFixed(0)}%)</span>
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

              <div className="p-4 bg-muted/40 rounded-2xl border border-border/50 text-[10px] text-muted-foreground flex items-center gap-2">
                <Percent size={14} className="text-brand-crimson flex-shrink-0" />
                <span>Adjust inventory categories and listings in the Product Catalog section.</span>
              </div>
            </div>
          </div>

          {/* Core Table Layouts */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Real-time Order Action Queue */}
            <div className="lg:col-span-2 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
              <div>
                <h3 className="text-md font-bold text-foreground">Wholesale Order Operations</h3>
                <p className="text-xs text-muted-foreground">Process, accept, package, and dispatch orders from the outlets.</p>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center space-y-2 border border-dashed border-border/80 rounded-2xl bg-muted/5">
                  <ShoppingBag size={40} className="text-muted-foreground mx-auto opacity-30" />
                  <p className="text-sm font-semibold text-muted-foreground">Order queue is empty</p>
                  <p className="text-xs text-muted-foreground/80">Pending orders from partner stores will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-border/60 text-xs font-bold text-muted-foreground">
                        <th className="pb-3 w-28">Order ID</th>
                        <th className="pb-3 w-36">Store Outlet</th>
                        <th className="pb-3 w-20 text-right">Items</th>
                        <th className="pb-3 w-28 text-right">Total Price</th>
                        <th className="pb-3 w-28 text-center">Status</th>
                        <th className="pb-3 text-center">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-muted/10 transition-colors">
                          <td className="py-3.5 font-bold font-mono text-xs text-foreground">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="py-3.5">
                            <span className="font-bold text-foreground block">{order.franchise.storeName}</span>
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">{order.franchise.gstNumber}</span>
                          </td>
                          <td className="py-3.5 text-right font-semibold text-muted-foreground">
                            {order.orderItems.reduce((acc, it) => acc + it.quantity, 0)} units
                          </td>
                          <td className="py-3.5 text-right font-extrabold text-foreground">
                            ₹{Number(order.finalAmount).toFixed(2)}
                          </td>
                          <td className="py-3.5 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                            }`}>
                              {order.status}
                            </span>
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

            {/* Franchise Outlet Balance Registry */}
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
              <div>
                <h3 className="text-md font-bold text-foreground">Franchise Credit Accounts</h3>
                <p className="text-xs text-muted-foreground">Manage limits, balances, and clear settlements.</p>
              </div>

              {franchises.length === 0 ? (
                <div className="py-8 text-center space-y-1">
                  <UserCheck size={28} className="text-muted-foreground mx-auto opacity-30" />
                  <p className="text-xs font-semibold text-muted-foreground">No franchises accounts registered</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {franchises.map((f) => {
                    const limitVal = Number(f.creditLimit) || 1;
                    const balanceVal = Number(f.outstandingBalance);
                    const usagePercent = Math.min((balanceVal / limitVal) * 100, 100);
                    return (
                      <div key={f.id} className="space-y-2.5 border-b border-border/40 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="text-xs font-extrabold text-foreground truncate">{f.storeName}</h4>
                            <p className="text-[10px] text-muted-foreground truncate">{f.user.name} • {f.contactNumber}</p>
                          </div>
                          
                          {balanceVal > 0 && (
                            <form action={clearFranchiseBalance.bind(null, f.id)}>
                              <button type="submit" className="px-2 py-1 bg-muted hover:bg-green-100 hover:text-green-700 font-bold rounded-lg text-[9px] cursor-pointer text-muted-foreground transition-colors">
                                Clear Balance
                              </button>
                            </form>
                          )}
                        </div>

                        {/* Credit Limit Usage Gauge */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground">Credit Line Limit: ₹{(limitVal / 1000).toFixed(0)}k</span>
                            <span className={balanceVal > limitVal ? 'text-red-500' : 'text-foreground'}>
                              Due: ₹{balanceVal.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                usagePercent > 80 ? 'bg-red-500' :
                                usagePercent > 50 ? 'bg-yellow-500' :
                                'bg-brand-crimson'
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        </div>
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
