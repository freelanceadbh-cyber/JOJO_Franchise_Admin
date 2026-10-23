'use client';

import React from 'react';
import { Star, Quote, MapPin, Sparkles, Store } from 'lucide-react';

const TESTIMONIALS = [
  {
    store: 'JoJo EA Mall Outlet',
    location: 'Royapettah, Chennai',
    owner: 'Priya & Vignesh R.',
    period: 'Partner since 2021',
    review:
      'Weekends are packed at our counter. The Lotus Biscoff and Alphonso Mango tubs sell out in hours. The B2B portal makes restocking effortless—we order on Tuesday night, and the temperature-monitored refrigerated van arrives Thursday morning like clockwork.',
    rating: 5,
    bestseller: 'Lotus Biscoff & Mango Delight'
  },
  {
    store: 'JoJo Indiranagar Scoop Bar',
    location: '100ft Road, Bengaluru',
    owner: 'Rahul & Ananya Mehta',
    period: 'Partner since 2022',
    review:
      'Bengaluru dessert lovers immediately recognize pure dairy churn from cheap vegetable fats. Our repeat customer rate is over 68%. The 42% retail margin allowed us to break even on our parlor renovation in just under 5 months.',
    rating: 5,
    bestseller: 'Belgian Chocolate & Tender Coconut'
  },
  {
    store: 'JoJo RS Puram Parlor',
    location: 'Coimbatore, Tamil Nadu',
    owner: 'Sangeetha & K. Narayanan',
    period: 'Partner since 2023',
    review:
      'The automated 5% GST invoicing and instant Razorpay checkout integration is gold for retail accounting. No manual billing disputes or missing paperwork. JoJo sets the gold standard for franchise support.',
    rating: 5,
    bestseller: 'Meethapaan & Hazelnut Nutella'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink dark:bg-brand-crimson/15 text-brand-crimson dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider">
            <Store size={14} />
            Verified Store Stories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            Hear From Our <br />
            <span className="gradient-crimson-text">Franchise Partners</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            From premier metropolitan malls to high-street scoop parlors, discover why partners thrive with JoJo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="tile-card rounded-3xl p-7 flex flex-col justify-between group hover:border-brand-crimson/40 transition-all duration-300 relative"
            >
              <div className="space-y-4">
                {/* Stars and Quote mark */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote size={24} className="text-brand-crimson/30 group-hover:text-brand-crimson transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  "{t.review}"
                </p>

                <div className="pt-2">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Bestseller at counter</div>
                  <span className="text-xs font-black text-brand-crimson">{t.bestseller}</span>
                </div>
              </div>

              {/* Owner info */}
              <div className="pt-5 mt-6 border-t border-border/60 space-y-1">
                <h4 className="text-sm font-extrabold text-foreground">{t.owner}</h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  <MapPin size={12} className="text-brand-crimson flex-shrink-0" />
                  <span>{t.store} • {t.location}</span>
                </div>
                <span className="text-[10px] text-muted-foreground block">{t.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
