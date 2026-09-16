'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Minus, Plus, Check, Star, XCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useMenu } from '@/context/MenuContext';
import { AddOnOption } from '@/types/foodwok';
import { formatNairaFromKobo } from '@/lib/currency';
import { useCart } from '@/context/CartContext';

export default function MenuItemDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { items, addOns: globalAddOns } = useMenu();
  const { addToCart } = useCart();

  const item =
    items.find((i) => i.id === resolvedParams.itemId) || items[0];

  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [imgSrc, setImgSrc] = useState(item?.image || '');

  useEffect(() => {
    if (item?.image) {
      setImgSrc(item.image);
    }
  }, [item?.image]);

  if (!item) return null;

  const isDishAvailable = item.isAvailable !== false;

  // Smart Add-on Filtering: Use dish-tailored add-ons directly for strict dish compliance, with category fallback
  const availableDishAddOns = item.addOns && item.addOns.length > 0
    ? item.addOns
    : globalAddOns.filter((addOn) => {
        // Universal drinks apply across all meals
        if (addOn.categoryType === 'DRINK' || !addOn.scope || addOn.scope === 'UNIVERSAL') return true;

        // Category Specific add-ons check matching category ID
        if (
          addOn.scope === 'CATEGORY_SPECIFIC' &&
          addOn.applicableCategories &&
          addOn.applicableCategories.includes(item.category)
        ) {
          return true;
        }

        return false;
      });

  const toggleAddOn = (addOn: AddOnOption) => {
    if (addOn.isAvailable === false) return; // Prevent selecting out-of-stock add-on
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addOn.id)
        ? prev.filter((a) => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.priceInKobo, 0);
  const unitPriceInKobo = item.priceInKobo + addOnsTotal;
  const totalPriceInKobo = unitPriceInKobo * quantity;

  const handleAddToCart = () => {
    if (!isDishAvailable) return;
    addToCart(item, quantity, selectedAddOns);
    router.push('/cart');
  };

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
          <span>Back to Menu</span>
        </Link>

        {/* Full Screen Item Detail Container */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Full Dish Photo */}
          <div className="md:w-1/2 relative min-h-[320px] sm:min-h-[400px] md:min-h-[480px] rounded-3xl overflow-hidden bg-slate-100 shadow-sm">
            {!isDishAvailable ? (
              <span className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-xs font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-400" />
                CURRENTLY SOLD OUT
              </span>
            ) : item.badge ? (
              <span className="absolute top-4 left-4 z-10 bg-[#EB3223] text-white text-xs font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-lg shadow-sm">
                {item.badge}
              </span>
            ) : null}

            <img
              src={imgSrc || item.image}
              alt={item.name}
              onError={() =>
                setImgSrc(
                  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80'
                )
              }
              className={`w-full h-full object-cover ${!isDishAvailable ? 'grayscale-50' : ''}`}
            />
          </div>

          {/* Right Column: Title, Description, Add Extras & Add to Cart */}
          <div className="md:w-1/2 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Title & Rating */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200/60 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </span>
                  {item.ordersCount && (
                    <span className="text-slate-400 font-medium">
                      · {item.ordersCount}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {item.name}
                </h1>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed pt-1">
                  {item.fullDescription || item.description}
                </p>
              </div>

              {/* Add Extras Section: Food Add-ons & Drinks Side by Side */}
              {availableDishAddOns && availableDishAddOns.length > 0 && (() => {
                const drinkAddOns = availableDishAddOns.filter(
                  (a) => a.categoryType === 'DRINK' || (a.scope === 'UNIVERSAL' && !a.categoryType)
                );
                const foodAddOns = availableDishAddOns.filter(
                  (a) => a.categoryType === 'FOOD' || (a.scope === 'CATEGORY_SPECIFIC' && !a.categoryType)
                );

                const renderAddOnList = (list: AddOnOption[], title: string, icon: string) => (
                  <div className="space-y-3 flex-1 min-w-[220px]">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <span>{icon}</span>
                      <span>{title}</span>
                    </h4>

                    <div className="space-y-2">
                      {list.map((addOn) => {
                        const isExtraAvailable = addOn.isAvailable !== false;
                        const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                        return (
                          <div
                            key={addOn.id}
                            role="checkbox"
                            aria-checked={isChecked}
                            tabIndex={isExtraAvailable ? 0 : -1}
                            onClick={() => isExtraAvailable && toggleAddOn(addOn)}
                            onKeyDown={(e) => {
                              if (isExtraAvailable && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                toggleAddOn(addOn);
                              }
                            }}
                            className={`group border rounded-2xl p-3.5 flex items-center justify-between transition-all duration-200 ${
                              !isExtraAvailable
                                ? 'bg-slate-100/50 border-slate-200 cursor-not-allowed opacity-60'
                                : isChecked
                                ? 'bg-red-50/40 border-[#EB3223] shadow-xs cursor-pointer'
                                : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                                  isChecked
                                    ? 'bg-[#EB3223] border-[#EB3223] text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-slate-800 text-xs sm:text-sm font-semibold truncate">
                                {addOn.name}
                              </span>
                            </div>

                            {isExtraAvailable ? (
                              <span className="text-[#EB3223] text-xs sm:text-sm font-extrabold shrink-0">
                                +{formatNairaFromKobo(addOn.priceInKobo)}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-1.5 py-0.5 rounded shrink-0">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );

                return (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Add Extras
                    </h3>

                    {/* Side by Side Grid for Drinks vs Food */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {foodAddOns.length > 0 && renderAddOnList(foodAddOns, 'Food & Meal Extras', '🍲')}
                      {drinkAddOns.length > 0 && renderAddOnList(drinkAddOns, 'Drinks & Beverages', '🥤')}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Quantity Controller & Add to Cart Button */}
            <div className="space-y-5 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-900">
                  Quantity
                </span>

                <div className="flex items-center gap-4 bg-slate-100/80 rounded-2xl p-1.5 border border-slate-200/50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={!isDishAvailable || quantity <= 1}
                    className="w-10 h-10 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center border border-slate-200/60 shadow-2xs hover:bg-slate-50 disabled:opacity-40 transition-all"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-black text-slate-900 text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={!isDishAvailable}
                    className="w-10 h-10 rounded-xl bg-[#EB3223] text-white font-bold flex items-center justify-center shadow-sm hover:bg-[#d62819] disabled:opacity-40 transition-all"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Full-width Warm Red CTA Button */}
              <button
                onClick={handleAddToCart}
                disabled={!isDishAvailable}
                className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg flex items-center justify-between px-6 transition-all ${
                  isDishAvailable
                    ? 'bg-[#EB3223] hover:bg-[#d62819] text-white shadow-red-500/25 hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed'
                }`}
              >
                <span>{isDishAvailable ? 'Add to Cart' : 'Currently Sold Out'}</span>
                <span className="font-black text-xl">
                  {isDishAvailable ? formatNairaFromKobo(totalPriceInKobo) : '—'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
