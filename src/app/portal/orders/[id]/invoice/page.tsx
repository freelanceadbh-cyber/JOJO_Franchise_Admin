import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldAlert,
  IceCream,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { GST_PERCENT } from '@/lib/tax';

interface InvoicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  // Fetch order details with associated invoice, items, products, and payments
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      franchise: {
        include: { user: true }
      },
      invoice: true,
      orderItems: {
        include: { product: true }
      },
      payments: true
    }
  });

  if (!order || !order.invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md p-8 bg-card border border-border rounded-3xl text-center space-y-4 shadow-lg">
          <ShieldAlert size={48} className="text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Invoice Not Found</h1>
          <p className="text-sm text-muted-foreground">
            We could not locate a settled tax invoice for this order record. Please verify that payment was fully cleared.
          </p>
          <Link href={session.user.role === 'ADMIN' ? '/admin/orders' : '/portal'} className="inline-block px-5 py-2.5 bg-brand-crimson text-white font-bold rounded-2xl text-xs transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Ensure security: only mapped franchise owner or admin can view this invoice
  if (session.user.role !== 'ADMIN' && order.franchise.userId !== session.user.id) {
    redirect('/portal');
  }

  const invoiceNumber = order.invoice.invoiceNumber;
  const payment = order.payments[0];

  // Financial computations
  const subtotal = Number(order.totalAmount);
  const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const gstAmount = Number(order.gstAmount);
  const grandTotal = Number(order.finalAmount);

  return (
    <div className="min-h-screen bg-background py-8 px-4 font-sans text-xs">
      
      {/* Action Header Panel - Hidden on print */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between py-2">
        <Link 
          href={session.user.role === 'ADMIN' ? '/admin/orders' : '/portal/orders'} 
          className="flex items-center gap-1.5 font-bold text-muted-foreground hover:text-brand-crimson transition-colors"
        >
          <ArrowLeft size={16} />
          {session.user.role === 'ADMIN' ? 'Back to Admin Orders' : 'Back to Shipments'}
        </Link>
        <div className="flex gap-2">
          <a
            href={`/portal/orders/${id}/invoice/pdf`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border-0"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Printable Invoice Container - Flat & Borderless Document */}
      <div className="max-w-3xl mx-auto bg-white text-slate-800 p-8 sm:p-12 relative">
        
        {/* Invoice Top Ribbon Brand */}
        <div className="flex justify-between items-start gap-4 border-b border-slate-200 pb-8">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Invoice No: {invoiceNumber}
            </div>
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
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Tax Invoice</h1>
            <div className="mt-2.5 font-mono space-y-0.5">
              <p><span className="font-bold text-slate-500">Date:</span> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              <p><span className="font-bold text-slate-500">Status:</span> PAID</p>
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
            <p className="text-slate-500 leading-relaxed font-mono">
              <span className="font-bold text-slate-800">Gateway:</span> Razorpay Merchant<br />
              <span className="font-bold text-slate-800">Transaction ID:</span> {payment?.paymentId || 'MOCK_SANDBOX'}<br />
              <span className="font-bold text-slate-800">Date settled:</span> {new Date(order.createdAt).toLocaleDateString('en-IN')}<br />
              <span className="font-bold text-slate-800">Mode:</span> Standard Card/UPI
            </p>
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
                <th className="pb-3 w-20 text-right">Tax ({GST_PERCENT}%)</th>
                <th className="pb-3 w-24 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.orderItems.map((item, index) => {
                const itemTotal = Number(item.priceAtPurchase) * item.quantity;
                const itemGST = itemTotal * GST_PERCENT / 100;
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

        {/* Calculations & order summary */}
        <div className="grid sm:grid-cols-12 gap-8 border-t border-slate-200 pt-8 mt-4 items-center">
          
          <div className="sm:col-span-7 p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Order Summary</span>
              <span className="text-[10px] text-slate-500 font-mono">{totalQuantity} qty</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-[10px] font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Items Count</span>
                <span className="font-semibold text-slate-900">{order.orderItems.length}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Total Quantity</span>
                <span className="font-semibold text-slate-900">{totalQuantity}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Taxable Value</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">GST</span>
                <span className="font-semibold text-slate-900">₹{gstAmount.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              This invoice is issued without QR verification. Use the invoice number for ledger matching and internal audit checks.
            </p>
          </div>

          {/* Pricing totals */}
          <div className="sm:col-span-5 space-y-2 text-xs font-mono text-slate-600">
            <div className="flex justify-between">
              <span>Taxable Value:</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({GST_PERCENT}%):</span>
              <span className="font-semibold text-slate-900">₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-3 text-sm font-extrabold text-slate-950">
              <span>Grand Total:</span>
              <span className="text-md" style={{ color: '#DC143C' }}>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer note */}
        <div className="border-t border-slate-200 mt-12 pt-6 text-center text-slate-400 text-[10px]">
          <p>Thank you for partnering with JoJo Ice Creams! This is a system-generated secure tax invoice.</p>
          <p className="mt-1">For any queries regarding credit adjustments or delivery issues, reach out to HQ Billing operations.</p>
        </div>

      </div>
    </div>
  );
}
