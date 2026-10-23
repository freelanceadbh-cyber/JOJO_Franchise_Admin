import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { History } from 'lucide-react';
import AdminSidebar from '@/components/admin-sidebar';
import OrdersClient, { SerializedOrder } from './orders-client';

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
  const dbOrders = await prisma.order.findMany({
    include: {
      franchise: true,
      payments: true,
      orderItems: true,
      invoice: true,
      proformaInvoice: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const serializedOrders: SerializedOrder[] = dbOrders.map((o) => ({
    id: o.id,
    franchiseId: o.franchiseId,
    status: o.status,
    totalAmount: Number(o.totalAmount),
    gstAmount: Number(o.gstAmount),
    finalAmount: Number(o.finalAmount),
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    estimatedDeliveryDate: o.estimatedDeliveryDate ? o.estimatedDeliveryDate.toISOString() : null,
    franchise: {
      id: o.franchise.id,
      storeName: o.franchise.storeName,
      gstNumber: o.franchise.gstNumber,
      contactNumber: o.franchise.contactNumber,
      address: o.franchise.address,
    },
    payments: o.payments.map((p) => ({
      id: p.id,
      paymentId: p.paymentId,
      status: p.status,
      amount: Number(p.amount),
    })),
    orderItems: o.orderItems.map((it) => ({
      id: it.id,
      quantity: it.quantity,
      priceAtPurchase: Number(it.priceAtPurchase),
    })),
    invoice: o.invoice
      ? {
          id: o.invoice.id,
          invoiceNumber: o.invoice.invoiceNumber,
          pdfUrl: o.invoice.pdfUrl,
        }
      : null,
    proformaInvoice: o.proformaInvoice
      ? {
          id: o.proformaInvoice.id,
          proformaNumber: o.proformaInvoice.proformaNumber,
          status: o.proformaInvoice.status,
        }
      : null,
  }));

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground font-sans">
      <AdminSidebar user={session.user} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-6 md:px-8 flex items-center justify-between bg-card shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Logistics Order Queue</h1>
            <p className="text-xs text-muted-foreground">Monitor branch replenishments and verify merchant gateway settlements.</p>
          </div>
        </header>

        <div className="p-4 md:p-6 w-full max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-border/80">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
                <History size={17} className="text-brand-crimson" />
                Network Order Registry
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-muted text-muted-foreground">
                {serializedOrders.length} Total
              </span>
            </div>
          </div>

          <OrdersClient initialOrders={serializedOrders} />
        </div>
      </main>
    </div>
  );
}
