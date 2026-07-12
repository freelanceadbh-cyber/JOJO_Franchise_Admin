import React from 'react';
import { IceCream, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0E0709] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-[36px] shadow-xl text-center space-y-6 animate-scale-in">
        
        {/* Animated Icon Container */}
        <div className="w-16 h-16 rounded-full bg-brand-pink text-brand-crimson flex items-center justify-center mx-auto shadow-inner">
          <IceCream size={32} className="stroke-[2] animate-bounce-slow" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-foreground tracking-tight">Scoop Not Found (404)</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The page or resource you are looking for has either melted or moved to a different B2B coordinates address.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/portal"
            className="px-5 py-3 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-transform shadow-md shadow-brand-crimson/10"
          >
            <ArrowLeft size={12} />
            Back to Portal
          </Link>
          
          <Link
            href="/"
            className="px-5 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Home size={12} />
            JoJo Home
          </Link>
        </div>
      </div>
    </div>
  );
}
