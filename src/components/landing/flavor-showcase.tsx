'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  IceCream, 
  Search, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  ThermometerSnowflake, 
  ShoppingBag,
  Layers,
  Award
} from 'lucide-react';

export interface ShowcaseProduct {
  id?: string;
  name: string;
  category: string;
  subcategory: string;
  flavor: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  stock?: number;
}

interface FlavorShowcaseProps {
  products: ShowcaseProduct[];
}

const CATEGORIES = [
  { id: 'ALL', label: 'All Flavors', countLabel: '39+ Specialties' },
  { id: 'Exotic', label: 'Exotic Cups & Sundaes', countLabel: 'Premium Cocoa & Nuts' },
  { id: 'Natural', label: 'Artisanal Naturals', countLabel: 'Real Fruits & Florals' },
  { id: 'Special', label: 'Gourmet Crunch & Sweets', countLabel: 'Cookies & Delights' },
  { id: 'Classic', label: 'Classic Favorites', countLabel: 'All-Time Best Sellers' },
];

export default function FlavorShowcase({ products }: FlavorShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ShowcaseProduct | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.flavor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'ALL') return true;
      if (activeCategory === 'Exotic') {
        return p.category === 'EXOTIC_CUP' || p.subcategory.toLowerCase().includes('exotic');
      }
      return p.subcategory.toLowerCase().includes(activeCategory.toLowerCase());
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <section id="flavors" className="py-24 bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-brand-pink/20 dark:bg-brand-crimson/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink dark:bg-brand-crimson/15 text-brand-crimson dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles size={13} />
              Chef-Curated Frozen Delights
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
              Signature Flavors That <br />
              <span className="gradient-crimson-text">Keep Customers Returning</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Made with 100% pure dairy fats, real fruit pulps, Belgian dark cocoa, and zero artificial shortenings. Available in scoop tubs and single-serve gourmet cups.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search mango, biscoff, rocher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson shadow-xs transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <Link
              href="/auth/signin"
              className="px-5 py-2.5 rounded-2xl bg-card border border-border hover:border-brand-crimson/40 text-foreground font-bold text-xs flex items-center justify-center gap-1.5 hover:text-brand-crimson transition-all shadow-xs"
            >
              Wholesale Catalog
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-brand-crimson text-white border-brand-crimson shadow-md shadow-brand-crimson/20 scale-[1.02]'
                    : 'bg-card text-muted-foreground border-border hover:border-brand-crimson/30 hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <IceCream size={48} className="mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-bold text-foreground">No flavors match your search</h3>
            <p className="text-xs text-muted-foreground mt-1">Try searching with a different keyword like "mango", "chocolate", or "cream".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
              className="mt-4 px-4 py-2 bg-brand-crimson text-white font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <div
                key={idx}
                className="tile-card rounded-3xl p-5 flex flex-col justify-between group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
              >
                <div>
                  {/* Image container */}
                  <div className="tile-media w-full h-48 rounded-2xl mb-4 relative overflow-hidden bg-brand-pink/30 dark:bg-card">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-crimson">
                        <IceCream size={56} className="stroke-[1.5] group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    
                    {/* Subcategory Badge */}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-card/90 backdrop-blur-md text-brand-crimson dark:text-rose-400 font-extrabold rounded-full text-[9px] uppercase tracking-wider border border-brand-crimson/15 shadow-sm">
                      {product.subcategory || 'Specialty'}
                    </span>

                    {/* Quick view button */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute bottom-3 right-3 p-2 bg-white/90 dark:bg-card/90 backdrop-blur-md text-foreground hover:text-brand-crimson rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer"
                      title="View Flavor Profile"
                      aria-label={`View details for ${product.name}`}
                    >
                      <Eye size={15} />
                    </button>
                  </div>

                  {/* Flavor Info */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-brand-crimson uppercase tracking-wider block">
                      {product.flavor}
                    </span>
                    <h3 className="text-base font-extrabold text-foreground group-hover:text-brand-crimson transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-1">
                      {product.description || 'Artisanal churned ice cream prepared with pure dairy fats.'}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Price & CTA */}
                <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-5">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground">
                      Wholesale / Tub
                    </span>
                    <span className="text-base font-black text-brand-crimson tracking-tight">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm shadow-brand-crimson/20 hover:scale-[1.03] transition-all cursor-pointer"
                  >
                    Order Bulk
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== PRODUCT DETAILS MODAL ===== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-down">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative animate-slide-up">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border-0 bg-transparent"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-brand-pink flex-shrink-0 border border-brand-crimson/20 shadow-md">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-crimson">
                    <IceCream size={48} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] bg-brand-pink text-brand-crimson dark:bg-brand-crimson/20 dark:text-rose-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  {selectedProduct.subcategory}
                </span>
                <h3 className="text-2xl font-extrabold text-foreground">{selectedProduct.name}</h3>
                <p className="text-xs text-muted-foreground font-semibold">
                  Tasting Profile: <span className="text-foreground font-bold">{selectedProduct.flavor}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block">
                Wholesale Specifications & Ingredients
              </span>
              <p className="text-sm text-foreground leading-relaxed bg-muted/40 p-4 rounded-2xl border border-border/50">
                {selectedProduct.description || 'Premium small-batch ice cream churned with fresh milk and real flavor inclusions.'}
              </p>
            </div>

            {/* Quality specs badges */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/60">
                <ShieldCheck size={16} className="mx-auto text-emerald-500 mb-1" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Dairy Purity</span>
                <span className="text-xs font-black text-foreground">100% Real Milk</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/60">
                <ThermometerSnowflake size={16} className="mx-auto text-sky-500 mb-1" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Storage Temp</span>
                <span className="text-xs font-black text-foreground">-18°C Cryo-Lock</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/60">
                <Award size={16} className="mx-auto text-amber-500 mb-1" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Wholesale Rate</span>
                <span className="text-xs font-black text-brand-crimson">₹{selectedProduct.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold block">Retail Partner Price</span>
                <span className="text-xl font-extrabold text-foreground">₹{selectedProduct.price.toFixed(2)}</span>
              </div>

              <Link
                href="/auth/signin"
                className="px-6 py-3 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-brand-crimson/25 cursor-pointer"
              >
                <ShoppingBag size={15} />
                Order via B2B Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
