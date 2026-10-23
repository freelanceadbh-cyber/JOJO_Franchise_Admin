'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  IceCream, 
  Loader2, 
  ArrowRight, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';
import { authenticateUser } from './actions';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-[32px] glass-panel shadow-2xl animate-slide-up border border-brand-crimson/15 relative">
      {/* Top back & theme bar */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-brand-crimson transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-crimson flex items-center justify-center text-white mb-4 animate-float shadow-lg shadow-brand-crimson/25">
          <IceCream size={30} className="stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight text-center">
          JoJo <span className="gradient-crimson-text">Creams</span>
        </h2>
        <p className="text-xs font-semibold text-muted-foreground mt-1.5 text-center">
          Franchise Partner & HQ Operations Portal
        </p>
      </div>

      {/* Quick Demo Fill Buttons */}
      <div className="mb-6 p-3.5 bg-muted/40 rounded-2xl border border-border/60 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground tracking-wider">
          <span className="flex items-center gap-1">
            <KeyRound size={12} className="text-brand-crimson" />
            Quick Demo Autofill
          </span>
          <span className="text-[9px] text-muted-foreground/80">Click to fill</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('admin@jojo.com', 'AdminPassword123')}
            className="px-3 py-2 bg-card hover:bg-brand-pink/50 dark:hover:bg-brand-crimson/20 border border-border text-[11px] font-bold text-foreground hover:text-brand-crimson rounded-xl transition-all cursor-pointer text-left"
          >
            <span className="block text-[9px] font-black text-brand-crimson uppercase">HQ Admin</span>
            <span>admin@jojo.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('franchise1@jojo.com', 'FranchisePassword123')}
            className="px-3 py-2 bg-card hover:bg-brand-pink/50 dark:hover:bg-brand-crimson/20 border border-border text-[11px] font-bold text-foreground hover:text-brand-crimson rounded-xl transition-all cursor-pointer text-left"
          >
            <span className="block text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Franchise Owner</span>
            <span>franchise1@jojo.com</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900/60 animate-fade-in-down">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
            Business Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="store@jojo.com or admin@jojo.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Security Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-11 py-3 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer border-0 bg-transparent p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:gap-3 transition-all duration-300 shadow-xl shadow-brand-crimson/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Portal</span>
              <ArrowRight size={16} className="stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border/80 pt-5 space-y-1">
        <p className="font-semibold text-foreground/80 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500" />
          SSL Encrypted Partner Access
        </p>
        <p className="text-[10px] text-muted-foreground">
          Need outlet registration? Contact <span className="font-bold text-foreground">operations@jojoicecreams.com</span>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-brand-pink/30 to-background p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-pink/20 dark:bg-brand-crimson/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <Suspense fallback={
        <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs">
          <Loader2 className="animate-spin text-brand-crimson" size={20} />
          <span>Loading JoJo Portal...</span>
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
}
