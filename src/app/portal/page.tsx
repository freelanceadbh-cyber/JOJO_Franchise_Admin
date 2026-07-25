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
import PortalHeaderActions from '@/components/portal-header-actions';
import PortalSidebar from '@/components/portal-sidebar';

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

async function getNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10
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
  const notifications = await getNotifications(session.user.id);
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
      <PortalSidebar user={session.user} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson lg:hidden">
              <IceCream size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground truncate tracking-tight">Store Overview</h1>
              <p className="text-xs text-muted-foreground truncate">{franchise.storeName}</p>
            </div>
          </div>
          <PortalHeaderActions
            user={session.user}
            franchise={franchise}
            notifications={notifications}
          />
        </header>

        {/* Dashboard Panels Grid */}
        <div className="p-8 space-y-7 w-full max-w-[1600px] mx-auto">
          
          {/* Store Info & Quick Actions Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Store Outlet Details</span>
                <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                  <CreditCard size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-foreground truncate tracking-tight">{franchise.storeName}</h3>
                <p className="text-sm font-mono text-muted-foreground mt-1">GSTIN: {franchise.gstNumber}</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Status</span>
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-green-600 dark:text-green-400 tracking-tight">Active Outlet</h3>
                <p className="text-xs text-muted-foreground mt-1">Verified partner store access</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Replenish Stock</span>
                <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div className="pt-2">
                <Link 
                  href="/portal/catalog" 
                  className="w-full py-3 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer border-0"
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
              <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <h2 className="text-base font-bold text-foreground">Recent Shipments</h2>
                  <Link href="/portal/orders" className="text-xs font-bold text-brand-crimson hover:underline">Full History</Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="py-12 text-center space-y-2 border border-dashed border-border rounded-xl bg-muted/10">
                    <ShoppingBag size={32} className="text-muted-foreground mx-auto opacity-40" />
                    <p className="text-sm font-semibold text-muted-foreground">No orders logged</p>
                    <p className="text-xs text-muted-foreground">Queue your first shipment in the catalog.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          <th className="pb-3 pt-1">Order ID</th>
                          <th className="pb-3 pt-1">Date</th>
                          <th className="pb-3 pt-1 text-right">Invoice Total</th>
                          <th className="pb-3 pt-1 text-center">Status</th>
                          <th className="pb-3 pt-1 text-center">Tax Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3.5 font-bold font-mono text-sm text-foreground">
                              #{order.id.slice(0, 8)}
                            </td>
                            <td className="py-3.5 text-xs text-muted-foreground font-medium">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-3.5 text-right font-extrabold text-foreground font-mono text-sm">
                              ₹{Number(order.finalAmount).toFixed(2)}
                            </td>
                            <td className="py-3.5 text-center">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-center">
                              {order.paymentStatus === 'PAID' ? (
                                <Link 
                                  href={`/portal/orders/${order.id}/invoice`}
                                  className="text-xs font-bold text-brand-crimson hover:underline flex items-center justify-center gap-1"
                                >
                                  <FileText size={14} />
                                  Tax Invoice
                                </Link>
                              ) : (
                                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">Unpaid</span>
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
              <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                <div>
                  <h3 className="text-base font-bold text-foreground">Store Demand Drivers</h3>
                  <p className="text-xs text-muted-foreground">Top-selling ice cream categories and scoops in your branch.</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {topProducts.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between gap-3">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center text-brand-crimson">
                          <IceCream size={16} />
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                          {p.growth}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">{p.name}</h4>
                        <span className="text-xs text-muted-foreground font-semibold uppercase">{p.category}</span>
                      </div>
                      <div className="flex items-end justify-between border-t border-border/60 pt-2.5">
                        <span className="text-xs text-muted-foreground font-semibold uppercase">Dispatched</span>
                        <span className="text-sm font-bold font-mono text-brand-crimson">{p.units} tubs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Announcements and Activities) */}
            <div className="space-y-6">
              
              {/* HQ Broadcast Announcements */}
              <div className="p-6 rounded-2xl border border-brand-crimson/25 bg-card shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-brand-crimson border-b border-border pb-3">
                  <Megaphone size={18} className="stroke-[2.5]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">HQ Announcements</h3>
                </div>

                {announcements.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">No active broadcasts from HQ.</p>
                ) : (
                  <div className="space-y-3.5">
                    {announcements.map((a) => (
                      <div key={a.id} className="p-3.5 bg-muted/30 rounded-xl border border-border/60 space-y-1.5">
                        <p className="text-xs text-foreground leading-relaxed font-medium">
                          {a.message}
                        </p>
                        <span className="text-[10px] text-muted-foreground block text-right font-mono">
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
              <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-foreground border-b border-border pb-3">
                  <Activity size={18} className="stroke-[2.5] text-brand-crimson" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Activity Feed</h3>
                </div>

                {activities.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No recent operations activity.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-border pl-4 ml-2 space-y-5">
                    {activities.map((act) => (
                      <div key={act.id} className="relative space-y-1">
                        {/* Dot indicator */}
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-crimson border-2 border-card" />
                        <p className="text-xs text-foreground leading-relaxed font-medium">
                          {act.message}
                        </p>
                        <span className="text-[10px] text-muted-foreground block font-mono">
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
