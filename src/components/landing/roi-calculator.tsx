'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  IndianRupee, 
  Store, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Percent,
  Coins
} from 'lucide-react';
import Link from 'next/link';

export default function RoiCalculator() {
  const [dailyScoops, setDailyScoops] = useState(240);
  const [averagePrice, setAveragePrice] = useState(89);
  const [outletFormat, setOutletFormat] = useState<'kiosk' | 'parlor' | 'cafe'>('parlor');

  // Franchise Economics Constants
  const MARGIN_PERCENTAGE = 0.42; // 42% Average Gross Retail Margin
  const DAYS_PER_MONTH = 30;

  const estimatedSetupCost = {
    kiosk: 350000,
    parlor: 650000,
    cafe: 1100000
  }[outletFormat];

  const monthlyGrossRevenue = dailyScoops * averagePrice * DAYS_PER_MONTH;
  const monthlyGrossProfit = Math.round(monthlyGrossRevenue * MARGIN_PERCENTAGE);
  const annualGrossProfit = monthlyGrossProfit * 12;

  // Payback in months
  const estimatedPaybackMonths = Math.max(2, Math.round((estimatedSetupCost / monthlyGrossProfit) * 10) / 10);

  return (
    <section id="calculator" className="py-24 bg-card border-y border-border/80 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink dark:bg-brand-crimson/15 text-brand-crimson dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider">
            <Calculator size={14} />
            Interactive Partner Economics
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            Franchise Profitability <br />
            <span className="gradient-crimson-text">Estimator & ROI Model</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Calculate your projected revenue and monthly returns based on location footfall and average scoop ticket value.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-background border border-border space-y-8 shadow-sm">
            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block">
                1. Select Proposed Outlet Model
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'kiosk', label: 'Mall Kiosk', size: '100 - 150 sq.ft' },
                  { id: 'parlor', label: 'Scoop Parlor', size: '250 - 450 sq.ft' },
                  { id: 'cafe', label: 'Dessert Cafe', size: '500+ sq.ft' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setOutletFormat(fmt.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      outletFormat === fmt.id
                        ? 'bg-brand-pink/50 dark:bg-brand-crimson/15 border-brand-crimson text-brand-crimson shadow-xs'
                        : 'bg-card border-border text-foreground hover:border-brand-crimson/30'
                    }`}
                  >
                    <span className="font-extrabold text-xs block">{fmt.label}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{fmt.size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Scoops Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                  2. Estimated Daily Scoops Sold
                </label>
                <span className="px-3.5 py-1 bg-brand-crimson text-white rounded-xl text-xs font-black">
                  {dailyScoops} Scoops/day
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="800"
                step="20"
                value={dailyScoops}
                onChange={(e) => setDailyScoops(Number(e.target.value))}
                className="w-full accent-brand-crimson cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                <span>Quiet Day (80)</span>
                <span>Average Outlet (240)</span>
                <span>Prime Mall Weekend (800)</span>
              </div>
            </div>

            {/* Average Ticket Value */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                  3. Average Retail Price per Scoop
                </label>
                <span className="px-3.5 py-1 bg-brand-pink dark:bg-brand-crimson/20 text-brand-crimson dark:text-rose-400 rounded-xl text-xs font-black">
                  ₹{averagePrice}.00
                </span>
              </div>
              <input
                type="range"
                min="49"
                max="135"
                step="5"
                value={averagePrice}
                onChange={(e) => setAveragePrice(Number(e.target.value))}
                className="w-full accent-brand-crimson cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                <span>Regular (₹49)</span>
                <span>Special (₹89)</span>
                <span>Exotic Sundae (₹135)</span>
              </div>
            </div>

            {/* Key Economics Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/80">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>42% Standard Retail Margin</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>5% GST Invoicing Automated</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Zero Franchise Royalty on Sales</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Freezer Hardware Support</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-radial from-brand-pink/30 to-background border border-border space-y-6 relative overflow-hidden shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-black text-brand-crimson block">
                Projected Financial Summary
              </span>
              <h3 className="text-2xl font-extrabold text-foreground">
                Estimated Franchise Yield
              </h3>
            </div>

            {/* Revenue Highlights */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="tile-stat p-5 bg-card/90 rounded-2xl border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Monthly Gross Sales
                </span>
                <span className="text-2xl sm:text-3xl font-black text-foreground block mt-1 tracking-tight">
                  ₹{monthlyGrossRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Based on 30 operational days
                </span>
              </div>

              <div className="tile-stat p-5 bg-card/90 rounded-2xl border border-brand-crimson/20 shadow-md">
                <span className="text-[10px] uppercase font-bold text-brand-crimson block">
                  Est. Gross Monthly Margin (42%)
                </span>
                <span className="text-2xl sm:text-3xl font-black text-brand-crimson block mt-1 tracking-tight">
                  ₹{monthlyGrossProfit.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
                  ₹{(annualGrossProfit / 100000).toFixed(1)} Lakhs / year
                </span>
              </div>
            </div>

            {/* Payback period indicator */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">Estimated Setup Cost Payback</span>
                <span className="font-black text-brand-crimson">{estimatedPaybackMonths} Months</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-brand-crimson rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(15, (6 / estimatedPaybackMonths) * 50))}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                Estimated capex covers display deep-freezers, scoop counter signage, POS terminal, and opening stock of 30 tubs.
              </p>
            </div>

            {/* Call to Action */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/signin"
                className="flex-1 py-3.5 px-6 rounded-2xl bg-brand-crimson hover:bg-brand-crimson/90 text-white font-extrabold text-xs text-center shadow-lg shadow-brand-crimson/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                Enter Franchise Portal
                <ArrowRight size={15} />
              </Link>
              <a
                href="#inquire"
                className="py-3.5 px-6 rounded-2xl bg-card border border-border hover:bg-muted text-foreground font-bold text-xs text-center transition-all"
              >
                Inquire For Outlet
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
