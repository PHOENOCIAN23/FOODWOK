'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Phone, CheckCircle2, Clock, ChefHat, Bike, PartyPopper, Sparkles, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useOrders } from '@/context/OrderContext';
import { OrderStatus } from '@/types/foodwok';

export default function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const { getOrderById, advanceOrderStatus } = useOrders();

  const [currentOrder, setCurrentOrder] = useState(() => getOrderById(resolvedParams.orderId));
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  useEffect(() => {
    const found = getOrderById(resolvedParams.orderId);
    if (found) {
      setCurrentOrder(found);
    }
  }, [resolvedParams.orderId, getOrderById]);

  // Live status ticker simulation
  const activeStatus: OrderStatus = currentOrder?.status || 'preparing';
  const isDelivered = activeStatus === 'delivered';

  // Trigger Thank You celebration pop-up when status is delivered
  useEffect(() => {
    if (isDelivered) {
      setShowThankYouModal(true);
    }
  }, [isDelivered]);



  const steps = [
    {
      key: 'received',
      title: 'Order Placed',
      desc: 'We received your order',
      time: currentOrder?.createdAt || '2:15 PM',
      icon: CheckCircle2,
    },
    {
      key: 'confirmed',
      title: 'Confirmed',
      desc: 'Restaurant confirmed your order',
      icon: CheckCircle2,
    },
    {
      key: 'preparing',
      title: 'Preparing',
      desc: 'Your food is being prepared in kitchen',
      icon: ChefHat,
    },
    {
      key: 'delivering',
      title: 'Out for Delivery',
      desc: 'Rider is on the way to your address',
      icon: Bike,
    },
    {
      key: 'delivered',
      title: 'Delivered',
      desc: 'Food delivered! Enjoy your meal',
      icon: PartyPopper,
    },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'received':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'delivering':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(activeStatus);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Order Tracking
          </h1>
        </div>

        {/* 4-Card Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Top Left Card: Estimated Delivery Box (Dynamic Red -> Emerald Green shift) */}
          <div
            className={`rounded-3xl p-8 text-white shadow-xl transition-all duration-700 flex flex-col justify-between space-y-6 ${
              isDelivered
                ? 'bg-emerald-600 shadow-emerald-600/30'
                : 'bg-[#EB3223] shadow-red-500/20'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                {isDelivered ? 'STATUS' : 'ESTIMATED DELIVERY'}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black tracking-tight">
                  {isDelivered ? 'DELIVERED' : '30–45'}
                </span>
                <span className="text-sm font-bold text-white/90">
                  {isDelivered ? 'Enjoy your meal!' : 'minutes from now'}
                </span>
              </div>
            </div>

            {/* Live Progress Pill */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 text-sm font-semibold text-white flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>
                {activeStatus === 'received' && 'Order placed successfully...'}
                {activeStatus === 'confirmed' && 'Restaurant confirmed order...'}
                {activeStatus === 'preparing' && 'Kitchen preparing your food...'}
                {activeStatus === 'delivering' && 'Rider on the way...'}
                {activeStatus === 'delivered' && 'Order completed & delivered! Thank you for buying from Foodwok.'}
              </span>
            </div>
          </div>

          {/* Top Right Card: Live Map Graphic */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-100 min-h-[220px] bg-sky-200">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
              alt="Live Delivery Map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Floating Badge */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 text-slate-900 font-extrabold text-xs shadow-lg flex items-center gap-2 border border-slate-100">
              <Bike className={`w-4 h-4 transition-colors ${isDelivered ? 'text-emerald-600' : 'text-[#EB3223]'}`} />
              <span>
                {activeStatus === 'delivering'
                  ? 'Rider is 5 mins away'
                  : isDelivered
                  ? 'Arrived & Delivered at your location'
                  : 'Heading your way'}
              </span>
            </div>
          </div>

          {/* Bottom Left Card: Rider Details (Dynamic Red -> Emerald Green shift) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full text-white font-black text-xl flex items-center justify-center shadow-md transition-colors ${
                  isDelivered ? 'bg-emerald-600' : 'bg-[#EB3223]'
                }`}
              >
                EA
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 text-xs font-semibold block">
                  Your Rider
                </span>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {currentOrder?.riderName || 'Emeka Adeleke'}
                </h3>
                <span className="text-slate-500 text-xs font-bold block">
                  ★ {currentOrder?.riderRating || 4.95} · {currentOrder?.riderVehicle || 'Honda CB'}
                </span>
              </div>
            </div>

            <a
              href="tel:+2348000000000"
              className={`p-3.5 rounded-full text-white shadow-md hover:scale-105 transition-all ${
                isDelivered
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-[#EB3223] hover:bg-[#d62819] shadow-red-500/20'
              }`}
              title="Call Rider"
            >
              <Phone className="w-5 h-5 fill-current" />
            </a>
          </div>

          {/* Bottom Right Card: Live Status Timeline (Sequential Green shift as each segment completes) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Live Status
            </h2>

            <div className="space-y-6 relative pl-2">
              {/* Connector line */}
              <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-100 -z-0" />

              {steps.map((step, idx) => {
                const isCurrent = idx === currentStepIdx;
                const isCompleted = idx < currentStepIdx || isDelivered;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-4 relative z-10">
                    {/* Icon circle shifts to green ONLY after kitchen signals progress on completed steps */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isCurrent
                          ? 'bg-[#EB3223] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <StepIcon className="w-4 h-4 stroke-[2.5]" />
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-extrabold text-sm ${
                            isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {step.time && (
                          <span className="text-slate-400 text-xs font-semibold">
                            {step.time}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs font-medium">
                        {step.desc}
                      </p>

                      {/* Animated indicator for active step in progress */}
                      {isCurrent && !isDelivered && (
                        <div className="flex items-center gap-1 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EB3223] animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EB3223] animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EB3223] animate-bounce [animation-delay:0.4s]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Thank You Celebration Pop-up Modal when Delivered */}
      {showThankYouModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-6 border border-slate-100 relative animate-scale-in">
            <button
              onClick={() => setShowThankYouModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Celebration Icon Badge */}
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
              <PartyPopper className="w-10 h-10 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Thank You for Buying!
              </h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Your order <strong className="text-slate-900">#{currentOrder?.id || resolvedParams.orderId}</strong> has been delivered successfully. Thank you for choosing Foodwok for your meal!
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowThankYouModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm"
              >
                Enjoy Your Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
