'use client';

import React, { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { 
  History, 
  ShoppingBag, 
  FileText, 
  CheckCircle, 
  Search, 
  X, 
  Filter, 
  Calendar, 
  Clock, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';
import DispatchWithDateForm from '@/components/dispatch-with-date-form';
import { updateStatus, cancelOrder } from './actions';

export interface SerializedOrder {
  id: string;
  franchiseId: string;
  status: string;
  totalAmount: number;
  gstAmount: number;
  finalAmount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryDate: string | null;
  franchise: {
    id: string;
    storeName: string;
    gstNumber: string;
    contactNumber: string;
    address: string;
  };
  payments: Array<{
    id: string;
    paymentId: string | null;
    status: string;
    amount: number;
  }>;
  orderItems: Array<{
    id: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
  invoice: {
    id: string;
    invoiceNumber: string;
    pdfUrl: string | null;
  } | null;
  proformaInvoice: {
    id: string;
    proformaNumber: string;
    status: string;
  } | null;
}

interface OrdersClientProps {
  initialOrders: SerializedOrder[];
}

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'PENDING', label: 'Pending Confirmation' },
  { key: 'CONFIRMED', label: 'In Packing' },
  { key: 'PACKED', label: 'Ready for Dispatch' },
  { key: 'DISPATCHED', label: 'In Transit' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
] as const;

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Status counts for quick dashboard awareness
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialOrders.length };
    for (const order of initialOrders) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }
    return counts;
  }, [initialOrders]);

  // Filtered orders list based on status and search query
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesStatus;

      const matchesSearch = 
        order.id.toLowerCase().includes(q) ||
        order.franchise.storeName.toLowerCase().includes(q) ||
        order.franchise.gstNumber.toLowerCase().includes(q) ||
        (order.invoice?.invoiceNumber.toLowerCase().includes(q) ?? false) ||
        (order.payments[0]?.paymentId?.toLowerCase().includes(q) ?? false);

      return matchesStatus && matchesSearch;
    });
  }, [initialOrders, selectedStatus, searchQuery]);

  const handleUpdateStatus = (orderId: string, status: string) => {
    setActiveActionId(orderId);
    startTransition(async () => {
      await updateStatus(orderId, status);
      setActiveActionId(null);
    });
  };

  const handleCancelOrder = (orderId: string) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId.slice(0, 8)}? Stock will be restored to inventory.`)) {
      return;
    }
    setActiveActionId(orderId);
    startTransition(async () => {
      await cancelOrder(orderId);
      setActiveActionId(null);
    });
  };

  const renderStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase border ${
        status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40' :
        status === 'CANCELLED' ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40' :
        status === 'PENDING' ? 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40' :
        'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          status === 'DELIVERED' ? 'bg-emerald-500' :
          status === 'CANCELLED' ? 'bg-rose-500' :
          status === 'PENDING' ? 'bg-amber-500' :
          'bg-sky-500'
        }`} />
        {status}
      </span>
    );
  };

  const renderActionButtons = (order: SerializedOrder, isMobile: boolean = false) => {
    const isRowBusy = isPending && activeActionId === order.id;

    return (
      <div className={`flex items-center ${isMobile ? 'w-full gap-2 pt-2 border-t border-border/60' : 'justify-center gap-2'}`}>
        {order.status === 'PENDING' && (
          <button 
            type="button"
            disabled={isRowBusy}
            onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
            className={`px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs min-h-[32px] cursor-pointer border-0 shadow-xs transition-all disabled:opacity-50 ${isMobile ? 'flex-1 text-center justify-center' : ''}`}
          >
            {isRowBusy ? 'Updating...' : 'Confirm'}
          </button>
        )}

        {order.status === 'CONFIRMED' && (
          <button 
            type="button"
            disabled={isRowBusy}
            onClick={() => handleUpdateStatus(order.id, 'PACKED')}
            className={`px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs min-h-[32px] cursor-pointer border-0 shadow-xs transition-all disabled:opacity-50 ${isMobile ? 'flex-1 text-center justify-center' : ''}`}
          >
            {isRowBusy ? 'Updating...' : 'Pack'}
          </button>
        )}

        {order.status === 'PACKED' && (
          <div className={isMobile ? 'w-full' : ''}>
            <DispatchWithDateForm orderId={order.id} />
          </div>
        )}

        {order.status === 'DISPATCHED' && (
          <button 
            type="button"
            disabled={isRowBusy}
            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
            className={`px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs min-h-[32px] cursor-pointer border-0 shadow-xs transition-all disabled:opacity-50 ${isMobile ? 'flex-1 text-center justify-center' : ''}`}
          >
            {isRowBusy ? 'Updating...' : 'Deliver'}
          </button>
        )}

        {/* Cancellation Option for Active Orders */}
        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
          <button 
            type="button"
            disabled={isRowBusy}
            onClick={() => handleCancelOrder(order.id)}
            className="px-3 py-1.5 bg-muted hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-muted-foreground font-bold rounded-lg text-xs min-h-[32px] cursor-pointer border border-border transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        {order.status === 'DELIVERED' && (
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
            <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" /> Completed
          </span>
        )}

        {order.status === 'CANCELLED' && (
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Cancelled</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* ===== WORKBENCH FILTER CONTROLS ===== */}
      <div className="space-y-3">
        {/* Search input + summary */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, Order #, or GST..."
              className="w-full pl-10 pr-9 py-2 bg-card border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent transition-all min-h-[36px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-muted-foreground">
            <span>Showing</span>
            <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
              {filteredOrders.length}
            </span>
            <span>of {initialOrders.length} orders</span>
          </div>
        </div>

        {/* Operational Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_FILTERS.map((tab) => {
            const count = statusCounts[tab.key] || 0;
            const isActive = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-brand-crimson text-white border-brand-crimson shadow-xs'
                    : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : count > 0 && tab.key === 'PENDING'
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== ORDER STREAM / LIST ===== */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center space-y-3 border border-dashed border-border rounded-2xl bg-card/40 p-6">
          <ShoppingBag size={40} className="text-muted-foreground mx-auto opacity-35" />
          <h3 className="text-sm font-bold text-foreground">No orders match this filter</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {searchQuery 
              ? `No orders matching "${searchQuery}" in the ${selectedStatus} view.`
              : `There are currently no orders in the ${selectedStatus} queue.`}
          </p>
          {(selectedStatus !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl text-xs transition-colors cursor-pointer border border-border"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* 1. Mobile & Tablet Card Layout (< md): 0 horizontal scroll */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => {
              const qty = order.orderItems.reduce((sum, it) => sum + it.quantity, 0);
              const payment = order.payments[0];

              return (
                <div 
                  key={order.id} 
                  className="bg-card border border-border rounded-2xl p-4 shadow-2xs space-y-3.5 transition-all hover:border-brand-crimson/30"
                >
                  {/* Top Bar: Order ID, Status, Placed Date */}
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {renderStatusBadge(order.status)}
                  </div>

                  {/* Middle Info: Store & Financials */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{order.franchise.storeName}</h3>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase">{order.franchise.gstNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-brand-crimson font-mono">
                        ₹{order.finalAmount.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono font-bold">
                        {qty} units
                      </span>
                    </div>
                  </div>

                  {/* Invoice & Payment State Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs py-1 px-2.5 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">Payment:</span>
                      {payment ? (
                        <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {payment.paymentId}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">PENDING</span>
                      )}
                    </div>

                    <div>
                      {order.invoice ? (
                        <Link
                          href={`/portal/orders/${order.id}/invoice`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-crimson hover:underline"
                        >
                          <FileText size={12} />
                          <span className="font-mono">{order.invoice.invoiceNumber}</span>
                        </Link>
                      ) : order.proformaInvoice ? (
                        <Link
                          href={`/portal/proforma-invoices/${order.proformaInvoice.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:underline"
                        >
                          <FileText size={12} />
                          <span className="font-mono">{order.proformaInvoice.proformaNumber}</span>
                        </Link>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">No Invoice</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  {renderActionButtons(order, true)}
                </div>
              );
            })}
          </div>

          {/* 2. Desktop Tabular Layout (>= md) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
            <table className="w-full text-left text-sm border-collapse min-w-[900px]" aria-label="Franchise network order fulfillment registry">
              <thead>
                <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">
                  <th scope="col" className="py-3.5 px-4 w-28">Order ID</th>
                  <th scope="col" className="py-3.5 px-4 w-44">Franchise Store</th>
                  <th scope="col" className="py-3.5 px-4 w-28">Date Placed</th>
                  <th scope="col" className="py-3.5 px-4 w-20 text-right">Items</th>
                  <th scope="col" className="py-3.5 px-4 w-28 text-right">Invoice Total</th>
                  <th scope="col" className="py-3.5 px-4 w-32 text-center">Fulfillment</th>
                  <th scope="col" className="py-3.5 px-4 w-40 text-center">Payment ID</th>
                  <th scope="col" className="py-3.5 px-4 w-36 text-center">Tax Invoice</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((order) => {
                  const qty = order.orderItems.reduce((sum, it) => sum + it.quantity, 0);
                  const payment = order.payments[0];

                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold font-mono text-sm text-foreground">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground block truncate max-w-[170px]">
                          {order.franchise.storeName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase font-semibold">
                          {order.franchise.gstNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-muted-foreground font-mono">
                        {qty} units
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-brand-crimson font-mono">
                        ₹{order.finalAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {renderStatusBadge(order.status)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-foreground">
                        {payment ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                            {payment.paymentId}
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-bold block">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {order.invoice ? (
                          <Link
                            href={`/portal/orders/${order.id}/invoice`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-pink/60 hover:bg-brand-pink text-brand-crimson font-bold rounded-xl text-xs transition-colors border border-brand-pink/80 shadow-2xs min-h-[30px]"
                            title="View & Print Official Tax Invoice"
                          >
                            <FileText size={13} />
                            <span className="font-mono">{order.invoice.invoiceNumber}</span>
                          </Link>
                        ) : order.proformaInvoice ? (
                          <Link
                            href={`/portal/proforma-invoices/${order.proformaInvoice.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold rounded-xl text-xs transition-colors min-h-[30px]"
                            title="View Proforma Invoice"
                          >
                            <FileText size={13} />
                            <span className="font-mono">{order.proformaInvoice.proformaNumber}</span>
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {renderActionButtons(order, false)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}
