'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Star,
  Store,
  FileCheck2
} from 'lucide-react';
import FranchiseInquiryModal from './franchise-inquiry-modal';

export default function LandingHero() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 hero-mesh-glow overflow-hidden">
        {/* Background ambient orbs */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-brand-pink/30 dark:bg-brand-crimson/10 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink/70 dark:bg-brand-crimson/15 rounded-full text-brand-crimson dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider border border-brand-crimson/15 shadow-xs">
              <Sparkles size={14} className="text-brand-crimson" />
              <span>Small-Batch Churned Dairy Bliss • Since 2012</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-foreground tracking-tight leading-[1.1]">
              Artisanal Churned Ice Creams, <br />
              <span className="gradient-crimson-text">
                Crafted for Franchises & Food Lovers
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              From our churns to your scoop counters, JoJo Ice Creams delivers velvety pure-milk scoops, exotic sundaes, and gourmet cups that draw long queues. Place batch orders, track cold-chain logistics, and retrieve 5% GST tax invoices automatically.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/auth/signin"
                className="px-8 py-4 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-extrabold rounded-2xl shadow-xl shadow-brand-crimson/25 flex items-center gap-2 hover:gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Enter Franchise Portal</span>
                <ArrowRight size={18} className="stroke-[2.5]" />
              </Link>

              <button
                onClick={() => setInquiryOpen(true)}
                className="px-7 py-4 bg-card border border-border hover:border-brand-crimson/40 hover:bg-muted text-foreground font-bold rounded-2xl transition-all duration-300 shadow-xs cursor-pointer flex items-center gap-2"
              >
                <Store size={18} className="text-brand-crimson" />
                <span>Apply for Franchise</span>
              </button>

              <a
                href="#flavors"
                className="px-6 py-4 text-xs font-bold text-muted-foreground hover:text-brand-crimson transition-colors"
              >
                View 39+ Flavors ↓
              </a>
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-border/70 max-w-xl mx-auto lg:mx-0">
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-heading font-black text-brand-crimson">50+</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Outlets</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-heading font-black text-brand-crimson">39+</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gourmet Flavors</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-heading font-black text-brand-crimson">1.2M+</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Happy Scoops</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-heading font-black text-brand-crimson">42%</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Gross Margin</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Ambient Backlight Glow */}
            <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-radial from-brand-crimson/25 to-transparent blur-3xl absolute -z-10" />

            {/* Main Visual Frame */}
            <div className="relative w-full max-w-[420px] rounded-[44px] p-2 bg-gradient-to-b from-white/80 to-white/20 dark:from-white/10 dark:to-transparent border border-white/40 dark:border-white/10 shadow-2xl shadow-brand-crimson/15">
              <div className="relative w-full h-[400px] sm:h-[440px] rounded-[38px] overflow-hidden bg-brand-pink shadow-inner">
                <img
                  src="/images/hero-gourmet-icecream.jpg"
                  alt="Gourmet artisanal ice cream scoops in a luxury bowl"
                  className="w-full h-full object-cover animate-float"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Glass Pill Top Left */}
              <div className="absolute -top-3 -left-3 sm:-left-6 glass-pill px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-lg border border-white/50 animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-black text-foreground flex items-center gap-1">
                    4.9 / 5.0
                    <span className="text-[9px] font-normal text-muted-foreground">(50+ Stores)</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Top Rated Dessert</span>
                </div>
              </div>

              {/* Floating Glass Pill Bottom Left */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 glass-pill px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl border border-white/50">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-xs font-black leading-tight text-foreground">100% Jersey Milk</div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Zero Palm or Veg Oil</span>
                </div>
              </div>

              {/* Floating Glass Pill Bottom Right */}
              <div className="absolute -bottom-4 -right-4 sm:-right-4 glass-pill px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-xl border border-white/50 hidden sm:flex">
                <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                  <ThermometerSnowflake size={18} />
                </div>
                <div>
                  <div className="text-xs font-black leading-tight text-foreground">-18°C Cryo Fleet</div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Monitored Cold-Chain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <FranchiseInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </>
  );
}
