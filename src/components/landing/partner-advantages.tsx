'use client';

import React from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  FileText, 
  Truck, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Clock 
} from 'lucide-react';

const ADVANTAGES = [
  {
    icon: ShoppingBag,
    title: 'Streamlined B2B Ordering',
    desc: 'Browse live inventory across 39+ gourmet flavors, choose custom batch sizes, and submit wholesale restock orders in under 60 seconds.',
    stat: '60s',
    statLabel: 'Quick Reorder'
  },
  {
    icon: ShieldCheck,
    title: 'Instant Razorpay Gateway',
    desc: 'Pay securely using UPI, business Netbanking, credit cards, or NEFT with instant settlement confirmation and zero payment delays.',
    stat: '100%',
    statLabel: 'Payment Security'
  },
  {
    icon: FileText,
    title: 'Automated 5% GST Invoices',
    desc: 'Every completed checkout automatically generates a legally compliant 5% GST tax invoice PDF with detailed HSN breakdown.',
    stat: '5% GST',
    statLabel: 'Compliant Invoices'
  },
  {
    icon: Truck,
    title: 'Monitored Cold-Chain Fleet',
    desc: 'Sub-zero (-18°C) GPS-monitored refrigerated trucks deliver directly to your store, guaranteeing zero melting or recrystallization.',
    stat: '24-48h',
    statLabel: 'Store Delivery'
  },
  {
    icon: TrendingUp,
    title: 'High Retail Margins',
    desc: 'Generous 40% to 45% gross margins on gourmet tubs and sundaes, ensuring swift payback on freezer setup and lease overheads.',
    stat: 'Up to 45%',
    statLabel: 'Gross Margin'
  },
  {
    icon: Layers,
    title: 'Turnkey Marketing & POS',
    desc: 'Get branded dipping counter signage, digital menu boards, seasonal flavor promotion kits, and localized social media creatives.',
    stat: 'Turnkey',
    statLabel: 'Brand Collateral'
  }
];

export default function PartnerAdvantages() {
  return (
    <section id="advantages" className="py-24 bg-card border-y border-border/80 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink dark:bg-brand-crimson/15 text-brand-crimson dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles size={14} />
            The Franchise Edge
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            A Complete Partner <br />
            <span className="gradient-crimson-text">Growth Ecosystem</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Built from the ground up to keep your counters stocked, your bookkeeping clean, and your customers thrilled.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ADVANTAGES.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="tile-card p-7 rounded-3xl flex flex-col justify-between group hover:border-brand-crimson/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-pink dark:bg-brand-crimson/15 flex items-center justify-center text-brand-crimson dark:text-rose-400 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      <Icon size={22} className="stroke-[2.2]" />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-brand-crimson block">{adv.stat}</span>
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">{adv.statLabel}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-foreground group-hover:text-brand-crimson transition-colors">
                    {adv.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {adv.desc}
                  </p>
                </div>

                <div className="w-full h-1 bg-border/40 group-hover:bg-brand-crimson/30 rounded-full mt-6 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
