'use client';

import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Flame, 
  ShieldCheck, 
  ThermometerSnowflake,
  Clock,
  HeartHandshake
} from 'lucide-react';

export default function CraftStory() {
  const steps = [
    {
      number: '01',
      title: 'Fresh Dairy Sourcing',
      desc: '100% farm-fresh Jersey cow and buffalo milk collected daily. No reconstituted milk powder and zero palm oils.',
      badge: '100% Real Cream',
    },
    {
      number: '02',
      title: 'Micro-Aerated Slow Churn',
      desc: 'Our slow-churn craft ensures ultra-low overrun. The result is a dense, silky scoop with rich mouthfeel that holds shape longer.',
      badge: 'Dense Silk Texture',
    },
    {
      number: '03',
      title: 'Single-Origin Ingredients',
      desc: 'Ratnagiri Alphonso mangoes, Belgian dark chocolate, roasted California almonds, and hand-plucked rose petals for Gulkand.',
      badge: 'Clean Label',
    },
    {
      number: '04',
      title: '-18°C Cryo Logistics',
      desc: 'Refrigerated fleet with continuous telematics tracking ensures scoops reach your parlor counter without temperature fluctuation.',
      badge: 'Zero Meltdown',
    },
  ];

  return (
    <section id="craft" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image & Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[36px] overflow-hidden border-4 border-card shadow-2xl group">
              <img
                src="/images/craft-icecream.jpg"
                alt="Artisanal ice cream maker drizzling chocolate on freshly churned scoop"
                className="w-full h-[520px] object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Quality Badge */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-2xl bg-white/90 dark:bg-card/90 backdrop-blur-md border border-brand-crimson/20 shadow-lg flex items-center gap-2 text-brand-crimson">
                <Award size={18} />
                <span className="font-extrabold text-xs tracking-wide">FSSAI Certified Artisanal Dairy</span>
              </div>

              {/* Floating Glass Stats Bar */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/85 dark:bg-card/85 backdrop-blur-xl border border-white/20 dark:border-border shadow-xl grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-xl font-black text-brand-crimson block">100%</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Dairy Milk Fat</span>
                </div>
                <div className="border-x border-border/80">
                  <span className="text-xl font-black text-brand-crimson block">0%</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Palm / Veg Oil</span>
                </div>
                <div>
                  <span className="text-xl font-black text-brand-crimson block">39+</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Flavors Churned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Steps Column */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink dark:bg-brand-crimson/15 text-brand-crimson dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                The Artisanal Benchmark
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight leading-[1.15]">
                Crafted With Pride, <br />
                <span className="gradient-crimson-text">Served With Confidence</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Commercial brands pump 50% air into their tubs. At JoJo Creams, we respect the craft of authentic gelato and ice cream churned with full-cream milk and honest ingredients.
              </p>
            </div>

            {/* 4 Steps Timeline */}
            <div className="space-y-4">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-card border border-border hover:border-brand-crimson/30 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-pink dark:bg-brand-crimson/15 text-brand-crimson dark:text-rose-400 font-black flex items-center justify-center text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                    {s.number}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-extrabold text-foreground group-hover:text-brand-crimson transition-colors">
                        {s.title}
                      </h3>
                      <span className="text-[9px] font-extrabold text-brand-crimson bg-brand-pink/50 dark:bg-brand-crimson/20 px-2 py-0.5 rounded-md uppercase">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
