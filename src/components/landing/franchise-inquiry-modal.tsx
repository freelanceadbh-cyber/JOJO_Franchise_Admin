'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, Phone, Mail, MapPin, Building } from 'lucide-react';
import { useToastTheme } from '@/components/providers/toast-theme-provider';

interface FranchiseInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FranchiseInquiryModal({ isOpen, onClose }: FranchiseInquiryModalProps) {
  const { showToast } = useToastTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [outletFormat, setOutletFormat] = useState('Scoop Parlor');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast('Thank you! Our Franchise Team will contact you within 24 hours.', 'success');
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-down">
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border-0 bg-transparent"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground">Inquiry Received!</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We have dispatched your inquiry to our South India Franchise Development desk. You will receive an official brand profile deck and unit economics sheet via email.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 bg-brand-crimson text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink dark:bg-brand-crimson/15 text-brand-crimson dark:text-rose-400 font-extrabold text-[10px] uppercase tracking-wider">
                <Sparkles size={12} />
                Partner With JoJo
              </div>
              <h3 className="text-2xl font-heading font-extrabold text-foreground">
                Franchise Partner Application
              </h3>
              <p className="text-xs text-muted-foreground">
                Share your location details to receive the official store financial prospectus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="arun@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    Target City / Town
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai, Bangalore, Madurai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    Outlet Format
                  </label>
                  <select
                    value={outletFormat}
                    onChange={(e) => setOutletFormat(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                  >
                    <option value="Scoop Parlor">Exclusive Scoop Parlor</option>
                    <option value="Mall Kiosk">Shopping Mall Kiosk</option>
                    <option value="Dessert Cafe">Dessert Cafe (500+ sq.ft)</option>
                    <option value="Restaurant Wholesale">Restaurant Wholesale Supply</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-crimson/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Send size={14} />
                  {submitting ? 'Submitting Application...' : 'Request Franchise P&L Deck'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
