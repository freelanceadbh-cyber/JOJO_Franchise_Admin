'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'What is the minimum wholesale order quantity for franchise outlets?',
    a: 'We keep batch thresholds friendly for small outlets: the minimum order is only 10 wholesale tubs (or a mix of 30 single-serve gourmet cups). This allows franchise partners to rotate fresh batches weekly without tying up cash in dead inventory.'
  },
  {
    q: 'How fast is store delivery and replenishment handled?',
    a: 'We guarantee 24 to 48-hour delivery across Tamil Nadu and Karnataka through our dedicated -18°C temperature-monitored cold-chain vehicles. Emergency restocking options are also available for peak festival weekends.'
  },
  {
    q: 'How are billing, payments, and GST invoices automated?',
    a: 'Every order placed through the JoJo B2B Partner Portal routes through an integrated Razorpay payment gateway (supporting UPI, Netbanking, and corporate cards). A 5% GST-compliant PDF invoice is instantly generated upon payment confirmation.'
  },
  {
    q: 'What equipment and brand collateral does JoJo provide?',
    a: 'We support franchisees with specialized display dipping freezers, branded acrylic menu backdrops, official scoopers, temperature loggers, and social media creative toolkits to drive local footfall.'
  },
  {
    q: 'Can cafes, restaurants, or catering businesses stock JoJo as dessert partners?',
    a: 'Yes. Beyond exclusive scoop parlors, we maintain wholesale partnerships with fine-dining restaurants, banquet caterers, and gourmet cafes seeking premium dessert solutions.'
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-card border-t border-border relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink dark:bg-brand-crimson/15 text-brand-crimson dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider">
            <HelpCircle size={14} />
            Partner Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">
            Frequently Asked <span className="gradient-crimson-text">Questions</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear information on operations, replenishment, and wholesale agreements.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-background overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground hover:text-brand-crimson transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-crimson' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 animate-fade-in-down">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
