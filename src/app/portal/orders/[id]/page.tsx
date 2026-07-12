import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle,
  FileText,
  ShieldCheck,
  IceCream,
  Truck,
  Package,
  Calendar,
  Clock,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import Link from 'next/link';

interface TrackingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderTrackingPage({ params }: TrackingPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  // Query database for order tracking details
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      franchise: true,
      orderItems: {
        include: { product: true }
      },
      invoice: true
    }
  });

  if (!order) {
    redirect('/portal/orders');
  }

  // Security check: only mapped owner or admin can track this order
  if (session.user.role !== 'ADMIN' && order.franchise.userId !== session.user.id) {
    redirect('/portal');
  }

  // Define tracking status mapping index
  const statusLevels: { [key: string]: number } = {
    'PENDING': 1,
    'CONFIRMED': 2,
    'PACKED': 3,
    'DISPATCHED': 4,
    'DELIVERED': 5
  };

  const currentLevel = statusLevels[order.status] || 1;
  const isPaid = order.paymentStatus === 'PAID';

  // Timeline step descriptions
  const steps = [
    {
      level: 1,
      title: 'Order Placed & Secured',
      subtitle: 'Awaiting headquarters operations approval.',
      desc: 'Your bulk replenishment order is successfully logged on the ledger. Inventory holds are verified.'
    },
    {
      level: 2,
      title: 'HQ Acceptance',
      subtitle: 'Order confirmed by Guindy Distribution Center.',
      desc: 'HQ warehouse admins verified credit compliance and authorized logistics scheduling.'
    },
    {
      level: 3,
      title: 'Cold Storage Packaging',
      subtitle: 'Tubs secured in dry-ice insulated boxes.',
      desc: 'Ice cream tubs are packed at -18°C with dry ice insulation layers to prevent temperature variations.'
    },
    {
      level: 4,
      title: 'Cold-Chain Transit',
      subtitle: 'Dispatched in refrigerated logistics van.',
      desc: 'Refrigerated van loaded. GPS tracking and thermochemical logs active for this shipment.'
    },
    {
      level: 5,
      title: 'Delivered & Handed Over',
      subtitle: 'Stock securely loaded in store freezer units.',
      desc: 'Shipment accepted, physical stock quantities matched, and compliant invoice generated.'
    }
  ];

  // Helper date computations
  const placedDate = new Date(order.createdAt);
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(placedDate.getDate() + 2); // 48h SLA for franchise orders

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0E0709] font-sans pb-16">
      
      {/* Header Panel */}
      <header className="h-20 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-40">
        <Link 
          href="/portal/orders"
          className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-brand-crimson transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Shipments
        </Link>
        <div className="flex items-center gap-2">
          <Truck size={18} className="text-brand-crimson" />
          <span className="font-extrabold text-sm uppercase text-foreground">
            Fulfillment Timeline
          </span>
        </div>
        <div className="w-20" />
      </header>

      {/* Main Grid */}
      <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-start mt-4">
        
        {/* Left: Timeline Feed (8 cols) */}
        <div className="md:col-span-8 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-8">
          <div>
            <span className="text-[9px] bg-brand-pink text-brand-crimson font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Real-time Logistics Feed
            </span>
            <h2 className="text-lg font-bold text-foreground mt-2">Fulfillment Milestones</h2>
            <p className="text-xs text-muted-foreground">Detailed progression of your cold-chain stock replenishment.</p>
          </div>

          {/* Timeline Node List */}
          <div className="relative border-l-2 border-border/80 pl-6 ml-3 space-y-8 py-2">
            {steps.map((s) => {
              const isFinished = currentLevel >= s.level;
              const isActive = currentLevel === s.level;
              return (
                <div key={s.level} className="relative space-y-1">
                  
                  {/* Circle Indicator */}
                  <div className={`absolute -left-[33px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isFinished 
                      ? 'bg-brand-crimson border-brand-crimson text-white shadow-sm'
                      : 'bg-card border-border text-muted-foreground'
                  }`}>
                    {isFinished ? (
                      <CheckCircle size={12} className="stroke-[3]" />
                    ) : (
                      <span className="text-[9px] font-black">{s.level}</span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h3 className={`text-xs font-black uppercase tracking-wider ${
                      isActive ? 'text-brand-crimson' : 
                      isFinished ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {s.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">{s.subtitle}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1.5 max-w-lg">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order details & address preview (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Metadata Card */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Shipment Summary</h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Shipment ID:</span>
                <span className="font-mono font-bold text-foreground">#{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Invoice Total:</span>
                <span className="font-bold text-foreground">₹{Number(order.finalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST Tax Class:</span>
                <span className="font-bold text-foreground">CGST + SGST (18%)</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-3.5 text-muted-foreground">
                <span>Est. Delivery:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Calendar size={12} />
                  {estimatedDelivery.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
            </div>

            {order.invoice && isPaid ? (
              <Link 
                href={`/portal/orders/${order.id}/invoice`}
                className="w-full py-3 bg-brand-pink/50 hover:bg-brand-pink/80 text-brand-crimson font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0"
              >
                <FileText size={14} />
                Download Tax Invoice
              </Link>
            ) : (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/40 text-[10px] text-yellow-700 dark:text-yellow-400 rounded-xl leading-relaxed">
                Tax invoice is available for download once payment confirmation is settled by Razorpay gateway.
              </div>
            )}
          </div>

          {/* Delivery Coordinates Preview */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Delivery Coordinates</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-brand-crimson mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground block">Branch Destination</span>
                  <span className="font-bold text-foreground block mt-0.5">{order.franchise.storeName}</span>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">{order.franchise.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-border/50 pt-4">
                <Package size={16} className="text-brand-crimson mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground block">Insulated Box Count</span>
                  <span className="font-bold text-foreground block mt-0.5">
                    {order.orderItems.reduce((sum, it) => sum + it.quantity, 0)} Tubs / Boxes
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
