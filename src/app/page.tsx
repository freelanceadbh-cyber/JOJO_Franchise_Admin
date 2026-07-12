import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  IceCream, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag, 
  FileText, 
  MapPin, 
  Sparkles, 
  Truck, 
  Award 
} from 'lucide-react';

// Fallback showcase items if the database is empty or not yet connected
const STATIC_SHOWCASE_PRODUCTS = [
  {
    name: 'Belgian Dark Chocolate Tub',
    category: 'ICE_CREAM',
    flavor: 'Dark Chocolate',
    description: 'Rich, velvet smooth Belgian dark chocolate ice cream crafted with real cocoa butter.',
    price: 250.00,
  },
  {
    name: 'Alphonso Mango Delight Tub',
    category: 'ICE_CREAM',
    flavor: 'Alphonso Mango',
    description: 'Creamy ice cream made with real Alphonso mango pulp sourced from Ratnagiri.',
    price: 220.00,
  },
  {
    name: 'Exotic Hazelnut Rocher Fudge',
    category: 'EXOTIC_CUP',
    flavor: 'Hazelnut Chocolate',
    description: 'Gourmet sundae combining hazelnut spread, crushed Ferrero Rocher, and hot fudge.',
    price: 350.00,
  },
];

async function getShowcaseProducts() {
  try {
    const dbProducts = await prisma.product.findMany({
      take: 3,
      where: { isAvailable: true },
    });
    if (dbProducts.length > 0) {
      return dbProducts.map(p => ({
        name: p.name,
        category: p.category,
        flavor: p.flavor,
        description: p.description || '',
        price: Number(p.price),
      }));
    }
  } catch (e) {
    // Graceful fallback during migration/seed state
    console.warn('Database not ready. Using fallback showcase products.');
  }
  return STATIC_SHOWCASE_PRODUCTS;
}

export default async function Home() {
  const showcaseProducts = await getShowcaseProducts();

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-crimson selection:text-white">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
              <IceCream size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-xl leading-none text-foreground uppercase">
                JoJo <span className="text-brand-crimson font-black">Creams</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5">
                Taste then order
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#about" className="text-muted-foreground hover:text-brand-crimson transition-colors">About Us</a>
            <a href="#showcase" className="text-muted-foreground hover:text-brand-crimson transition-colors">Showcase</a>
            <a href="#portal" className="text-muted-foreground hover:text-brand-crimson transition-colors">B2B Portal</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signin" 
              className="px-6 py-2.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-full text-xs shadow-md shadow-brand-crimson/10 flex items-center gap-1.5 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            >
              Partner Portal
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-36 pb-20 md:py-48 bg-radial from-brand-pink/30 to-background overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/20 rounded-full blur-3xl -z-10 animate-float" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-crimson/10 rounded-full text-brand-crimson font-bold text-xs uppercase tracking-wider">
              <Sparkles size={12} />
              Crafting Bliss Since 2012
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] font-sans">
              The Finest Ice Creams,<br />
              <span className="text-brand-crimson bg-gradient-to-r from-brand-crimson to-brand-maroon bg-clip-text text-transparent">
                Partnered for Success
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              From our churns to your stores, JoJo Ice Creams delivers premium scoops, milkshakes, and sundaes that drive customers back. Log in to place bulk orders, manage billing, and download compliant tax invoices.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/auth/signin" 
                className="px-8 py-4 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl shadow-lg shadow-brand-crimson/20 flex items-center gap-2 hover:gap-3 transition-all duration-300 cursor-pointer"
              >
                Enter Franchise Portal
                <ArrowRight size={18} />
              </Link>
              <a 
                href="#showcase"
                className="px-8 py-4 bg-card border border-border hover:bg-muted text-foreground font-bold rounded-2xl transition-all duration-300"
              >
                Browse Menu
              </a>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/80 max-w-lg">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-brand-crimson">50+</div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Branches</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-brand-crimson">30+</div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Gourmet Flavors</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-brand-crimson">1M+</div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Happy Scoops</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center relative">
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-radial from-brand-crimson/15 to-transparent blur-2xl absolute -z-10" />
            <div className="w-80 h-80 md:w-96 md:h-96 rounded-[40px] bg-brand-pink flex items-center justify-center text-brand-crimson shadow-2xl rotate-3 relative border-4 border-white animate-float">
              <IceCream size={160} className="stroke-[1.5]" />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-card px-4 py-3 rounded-2xl shadow-lg border border-border flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Award size={16} />
                </div>
                <div>
                  <div className="text-xs font-extrabold leading-none text-foreground">100% Pure Milk</div>
                  <span className="text-[9px] text-muted-foreground font-semibold">Zero Artificial Fats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PORTAL ADVANTAGES ===== */}
      <section id="portal" className="py-24 bg-card border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              A Complete Partner Ecosystem
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Everything you need to keep your retail counters stacked, your account balanced, and your logs clean.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-border/80 bg-background/50 hover:border-brand-crimson/20 hover:bg-background transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                <ShoppingBag size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Streamlined Ordering</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add products from the categories, request customizations, check inventory states, and queue orders in seconds.
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-border/80 bg-background/50 hover:border-brand-crimson/20 hover:bg-background transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                <ShieldCheck size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Secure Payments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pay on-the-fly using the integrated Razorpay checkout gateway. Support credit, debit, netbanking, and UPI.
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-border/80 bg-background/50 hover:border-brand-crimson/20 hover:bg-background transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink flex items-center justify-center text-brand-crimson">
                <FileText size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Instant Invoices</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Retrieve 18% GST compliant PDF invoices, automatically generated after checkout completes. No manual request needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATALOG SHOWCASE ===== */}
      <section id="showcase" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Our Signature Selection
              </h2>
              <p className="text-sm text-muted-foreground">
                Crafted using organic milk fats, real fruits, and imported dark cocoas.
              </p>
            </div>
            <Link 
              href="/auth/signin" 
              className="text-sm font-bold text-brand-crimson flex items-center gap-1 hover:gap-2 transition-all duration-300"
            >
              Log in to view complete catalog
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {showcaseProducts.map((product, idx) => (
              <div 
                key={idx} 
                className="group rounded-[32px] border border-border p-6 bg-card hover:shadow-xl hover:border-brand-crimson/15 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-48 rounded-[24px] bg-brand-pink/50 flex items-center justify-center text-brand-crimson mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                    <IceCream size={48} className="stroke-[1.5]" />
                  </div>
                  <div className="text-xs font-bold text-brand-crimson uppercase tracking-wider">{product.category}</div>
                  <h3 className="text-xl font-bold text-foreground mt-1 mb-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-6">
                  <span className="text-lg font-extrabold text-brand-crimson">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <Link 
                    href="/auth/signin" 
                    className="px-4 py-2 bg-secondary hover:bg-brand-crimson hover:text-white text-secondary-foreground font-bold rounded-xl text-xs flex items-center gap-1 transition-all duration-300"
                  >
                    Order Bulk
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-foreground text-background py-16 mt-auto border-t border-brand-maroon/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-crimson flex items-center justify-center text-white">
                <IceCream size={16} />
              </div>
              <span className="font-extrabold text-lg tracking-tight uppercase text-white">
                JoJo <span className="text-brand-crimson">Creams</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Serving smiles, one scoop at a time. The premium franchise network for gourmet desserts and shakes.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-widest mb-4">Store Access</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/auth/signin" className="hover:text-brand-crimson transition-colors">Franchise Login</Link></li>
              <li><Link href="/auth/signin" className="hover:text-brand-crimson transition-colors">HQ Admin Login</Link></li>
              <li><Link href="/auth/signin" className="hover:text-brand-crimson transition-colors">Forgot Password</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-widest mb-4">Operations</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-1.5">
                <MapPin size={12} className="text-brand-crimson flex-shrink-0 mt-0.5" />
                <span>HQ: Chennai Central Operations, Express Avenue, Royapettah, Chennai</span>
              </div>
              <div>Support: operations@jojoicecreams.com</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-widest mb-4">System Logistics</h4>
            <div className="space-y-2 text-[10px] text-muted-foreground leading-relaxed">
              <div>Secure Payment Gateway: Razorpay SSL Verified</div>
              <div>Invoice Engine: Compliant GST 18%</div>
              <div>Next.js 15 • PostgreSQL DB • Auth.js v5</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-border/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <span>&copy; 2026 JoJo Ice Creams Private Limited. All Rights Reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms of Partner</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
