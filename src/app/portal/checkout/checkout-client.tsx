'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  IceCream, 
  CreditCard, 
  ShoppingBag, 
  Loader2, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  FileText,
  ShieldCheck,
  User,
  MapPin,
  Phone
} from 'lucide-react';
import { CartItem } from '@/types';

interface CheckoutClientProps {
  franchiseDetails: {
    storeName: string;
    gstNumber: string;
    address: string;
    contactNumber: string;
    email: string;
    name: string;
  };
  preloadedItems?: CartItem[];
  preloadedOrderId?: string;
}

export default function CheckoutClient({ 
  franchiseDetails,
  preloadedItems,
  preloadedOrderId
}: CheckoutClientProps) {
  const router = useRouter();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sandbox Simulator State
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [mockOrderId, setMockOrderId] = useState('');
  const [mockAmount, setMockAmount] = useState(0);
  const [dbOrderId, setDbOrderId] = useState<string | null>(null);

  // Initialize cart from localStorage or preloaded items on mount
  useEffect(() => {
    if (preloadedItems && preloadedItems.length > 0) {
      setCart(preloadedItems);
      if (preloadedOrderId) {
        setDbOrderId(preloadedOrderId);
      }
      return;
    }
    const savedCart = localStorage.getItem('jojo_cart_items');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
        if (parsed.length === 0) {
          router.push('/portal/catalog');
        }
      } catch (e) {
        console.error('Failed to parse cart items:', e);
        router.push('/portal/catalog');
      }
    } else {
      router.push('/portal/catalog');
    }
  }, [router, preloadedItems, preloadedOrderId]);

  // Load Razorpay Script dynamically for live mode
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Checkout Subtotals
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartGST = cartSubtotal * 0.18; // 18% GST standard
  const cartTotal = cartSubtotal + cartGST;

  // Process checkout sequence
  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create order in backend
      const res = await fetch('/api/checkout/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, dbOrderId: dbOrderId })
      });

      if (!res.ok) {
        throw new Error('Failed to initialize order details with server.');
      }

      const orderData = await res.json();
      setDbOrderId(orderData.dbOrderId);
      
      // If we are in test mode or keys are mock, trigger the Sandbox Simulator Modal
      if (orderData.keyId === 'rzp_test_mock' || orderData.orderId.startsWith('order_mock_')) {
        setMockOrderId(orderData.orderId);
        setMockAmount(orderData.amount);
        setSimulatorOpen(true);
        setLoading(false);
        return;
      }

      // Otherwise, process with live/test Razorpay overlay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you connected to the internet?');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amountInPaise,
        currency: orderData.currency,
        name: 'JoJo Ice Creams',
        description: 'Franchise Stock Order',
        order_id: orderData.orderId,
        prefill: {
          name: franchiseDetails.name,
          email: franchiseDetails.email,
          contact: franchiseDetails.contactNumber,
        },
        theme: {
          color: '#DC143C',
        },
        handler: async function (response: any) {
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                dbOrderId: orderData.dbOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                items: cart,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              localStorage.removeItem('jojo_cart_items');
              router.push(`/portal/checkout/success?orderId=${verifyData.orderId}&invoice=${verifyData.invoiceNumber}`);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }
          } catch (err: any) {
            setError(err.message || 'Verification failed. Please contact HQ support.');
            setLoading(false);
          }
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Payment initialization failed. Try again.');
      setLoading(false);
    }
  };

  const handleGenerateProformaOnly = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, dbOrderId: dbOrderId })
      });

      if (!res.ok) {
        throw new Error('Failed to generate proforma invoice.');
      }

      const orderData = await res.json();
      localStorage.removeItem('jojo_cart_items');
      router.push(`/portal/proforma-invoices/${orderData.proformaId}`);
    } catch (err: any) {
      setError(err.message || 'Proforma generation failed. Try again.');
      setLoading(false);
    }
  };

  // Simulator payment completion handler
  const handleSimulatedPayment = async (success: boolean) => {
    setSimulatorOpen(false);
    setLoading(true);
    
    if (!success) {
      setError('Transaction cancelled by user in Sandbox Simulator.');
      setLoading(false);
      return;
    }

    try {
      const verifyRes = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dbOrderId: dbOrderId,
          razorpayPaymentId: 'pay_sim_' + Math.random().toString(36).substring(2, 10),
          razorpayOrderId: mockOrderId,
          razorpaySignature: 'sig_sim_' + Math.random().toString(36).substring(2, 10),
          items: cart,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        localStorage.removeItem('jojo_cart_items');
        router.push(`/portal/checkout/success?orderId=${verifyData.orderId}&invoice=${verifyData.invoiceNumber}`);
      } else {
        throw new Error(verifyData.error || 'Simulated payment processing failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment verification failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0E0709] font-sans pb-16">
      
      {/* Header bar */}
      <header className="h-20 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-brand-crimson transition-colors border-0 bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Catalog
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
            <IceCream size={16} />
          </div>
          <span className="font-extrabold text-sm uppercase text-foreground">
            Checkout Gateway
          </span>
        </div>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Main Container */}
      <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-start mt-4">
        
        {/* Left Side: Summary & Billing (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-900/50 text-xs flex gap-2 items-start">
              <AlertCircle className="flex-shrink-0" size={16} />
              <div>
                <span className="font-bold block">Order Error</span>
                {error}
              </div>
            </div>
          )}

          {/* Cart summary card */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-foreground pb-4 border-b border-border/60">
              <ShoppingBag size={18} className="text-brand-crimson" />
              <h2 className="text-md font-bold">Wholesale Stock Cart</h2>
            </div>

            <div className="divide-y divide-border/60">
              {cart.map((item) => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center justify-between">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson flex-shrink-0">
                      <IceCream size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-foreground truncate">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground truncate">Flavor: {item.flavor} • ₹{item.price.toFixed(2)}/unit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">{item.quantity} Tubs</span>
                    <span className="text-xs font-black text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Info Preview */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-foreground pb-4 border-b border-border/60">
              <FileText size={18} className="text-brand-crimson" />
              <h2 className="text-md font-bold">Compliant Billing Credentials</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-start gap-3">
                <User size={16} className="text-brand-crimson flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground block">Store Owner</span>
                  <span className="font-bold text-foreground block mt-0.5">{franchiseDetails.name}</span>
                  <span className="text-muted-foreground">{franchiseDetails.email}</span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-start gap-3">
                <ShieldCheck size={16} className="text-brand-crimson flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground block">Tax Entity / GST</span>
                  <span className="font-bold text-foreground block mt-0.5">{franchiseDetails.storeName}</span>
                  <span className="font-mono text-muted-foreground block mt-0.5">{franchiseDetails.gstNumber}</span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-start gap-3 sm:col-span-2">
                <MapPin size={16} className="text-brand-crimson flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground block">Dispatch Address</span>
                  <p className="text-foreground mt-0.5 leading-relaxed">{franchiseDetails.address}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Payment (4 cols) */}
        <div className="md:col-span-4 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6 relative">
          <h2 className="text-md font-bold text-foreground pb-4 border-b border-border/60">Checkout Summary</h2>
          
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Total</span>
              <span className="font-bold text-foreground">₹{cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Wholesale GST (18%)</span>
              <span className="font-bold text-foreground">₹{cartGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-4 text-sm font-bold text-foreground">
              <span>Grand Total</span>
              <span className="text-md font-black text-brand-crimson">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-4 bg-brand-pink/50 border border-brand-crimson/10 rounded-2xl text-[9px] text-brand-maroon leading-relaxed flex gap-2">
            <ShieldCheck size={16} className="flex-shrink-0 text-brand-crimson" />
            <span>Fully encrypted transaction. Razorpay payment verification covers real-time order locking and stock reservations.</span>
          </div>

          {dbOrderId ? (
            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-brand-crimson/20 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Securing Gateway...
                  </>
                ) : (
                  <>
                    <CreditCard size={14} />
                    Pay via Razorpay
                  </>
                )}
              </button>

              {/* Bank Transfer Instructions */}
              <div className="p-5 rounded-2xl border border-border bg-muted/30 space-y-2">
                <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Option 2: Direct Bank Transfer</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  You can transfer the grand total directly to the HQ bank account. Once transferred, please email the transaction receipt to billing@jojo.com with your Proforma Number as the subject.
                </p>
                <div className="pt-2 font-mono text-[10px] space-y-1 text-foreground bg-card/50 p-3 rounded-xl border border-border/40">
                  <p><span className="text-muted-foreground">Account Name:</span> JoJo Ice Creams HQ</p>
                  <p><span className="text-muted-foreground">Account Number:</span> 987654321098</p>
                  <p><span className="text-muted-foreground">Bank Name:</span> HDFC Bank Ltd</p>
                  <p><span className="text-muted-foreground">IFSC Code:</span> HDFC0001234</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerateProformaOnly}
              disabled={loading}
              className="w-full py-4 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-brand-crimson/20 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Generating Proforma...
                </>
              ) : (
                <>
                  <FileText size={14} />
                  Generate Proforma Invoice
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* ===== SANDBOX TRANSACTION SIMULATOR MODAL ===== */}
      {simulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-6 relative text-center animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson mx-auto animate-float shadow-inner">
              <CreditCard size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Razorpay Sandbox Simulator</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                No custom Razorpay API credentials were found in `.env`. We have simulated a secure checkout environment.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-2xl border border-border text-xs text-left font-mono space-y-1">
              <div><span className="font-semibold text-muted-foreground">Order ID:</span> {mockOrderId.slice(0, 16)}...</div>
              <div><span className="font-semibold text-muted-foreground">Amount:</span> ₹{mockAmount.toFixed(2)}</div>
              <div><span className="font-semibold text-muted-foreground">Gateway Status:</span> Sandboxed test environment</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleSimulatedPayment(false)}
                className="py-3 bg-card hover:bg-muted border border-border font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel Payment
              </button>
              <button
                onClick={() => handleSimulatedPayment(true)}
                className="py-3 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-md shadow-brand-crimson/15 border-0"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
