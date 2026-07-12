'use client';

import React, { useEffect } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Captured Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0E0709] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-[36px] shadow-xl text-center space-y-6 animate-scale-in">
        
        {/* Animated Icon Container */}
        <div className="w-16 h-16 rounded-full bg-brand-pink text-brand-crimson flex items-center justify-center mx-auto shadow-inner animate-pulse-subtle">
          <ShieldAlert size={32} className="stroke-[2]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-foreground tracking-tight">System Exception Encountered</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We apologize for the inconvenience. A runtime exception has been blocked by our root layout guardians.
          </p>
          {error.digest && (
            <code className="block text-[10px] font-mono text-muted-foreground bg-muted p-2 rounded-xl mt-2 select-all">
              Error Digest: {error.digest}
            </code>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-3 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer border-0 shadow-md shadow-brand-crimson/10"
          >
            <RefreshCw size={12} />
            Attempt Recovery
          </button>
          
          <Link
            href="/"
            className="px-5 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Home size={12} />
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
