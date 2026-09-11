'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Order, CartItem, DeliveryDetails, OrderStatus } from '@/types/foodwok';
import { playKitchenOrderChime } from '@/lib/audioAlert';

interface OrderContextType {
  orders: Order[];
  createOrder: (
    deliveryDetails: DeliveryDetails,
    items: CartItem[],
    subtotalInKobo: number,
    deliveryFeeInKobo: number,
    totalInKobo: number
  ) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  activeOrders: Order[];
  pastOrders: Order[];
  paidKitchenOrders: Order[];
  advanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  reorder: (order: Order) => void;
  simulateIncomingPaystackOrder: () => Order;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  archiveCurrentDayAndResetBoard: () => Promise<boolean>;
}

const INITIAL_DEMO_ORDER: Order = {
  id: 'FW-94344',
  status: 'preparing',
  paymentStatus: 'PAID',
  paystackReference: 'pstk_ref_94344_live',
  paystackVerified: true,
  items: [
    {
      id: 'demo-item-1',
      menuItem: {
        id: 'smoky-jollof-rice',
        name: 'Smoky Party Jollof Rice',
        category: 'rice',
        description: 'Perfectly seasoned Nigerian party jollof with rich tomato base, smoked paprika, and a charcoal finish.',
        priceInKobo: 350000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        addOns: [],
      },
      quantity: 1,
      selectedAddOns: [
        { id: 'extra-beef', name: 'Extra Beef', priceInKobo: 50000 },
        { id: 'salad', name: 'Salad / Coleslaw', priceInKobo: 20000 },
      ],
      itemTotalInKobo: 420000,
    },
  ],
  deliveryDetails: {
    fullName: 'Chidi Okeke',
    phoneNumber: '+234 800 000 0000',
    address: '12 Adeola Odeku Street, Victoria Island, Lagos',
    landmark: 'Near GTBank branch',
  },
  subtotalInKobo: 420000,
  deliveryFeeInKobo: 50000,
  totalInKobo: 470000,
  createdAt: '2:15 PM',
  createdAtTimestamp: Date.now() - 10 * 60 * 1000, // 10 mins ago
  estimatedDeliveryMinutes: '30–45',
  riderName: 'Emeka Adeleke',
  riderVehicle: 'Honda CB',
  riderRating: 4.95,
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([INITIAL_DEMO_ORDER]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [lastServerSyncTimestamp, setLastServerSyncTimestamp] = useState<number>(0);
  const [currentDayDateString, setCurrentDayDateString] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const knownOrderIdsRef = useRef<Set<string>>(new Set([INITIAL_DEMO_ORDER.id]));

  // Helper to push actions to server /api/orders-sync
  const pushServerAction = useCallback(async (payload: any) => {
    try {
      const res = await fetch('/api/orders-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.lastUpdated) {
          setLastServerSyncTimestamp(data.lastUpdated);
        }
      }
    } catch {}
  }, []);

  // Helper to pull orders from server /api/orders-sync
  const pullOrdersFromServer = useCallback(async () => {
    try {
      const res = await fetch('/api/orders-sync');
      if (res.ok) {
        const data = await res.json();
        if (data && data.lastUpdated && data.lastUpdated > lastServerSyncTimestamp) {
          if (Array.isArray(data.orders)) {
            const serverOrders: Order[] = data.orders;

            // Check if a new order arrived for chime alert
            let hasNewOrder = false;
            for (const o of serverOrders) {
              if (!knownOrderIdsRef.current.has(o.id)) {
                knownOrderIdsRef.current.add(o.id);
                hasNewOrder = true;
              }
            }

            if (hasNewOrder && isSoundEnabled) {
              playKitchenOrderChime();
            }

            setOrders(serverOrders);
            localStorage.setItem('foodwok_orders', JSON.stringify(serverOrders));
          }
          setLastServerSyncTimestamp(data.lastUpdated);
        }
      }
    } catch {}
  }, [lastServerSyncTimestamp, isSoundEnabled]);

  // Archive current day's completed orders to ledger database and clear completed board
  const archiveCurrentDayAndResetBoard = useCallback(async (): Promise<boolean> => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const completedOrders = orders.filter((o) => o.status === 'delivered');

      if (completedOrders.length > 0) {
        // Send archive payload to accounting endpoint
        await fetch('/api/accounting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'ARCHIVE_DAY',
            targetDateString: todayStr,
            orders: orders,
          }),
        });
      }

      // Remove completed orders from active board for the new day
      const remainingActiveOrders = orders.filter((o) => o.status !== 'delivered');
      setOrders(remainingActiveOrders);
      localStorage.setItem('foodwok_orders', JSON.stringify(remainingActiveOrders));
      await pushServerAction({ action: 'SYNC_ALL', orders: remainingActiveOrders });

      return true;
    } catch {
      return false;
    }
  }, [orders, pushServerAction]);

  // Check for Midnight (00:00) Rollover automatically
  useEffect(() => {
    if (!isMounted) return;

    const checkMidnightRollover = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      if (todayStr !== currentDayDateString) {
        // Clock has hit 00:00 midnight! Perform auto-rollover
        archiveCurrentDayAndResetBoard();
        setCurrentDayDateString(todayStr);
      }
    };

    const interval = setInterval(checkMidnightRollover, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [isMounted, currentDayDateString, archiveCurrentDayAndResetBoard]);

  // Initial load from localStorage & server seed
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('foodwok_orders');
    let loadedOrders = [INITIAL_DEMO_ORDER];

    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedOrders = parsed;
        }
      } catch {}
    }

    setOrders(loadedOrders);
    loadedOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));

    // Seed server
    pushServerAction({ action: 'SYNC_ALL', orders: loadedOrders });
  }, [pushServerAction]);

  // Real-time polling (1s) & window focus listeners
  useEffect(() => {
    if (!isMounted) return;

    pullOrdersFromServer();
    const interval = setInterval(pullOrdersFromServer, 1000);

    const handleFocus = () => pullOrdersFromServer();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [isMounted, pullOrdersFromServer]);

  // Save to localStorage on state change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('foodwok_orders', JSON.stringify(orders));
    }
  }, [orders, isMounted]);

  const createOrder = (
    deliveryDetails: DeliveryDetails,
    items: CartItem[],
    subtotalInKobo: number,
    deliveryFeeInKobo: number,
    totalInKobo: number
  ): Order => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const pstkRef = `pstk_ref_${randomDigits}_live`;

    const newOrder: Order = {
      id: `FW-${randomDigits}`,
      status: 'received',
      paymentStatus: 'PENDING',
      paystackReference: pstkRef,
      paystackVerified: false,
      items,
      deliveryDetails,
      subtotalInKobo,
      deliveryFeeInKobo,
      totalInKobo,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtTimestamp: Date.now(),
      estimatedDeliveryMinutes: '30–45',
      riderName: 'Emeka Adeleke',
      riderVehicle: 'Honda CB',
      riderRating: 4.95,
    };

    knownOrderIdsRef.current.add(newOrder.id);
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);

    if (isSoundEnabled) {
      playKitchenOrderChime();
    }

    pushServerAction({ action: 'CREATE_ORDER', order: newOrder });

    return newOrder;
  };

  const simulateIncomingPaystackOrder = (): Order => {
    const dishes = [
      {
        id: 'jollof-spaghetti',
        name: 'Jollof Spaghetti',
        category: 'pasta' as const,
        description: 'Tomato-stewed spaghetti Nigerian style.',
        priceInKobo: 280000,
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        addOns: [],
      },
      {
        id: 'nigerian-fried-rice',
        name: 'Nigerian Fried Rice',
        category: 'rice' as const,
        description: 'Colorful stir-fried rice tossed with prawns.',
        priceInKobo: 320000,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        addOns: [],
      },
    ];

    const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
    const randomDigits = Math.floor(10000 + Math.random() * 90000);

    const newOrder: Order = {
      id: `FW-${randomDigits}`,
      status: 'received',
      paymentStatus: 'PAID',
      paystackReference: `pstk_ref_${randomDigits}_hmac_verified`,
      paystackVerified: true,
      items: [
        {
          id: `item-${Date.now()}`,
          menuItem: randomDish,
          quantity: 1,
          selectedAddOns: [
            { id: 'extra-beef', name: 'Extra Beef', priceInKobo: 50000 },
            { id: 'plantain', name: 'Fried Plantain', priceInKobo: 30000 },
          ],
          itemTotalInKobo: randomDish.priceInKobo + 80000,
        },
      ],
      deliveryDetails: {
        fullName: 'Kelechi Nwosu',
        phoneNumber: '+234 812 345 6789',
        address: '88 Lekki Phase 1, Admiralty Way, Lagos',
        landmark: 'Opposite Filmhouse Cinema',
      },
      subtotalInKobo: randomDish.priceInKobo + 80000,
      deliveryFeeInKobo: 80000,
      totalInKobo: randomDish.priceInKobo + 160000,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtTimestamp: Date.now(),
      estimatedDeliveryMinutes: '30–40',
      riderName: 'Emeka Adeleke',
      riderVehicle: 'Honda CB',
      riderRating: 4.95,
    };

    knownOrderIdsRef.current.add(newOrder.id);
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);

    if (isSoundEnabled) {
      playKitchenOrderChime();
    }

    pushServerAction({ action: 'CREATE_ORDER', order: newOrder });

    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.id === `#${orderId}` || orderId.endsWith(o.id));
  };

  const advanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const nextOrders = orders.map((o) =>
      o.id === orderId || o.id === `#${orderId}` || orderId.endsWith(o.id)
        ? { ...o, status: nextStatus }
        : o
    );
    setOrders(nextOrders);

    pushServerAction({ action: 'UPDATE_STATUS', orderId, status: nextStatus });
  };

  const reorder = (order: Order) => {
    createOrder(
      order.deliveryDetails,
      order.items,
      order.subtotalInKobo,
      order.deliveryFeeInKobo,
      order.totalInKobo
    );
  };

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const pastOrders = orders.filter((o) => o.status === 'delivered');
  const paidKitchenOrders = orders.filter((o) => o.paymentStatus === 'PAID');

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        activeOrders,
        pastOrders,
        paidKitchenOrders,
        advanceOrderStatus,
        reorder,
        simulateIncomingPaystackOrder,
        isSoundEnabled,
        setIsSoundEnabled,
        archiveCurrentDayAndResetBoard,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
