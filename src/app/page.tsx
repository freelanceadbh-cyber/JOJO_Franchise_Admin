import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  IceCream, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  Heart
} from 'lucide-react';

import LandingHeader from '@/components/landing/landing-header';
import LandingHero from '@/components/landing/landing-hero';
import PartnerAdvantages from '@/components/landing/partner-advantages';
import FlavorShowcase, { ShowcaseProduct } from '@/components/landing/flavor-showcase';
import CraftStory from '@/components/landing/craft-story';
import RoiCalculator from '@/components/landing/roi-calculator';
import Testimonials from '@/components/landing/testimonials';
import FaqAccordion from '@/components/landing/faq-accordion';

// Rich fallback showcase items with authentic images if the database is syncing
const STATIC_SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    name: 'Lotus Biscoff',
    category: 'EXOTIC_CUP',
    subcategory: 'Exotic Special',
    flavor: 'Lotus Biscoff',
    description: 'Caramelized Belgian biscuit swirl with crunchy Lotus cookie crumble in dense dairy cream (90g).',
    price: 125.00,
    imageUrl: '/images/flavors/Lotus Biscoff .jpeg',
  },
  {
    name: 'Alphonso Mango',
    category: 'ICE_CREAM',
    subcategory: 'Natural',
    flavor: 'Alphonso Mango',
    description: 'Sun-ripened Ratnagiri Alphonso mango pulp churned with rich whole milk (90g).',
    price: 89.00,
    imageUrl: '/images/flavors/alphanso mango.jpeg',
  },
  {
    name: 'Choco Almond Fudge',
    category: 'EXOTIC_CUP',
    subcategory: 'Exotic',
    flavor: 'Choco Almond Fudge',
    description: 'Intense Belgian chocolate swirl packed with roasted California almonds (90g).',
    price: 99.00,
    imageUrl: '/images/flavors/choco Almond Fudge.jpeg',
  },
  {
    name: 'Hazelnut Nutella',
    category: 'EXOTIC_CUP',
    subcategory: 'Exotic',
    flavor: 'Hazelnut Nutella',
    description: 'Creamy toasted hazelnut spread ribbons layered through velvety sweet cream (90g).',
    price: 99.00,
    imageUrl: '/images/flavors/Hazelnut Nutella.jpeg',
  },
  {
    name: 'Meethapaan',
    category: 'ICE_CREAM',
    subcategory: 'Natural',
    flavor: 'Meethapaan',
    description: 'Traditional royal betel leaf essence with sweet gulkand and fennel notes (90g).',
    price: 89.00,
    imageUrl: '/images/flavors/Meethapaan.jpeg',
  },
  {
    name: 'Red Velvet',
    category: 'ICE_CREAM',
    subcategory: 'Special',
    flavor: 'Red Velvet',
    description: 'Elegant cocoa sponge cake crumble with cream cheese swirls (90g).',
    price: 89.00,
    imageUrl: '/images/flavors/Red Velvet.jpeg',
  },
  {
    name: 'Tender Coconut',
    category: 'ICE_CREAM',
    subcategory: 'Natural',
    flavor: 'Tender Coconut',
    description: 'Fresh coconut water and soft malai chunks churned for refreshing tropical indulgence (90g).',
    price: 89.00,
    imageUrl: '/images/flavors/Tender coconut.jpeg',
  },
  {
    name: 'Kulfi Malai',
    category: 'ICE_CREAM',
    subcategory: 'Classic',
    flavor: 'Kulfi Malai',
    description: 'Slow-simmered rabdi milk with aromatic cardamom and saffron essence (90g).',
    price: 99.00,
    imageUrl: '/images/flavors/kulfi malai.jpeg',
  },
  {
    name: 'Berry Blast',
    category: 'ICE_CREAM',
    subcategory: 'Natural',
    flavor: 'Berry Blast',
    description: 'Vibrant medley of wild blackberries, blueberries, and raspberries in cream (90g).',
    price: 89.00,
    imageUrl: '/images/flavors/Berry Blast.jpeg',
  },
  {
    name: 'Pink Guava',
    category: 'ICE_CREAM',
    subcategory: 'Natural',
    flavor: 'Pink Guava',
    description: 'Authentic Allahabad pink guava with subtle spicy chili-salt sprinkle (90g).',
    price: 89.00,
    imageUrl: '/images/flavors/Pink Guava.jpeg',
  },
  {
    name: 'Chocolate Bourbon',
    category: 'EXOTIC_CUP',
    subcategory: 'Exotic',
    flavor: 'Chocolate Bourbon',
    description: 'Dark Belgian chocolate cream infused with warm Bourbon vanilla extract (90g).',
    price: 99.00,
    imageUrl: '/images/flavors/Chocolate Bourbon.jpeg',
  },
  {
    name: 'Salted Caramel',
    category: 'ICE_CREAM',
    subcategory: 'Special',
    flavor: 'Salted Caramel',
    description: 'Golden caramelized cane sugar balanced with hand-harvested sea salt flakes (90g).',
    price: 89.00,
    imageUrl: '/images/flavors/Salted Caramel.jpeg',
  },
];

async function getShowcaseProducts(): Promise<ShowcaseProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: { category: 'asc' },
    });

    if (dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        subcategory: p.subcategory || 'Specialty',
        flavor: p.flavor,
        description: p.description || '',
        price: Number(p.price),
        imageUrl: p.imageUrl,
        stock: p.stock,
      }));
    }
  } catch (e) {
    console.warn('Database query fallback during landing page render.');
  }
  return STATIC_SHOWCASE_PRODUCTS;
}

export default async function Home() {
  const showcaseProducts = await getShowcaseProducts();

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-crimson selection:text-white bg-background text-foreground">
      {/* ===== STICKY HEADER ===== */}
      <LandingHeader />

      {/* ===== HERO SECTION ===== */}
      <LandingHero />

      {/* ===== BRAND QUALITY STRIP ===== */}
      <section className="py-6 bg-brand-pink/50 dark:bg-card border-y border-brand-crimson/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-muted-foreground font-bold">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>100% Pure Dairy Milk Fat</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <span>Zero Palm Oil or Vanaspati</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-crimson" />
              <span>FSSAI Certified Artisanal Batch Churn</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-sky-500" />
              <span>Automated 5% GST Invoices on Every Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-purple-500" />
              <span>Razorpay Instant Settlement Gateway</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATALOG & SIGNATURE FLAVORS ===== */}
      <FlavorShowcase products={showcaseProducts} />

      {/* ===== ARTISANAL CRAFT STORY ===== */}
      <CraftStory />

      {/* ===== PARTNER ADVANTAGES ===== */}
      <PartnerAdvantages />

      {/* ===== ROI CALCULATOR ===== */}
      <RoiCalculator />

      {/* ===== VERIFIED PARTNER TESTIMONIALS ===== */}
      <Testimonials />

      {/* ===== FAQ SECTION ===== */}
      <FaqAccordion />

      {/* ===== CONVERSION CALL TO ACTION BANNER ===== */}
      <section className="py-20 bg-gradient-to-r from-brand-crimson via-rose-700 to-brand-maroon text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/20 rounded-full blur-2xl" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white font-extrabold text-xs uppercase tracking-wider">
            <Sparkles size={14} />
            Exclusive South India Franchise Territories Available
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight">
            Ready to Serve Smiles & High Margins?
          </h2>

          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join over 50+ successful franchise partners across Tamil Nadu and Karnataka. Get turnkey counter equipment, opening flavor batches, and automated logistics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/signin"
              className="px-8 py-4 bg-white text-brand-crimson font-black rounded-2xl shadow-xl hover:bg-neutral-100 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer text-sm flex items-center gap-2"
            >
              <span>Franchise Partner Login</span>
              <ArrowRight size={16} className="stroke-[2.5]" />
            </Link>

            <a
              href="#calculator"
              className="px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold rounded-2xl transition-all duration-300 text-sm cursor-pointer"
            >
              Estimate Your Store ROI
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-foreground text-background py-16 border-t border-border/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-crimson flex items-center justify-center text-white shadow-md">
                <IceCream size={18} />
              </div>
              <span className="font-heading font-black text-xl tracking-tight uppercase text-white">
                JoJo <span className="text-rose-400">Creams</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Crafting joy since 2012. JoJo Ice Creams is South India's premier B2B artisanal ice cream network, serving franchise parlors, cafes, and hospitality leaders.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>FSSAI Lic. #12421008000452</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" />
                <span>GSTIN: 33AABCJ1234F1Z5</span>
              </div>
            </div>
          </div>

          {/* Partner & Store Access */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-widest mb-4">
              Partner Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/auth/signin" className="hover:text-rose-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={12} />
                  Franchise Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-rose-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={12} />
                  HQ Admin Console
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-rose-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={12} />
                  B2B Wholesale Catalog
                </Link>
              </li>
              <li>
                <a href="#calculator" className="hover:text-rose-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={12} />
                  ROI Profit Model
                </a>
              </li>
            </ul>
          </div>

          {/* Operations & Sourcing */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-widest mb-4">
              Headquarters
            </h4>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Express Avenue Mall Complex, Whites Road, Royapettah, Chennai - 600014</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-rose-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-rose-400 flex-shrink-0" />
                <span>franchise@jojoicecreams.com</span>
              </div>
            </div>
          </div>

          {/* Technology & Logistics */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-widest mb-4">
              Supply Chain
            </h4>
            <div className="space-y-2 text-[11px] text-muted-foreground leading-relaxed">
              <p>• Fleet: GPS -18°C Cryo Reefers</p>
              <p>• Logistics Hubs: Chennai, Bengaluru, Coimbatore</p>
              <p>• Billing: 5% GST Automated Invoices</p>
              <p>• Payment: Razorpay PCI-DSS Level 1</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-6 border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} JoJo Ice Creams Private Limited.</span>
            <span className="hidden sm:inline">• Handcrafted with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 inline mx-0.5" />
            <span className="hidden sm:inline">for true dessert lovers.</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Franchise Agreement</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Notice</a>
            <a href="#" className="hover:text-white transition-colors">FSSAI Disclosures</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
