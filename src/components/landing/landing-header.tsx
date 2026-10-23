'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IceCream, ArrowRight, Menu, X, Sparkles, LogIn } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-brand-crimson text-white flex items-center justify-center shadow-lg shadow-brand-crimson/25 group-hover:scale-105 transition-transform duration-300">
            <IceCream size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold tracking-tight text-xl leading-none text-foreground uppercase">
              JoJo <span className="gradient-crimson-text font-black">Creams</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Taste Then Order • Artisanal B2B
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          <a 
            href="#flavors" 
            className="text-muted-foreground hover:text-brand-crimson transition-colors relative py-1 hover:font-bold"
          >
            Signature Flavors
          </a>
          <a 
            href="#craft" 
            className="text-muted-foreground hover:text-brand-crimson transition-colors relative py-1 hover:font-bold"
          >
            The Artisan Craft
          </a>
          <a 
            href="#advantages" 
            className="text-muted-foreground hover:text-brand-crimson transition-colors relative py-1 hover:font-bold"
          >
            Franchise Advantage
          </a>
          <a 
            href="#calculator" 
            className="text-muted-foreground hover:text-brand-crimson transition-colors relative py-1 hover:font-bold"
          >
            ROI Calculator
          </a>
          <a 
            href="#testimonials" 
            className="text-muted-foreground hover:text-brand-crimson transition-colors relative py-1 hover:font-bold"
          >
            Partner Stories
          </a>
          <a 
            href="#faq" 
            className="text-muted-foreground hover:text-brand-crimson transition-colors relative py-1 hover:font-bold"
          >
            FAQ
          </a>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link 
            href="/auth/signin" 
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs shadow-md shadow-brand-crimson/20 hover:shadow-brand-crimson/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <LogIn size={15} />
            Partner Portal
            <ArrowRight size={14} className="stroke-[2.5]" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card/95 backdrop-blur-xl px-6 py-6 space-y-4 animate-fade-in-down shadow-xl">
          <nav className="flex flex-col space-y-3 font-semibold text-sm">
            <a 
              href="#flavors" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-foreground hover:bg-brand-pink/40 dark:hover:bg-brand-crimson/10 transition-colors"
            >
              Signature Flavors
            </a>
            <a 
              href="#craft" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-foreground hover:bg-brand-pink/40 dark:hover:bg-brand-crimson/10 transition-colors"
            >
              The Artisan Craft
            </a>
            <a 
              href="#advantages" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-foreground hover:bg-brand-pink/40 dark:hover:bg-brand-crimson/10 transition-colors"
            >
              Franchise Advantage
            </a>
            <a 
              href="#calculator" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-foreground hover:bg-brand-pink/40 dark:hover:bg-brand-crimson/10 transition-colors"
            >
              ROI Calculator
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-foreground hover:bg-brand-pink/40 dark:hover:bg-brand-crimson/10 transition-colors"
            >
              Partner Stories
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-foreground hover:bg-brand-pink/40 dark:hover:bg-brand-crimson/10 transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link 
              href="/auth/signin" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-brand-crimson text-white font-bold text-center text-sm shadow-md shadow-brand-crimson/20 flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              Franchise & HQ Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
