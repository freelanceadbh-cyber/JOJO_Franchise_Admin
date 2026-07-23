'use client';

import LogoutButton from '@/components/logout-button';

import { signOut } from 'next-auth/react';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  IceCream, 
  CreditCard, 
  ShoppingBag, 
  History, 
  MessageSquare, 
  LogOut, 
  Mail, 
  Send, 
  Trash2, 
  User, 
  Inbox, 
  MessageCircle,
  Clock,
  CheckCircle,
  Plus,
  Layers,
  Users
} from 'lucide-react';
import { sendMessage, markAsRead } from '../[id]/invoice/../../../portal/messages/actions'; // Reuse actions

interface MessageClientData {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface FranchiseUserData {
  id: string;
  name: string;
  email: string;
}

interface AdminMessagesClientProps {
  inbox: MessageClientData[];
  sent: MessageClientData[];
  franchiseUsers: FranchiseUserData[];
  currentUserId: string;
  adminName: string;
}

export default function AdminMessagesClient({ inbox, sent, franchiseUsers, currentUserId, adminName }: AdminMessagesClientProps) {
  const [activeTab, setActiveTab] = useState<'INBOX' | 'SENT' | 'COMPOSE'>('INBOX');
  const [selectedMessage, setSelectedMessage] = useState<MessageClientData | null>(null);
  
  // Form States
  const [composeTo, setComposeTo] = useState(franchiseUsers[0]?.id || '');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [replyBody, setReplyBody] = useState('');

  // Status States
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectMessage = async (msg: MessageClientData) => {
    setSelectedMessage(msg);
    if (activeTab === 'INBOX' && !msg.isRead) {
      msg.isRead = true;
      await markAsRead(msg.id);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await sendMessage(currentUserId, composeTo, composeSubject, composeBody);
    
    if (res.success) {
      setSuccessMsg('Outbound brand notice dispatched successfully.');
      setComposeSubject('');
      setComposeBody('');
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('SENT');
        setSelectedMessage(null);
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Failed to dispatch message.');
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyBody.trim()) return;
    setLoading(true);

    const recipientId = selectedMessage.senderId;
    const subject = `Re: ${selectedMessage.subject.startsWith('Re:') ? '' : 'Re: '}${selectedMessage.subject}`;
    
    const res = await sendMessage(currentUserId, recipientId, subject, replyBody);
    
    if (res.success) {
      setReplyBody('');
      setSuccessMsg('Reply successfully sent to franchise.');
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('SENT');
        setSelectedMessage(null);
      }, 1200);
    } else {
      setErrorMsg(res.error || 'Failed to send reply.');
      setLoading(false);
    }
  };

  const currentList = activeTab === 'INBOX' ? inbox : sent;

  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans">
      
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
            <IceCream size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold tracking-tight text-md uppercase text-foreground">
            JoJo <span className="text-brand-crimson">HQ</span>
          </span>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <Layers size={18} />
            Operations Room
          </Link>
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Catalog Management</div>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <IceCream size={18} />
            Ice Cream Flavors
          </Link>
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Store Logistics</div>
          <Link href="/admin/franchises" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <Users size={18} />
            Franchise Registry
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <ShoppingBag size={18} />
            Full Order Queue
          </Link>
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">HQ Operations</div>
          <Link href="/admin/messages" className="flex items-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
            <MessageSquare size={18} />
            Store Support
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-3 bg-muted/40 rounded-2xl border border-border/50 flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-crimson text-white flex items-center justify-center text-xs font-bold shadow-inner">
              {adminName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{adminName}</p>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">HQ Admin</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ===== MAIN CONTENT Workspace split grid ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-6 flex items-center justify-between bg-card flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">HQ Operations Mailbox</h1>
            <p className="text-xs text-muted-foreground">Manage communications with Jojo Ice Cream branches.</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                setActiveTab('COMPOSE');
                setSelectedMessage(null);
              }}
              className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-transform cursor-pointer border-0"
            >
              <Plus size={14} className="stroke-[2.5]" />
              New Outbound Message
            </button>
          </div>
        </header>

        {/* Messaging layout */}
        <div className="flex-1 grid md:grid-cols-12 min-h-0 bg-card">
          
          {/* LEFT PANEL: Message list (5 cols) */}
          <div className="md:col-span-5 border-r border-border flex flex-col min-h-[500px]">
            {/* Header controls (Tabs) */}
            <div className="p-4 border-b border-border flex gap-1 bg-muted/20">
              <button 
                onClick={() => {
                  setActiveTab('INBOX');
                  setSelectedMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 ${
                  activeTab === 'INBOX' ? 'bg-secondary text-secondary-foreground' : 'bg-transparent text-muted-foreground'
                }`}
              >
                Franchise Tickets
              </button>
              <button 
                onClick={() => {
                  setActiveTab('SENT');
                  setSelectedMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 ${
                  activeTab === 'SENT' ? 'bg-secondary text-secondary-foreground' : 'bg-transparent text-muted-foreground'
                }`}
              >
                Outbox Notices
              </button>
            </div>

            {/* List scrollarea */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {currentList.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <Inbox size={32} className="text-muted-foreground mx-auto opacity-35" />
                  <p className="text-xs font-bold text-muted-foreground">No messages found</p>
                </div>
              ) : (
                currentList.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full text-left p-4 hover:bg-muted/30 transition-colors flex gap-3 border-0 bg-transparent cursor-pointer ${
                      selectedMessage?.id === msg.id ? 'bg-brand-pink/20' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson flex-shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                    <div className="min-w-0 flex-1 relative">
                      {activeTab === 'INBOX' && !msg.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-crimson absolute top-1 right-0" />
                      )}
                      
                      <div className="flex justify-between items-start pr-4">
                        <span className="text-xs font-bold text-foreground truncate">{msg.senderName}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">
                          {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${!msg.isRead && activeTab === 'INBOX' ? 'font-black text-foreground' : 'text-muted-foreground'}`}>
                        {msg.subject}
                      </p>
                      <p className="text-[11px] text-muted-foreground/80 line-clamp-1 mt-1 leading-relaxed">
                        {msg.body}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Reading pane or Composer (7 cols) */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between min-h-[500px]">
            {successMsg && (
              <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-xs flex gap-2 items-center mb-4">
                <CheckCircle size={16} />
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs flex gap-2 items-center mb-4">
                <Mail size={16} />
                {errorMsg}
              </div>
            )}

            {activeTab === 'COMPOSE' ? (
              // Outbound notice composer form
              <form onSubmit={handleSendMessage} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Compose Brand Notice / Direct Message</h2>
                    <p className="text-[10px] text-muted-foreground">Select a franchise outlet user below to send a secure directive.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Recipient Store Outlet</label>
                    <select
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                    >
                      {franchiseUsers.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Subject Reference</label>
                    <input
                      type="text"
                      required
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      placeholder="e.g. System Audit: Credit adjustment confirmation"
                      className="w-full p-3.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Message Body</label>
                    <textarea
                      required
                      rows={6}
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      placeholder="Type details here..."
                      className="w-full p-3.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border-0 shadow-md shadow-brand-crimson/15"
                  >
                    <Send size={12} />
                    Dispatch Notice
                  </button>
                </div>
              </form>
            ) : selectedMessage ? (
              // Message details pane
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="border-b border-border/60 pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h2 className="text-sm font-bold text-foreground leading-relaxed">{selectedMessage.subject}</h2>
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          From: <span className="font-bold text-foreground">{selectedMessage.senderName}</span> ({selectedMessage.senderEmail})
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(selectedMessage.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 border border-border/40 rounded-2xl text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.body}
                  </div>
                </div>

                {/* Reply section */}
                {selectedMessage.senderId !== currentUserId ? (
                  <form onSubmit={handleSendReply} className="pt-6 border-t border-border mt-8 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Send Reply to Store Owner</h3>
                    </div>
                    <div className="relative">
                      <textarea
                        required
                        rows={3}
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder={`Reply to ${selectedMessage.senderName}...`}
                        className="w-full p-3.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson resize-none pr-12"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-3.5 bottom-4 w-9 h-9 rounded-xl bg-brand-crimson hover:bg-brand-crimson/95 text-white flex items-center justify-center cursor-pointer transition-colors border-0"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 bg-muted/40 border border-border/50 text-[10px] text-muted-foreground rounded-2xl">
                    Outbound notice dispatched by HQ to {selectedMessage.recipientName}.
                  </div>
                )}
              </div>
            ) : (
              // Empty selection state
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                <MessageCircle size={40} className="text-muted-foreground opacity-30 animate-float" />
                <h3 className="text-xs font-bold text-foreground">Select a message</h3>
                <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                  Click on any support ticket from the list to read details, view timestamps, and dispatch immediate replies.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
