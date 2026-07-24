'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IceCream, Loader2, ArrowRight, Lock, Mail } from 'lucide-react';
import { authenticateUser } from './actions';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authenticateUser(email, password);

      if (!res.success || res.error) {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
        setLoading(false);
        return;
      }

      let redirectUrl = callbackUrl;
      if (callbackUrl === '/' || callbackUrl.includes('/auth/signin')) {
        redirectUrl = res.redirectUrl || '/portal';
      }

      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error('[SignIn] exception:', err);
      setError('An error occurred during sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl glass-panel shadow-2xl animate-slide-up">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson mb-4 animate-float shadow-inner">
          <IceCream size={32} className="stroke-[2.5]" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight text-center">
          JoJo Ice Creams
        </h2>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Franchise & HQ Management Portal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Business Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. store@jojo.com"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-sm transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Security Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-sm transition-all duration-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:gap-3 transition-all duration-300 shadow-lg shadow-brand-crimson/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Securing Access...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border pt-6">
        <p className="font-medium text-foreground/80">Authorized Franchise & HQ Personnel Only</p>
        <p className="mt-1 text-[11px]">Franchise owners sign in using credentials issued by HQ Admin during registration.</p>
        <div className="mt-3 bg-muted/40 p-2.5 rounded-xl border border-border/50 text-left text-[11px] font-mono text-muted-foreground">
          <div><span className="font-semibold text-foreground">Default HQ Admin:</span> admin@jojo.com</div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-brand-pink/40 to-background p-4">
      <Suspense fallback={
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin text-brand-crimson" size={24} />
          <span className="text-sm font-semibold">Loading Portal...</span>
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
}
