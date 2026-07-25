'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/logout-button';
import { 
  IceCream, 
  CreditCard, 
  ShoppingBag, 
  History, 
  FileText, 
  MessageSquare 
} from 'lucide-react';

interface PortalSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function PortalSidebar({ user }: PortalSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/portal', icon: CreditCard },
    { label: 'Order Catalog', href: '/portal/catalog', icon: ShoppingBag },
    { label: 'Order History', href: '/portal/orders', icon: History },
    { label: 'Proforma Invoices', href: '/portal/proforma-invoices', icon: FileText },
    { label: 'HQ Messages', href: '/portal/messages', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-20 px-6 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-crimson text-white flex items-center justify-center shadow-xs">
          <IceCream size={20} className="stroke-[2.5]" />
        </div>
        <span className="font-extrabold tracking-tight text-base uppercase text-foreground">
          JoJo <span className="text-brand-crimson">Portal</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/portal' 
            ? pathname === '/portal' 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-pink/70 text-brand-crimson font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="p-3 bg-muted/40 rounded-xl border border-border/50 flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-crimson text-white flex items-center justify-center text-sm font-bold shadow-xs">
            {user.name?.[0]?.toUpperCase() || 'F'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground truncate">{user.name || 'Franchise Partner'}</p>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Franchise Partner</span>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
