'use client';

import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from '@/components/theme-toggle';
import LogoutButton from '@/components/logout-button';
import Link from 'next/link';
import {
  Bell,
  User,
  CheckCheck,
  ShoppingBag,
  CreditCard,
  Info,
  X,
  Building2,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  Store
} from 'lucide-react';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/app/portal/notifications-actions';

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}

interface PortalHeaderActionsProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  franchise: {
    storeName: string;
    gstNumber: string;
    address: string;
    contactNumber: string;
  } | null;
  notifications: NotificationItem[];
}

export default function PortalHeaderActions({ user, franchise, notifications }: PortalHeaderActionsProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
  };

  const handleNotificationClick = async (notifId: string) => {
    await markNotificationAsRead(notifId);
  };

  return (
    <div className="flex items-center gap-3 relative">
      <ThemeToggle />

      {/* ===== NOTIFICATIONS BUTTON & DROPDOWN ===== */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => {
            setIsNotifOpen(!isNotifOpen);
            setIsProfileOpen(false);
          }}
          className="w-10 h-10 rounded-full border border-border hover:bg-muted/80 flex items-center justify-center text-muted-foreground relative transition-colors cursor-pointer focus:outline-none"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand-crimson text-white text-[10px] font-black flex items-center justify-center absolute -top-1 -right-1 border-2 border-card shadow-sm animate-pulse-subtle">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown Panel */}
        {isNotifOpen && (
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-3xl shadow-xl z-50 overflow-hidden animate-fade-in-down">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-brand-crimson" />
                <h3 className="text-xs font-bold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-pink text-brand-crimson">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-brand-crimson hover:underline font-bold flex items-center gap-1 cursor-pointer border-0 bg-transparent"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
              {notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Bell size={28} className="text-muted-foreground mx-auto opacity-30" />
                  <p className="text-xs font-semibold text-muted-foreground">No notifications yet</p>
                  <p className="text-[10px] text-muted-foreground/70">
                    Order updates and store announcements will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const date = new Date(notif.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-muted/40 ${
                        !notif.isRead ? 'bg-brand-pink/20' : ''
                      }`}
                    >
                      <div className="mt-0.5 p-2 rounded-xl bg-muted text-foreground flex-shrink-0">
                        {notif.type === 'ORDER' ? (
                          <ShoppingBag size={14} className="text-brand-crimson" />
                        ) : notif.type === 'PAYMENT' ? (
                          <CreditCard size={14} className="text-green-600" />
                        ) : (
                          <Info size={14} className="text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-snug font-medium">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-muted-foreground mt-1 block">
                          {date}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand-crimson flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== PROFILE BUTTON & DROPDOWN ===== */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
            setIsNotifOpen(false);
          }}
          className="w-10 h-10 rounded-full bg-brand-pink/60 hover:bg-brand-pink border border-brand-crimson/20 flex items-center justify-center text-brand-crimson font-bold text-sm transition-all cursor-pointer focus:outline-none shadow-xs"
          title="Account & Store Profile"
        >
          {user.name?.[0]?.toUpperCase() || <User size={18} />}
        </button>

        {/* Profile Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute right-0 mt-3 w-72 bg-card border border-border rounded-3xl shadow-xl z-50 overflow-hidden animate-fade-in-down">
            {/* Header info */}
            <div className="p-4 border-b border-border bg-muted/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground block truncate">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  {user.role === 'ADMIN' ? 'HQ Admin' : 'Franchise Partner'}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</p>
              {franchise && (
                <p className="text-[10px] text-brand-crimson font-semibold truncate pt-1 flex items-center gap-1">
                  <Store size={11} />
                  {franchise.storeName}
                </p>
              )}
            </div>

            {/* Menu options */}
            <div className="p-2 space-y-1">
              {franchise && (
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsStoreModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-2xl hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-between transition-colors cursor-pointer border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 size={15} className="text-brand-crimson" />
                    <span>Store Profile & Credentials</span>
                  </div>
                  <ExternalLink size={12} className="text-muted-foreground" />
                </button>
              )}

              <Link
                href="/portal/messages"
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-3.5 py-2.5 rounded-2xl hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-2.5 transition-colors block"
              >
                <MessageSquare size={15} className="text-blue-600" />
                <span>HQ Support Messages</span>
              </Link>
            </div>

            {/* Sign out footer */}
            <div className="p-2 border-t border-border bg-muted/10">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>

      {/* ===== STORE PROFILE MODAL ===== */}
      {isStoreModalOpen && franchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-down">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-pink flex items-center justify-center text-brand-crimson font-bold">
                  <Store size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">{franchise.storeName}</h2>
                  <p className="text-xs text-muted-foreground font-mono">Verified Franchise Store Outlet</p>
                </div>
              </div>
              <button
                onClick={() => setIsStoreModalOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer border-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile fields */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>Outlet Status:</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  ACTIVE PARTNER STORE
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-border/60 bg-card space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                    <User size={12} />
                    Store Manager
                  </span>
                  <p className="font-bold text-foreground">{user.name}</p>
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-card space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                    <Mail size={12} />
                    Registered Email
                  </span>
                  <p className="font-bold text-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border/60 bg-card space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                  <Building2 size={12} />
                  GSTIN Registration No.
                </span>
                <p className="font-bold font-mono text-brand-crimson text-sm">{franchise.gstNumber}</p>
              </div>

              <div className="p-4 rounded-2xl border border-border/60 bg-card space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                  <MapPin size={12} />
                  Store Outlet Address
                </span>
                <p className="font-semibold text-foreground leading-relaxed">{franchise.address}</p>
              </div>

              <div className="p-4 rounded-2xl border border-border/60 bg-card space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                  <Phone size={12} />
                  Official Phone Contact
                </span>
                <p className="font-mono font-bold text-foreground">{franchise.contactNumber}</p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsStoreModalOpen(false)}
                className="px-6 py-2.5 bg-brand-crimson text-white font-bold rounded-2xl text-xs shadow-md shadow-brand-crimson/15 hover:bg-brand-crimson/95 transition-all cursor-pointer border-0"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
