'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, AddOnOption, CartItem } from '@/types/foodwok';
import { calculateDeliveryFeeFromLocation, DeliveryCalculationResult } from '@/lib/deliveryCalculator';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (menuItem: MenuItem, quantity: number, selectedAddOns: AddOnOption[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotalInKobo: number;
  deliveryFeeInKobo: number;
  totalInKobo: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeCustomizingItem: MenuItem | null;
  setActiveCustomizingItem: (item: MenuItem | null) => void;
  deliveryLocation: string;
  deliveryDispatchInfo: DeliveryCalculationResult;
  setDeliveryLocationInfo: (address: string, landmark?: string) => void;
}

const INITIAL_DEMO_CART: CartItem[] = [
  {
    id: 'cart-init-1',
    menuItem: {
      id: 'smoky-jollof-rice',
      name: 'Smoky Jollof Rice',
      category: 'rice',
      description: 'Perfectly seasoned Nigerian party jollof with rich tomato base, smoked paprika, and a charcoal finish.',
      priceInKobo: 350000,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      addOns: [],
    },
    quantity: 1,
    selectedAddOns: [],
    itemTotalInKobo: 350000,
  },
];

const DEFAULT_ADDRESS = '12 Adeola Odeku Street, Victoria Island, Lagos';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_DEMO_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCustomizingItem, setActiveCustomizingItem] = useState<MenuItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Dynamic location & delivery calculation state
  const [deliveryLocation, setDeliveryLocation] = useState<string>(DEFAULT_ADDRESS);
  const [deliveryDispatchInfo, setDeliveryDispatchInfo] = useState<DeliveryCalculationResult>(() =>
    calculateDeliveryFeeFromLocation(DEFAULT_ADDRESS)
  );

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('foodwok_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {
        // Fallback
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('foodwok_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const setDeliveryLocationInfo = useCallback((address: string, landmark?: string) => {
    if (!address) return;
    setDeliveryLocation(address);
    const result = calculateDeliveryFeeFromLocation(address, landmark);
    setDeliveryDispatchInfo((prev) => {
      if (prev.feeInKobo === result.feeInKobo && prev.zoneName === result.zoneName) {
        return prev;
      }
      return result;
    });
  }, []);

  const addToCart = (menuItem: MenuItem, quantity: number, selectedAddOns: AddOnOption[]) => {
    const addOnsCost = selectedAddOns.reduce((acc, addOn) => acc + addOn.priceInKobo, 0);
    const unitPrice = menuItem.priceInKobo + addOnsCost;
    const itemTotalInKobo = unitPrice * quantity;

    const newItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity,
      selectedAddOns,
      itemTotalInKobo,
    };

    setCartItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const addOnsCost = item.selectedAddOns.reduce((acc, addOn) => acc + addOn.priceInKobo, 0);
          const unitPrice = item.menuItem.priceInKobo + addOnsCost;
          return {
            ...item,
            quantity: newQuantity,
            itemTotalInKobo: unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotalInKobo = cartItems.reduce((acc, item) => acc + item.itemTotalInKobo, 0);
  const deliveryFeeInKobo = cartItems.length > 0 ? deliveryDispatchInfo.feeInKobo : 0;
  const totalInKobo = subtotalInKobo + deliveryFeeInKobo;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotalInKobo,
        deliveryFeeInKobo,
        totalInKobo,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
        activeCustomizingItem,
        setActiveCustomizingItem,
        deliveryLocation,
        deliveryDispatchInfo,
        setDeliveryLocationInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
