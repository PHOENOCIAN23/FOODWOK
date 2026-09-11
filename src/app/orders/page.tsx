'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useOrders } from '@/context/OrderContext';
import { formatNairaFromKobo } from '@/lib/currency';

export default function OrdersPage() {
  const router = useRouter();
  const { activeOrders, pastOrders, reorder } = useOrders();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            My Orders
          </h1>

          {/* Two Tabs matching requirement */}
          <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Orders ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'past'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past Orders ({pastOrders.length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {displayedOrders.length > 0 ? (
          <div className="space-y-4">
            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 text-base">
                      #{order.id}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold">
                      {order.createdAt}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700 animate-pulse'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                        />
                        <span className="font-semibold text-slate-800">
                          {item.menuItem.name} <span className="text-slate-400">×{item.quantity}</span>
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatNairaFromKobo(item.itemTotalInKobo)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-400 text-xs font-medium block">Total Paid</span>
                    <span className="text-[#EB3223] font-black text-lg">
                      {formatNairaFromKobo(order.totalInKobo)}
                    </span>
                  </div>

                  {activeTab === 'active' ? (
                    <Link
                      href={`/track/${order.id}`}
                      className="bg-[#EB3223] hover:bg-[#d62819] text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-red-500/20 inline-flex items-center gap-1.5 transition-all"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        reorder(order);
                        router.push('/cart');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition-all"
                    >
                      Re-order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No {activeTab} orders</h2>
            <p className="text-slate-500 text-sm">
              You don&apos;t have any {activeTab} orders right now.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
