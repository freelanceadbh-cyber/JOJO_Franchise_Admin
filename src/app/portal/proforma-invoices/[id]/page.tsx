import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldAlert,
  FileText,
  DollarSign,
  IceCream
} from 'lucide-react';
import Link from 'next/link';
import PrintButton from '@/components/print-button';

interface ProformaInvoicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProformaInvoiceDetailPage({ params }: ProformaInvoicePageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  // Fetch proforma invoice details with associated order, items, products, and franchise
  const proforma = await prisma.proformaInvoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          franchise: {
            include: { user: true }
          },
          orderItems: {
            include: { product: true }
          },
          payments: true
        }
      }
    }
  });

  if (!proforma) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md p-8 bg-card border border-border rounded-3xl text-center space-y-4 shadow-lg">
          <ShieldAlert size={48} className="text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Proforma Invoice Not Found</h1>
          <p className="text-sm text-muted-foreground">
            We could not locate the proforma invoice record you are looking for.
          </p>
          <Link href="/portal/proforma-invoices" className="inline-block px-5 py-2.5 bg-brand-crimson text-white font-bold rounded-2xl text-xs transition-colors">
            Return to list
          </Link>
        </div>
      </div>
    );
  }

  // Security guard: only mapped franchise owner or admin can view this proforma invoice
  if (session.user.role !== 'ADMIN' && proforma.order.franchise.userId !== session.user.id) {
    redirect('/portal');
  }

  const order = proforma.order;
  const isPending = proforma.status === 'PENDING_PAYMENT';
  const payment = order.payments[0];

  // QR Code pointing to this view page for verification
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/portal/proforma-invoices/${id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationUrl)}`;

  // Financial computations
  const subtotal = Number(order.totalAmount);
  const cgst = Number(order.gstAmount) / 2; // Split CGST 9%
  const sgst = Number(order.gstAmount) / 2; // Split SGST 9%
  const grandTotal = Number(order.finalAmount);

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-[#080405] py-10 px-4 font-sans text-xs">
      
      {/* Action Header Panel - Hidden on print */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between no-print bg-card border border-border p-4 rounded-2xl shadow-xs">
        <Link 
          href="/portal/proforma-invoices" 
          className="flex items-center gap-1.5 font-bold text-muted-foreground hover:text-brand-crimson transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Proformas
        </Link>
        <div className="flex gap-2">
          {isPending && (
            <Link 
              href={`/portal/checkout?orderId=${order.id}`}
              className="px-5 py-2.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-brand-crimson/15 cursor-pointer border-0"
            >
              <DollarSign size={14} />
              Pay Now
            </Link>
          )}
          <PrintButton />
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="max-w-3xl mx-auto bg-white text-slate-800 p-8 sm:p-12 border border-slate-200 rounded-3xl shadow-sm relative print-container print:border-none print:shadow-none print:p-0">
        
        {/* Proforma Top Ribbon Brand */}
        <div className="flex justify-between items-start gap-4 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-crimson flex items-center justify-center text-white" style={{ backgroundColor: '#DC143C' }}>
                <IceCream size={16} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold tracking-tight text-sm uppercase text-slate-900">
                JoJo Ice Creams
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Corporate Headquarters<br />
              Plot 45, Food Tech Park, Guindy Industrial Estate,<br />
              Chennai, Tamil Nadu - 600032<br />
              Email: hq@jojo.com | GSTIN: 33AAACJ9401F1ZX
            </p>
          </div>
          
          <div className="text-right">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Proforma Invoice</h1>
            <div className="mt-2.5 font-mono space-y-0.5">
              <p><span className="font-bold text-slate-900">Proforma No:</span> {proforma.proformaNumber}</p>
              <p><span className="font-bold text-slate-500">Date:</span> {new Date(proforma.createdAt).toLocaleDateString('en-IN')}</p>
              <p><span className="font-bold text-slate-500">Valid Until:</span> {new Date(proforma.validUntil).toLocaleDateString('en-IN')}</p>
              <p><span className="font-bold text-slate-500">Status:</span> <span className="font-extrabold uppercase" style={{ color: proforma.status === 'PAID' ? 'green' : proforma.status === 'PENDING_PAYMENT' ? '#D68A00' : 'slate' }}>{proforma.status.replace('_', ' ')}</span></p>
            </div>
          </div>
        </div>

        {/* Mapped Billing Parties */}
        <div className="grid sm:grid-cols-2 gap-8 py-8 border-b border-slate-200">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Billed To (Franchise Details)</span>
            <h3 className="font-bold text-slate-950 text-xs">{order.franchise.storeName}</h3>
            <p className="text-slate-500 leading-relaxed mt-1">
              Store Owner: {order.franchise.user.name}<br />
              Address: {order.franchise.address}<br />
              Phone: {order.franchise.contactNumber}<br />
              <span className="font-mono font-bold text-slate-900">GSTIN: {order.franchise.gstNumber}</span>
            </p>
          </div>
          
          <div className="sm:text-right">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Payment Details</span>
            {proforma.status === 'PAID' ? (
              <p className="text-slate-500 leading-relaxed font-mono">
                <span className="font-bold text-slate-800">Gateway:</span> Razorpay Merchant<br />
                <span className="font-bold text-slate-800">Transaction ID:</span> {payment?.paymentId || 'MOCK_SANDBOX'}<br />
                <span className="font-bold text-slate-800">Date settled:</span> {payment ? new Date(payment.createdAt).toLocaleDateString('en-IN') : 'N/A'}<br />
                <span className="font-bold text-slate-800">Mode:</span> Standard Card/UPI
              </p>
            ) : (
              <p className="text-slate-500 leading-relaxed font-mono">
                <span className="font-bold text-slate-800">Payment Status:</span> UNPAID<br />
                <span className="font-bold text-slate-800">Due Amount:</span> ₹{grandTotal.toFixed(2)}<br />
                <span className="font-bold text-red-500">Action Required:</span> Settlement required prior to stock packing.
              </p>
            )}
          </div>
        </div>

        {/* Itemized Invoice Table */}
        <div className="py-8">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 font-bold text-slate-900">
                <th className="pb-3 w-10">#</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 w-20 text-right">Unit Price</th>
                <th className="pb-3 w-16 text-right">Qty</th>
                <th className="pb-3 w-20 text-right">Taxable Val</th>
                <th className="pb-3 w-20 text-right">Tax (18%)</th>
                <th className="pb-3 w-24 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.orderItems.map((item, index) => {
                const itemTotal = Number(item.priceAtPurchase) * item.quantity;
                const itemGST = itemTotal * 0.18;
                const itemGrand = itemTotal + itemGST;
                return (
                  <tr key={item.id} className="text-slate-700">
                    <td className="py-3.5 font-mono text-[10px]">{index + 1}</td>
                    <td className="py-3.5 font-semibold text-slate-900">
                      {item.product.name}
                      <span className="block text-[10px] text-slate-500 font-normal mt-0.5">Flavor: {item.product.flavor}</span>
                    </td>
                    <td className="py-3.5 text-right font-mono">₹{Number(item.priceAtPurchase).toFixed(2)}</td>
                    <td className="py-3.5 text-right font-semibold">{item.quantity}</td>
                    <td className="py-3.5 text-right font-mono">₹{itemTotal.toFixed(2)}</td>
                    <td className="py-3.5 text-right font-mono text-slate-500">₹{itemGST.toFixed(2)}</td>
                    <td className="py-3.5 text-right font-mono font-bold text-slate-900">₹{itemGrand.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculations & QR Code Verification seal */}
        <div className="grid sm:grid-cols-12 gap-8 border-t border-slate-200 pt-8 mt-4 items-center">
          
          {/* QR Scan Verification */}
          <div className="sm:col-span-7 flex gap-4 items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrCodeUrl} 
              alt="Verification QR" 
              className="w-20 h-20 border border-slate-200 bg-white rounded-lg"
            />
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">B2B Quotation Seal</span>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Scan this QR code to verify this proforma invoice quotation online or trigger immediate digital settlement via our secure gateway interface.
              </p>
            </div>
          </div>

          {/* Pricing totals */}
          <div className="sm:col-span-5 space-y-2 text-xs font-mono text-slate-600">
            <div className="flex justify-between">
              <span>Taxable Value:</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9.0%):</span>
              <span className="font-semibold text-slate-900">₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9.0%):</span>
              <span className="font-semibold text-slate-900">₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-3 text-sm font-extrabold text-slate-950">
              <span>Grand Total:</span>
              <span className="text-md" style={{ color: '#DC143C' }}>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer note */}
        <div className="border-t border-slate-200 mt-12 pt-6 text-center text-slate-400 text-[10px]">
          <p className="font-bold text-slate-500">IMPORTANT NOTICE</p>
          <p className="mt-1">This is a Proforma Invoice/Quotation and NOT a final tax invoice. It serves as a payment request.</p>
          <p className="mt-1">Stock packing and dispatches will only be initiated upon complete payment settlement of this proforma invoice.</p>
        </div>

      </div>
    </div>
  );
}
