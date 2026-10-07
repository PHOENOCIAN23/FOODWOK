import { NextResponse } from 'next/server';
import { Order, OrderStatus } from '@/types/foodwok';

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
    orders: [],
    lastUpdated: Date.now(),
  };
}

// In case the store was previously initialized with the legacy demo order in this Node process
if (globalThis._foodwok_server_orders_store) {
  globalThis._foodwok_server_orders_store.orders = globalThis._foodwok_server_orders_store.orders.filter(
    (o) => o.id !== 'FW-94344'
  );
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
      // Merge: retain any server orders not in the incoming list so other clients' orders are never overwritten
      const incomingIds = new Set(orders.map((o) => o.id));
      const retainedServerOrders = store.orders.filter((o) => !incomingIds.has(o.id));
      store.orders = [...orders, ...retainedServerOrders];
      store.lastUpdated = Date.now();
    } else if (action === 'ARCHIVE_RESET' && Array.isArray(orders)) {
      // Dedicated action for end-of-day archiving to clean up completed orders
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
