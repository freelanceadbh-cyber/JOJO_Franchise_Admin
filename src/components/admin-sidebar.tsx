'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/logout-button';
import { 
  IceCream, 
  Layers, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3 
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

  return (
    <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-20 px-6 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson shadow-xs">
          <IceCream size={20} className="stroke-[2.5]" />
        </div>
        <span className="font-extrabold tracking-tight text-base uppercase text-foreground">
          JoJo <span className="text-brand-crimson">HQ</span>
        </span>
      </div>

      {/* Navigation */}
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="p-3 bg-muted/40 rounded-xl border border-border/50 flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-crimson text-white flex items-center justify-center text-sm font-bold shadow-xs">
            {user.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground truncate">{user.name || 'HQ Admin'}</p>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">HQ Administrator</span>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
