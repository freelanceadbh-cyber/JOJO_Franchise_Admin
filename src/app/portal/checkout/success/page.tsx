import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  CheckCircle, 
  ShoppingBag, 
  FileText, 
  ArrowRight, 
  IceCream,
  Home,
  ShieldCheck
} from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    invoice?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { orderId, invoice } = await searchParams;

  if (!orderId) {
    redirect('/portal');
  }

  // Fetch verified order details from DB
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: { product: true }
      },
      payments: true
    }
  });

  if (!order) {
    redirect('/portal');
  }

  const invoiceNumber = invoice || 'INV-2026-0000';
  const paymentRecord = order.payments[0];

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0E0709] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card border border-border p-8 rounded-[36px] shadow-2xl space-y-8 text-center relative overflow-hidden animate-slide-up">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-crimson" />

        {/* Check icon */}
        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto animate-float shadow-inner">
          <CheckCircle size={44} className="stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] bg-brand-pink text-brand-crimson font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Order Dispatched Successfully
          </span>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Stock Replenished!</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your payment was successfully settled. HQ operations has queued your wholesale ice cream shipment.
          </p>
        </div>

        {/* Order Details Receipt */}
        <div className="border border-border/80 bg-muted/20 rounded-3xl p-6 text-left text-xs space-y-4">
          <div className="flex justify-between border-b border-border/60 pb-3 font-mono">
            <div>
              <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider">Invoice Number</span>
              <span className="font-extrabold text-foreground">{invoiceNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider">Order ID</span>
              <span className="font-bold text-foreground">#{order.id.slice(0, 8)}</span>
            </div>
          </div>

          <div className="space-y-2 border-b border-border/60 pb-3">
            <span className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider block">Items Purchased</span>
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-foreground font-semibold">
                <span className="truncate pr-4">{item.product.name} ({item.quantity} Tubs)</span>
                <span>₹{(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST Liability (18%)</span>
              <span className="font-semibold text-foreground">₹{Number(order.gstAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-3 text-sm font-extrabold text-foreground">
              <span>Total Paid (Incl. Tax)</span>
              <span className="text-brand-crimson">₹{Number(order.finalAmount).toFixed(2)}</span>
            </div>
          </div>

          {paymentRecord && (
            <div className="bg-white dark:bg-background border border-border p-3.5 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Secure Transaction reference</span>
                <span className="font-mono text-foreground block font-bold mt-0.5">{paymentRecord.paymentId}</span>
                <span className="text-[10px] text-muted-foreground block">Verified by Razorpay merchant gateway</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link 
            href="/portal"
            className="px-6 py-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home size={14} />
            Back to Dashboard
          </Link>
          <Link 
            href="/portal/orders"
            className="px-6 py-4 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-brand-crimson/15 cursor-pointer"
          >
            Track Dispatch
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
