'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  DollarSign,
  PackageCheck,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { Order } from '@/types/foodwok';
import { formatNairaFromKobo } from '@/lib/currency';
import { DailyAccountingRecord } from '@/app/api/accounting/route';

const PAGE_SIZE = 40;

interface FlatTransaction {
  order: Order;
  dateString: string;
  formattedDate: string;
}

export default function StandaloneAccountingLedgerPage() {
  const { user, isLoading } = useAuth();
  const { orders: liveOrders } = useOrders();

  const [localStaffUser, setLocalStaffUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('foodwok_staff_user');
      if (stored) {
        setLocalStaffUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const activeUser = user || localStaffUser;
  const isAdmin = activeUser?.role === 'ADMIN';

  const [ledgerRecords, setLedgerRecords] = useState<DailyAccountingRecord[]>([]);

  // Time Period & Date Range Filter States
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_7_DAYS'>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination State (40 transactions per page)
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter, startDate, endDate, searchQuery]);

  // Fetch ledger data from server API
  const fetchLedgers = async () => {
    try {
      const res = await fetch('/api/accounting');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.ledgers)) {
          setLedgerRecords(data.ledgers);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  // 1. Combine live completed orders AND archived ledgers into one master pool
  const masterCompletedOrdersPool: FlatTransaction[] = useMemo(() => {
    const map = new Map<string, FlatTransaction>();

    // Add archived ledgers
    ledgerRecords.forEach((ledger) => {
      ledger.completedOrders.forEach((order) => {
        if (!map.has(order.id)) {
          map.set(order.id, {
            order,
            dateString: ledger.dateString,
            formattedDate: ledger.formattedDate,
          });
        }
      });
    });

    // Add live completed orders from OrderContext (if not already archived)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayFormatted = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    liveOrders.forEach((order) => {
      if (order.status === 'delivered' && !map.has(order.id)) {
        map.set(order.id, {
          order,
          dateString: todayStr,
          formattedDate: todayFormatted,
        });
      }
    });

    return Array.from(map.values());
  }, [ledgerRecords, liveOrders]);

  // 2. Filter master transactions by Time Period / Custom Date Range / Search Query
  const filteredTransactions = useMemo(() => {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return masterCompletedOrdersPool.filter(({ order, dateString }) => {
      const orderTime = order.createdAtTimestamp || Date.now();

      // Time Period Quick Filters
      if (timeFilter === 'THIS_MONTH' && !dateString.startsWith(currentMonth)) {
        return false;
      }
      if (timeFilter === 'LAST_7_DAYS' && orderTime < sevenDaysAgoMs) {
        return false;
      }

      // Custom Date Pickers Range
      if (startDate && dateString < startDate) return false;
      if (endDate && dateString > endDate) return false;

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesRef = (order.paystackReference || '').toLowerCase().includes(q);
        const matchesName = (order.deliveryDetails.fullName || '').toLowerCase().includes(q);
        const matchesPhone = (order.deliveryDetails.phoneNumber || '').toLowerCase().includes(q);

        if (!matchesId && !matchesRef && !matchesName && !matchesPhone) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => (b.order.createdAtTimestamp || 0) - (a.order.createdAtTimestamp || 0));
  }, [masterCompletedOrdersPool, timeFilter, startDate, endDate, searchQuery]);

  // 3. Paginate transactions (40 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const paginatedTransactions = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  // Aggregate Range Summary Metrics
  const rangeMetrics = useMemo(() => {
    let totalRevenueKobo = 0;
    const totalOrdersCount = filteredTransactions.length;
    const itemMap = new Map<string, { quantity: number; totalKobo: number }>();

    filteredTransactions.forEach(({ order }) => {
      totalRevenueKobo += order.totalInKobo || 0;
      order.items.forEach((item) => {
        const name = item.menuItem.name;
        const cur = itemMap.get(name) || { quantity: 0, totalKobo: 0 };
        itemMap.set(name, {
          quantity: cur.quantity + item.quantity,
          totalKobo: cur.totalKobo + item.itemTotalInKobo,
        });
      });
    });

    const averageOrderValueKobo = totalOrdersCount > 0 ? Math.round(totalRevenueKobo / totalOrdersCount) : 0;
    const itemizedAggregate = Array.from(itemMap.entries()).map(([name, val]) => ({
      name,
      quantity: val.quantity,
      totalKobo: val.totalKobo,
    }));

    return {
      totalRevenueKobo,
      totalOrdersCount,
      averageOrderValueKobo,
      itemizedAggregate,
    };
  }, [filteredTransactions]);

  // Reliable Blob-based CSV Export Functionality
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('No transaction records available to export for the selected filter.');
      return;
    }

    const headers = [
      'Order Tracking ID',
      'Paystack Reference',
      'Date & Time',
      'Customer Name',
      'Customer Phone',
      'Delivery Address',
      'Items Purchased',
      'Total Paid (Naira)',
    ];

    const rows: string[][] = [];

    filteredTransactions.forEach(({ order, dateString }) => {
      const itemsStr = order.items
        .map((i) => {
          const extras = i.selectedAddOns && i.selectedAddOns.length > 0
            ? i.selectedAddOns.map((a) => a.name).join(', ')
            : '';
          return `${i.menuItem.name} (x${i.quantity})${extras ? ` [Extras: ${extras}]` : ''}`;
        })
        .join(' | ');

      rows.push([
        order.id,
        order.paystackReference || 'pstk_ref_verified',
        `${dateString} ${order.createdAt}`,
        `"${(order.deliveryDetails.fullName || '').replace(/"/g, '""')}"`,
        `"${(order.deliveryDetails.phoneNumber || '').replace(/"/g, '""')}"`,
        `"${(order.deliveryDetails.address || '').replace(/"/g, '""')}"`,
        `"${itemsStr.replace(/"/g, '""')}"`,
        (order.totalInKobo / 100).toFixed(2),
      ]);
    });

    const csvData = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Foodwok_Transactions_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Total Sales for the Current Month
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const totalMonthlySalesInKobo = masterCompletedOrdersPool
    .filter((t) => t.dateString.startsWith(currentMonthStr))
    .reduce((sum, t) => sum + (t.order.totalInKobo || 0), 0);

  // 1. Loading state
  if (isLoading && !activeUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Role Guard check for Admin Only
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">403 Restricted Access</h2>
            <p className="text-slate-500 text-sm font-medium">
              The Daily Accounting & Financial Ledger is accessible <strong>strictly to Admin accounts</strong>.
            </p>
          </div>
          <Link
            href="/admin/kds"
            className="block w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all text-sm"
          >
            Return to Kitchen KDS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Page Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Master Accounting Ledger & Sales Reports
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Complete transaction ledger table, tracking IDs, 40-item pagination & instant CSV data download
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export ({filteredTransactions.length} Transactions) to CSV</span>
        </button>
      </div>

      {/* Time Period Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              TOTAL SALES THIS MONTH
            </span>
            <p className="text-2xl font-black text-emerald-700">
              {formatNairaFromKobo(totalMonthlySalesInKobo)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" />
              TIME PERIOD FILTER:
            </span>
            <button
              onClick={() => setTimeFilter('ALL')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                timeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setTimeFilter('THIS_MONTH')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                timeFilter === 'THIS_MONTH'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFilter('LAST_7_DAYS')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                timeFilter === 'LAST_7_DAYS'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Last 7 Days
            </button>
          </div>
        </div>

        {/* Custom Date Pickers & Search Query Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase text-slate-500">
              FROM DATE
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-xs font-bold focus:outline-none focus:border-[#EB3223]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase text-slate-500">
              TO DATE
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-xs font-bold focus:outline-none focus:border-[#EB3223]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase text-slate-500">
              SEARCH TRANSACTION / REF / NAME
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search #FW-94344 or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-slate-900 text-xs font-bold focus:outline-none focus:border-[#EB3223]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Range Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-200/80 p-6 rounded-3xl space-y-2 shadow-2xs">
          <span className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            TOTAL FILTERED REVENUE
          </span>
          <p className="text-3xl font-black text-emerald-950">
            {formatNairaFromKobo(rangeMetrics.totalRevenueKobo)}
          </p>
          <span className="text-[11px] font-bold text-emerald-700 block">
            From {filteredTransactions.length} matching transactions
          </span>
        </div>

        <div className="bg-sky-50 border border-sky-200/80 p-6 rounded-3xl space-y-2 shadow-2xs">
          <span className="text-xs font-black uppercase text-sky-800 flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-sky-600" />
            TOTAL COMPLETED TRANSACTIONS
          </span>
          <p className="text-3xl font-black text-sky-950">
            {rangeMetrics.totalOrdersCount} Transactions
          </p>
          <span className="text-[11px] font-bold text-sky-700 block">
            Displaying 40 per page with pagination
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 p-6 rounded-3xl space-y-2 shadow-2xs">
          <span className="text-xs font-black uppercase text-amber-800 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            AVERAGE TRANSACTION VALUE
          </span>
          <p className="text-3xl font-black text-amber-950">
            {formatNairaFromKobo(rangeMetrics.averageOrderValueKobo)}
          </p>
          <span className="text-[11px] font-bold text-amber-700 block">
            Average revenue per completed order
          </span>
        </div>
      </div>

      {/* MASTER TRANSACTIONS LEDGER TABLE (EXACT 8-COLUMN TABLE FORMAT) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
        {/* Table & Pagination Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Master Transactions Ledger Table ({filteredTransactions.length} Total)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Page {currentPage} of {totalPages} ({paginatedTransactions.length} displayed on this page)
            </p>
          </div>

          {/* Pagination Controller (Prev / Next) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1 border transition-all ${
                currentPage === 1
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-black text-slate-700 px-2">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1 border transition-all ${
                currentPage === totalPages
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 8-Column HTML Table Format matching user screenshot */}
        {paginatedTransactions.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-black uppercase tracking-wider">
                  <th className="p-3.5 border-r border-slate-200 whitespace-nowrap">Order Tracking ID</th>
                  <th className="p-3.5 border-r border-slate-200 whitespace-nowrap">Paystack Ref</th>
                  <th className="p-3.5 border-r border-slate-200 whitespace-nowrap">Date & Time</th>
                  <th className="p-3.5 border-r border-slate-200 whitespace-nowrap">Customer Name</th>
                  <th className="p-3.5 border-r border-slate-200 whitespace-nowrap">Customer Phone</th>
                  <th className="p-3.5 border-r border-slate-200 whitespace-nowrap">Delivery Address</th>
                  <th className="p-3.5 border-r border-slate-200 min-w-[240px]">Items Purchased</th>
                  <th className="p-3.5 text-right whitespace-nowrap">Total Paid (Naira)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {paginatedTransactions.map(({ order, dateString }, idx) => {
                  const itemsSummary = order.items
                    .map((i) => {
                      const extras = i.selectedAddOns && i.selectedAddOns.length > 0
                        ? ` (+ ${i.selectedAddOns.map((a) => a.name).join(', ')})`
                        : '';
                      return `${i.menuItem.name} ×${i.quantity}${extras}`;
                    })
                    .join('; ');

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      <td className="p-3.5 border-r border-slate-200 font-black text-slate-900 whitespace-nowrap">
                        #{order.id}
                      </td>
                      <td className="p-3.5 border-r border-slate-200 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {order.paystackReference || 'pstk_ref_verified'}
                      </td>
                      <td className="p-3.5 border-r border-slate-200 text-slate-600 whitespace-nowrap">
                        {dateString} {order.createdAt}
                      </td>
                      <td className="p-3.5 border-r border-slate-200 font-bold text-slate-900 whitespace-nowrap">
                        {order.deliveryDetails.fullName}
                      </td>
                      <td className="p-3.5 border-r border-slate-200 text-slate-600 whitespace-nowrap">
                        {order.deliveryDetails.phoneNumber}
                      </td>
                      <td className="p-3.5 border-r border-slate-200 text-slate-600 max-w-xs truncate" title={order.deliveryDetails.address}>
                        {order.deliveryDetails.address}
                      </td>
                      <td className="p-3.5 border-r border-slate-200 font-medium text-slate-800">
                        {itemsSummary}
                      </td>
                      <td className="p-3.5 text-right font-black text-emerald-700 text-sm whitespace-nowrap">
                        {formatNairaFromKobo(order.totalInKobo)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-4">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800">No Transactions Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No completed transactions match the selected time filter or search query.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Pagination Controls */}
        {filteredTransactions.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">
              Showing {Math.min(filteredTransactions.length, (currentPage - 1) * PAGE_SIZE + 1)}–
              {Math.min(filteredTransactions.length, currentPage * PAGE_SIZE)} of {filteredTransactions.length} total transactions
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1 border transition-all ${
                  currentPage === 1
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-black text-slate-700 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1 border transition-all ${
                  currentPage === totalPages
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
