'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/logout-button';
import ThemeToggle from '@/components/theme-toggle';
import { 
  IceCream, 
  Layers, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const sections = [
    {
      title: null,
      items: [
        { label: 'Operations Room', href: '/admin', icon: Layers, exact: true },
      ]
    },
    {
      title: 'Catalog Management',
      items: [
        { label: 'Ice Cream Flavors', href: '/admin/products', icon: IceCream },
      ]
    },
    {
      title: 'Store Logistics',
      items: [
        { label: 'Franchise Registry', href: '/admin/franchises', icon: Users },
        { label: 'Full Order Queue', href: '/admin/orders', icon: ShoppingBag },
      ]
    },
    {
      title: 'HQ Operations',
      items: [
        { label: 'Store Support', href: '/admin/messages', icon: MessageSquare },
        { label: 'Analytics & Reports', href: '/admin/reports', icon: BarChart3 },
      ]
    }
  ];

  const NavContent = () => (
    <>
      <nav className="p-4 flex-1 space-y-4 overflow-y-auto">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && (
              <div className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = 'exact' in item && item.exact
                ? pathname === '/admin' 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-pink/80 dark:bg-brand-crimson/20 text-brand-crimson dark:text-rose-400 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-brand-crimson dark:hover:text-rose-400 hover:bg-brand-pink/30 dark:hover:bg-brand-crimson/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="p-3 bg-muted/40 rounded-xl border border-border/50 flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-crimson text-white flex items-center justify-center text-sm font-bold shadow-xs flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{user.name || 'HQ Admin'}</p>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">HQ Administrator</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Navigation Bar (< lg) */}
      <header className="lg:hidden sticky top-0 z-30 w-full h-16 bg-card border-b border-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson shadow-xs">
            <IceCream size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold tracking-tight text-sm uppercase text-foreground">
            JoJo <span className="text-brand-crimson">HQ</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          aria-expanded={isMobileOpen}
          aria-label="Open HQ navigation menu"
          className="p-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Slide-Out Drawer (< lg) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Accessible Drawer Container */}
          <aside 
            className="relative w-72 max-w-[85vw] bg-card border-r border-border h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="HQ Navigation Menu"
          >
            <div className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson shadow-xs">
                  <IceCream size={18} className="stroke-[2.5]" />
                </div>
                <span className="font-extrabold tracking-tight text-sm uppercase text-foreground">
                  JoJo <span className="text-brand-crimson">HQ</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X size={20} />
              </button>
            </div>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar (>= lg) */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col flex-shrink-0 min-h-screen sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-border flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson shadow-xs">
            <IceCream size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold tracking-tight text-base uppercase text-foreground">
            JoJo <span className="text-brand-crimson">HQ</span>
          </span>
        </div>
        <NavContent />
      </aside>
    </>
  );
}
