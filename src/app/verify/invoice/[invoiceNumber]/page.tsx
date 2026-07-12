import React from 'react';
import { prisma } from '@/lib/prisma';
import { 
  CheckCircle, 
  AlertTriangle, 
  IceCream, 
  ShieldCheck, 
  Calendar, 
  FileText,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

interface VerifyInvoicePageProps {
  params: Promise<{
    invoiceNumber: string;
  }>;
}

export default async function VerifyInvoicePage({ params }: VerifyInvoicePageProps) {
  const { invoiceNumber } = await params;

  // Query database for invoice matching unique invoice number
  const invoice = await prisma.invoice.findUnique({
    where: { invoiceNumber },
    include: {
      order: {
        include: {
          franchise: {
            include: { user: true }
          },
          payments: true
        }
      }
    }
  });

  const isValid = !!invoice;
  const order = invoice?.order;
  const franchise = order?.franchise;
  const payment = order?.payments?.[0];

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-[#0E0709] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card border border-border p-8 rounded-[32px] shadow-2xl text-center space-y-6 relative overflow-hidden animate-slide-up">
        {/* Top brand header */}
        <div className="flex items-center justify-center gap-1.5 pb-4 border-b border-border/60">
          <div className="w-7 h-7 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
            <IceCream size={14} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold tracking-tight text-xs uppercase text-foreground">
            JoJo Ice Creams
          </span>
        </div>

        {isValid ? (
          // Verified Invoice Panel
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto animate-float shadow-inner">
              <ShieldCheck size={36} className="stroke-[2]" />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Ledger Record Verified
              </span>
              <h2 className="text-xl font-black text-foreground tracking-tight">Invoice is Compliant</h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                This transaction is registered on the active JoJo ledger database and complies with B2B filing standards.
              </p>
            </div>

            {/* Audit details */}
            <div className="p-4 bg-muted/30 border border-border rounded-2xl text-left text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-bold text-[9px] uppercase">Invoice Number</span>
                <span className="font-black text-foreground">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-bold text-[9px] uppercase">Store Outlet</span>
                <span className="font-bold text-foreground text-right">{franchise?.storeName}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-bold text-[9px] uppercase">GSTIN / Entity</span>
                <span className="font-bold text-foreground">{franchise?.gstNumber}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-bold text-[9px] uppercase">Settlement Date</span>
                <span className="font-bold text-foreground">
                  {order ? new Date(order.createdAt).toLocaleDateString('en-IN') : '-'}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-bold text-[9px] uppercase">Transaction ID</span>
                <span className="font-bold text-foreground text-right truncate max-w-[150px]">
                  {payment?.paymentId || 'MOCK_SANDBOX'}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-slate-900 dark:text-foreground">
                <span className="text-[9px] uppercase">Total Value Paid</span>
                <span className="text-brand-crimson">₹{Number(order?.finalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          // Invalid Invoice Panel
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto animate-pulse shadow-inner">
              <AlertTriangle size={36} className="stroke-[2]" />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Verification Failed
              </span>
              <h2 className="text-xl font-black text-foreground tracking-tight">Invalid Invoice Number</h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                The invoice number <span className="font-mono font-bold text-red-600">{invoiceNumber}</span> was not found in the JoJo database register.
              </p>
            </div>

            <div className="p-4 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/40 rounded-2xl text-[10px] text-red-600 dark:text-red-400 leading-relaxed text-left">
              If you believe this is an error, please ensure you scanned the correct barcode/QR code or contact HQ billing support to check database synchronization.
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link 
            href="/auth/signin"
            className="w-full py-3.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            Portal Login Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}
