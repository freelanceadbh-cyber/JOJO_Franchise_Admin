'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  IceCream, 
  CreditCard, 
  ShoppingBag, 
  History, 
  MessageSquare, 
  LogOut, 
  FileText, 
  Mail, 
  Send, 
  Trash2, 
  User, 
  Inbox, 
  MessageCircle,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';
import { sendMessage, markAsRead } from './actions';

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

interface AdminData {
  id: string;
  name: string;
  email: string;
}

interface MessagesClientProps {
  inbox: MessageClientData[];
  sent: MessageClientData[];
  admins: AdminData[];
  currentUserId: string;
  storeName: string;
}

export default function MessagesClient({ inbox, sent, admins, currentUserId, storeName }: MessagesClientProps) {
  // Tabs: INBOX, SENT, COMPOSE
  const [activeTab, setActiveTab] = useState<'INBOX' | 'SENT' | 'COMPOSE'>('INBOX');
  
  // Selected Message reading state
  const [selectedMessage, setSelectedMessage] = useState<MessageClientData | null>(null);
  
  // Composer Form States
  const [composeTo, setComposeTo] = useState(admins[0]?.id || '');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  
  // Reply Form States
  const [replyBody, setReplyBody] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectMessage = async (msg: MessageClientData) => {
    setSelectedMessage(msg);
    // If it is in inbox and unread, mark it as read on backend
    if (activeTab === 'INBOX' && !msg.isRead) {
      msg.isRead = true; // Update local state for immediate feedback
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
      setSuccessMsg('Support ticket dispatched successfully.');
      setComposeSubject('');
      setComposeBody('');
      setLoading(false);
      // Wait 1s and route back to Inbox or Sent
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('SENT');
        setSelectedMessage(null);
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Failed to dispatch ticket.');
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
      setSuccessMsg('Reply dispatched.');
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
            JoJo <span className="text-brand-crimson">Portal</span>
          </span>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          <Link href="/portal" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <CreditCard size={18} />
            Dashboard
          </Link>
          <Link href="/portal/catalog" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <ShoppingBag size={18} />
            Order Catalog
          </Link>
          <Link href="/portal/orders" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <History size={18} />
            Order History
          </Link>
          <Link href="/portal/proforma-invoices" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <FileText size={18} />
            Proforma Invoices
          </Link>
          <Link href="/portal/messages" className="flex items-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
            <MessageSquare size={18} />
            HQ Messages
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-3 bg-muted/40 rounded-2xl border border-border/50 flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-crimson text-white flex items-center justify-center text-xs font-bold shadow-inner">
              {admins[0] ? 'F' : 'P'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{storeName}</p>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Franchise</span>
            </div>
          </div>
          <button 
            onClick={() => {
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = '/api/auth/signout';
              document.body.appendChild(form);
              form.submit();
            }}
            className="w-full py-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 bg-transparent"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT Workspace split grid ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-6 flex items-center justify-between bg-card flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">HQ Support Messenger</h1>
            <p className="text-xs text-muted-foreground">{storeName} ticket dashboard.</p>
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
              New Ticket
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
                Inbox
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
                Sent Items
              </button>
            </div>

            {/* List scrollarea */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {currentList.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <Inbox size={32} className="text-muted-foreground mx-auto opacity-35" />
                  <p className="text-xs font-bold text-muted-foreground">Inbox is empty</p>
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
                      {/* Unread indicator dot */}
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
              // Support ticket composer form
              <form onSubmit={handleSendMessage} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Compose Brand Support Ticket</h2>
                    <p className="text-[10px] text-muted-foreground">Dispatched directly to the Jojo HQ management desk.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Recipient Desk</label>
                    <select
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                    >
                      {admins.map((adm) => (
                        <option key={adm.id} value={adm.id}>{adm.name} (HQ HQ)</option>
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
                      placeholder="e.g. Credit adjustment inquiry for June billing"
                      className="w-full p-3.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Ticket Message Details</label>
                    <textarea
                      required
                      rows={6}
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      placeholder="Detail your request here. HQ operations will reply in 12-24 hours."
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
                    Dispatch Ticket
                  </button>
                </div>
              </form>
            ) : selectedMessage ? (
              // Message reading details pane
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Message header */}
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

                  {/* Message body */}
                  <div className="p-4 bg-muted/30 border border-border/40 rounded-2xl text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.body}
                  </div>
                </div>

                {/* Reply section (Only if received message from other party) */}
                {selectedMessage.senderId !== currentUserId ? (
                  <form onSubmit={handleSendReply} className="pt-6 border-t border-border mt-8 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Send Quick Reply</h3>
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
                    This message was dispatched by you to {selectedMessage.recipientName}. Awaiting reply from the admin.
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
