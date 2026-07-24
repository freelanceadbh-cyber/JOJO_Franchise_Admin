import React from 'react';
import LogoutButton from '@/components/logout-button';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { 
  IceCream, 
  CreditCard, 
  ShoppingBag, 
  History, 
  MessageSquare, 
  Bell, 
  LogOut, 
  User, 
  FileText,
  Plus,
  ShieldCheck,
  Megaphone,
  Activity,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';

async function getFranchiseData(userId: string) {
  return await prisma.franchise.findUnique({
    where: { userId },
  });
}

async function getRecentOrders(franchiseId: string) {
  return await prisma.order.findMany({
    where: { franchiseId },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });
}

async function getAnnouncements(userId: string) {
  return await prisma.notification.findMany({
    where: { userId, type: 'SYSTEM' },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
}

async function getActivities(userId: string) {
  return await prisma.notification.findMany({
    where: { 
      userId,
      OR: [
        { type: 'ORDER' },
        { type: 'PAYMENT' }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
}

export default async function PortalDashboard() {
  const session = await auth();

  // Route security guard - redirect to sign-in if no session
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Redirect admins to admin dashboard
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  const franchise = await getFranchiseData(session.user.id);

  if (!franchise) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md p-8 bg-card border border-border rounded-3xl text-center shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson mx-auto">
            <IceCream size={24} />
          </div>
          <h1 className="text-xl font-bold text-foreground">Profile Not Setup</h1>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find a registered Franchise Profile matching your user account. Please contact headquarters to verify your store mapping.
          </p>
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/auth/signin' });
          }}>
            <button type="submit" className="px-6 py-2.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-sm cursor-pointer transition-colors">
              Log Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  const recentOrders = await getRecentOrders(franchise.id);
  const announcements = await getAnnouncements(session.user.id);
  const activities = await getActivities(session.user.id);

  // Top Selling products for this store (Mocked based on order seeding)
  const topProducts = [
    { name: 'Belgian Dark Chocolate Tub', category: 'ICE_CREAM', units: 22, growth: '+15%' },
    { name: 'Alphonso Mango Delight Tub', category: 'ICE_CREAM', units: 20, growth: '+8%' },
    { name: 'Madagascar Vanilla Gold Tub', category: 'ICE_CREAM', units: 2, growth: 'Stable' },
  ];

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
          <Link href="/portal" className="flex items-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
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
            <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson lg:hidden">
              <IceCream size={16} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground truncate">Store Overview</h1>
              <p className="text-xs text-muted-foreground truncate">{franchise.storeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="w-10 h-10 rounded-full border border-border hover:bg-muted flex items-center justify-center text-muted-foreground relative">
              <Bell size={18} />
              <span className="w-2 h-2 rounded-full bg-brand-crimson absolute top-2 right-2 border-2 border-card" />
            </button>
            <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground text-sm font-bold">
              <User size={18} />
            </div>
          </div>
        </header>

        {/* Dashboard Panels Grid */}
        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Store Info & Quick Actions Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Store Outlet Details</span>
                <div className="w-10 h-10 rounded-2xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                  <CreditCard size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-foreground truncate">{franchise.storeName}</h3>
                <p className="text-xs font-mono text-muted-foreground mt-1">GSTIN: {franchise.gstNumber}</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Status</span>
                <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-green-600 dark:text-green-400">Active Outlet</h3>
                <p className="text-xs text-muted-foreground mt-1">Verified partner store access</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4 sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Replenish Stock</span>
                <div className="w-10 h-10 rounded-2xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div className="pt-2">
                <Link 
                  href="/portal/catalog" 
                  className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-brand-crimson/15 cursor-pointer"
                >
                  Order Wholesale Stock
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left/Middle Column (Orders and Top Products) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Recent Orders Card */}
              <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-foreground">Recent Shipments</h2>
                  <Link href="/portal/orders" className="text-xs font-bold text-brand-crimson hover:underline">Full History</Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="py-12 text-center space-y-2 border border-dashed border-border/80 rounded-2xl bg-muted/5">
                    <ShoppingBag size={32} className="text-muted-foreground mx-auto opacity-40" />
                    <p className="text-sm font-semibold text-muted-foreground">No orders logged</p>
                    <p className="text-xs text-muted-foreground/80">Queue your first shipment in the catalog.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse min-w-[400px]">
                      <thead>
                        <tr className="border-b border-border/60 text-xs font-bold text-muted-foreground">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3 text-right">Invoice Total</th>
                          <th className="pb-3 text-center">Status</th>
                          <th className="pb-3 text-center">Invoice Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                            <td className="py-3 font-bold font-mono text-xs text-foreground">
                              #{order.id.slice(0, 8)}
                            </td>
                            <td className="py-3 text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-3 text-right font-extrabold text-foreground">
                              ₹{Number(order.finalAmount).toFixed(2)}
                            </td>
                            <td className="py-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              {order.paymentStatus === 'PAID' ? (
                                <Link 
                                  href={`/portal/orders/${order.id}/invoice`}
                                  className="text-xs font-bold text-brand-crimson hover:underline flex items-center justify-center gap-1"
                                >
                                  <FileText size={12} />
                                  View Invoice
                                </Link>
                              ) : (
                                <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold">Unpaid</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Top Selling Products */}
              <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
                <div>
                  <h3 className="text-md font-bold text-foreground">Store Demand Drivers</h3>
                  <p className="text-xs text-muted-foreground">Top-selling ice cream categories and scoops in your branch.</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {topProducts.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-border bg-muted/30 flex flex-col justify-between gap-3">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                          <IceCream size={16} />
                        </div>
                        <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md">
                          {p.growth}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">{p.name}</h4>
                        <span className="text-[9px] text-muted-foreground font-semibold uppercase">{p.category}</span>
                      </div>
                      <div className="flex items-end justify-between border-t border-border/40 pt-2.5">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Dispatched</span>
                        <span className="text-sm font-black text-brand-crimson">{p.units} tubs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Announcements and Activities) */}
            <div className="space-y-6">
              
              {/* HQ Broadcast Announcements */}
              <div className="p-6 rounded-3xl border border-brand-crimson/25 bg-radial from-brand-pink/20 to-card shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-brand-crimson">
                  <Megaphone size={18} className="stroke-[2.5]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">HQ Announcements</h3>
                </div>

                {announcements.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">No active broadcasts from HQ.</p>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((a) => (
                      <div key={a.id} className="p-3.5 bg-background rounded-2xl border border-border/60 shadow-xs space-y-1.5">
                        <p className="text-xs text-foreground leading-relaxed font-semibold">
                          {a.message}
                        </p>
                        <span className="text-[9px] text-muted-foreground block text-right font-mono">
                          {new Date(a.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Operations Activity Feed */}
              <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-foreground">
                  <Activity size={18} className="stroke-[2.5] text-brand-crimson" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Activity Feed</h3>
                </div>

                {activities.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No recent operations activity.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-border/80 pl-4 ml-2 space-y-6">
                    {activities.map((act) => (
                      <div key={act.id} className="relative space-y-1">
                        {/* Dot indicator */}
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-crimson border-2 border-card" />
                        <p className="text-xs text-foreground leading-relaxed">
                          {act.message}
                        </p>
                        <span className="text-[9px] text-muted-foreground block font-mono">
                          {new Date(act.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
