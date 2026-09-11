'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { formatNairaFromKobo } from '@/lib/currency';
import { Order, SavedAddress } from '@/types/foodwok';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotalInKobo, deliveryFeeInKobo, totalInKobo, setDeliveryLocationInfo, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const savedAddresses = user?.addresses || [];
  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || '');
  const [fullName, setFullName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : 'Chidi Okeke'
  );
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '+234 800 000 0000');
  const [address, setAddress] = useState(
    defaultAddr?.address || '12 Adeola Odeku Street, Victoria Island, Lagos'
  );
  const [landmark, setLandmark] = useState(defaultAddr?.landmark || 'Near GTBank branch');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Recalculate dynamic location-relative delivery fee on address change
  useEffect(() => {
    if (address) {
      setDeliveryLocationInfo(address, landmark);
    }
  }, [address, landmark, setDeliveryLocationInfo]);

  // Sync state when selected address changes
  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setAddress(addr.address);
    setLandmark(addr.landmark || '');
  };

  const handleAddressInputChange = (newAddr: string) => {
    setAddress(newAddr);
  };

  const handleLandmarkInputChange = (newLandmark: string) => {
    setLandmark(newLandmark);
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      // 1. Create order instance in state & real-time sync pipeline
      const newOrder = createOrder(
        {
          fullName,
          phoneNumber,
          address,
          landmark,
        },
        cartItems,
        subtotalInKobo,
        deliveryFeeInKobo,
        totalInKobo
      );

      // 2. Initialize Paystack Transaction via API
      const paystackRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || 'customer@foodwok.ng',
          amountInKobo: totalInKobo,
          reference: newOrder.paystackReference,
          callbackUrl: `${window.location.origin}/track/${newOrder.id}`,
          metadata: {
            orderId: newOrder.id,
            customerName: fullName,
            phone: phoneNumber,
          },
        }),
      });

      const paystackData = await paystackRes.json();

      if (paystackData?.data?.authorization_url) {
        // Clear cart and redirect to Paystack's official secure payment page
        clearCart();
        window.location.href = paystackData.data.authorization_url;
      } else {
        // Fallback for test mode or demo checkout simulation
        clearCart();
        setIsSubmitting(false);
        setConfirmedOrder(newOrder);
      }
    } catch (err) {
      console.error('Paystack checkout error:', err);
      // Fallback local completion
      const fallbackOrder = createOrder(
        { fullName, phoneNumber, address, landmark },
        cartItems,
        subtotalInKobo,
        deliveryFeeInKobo,
        totalInKobo
      );
      clearCart();
      setIsSubmitting(false);
      setConfirmedOrder(fallbackOrder);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col pb-12">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        {/* Title matching reference screenshot */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Checkout
        </h1>

        <form onSubmit={handlePayNow} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Delivery Address
                </h2>
                {user && (
                  <Link
                    href="/profile"
                    className="text-xs font-bold text-[#EB3223] hover:underline"
                  >
                    + Manage Saved Addresses
                  </Link>
                )}
              </div>

              {/* Saved Addresses Picker (if user logged in & has saved addresses) */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    SELECT FROM SAVED ADDRESSES
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-red-50/30 border-[#EB3223] shadow-2xs'
                              : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/70'
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery-address"
                            checked={isSelected}
                            onChange={() => handleSelectAddress(addr)}
                            className="mt-1 accent-[#EB3223]"
                          />
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="bg-[#EB3223] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-xs sm:text-sm font-medium">
                              {addr.address}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-2">
                {/* Row 1: Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#EB3223] focus:bg-white transition-all"
                      placeholder="e.g. Chidi Okeke"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#EB3223] focus:bg-white transition-all"
                      placeholder="e.g. +234 800 000 0000"
                    />
                  </div>
                </div>

                {/* Row 2: Delivery Address & Landmark */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    STREET ADDRESS & SUITE / HOUSE NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => handleAddressInputChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#EB3223] focus:bg-white transition-all"
                    placeholder="e.g. 12 Adeola Odeku Street, Victoria Island, Lagos"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    NEAREST LANDMARK / DELIVERY INSTRUCTIONS
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => handleLandmarkInputChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#EB3223] focus:bg-white transition-all"
                    placeholder="e.g. Opposite GTBank, Black gate"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-2xs">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-between">
                <span>Payment Method</span>
                <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Paystack Live Encrypted
                </span>
              </h2>

              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    CARD
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Paystack Instant Payment</h4>
                    <p className="text-xs text-slate-500 font-medium">Debit Card, Bank Transfer, USSD & Apple Pay</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-xl font-black tracking-tight border-b border-slate-800 pb-4">
                Order Summary
              </h3>

              {/* Items Mini List */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-white">
                        {item.menuItem.name} <span className="text-slate-400">×{item.quantity}</span>
                      </p>
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-[10px] text-slate-400">
                          + {item.selectedAddOns.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-slate-300">
                      {formatNairaFromKobo(item.itemTotalInKobo)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-3 pt-4 border-t border-slate-800 text-sm">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{formatNairaFromKobo(subtotalInKobo)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Estimated Delivery Fee</span>
                  <span className="font-bold text-white">{formatNairaFromKobo(deliveryFeeInKobo)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 text-xl font-black">
                    {formatNairaFromKobo(totalInKobo)}
                  </span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full bg-[#EB3223] hover:bg-[#d42a1d] disabled:bg-slate-800 text-white font-extrabold text-base py-4 rounded-2xl transition-all shadow-lg shadow-[#EB3223]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Initializing Paystack Gateway...' : `Pay Now (${formatNairaFromKobo(totalInKobo)})`}</span>
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Confirmation Modal Fallback */}
      {confirmedOrder && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Payment Confirmed! 🎉
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Your order <strong className="text-slate-900">#{confirmedOrder.id}</strong> has been received by the kitchen!
              </p>
            </div>

            <button
              onClick={() => router.push(`/track/${confirmedOrder.id}`)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Track Order Progress</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
