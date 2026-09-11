'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, X, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { formatNairaFromKobo } from '@/lib/currency';

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotalInKobo,
    deliveryFeeInKobo,
    totalInKobo,
    totalItemsCount,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        {/* Title matching reference screenshot */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          My Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4 relative group">
                    {/* Item Thumbnail */}
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 shrink-0"
                    />

                    {/* Item Info */}
                    <div className="flex-1 space-y-1 pr-6">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        {item.menuItem.name}
                      </h3>
                      
                      <span className="text-slate-400 text-xs font-medium block">
                        ×{item.quantity}
                      </span>

                      {/* Add-ons list if any */}
                      {item.selectedAddOns.length > 0 && (
                        <div className="text-xs text-slate-500 pt-1 space-y-0.5">
                          {item.selectedAddOns.map((addOn) => (
                            <div key={addOn.id} className="flex items-center justify-between max-w-xs">
                              <span>+ {addOn.name}</span>
                              <span className="text-slate-400 font-medium">
                                {formatNairaFromKobo(addOn.priceInKobo)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price & Remove Button matching reference screenshot */}
                    <div className="text-right flex flex-col justify-between items-end h-full">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-slate-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <span className="text-[#EB3223] font-black text-base sm:text-lg tracking-tight mt-6">
                        {formatNairaFromKobo(item.itemTotalInKobo)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary matching reference screenshot */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-slate-100 pb-4 text-sm font-medium">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-bold text-slate-900">
                    {formatNairaFromKobo(subtotalInKobo)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery fee</span>
                  <span className="font-bold text-slate-900">
                    {formatNairaFromKobo(deliveryFeeInKobo)}
                  </span>
                </div>
              </div>

              {/* Total Line */}
              <div className="flex items-center justify-between text-lg font-black pt-1">
                <span className="text-slate-900">Total</span>
                <span className="text-[#EB3223] text-2xl">
                  {formatNairaFromKobo(totalInKobo)}
                </span>
              </div>

              {/* Proceed to Checkout CTA Button */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-[#EB3223] hover:bg-[#d62819] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all text-center"
              >
                Proceed to Checkout
              </button>

              {/* Add More Items Link */}
              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-slate-500 hover:text-[#EB3223] text-xs font-semibold transition-colors"
                >
                  + Add more items
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#EB3223] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Your cart is empty</h2>
            <p className="text-slate-500 text-sm">
              Looks like you haven&apos;t added any delicious Nigerian meals to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#EB3223] text-white font-bold px-8 py-3 rounded-2xl shadow-md hover:bg-[#d62819] transition-all"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
