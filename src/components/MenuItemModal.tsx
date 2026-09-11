'use client';

import React, { useState } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';
import { MenuItem, AddOnOption } from '@/types/foodwok';
import { formatNairaFromKobo } from '@/lib/currency';
import { useCart } from '@/context/CartContext';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const toggleAddOn = (addOn: AddOnOption) => {
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
    addToCart(item, quantity, selectedAddOns);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative max-h-[90vh] md:max-h-[85vh] animate-scale-up border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Dish Image Banner */}
        <div className="md:w-1/2 relative min-h-[240px] md:min-h-full bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Description & Extras Customization matching reference screenshot */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {item.name}
              </h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Add Extras Section */}
            {item.addOns && item.addOns.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Add Extras
                </h3>

                <div className="space-y-2.5">
                  {item.addOns.map((addOn) => {
                    const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                    return (
                      <div
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`group border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                          isChecked
                            ? 'bg-red-50/40 border-[#EB3223] shadow-xs'
                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked
                                ? 'bg-[#EB3223] border-[#EB3223] text-white'
                                : 'border-slate-300 bg-white group-hover:border-slate-400'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-slate-800 text-sm font-semibold">
                            {addOn.name}
                          </span>
                        </div>

                        <span className="text-[#EB3223] text-sm font-bold">
                          +{formatNairaFromKobo(addOn.priceInKobo)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector & CTA Button */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* Quantity Controller */}
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-slate-900">
                Quantity
              </span>

              <div className="flex items-center gap-4 bg-slate-100/80 rounded-2xl p-1.5 border border-slate-200/50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center border border-slate-200/60 shadow-2xs hover:bg-slate-50 disabled:opacity-40 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-black text-slate-900 text-base">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-xl bg-[#EB3223] text-white font-bold flex items-center justify-center shadow-sm hover:bg-[#d62819] transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Warm Red Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#EB3223] hover:bg-[#d62819] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 flex items-center justify-between px-6 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <span>Add to Cart</span>
              <span className="font-black text-lg">
                {formatNairaFromKobo(totalPriceInKobo)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
