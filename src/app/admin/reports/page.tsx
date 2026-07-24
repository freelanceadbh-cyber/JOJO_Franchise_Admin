import React from 'react';
import LogoutButton from '@/components/logout-button';
import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  IceCream, 
  Layers, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  LogOut, 
  DollarSign,
  TrendingUp,
  Percent,
  TrendingDown,
  BarChart3,
  Calendar,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import Link from 'next/link';
import PrintButton from '@/components/print-button';

async function getReportData() {
  // 1. Fetch settled orders (PAID)
  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    select: { finalAmount: true, totalAmount: true, gstAmount: true }
  });
  
  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.finalAmount), 0);
  const totalTaxable = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const totalGST = paidOrders.reduce((sum, order) => sum + Number(order.gstAmount), 0);
  
  // 2. Average Order Value
  const aov = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // 3. Fetch franchise directory
  const franchises = await prisma.franchise.findMany({
    include: { user: true }
  });
  
  const activeOutletsCount = franchises.length;
  const totalOrdersCount = await prisma.order.count();

  const branchDirectory = franchises.map(f => {
    return {
      storeName: f.storeName,
      owner: f.user.name,
      email: f.user.email,
      contact: f.contactNumber,
      gst: f.gstNumber
    };
  });

  // Category statistics
  const productDistribution = {
    ICE_CREAM: await prisma.product.count({ where: { category: 'ICE_CREAM' } }),
    MILKSHAKE: await prisma.product.count({ where: { category: 'MILKSHAKE' } }),
    EXOTIC_CUP: await prisma.product.count({ where: { category: 'EXOTIC_CUP' } }),
  };

  return {
    totalRevenue,
    totalGST,
    totalTaxable,
    aov,
    activeOutletsCount,
    totalOrdersCount,
    branchDirectory,
    productDistribution
  };
}

export default async function AdminReportsPage() {
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
    totalGST,
    aov,
    activeOutletsCount,
    totalOrdersCount,
    branchDirectory,
    productDistribution
  } = await getReportData();

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
          <Link href="/admin/reports" className="flex items-center gap-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
            <BarChart3 size={18} />
            Filing Reports
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
          <LogoutButton />
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-6 flex items-center justify-between bg-card flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Filing & Billing Analytics</h1>
            <p className="text-xs text-muted-foreground">HQ wholesale audits and tax liability reports.</p>
          </div>
          <div className="flex gap-2">
            <PrintButton className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-transform cursor-pointer border-0 shadow-md shadow-brand-crimson/15">
              Export Page Reports
            </PrintButton>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* KPI Analytics metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Wholesale Revenue</span>
                <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <DollarSign size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-0.5">
                  <TrendingUp size={12} className="text-green-600" />
                  Tax-inclusive settled payouts
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total GST Collected</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Percent size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">₹{totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">Based on 18% standard wholesale rate</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average Order Value (AOV)</span>
                <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center text-brand-crimson">
                  <ShoppingBag size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">₹{aov.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">Order value average per settlement</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-extrabold">Active Outlets & Orders</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Users size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">{activeOutletsCount} Outlets</h3>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {totalOrdersCount} Total Orders Placed
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left: Outlet Directory table (2 cols) */}
            <div className="lg:col-span-2 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">Registered Franchise Store Registry</h3>
                <p className="text-xs text-muted-foreground">Detailed summary of active franchise stores and corporate contacts.</p>
              </div>

              {branchDirectory.length === 0 ? (
                <p className="text-xs text-muted-foreground">No branch data available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/60 font-bold text-muted-foreground pb-2">
                        <th className="pb-2">Franchise Store</th>
                        <th className="pb-2 w-40">GST Registry</th>
                        <th className="pb-2 w-44">Contact Number</th>
                        <th className="pb-2 text-center w-20">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {branchDirectory.map((b, idx) => (
                        <tr key={idx} className="hover:bg-muted/5 transition-colors">
                          <td className="py-3 font-semibold text-slate-800 dark:text-foreground">
                            {b.storeName}
                            <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">Owner: {b.owner} ({b.email})</span>
                          </td>
                          <td className="py-3 font-mono text-foreground font-bold">
                            {b.gst}
                          </td>
                          <td className="py-3 font-mono text-slate-500 font-bold">
                            {b.contact}
                          </td>
                          <td className="py-3 text-center">
                            <span className="text-[9px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full justify-center inline-block">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right: Category spreading visual (1 col) */}
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1">
                  <PieChart size={16} className="text-brand-crimson" />
                  Product Inventory Divisor
                </h3>
                <p className="text-[10px] text-muted-foreground">Breakdown of product listings by category spread.</p>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="space-y-4 py-2">
                {[
                  { label: 'Ice Creams Tubs', count: productDistribution.ICE_CREAM, color: 'bg-brand-crimson' },
                  { label: 'Milkshakes', count: productDistribution.MILKSHAKE, color: 'bg-brand-maroon' },
                  { label: 'Exotic Cups & Sundaes', count: productDistribution.EXOTIC_CUP, color: 'bg-[#FF8A9F]' }
                ].map((item, idx) => {
                  const total = productDistribution.ICE_CREAM + productDistribution.MILKSHAKE + productDistribution.EXOTIC_CUP || 1;
                  const percent = (item.count / total) * 100;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-foreground">
                        <span>{item.label}</span>
                        <span>{item.count} items ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-muted/40 rounded-2xl border border-border/50 text-[10px] text-muted-foreground leading-relaxed">
                HQ inventory reports are synced dynamically with the SQLite catalog. Update products or categories under flavor management to rebuild grids.
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
