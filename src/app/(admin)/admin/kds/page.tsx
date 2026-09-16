'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  Bike,
  AlertTriangle,
  Flame,
  ShieldCheck,
  MapPin,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Calendar,
  DollarSign,
  PackageCheck,
  X,
  FileSpreadsheet,
  TrendingUp,
  Lock,
  UserCheck,
  Filter,
} from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/foodwok';
import { formatNairaFromKobo } from '@/lib/currency';
import { DailyAccountingRecord } from '@/app/api/accounting/route';

export default function KitchenDisplaySystemPage() {
  const { paidKitchenOrders, advanceOrderStatus } = useOrders();
  const { user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isMounted, setIsMounted] = useState(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  // Accounting Ledger Modal State (Restricted strictly to Admin)
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [ledgerRecords, setLedgerRecords] = useState<DailyAccountingRecord[]>([]);
  const [selectedLedgerDate, setSelectedLedgerDate] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_7_DAYS'>('ALL');
  const [showAccountingNotice, setShowAccountingNotice] = useState(false);

  // Update timer every 10 seconds for delay indicators
  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(Date.now());
    const interval = setInterval(() => setCurrentTime(Date.now()), 10000);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('notice') === 'accounting_restricted') {
        setShowAccountingNotice(true);
      }
    }

    return () => clearInterval(interval);
  }, []);

  // Fetch accounting ledgers from server API when modal opens
  const fetchLedgers = async () => {
    try {
      const res = await fetch('/api/accounting');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.ledgers)) {
          setLedgerRecords(data.ledgers);
          if (data.ledgers.length > 0 && !selectedLedgerDate) {
            setSelectedLedgerDate(data.ledgers[0].dateString);
          }
        }
      }
    } catch {}
  };

  const handleOpenLedgerModal = () => {
    if (!isAdmin) {
      alert('Access Restricted: Only Admin users have access to the Daily Accounting Ledger and financial reports.');
      return;
    }
    fetchLedgers();
    setShowLedgerModal(true);
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  // Group paid orders into KDS Kanban columns
  const newOrders = paidKitchenOrders.filter((o) => o.status === 'received');
  const preparingOrders = paidKitchenOrders.filter((o) => o.status === 'confirmed' || o.status === 'preparing');
  const deliveringOrders = paidKitchenOrders.filter((o) => o.status === 'delivering');
  const completedOrders = paidKitchenOrders.filter((o) => o.status === 'delivered');

  // Active Order Card rendering
  const renderActiveOrderCard = (order: Order) => {
    const elapsedMs = isMounted ? currentTime - (order.createdAtTimestamp || currentTime) : 0;
    const elapsedMins = Math.max(0, Math.floor(elapsedMs / (1000 * 60)));

    const isWarning = isMounted && elapsedMins >= 15 && elapsedMins < 25;
    const isUrgent = isMounted && elapsedMins >= 25;

    return (
      <div
        key={order.id}
        className={`bg-white rounded-3xl border p-5 shadow-xs space-y-4 transition-all ${
          isUrgent
            ? 'border-red-500 ring-2 ring-red-500/30 bg-red-50/20 animate-pulse'
            : isWarning
            ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-50/20'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-lg">
                #{order.id}
              </span>

              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                PAYSTACK VERIFIED
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Received {order.createdAt}</span>
              {isMounted && <span>• {elapsedMins}m elapsed</span>}
            </div>
          </div>

          {/* Urgent / Delayed Indicator */}
          {isUrgent ? (
            <span className="bg-red-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5" />
              URGENT DELAY
            </span>
          ) : isWarning ? (
            <span className="bg-amber-500 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              DELAYED
            </span>
          ) : null}
        </div>

        {/* Menu Items & Addons */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
            ORDER ITEMS & EXTRAS
          </span>

          <div className="space-y-3 divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-base">
                    {item.menuItem.name}{' '}
                    <span className="text-[#EB3223] font-bold">×{item.quantity}</span>
                  </span>
                </div>

                {item.selectedAddOns && item.selectedAddOns.length > 0 ? (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-2.5 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                      Addon Groups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.selectedAddOns.map((addOn) => (
                        <span
                          key={addOn.id}
                          className="bg-white border border-slate-300 text-slate-900 font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1"
                        >
                          <span className="text-[#EB3223]">+</span> {addOn.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No extra add-ons</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-slate-100/70 border border-slate-200/50 rounded-2xl p-3 text-xs space-y-1 font-medium">
          <div className="flex items-center justify-between text-slate-900 font-bold">
            <span>Customer: {order.deliveryDetails.fullName}</span>
            <span>{order.deliveryDetails.phoneNumber}</span>
          </div>
          <div className="text-slate-600 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#EB3223] shrink-0" />
            <span className="line-clamp-1">{order.deliveryDetails.address}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-100">
          {order.status === 'received' && (
            <button
              onClick={() => advanceOrderStatus(order.id, 'preparing')}
              className="w-full bg-[#EB3223] hover:bg-[#d62819] text-white py-3 rounded-2xl font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Flame className="w-4 h-4" />
              <span>Start Preparing</span>
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={() => advanceOrderStatus(order.id, 'delivering')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Bike className="w-4 h-4" />
              <span>Mark Ready for Delivery</span>
            </button>
          )}

          {order.status === 'delivering' && (
            <button
              onClick={() => advanceOrderStatus(order.id, 'delivered')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Order</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // COMPLETED ORDERS: Compact List Format (Expandable on click)
  const renderCompletedOrderRow = (order: Order) => {
    const isExpanded = expandedOrderIds.has(order.id);

    return (
      <div
        key={order.id}
        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
      >
        <div
          onClick={() => toggleOrderExpand(order.id)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors gap-2"
        >
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-black text-slate-900 text-sm tracking-tight">
              #{order.id}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
              {formatNairaFromKobo(order.totalInKobo)}
            </span>

            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 text-[11px] font-bold shrink-0"
            >
              <span>{isExpanded ? 'Hide' : 'Details'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-3 text-xs animate-fade-in">
            <div className="flex items-center justify-between text-slate-500 font-semibold border-b border-slate-200/60 pb-2">
              <span>Paystack Ref: {order.paystackReference}</span>
              <span>Time: {order.createdAt}</span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                MEALS & ADDONS
              </span>
              <div className="space-y-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="bg-white p-2.5 rounded-xl border border-slate-200/60 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{item.menuItem.name} ×{item.quantity}</span>
                      <span>{formatNairaFromKobo(item.itemTotalInKobo)}</span>
                    </div>

                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.selectedAddOns.map((addOn) => (
                          <span
                            key={addOn.id}
                            className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded"
                          >
                            + {addOn.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 space-y-1 text-slate-700 font-medium">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Customer: {order.deliveryDetails.fullName}</span>
                <span>{order.deliveryDetails.phoneNumber}</span>
              </div>
              <p className="text-slate-500">{order.deliveryDetails.address}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Filtered Ledgers by Time Period
  const filteredLedgers = ledgerRecords.filter((ledger) => {
    if (timeFilter === 'THIS_MONTH') {
      const currentMonth = new Date().toISOString().substring(0, 7); // "YYYY-MM"
      return ledger.dateString.startsWith(currentMonth);
    }
    if (timeFilter === 'LAST_7_DAYS') {
      const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return ledger.archivedAtTimestamp >= sevenDaysAgoMs;
    }
    return true;
  });

  const selectedLedger = ledgerRecords.find((l) => l.dateString === selectedLedgerDate);

  // Total Sales for the Current Month
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const totalMonthlySalesInKobo = ledgerRecords
    .filter((l) => l.dateString.startsWith(currentMonthStr))
    .reduce((sum, l) => sum + (l.totalRevenueInKobo || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header Bar (Cleaned up as requested: NO simulation, sound, shift close buttons) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kitchen Display System (KDS)
            </h1>
            <span className="bg-red-100 text-[#EB3223] text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          </div>
        </div>

        {/* Accounting Ledger Button (Visible strictly to ADMIN) */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link
              href="/admin/accounting"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold shadow-md flex items-center gap-2 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Accounting Ledger & Reports</span>
            </Link>
          </div>
        )}
      </div>

      {/* Restricted Area Notice Banner */}
      {showAccountingNotice && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs font-bold animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Restricted Access: The Daily Accounting Ledger is reserved strictly for Administrators. Your session has been redirected to the Kitchen KDS terminal.
            </span>
          </div>
          <button
            onClick={() => setShowAccountingNotice(false)}
            className="text-amber-700 hover:text-amber-950 text-xs font-black uppercase tracking-wider px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {/* Column 1: New Paid Orders */}
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200/80 rounded-2xl p-4 flex items-center justify-between text-red-900">
            <span className="font-black text-sm uppercase tracking-wider">
              NEW PAID ORDERS
            </span>
            <span className="bg-[#EB3223] text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
              {newOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {newOrders.length > 0 ? (
              newOrders.map((o) => renderActiveOrderCard(o))
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-400 text-xs font-medium">
                No new orders waiting
              </div>
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between text-amber-900">
            <span className="font-black text-sm uppercase tracking-wider">
              IN KITCHEN
            </span>
            <span className="bg-amber-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {preparingOrders.length > 0 ? (
              preparingOrders.map((o) => renderActiveOrderCard(o))
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-400 text-xs font-medium">
                No orders being prepared
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Ready for Delivery */}
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-4 flex items-center justify-between text-sky-900">
            <span className="font-black text-sm uppercase tracking-wider">
              OUT FOR DELIVERY
            </span>
            <span className="bg-sky-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
              {deliveringOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {deliveringOrders.length > 0 ? (
              deliveringOrders.map((o) => renderActiveOrderCard(o))
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-400 text-xs font-medium">
                No orders out for delivery
              </div>
            )}
          </div>
        </div>

        {/* Column 4: COMPLETED ORDERS */}
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between text-emerald-900">
            <span className="font-black text-sm uppercase tracking-wider">
              COMPLETED
            </span>
            <span className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {completedOrders.length > 0 ? (
              completedOrders.map((o) => renderCompletedOrderRow(o))
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-400 text-xs font-medium">
                No completed orders yet today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADMIN-ONLY DAILY ACCOUNTING LEDGER & FINANCIAL ANALYTICS MODAL */}
      {showLedgerModal && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">Admin Accounting & Financial Ledger</h2>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" /> ADMIN SECURE ACCESS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Financial archives, monthly sales aggregates, and staff attendance logs
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLedgerModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Time Period Filter & Monthly Aggregates Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-3xl">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  TOTAL SALES THIS MONTH
                </span>
                <p className="text-xl font-black text-emerald-700">
                  {formatNairaFromKobo(totalMonthlySalesInKobo)}
                </p>
              </div>

              <div className="space-y-1 col-span-2 flex flex-col justify-center">
                <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  TIME PERIOD FILTER
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTimeFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      timeFilter === 'ALL'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Records
                  </button>
                  <button
                    onClick={() => setTimeFilter('THIS_MONTH')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      timeFilter === 'THIS_MONTH'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => setTimeFilter('LAST_7_DAYS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      timeFilter === 'LAST_7_DAYS'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Last 7 Days
                  </button>
                </div>
              </div>
            </div>

            {/* Date Selection Bar */}
            {filteredLedgers.length > 0 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                    SELECT DATE RECORD
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {filteredLedgers.map((ledger) => {
                      const isSelected = ledger.dateString === selectedLedgerDate;
                      return (
                        <button
                          key={ledger.id}
                          onClick={() => setSelectedLedgerDate(ledger.dateString)}
                          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{ledger.formattedDate}</span>
                          <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                            {ledger.totalOrdersCount} orders
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedLedger && (
                  <div className="space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-emerald-50 border border-emerald-200/70 p-5 rounded-3xl space-y-1">
                        <span className="text-xs font-extrabold uppercase text-emerald-800 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          DAILY REVENUE
                        </span>
                        <p className="text-2xl font-black text-emerald-950">
                          {formatNairaFromKobo(selectedLedger.totalRevenueInKobo)}
                        </p>
                      </div>

                      <div className="bg-sky-50 border border-sky-200/70 p-5 rounded-3xl space-y-1">
                        <span className="text-xs font-extrabold uppercase text-sky-800 flex items-center gap-1.5">
                          <PackageCheck className="w-4 h-4 text-sky-600" />
                          COMPLETED ORDERS
                        </span>
                        <p className="text-2xl font-black text-sky-950">
                          {selectedLedger.totalOrdersCount} Orders
                        </p>
                      </div>

                      <div className="bg-amber-50 border border-amber-200/70 p-5 rounded-3xl space-y-1">
                        <span className="text-xs font-extrabold uppercase text-amber-800 flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-amber-600" />
                          AVERAGE ORDER VALUE
                        </span>
                        <p className="text-2xl font-black text-amber-950">
                          {selectedLedger.totalOrdersCount > 0
                            ? formatNairaFromKobo(
                                Math.round(
                                  selectedLedger.totalRevenueInKobo / selectedLedger.totalOrdersCount
                                )
                              )
                            : '₦0'}
                        </p>
                      </div>
                    </div>

                    {/* KITCHEN STAFF ATTENDANCE LOG (LOGIN / LOGOUT TIMESTAMPS) */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        Kitchen Staff Shift Attendance ({selectedLedger.formattedDate})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedLedger.kitchenStaffAttendance && selectedLedger.kitchenStaffAttendance.length > 0 ? (
                          selectedLedger.kitchenStaffAttendance.map((staff, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold"
                            >
                              <span className="font-bold text-slate-900">{staff.staffName}</span>
                              <div className="text-right space-y-0.5">
                                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-extrabold block">
                                  Logged In: {staff.loginTime}
                                </span>
                                {staff.logoutTime && (
                                  <span className="text-slate-500 text-[10px] block">
                                    Logged Out: {staff.logoutTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 bg-slate-50 p-4 rounded-2xl text-xs text-slate-400 italic text-center">
                            No staff login records logged for this date
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Itemized Dish Breakdown Table */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Itemized Sales Breakdown
                      </h4>

                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase">
                              <th className="p-3">Dish / Meal Name</th>
                              <th className="p-3 text-center">Units Sold</th>
                              <th className="p-3 text-right">Total Revenue</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60 font-medium text-slate-800">
                            {selectedLedger.itemizedSummary.map((item, idx) => (
                              <tr key={idx} className="hover:bg-white transition-colors">
                                <td className="p-3 font-bold">{item.name}</td>
                                <td className="p-3 text-center font-bold">{item.quantity}</td>
                                <td className="p-3 text-right font-black text-emerald-700">
                                  {formatNairaFromKobo(item.totalKobo)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-800">No Accounting Records for Selected Period</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    At 00:00 midnight every day, completed orders are automatically archived here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
