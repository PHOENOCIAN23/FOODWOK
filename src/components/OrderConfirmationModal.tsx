'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { Order } from '@/types/foodwok';

interface OrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-6 relative border border-slate-100 animate-scale-up">
        {/* Top Success Badge with Check */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs mx-auto">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-1.5">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Order Received!
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Your order has been successfully placed and confirmed.
          </p>
          <p className="text-slate-400 text-xs font-semibold pt-1">
            Estimated delivery: <span className="text-slate-700 font-bold">30–45 minutes</span>
          </p>
        </div>

        {/* Order Details Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium space-y-2.5 text-left">
          <div className="flex items-center justify-between text-slate-500">
            <span>Order ID</span>
            <span className="font-extrabold text-slate-900">#{order.id}</span>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span>Delivery time</span>
            <span className="font-bold text-slate-800">{order.estimatedDeliveryMinutes} minutes</span>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span>Payment</span>
            <span className="font-extrabold text-emerald-600 flex items-center gap-1">
              Confirmed ✓
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              onClose();
              router.push(`/track/${order.id}`);
            }}
            className="w-full bg-[#EB3223] hover:bg-[#d62819] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            Track My Order
          </button>

          <button
            onClick={() => {
              onClose();
              router.push('/');
            }}
            className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
