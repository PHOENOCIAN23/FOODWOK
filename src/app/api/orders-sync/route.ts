import { NextResponse } from 'next/server';
import { Order, OrderStatus } from '@/types/foodwok';

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
  createdAtTimestamp: Date.now() - 10 * 60 * 1000,
  estimatedDeliveryMinutes: '30–45',
  riderName: 'Emeka Adeleke',
  riderVehicle: 'Honda CB',
  riderRating: 4.95,
};

interface ServerOrdersStore {
  orders: Order[];
  lastUpdated: number;
}

declare global {
  // eslint-disable-next-line no-var
  var _foodwok_server_orders_store: ServerOrdersStore | undefined;
}

if (!globalThis._foodwok_server_orders_store) {
  globalThis._foodwok_server_orders_store = {
    orders: [INITIAL_DEMO_ORDER],
    lastUpdated: Date.now(),
  };
}

export async function GET() {
  const store = globalThis._foodwok_server_orders_store!;
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = globalThis._foodwok_server_orders_store!;

    const { action, order, orderId, status, orders } = body;

    if (action === 'CREATE_ORDER' && order) {
      // Prepend new order if not already in store
      if (!store.orders.some((o) => o.id === order.id)) {
        store.orders = [order, ...store.orders];
        store.lastUpdated = Date.now();
      }
    } else if (action === 'UPDATE_STATUS' && orderId && status) {
      store.orders = store.orders.map((o) =>
        o.id === orderId || o.id === `#${orderId}` || orderId.endsWith(o.id)
          ? { ...o, status: status as OrderStatus }
          : o
      );
      store.lastUpdated = Date.now();
    } else if (action === 'SYNC_ALL' && Array.isArray(orders)) {
      store.orders = orders;
      store.lastUpdated = Date.now();
    }

    return NextResponse.json({
      success: true,
      lastUpdated: store.lastUpdated,
      ordersCount: store.orders.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
