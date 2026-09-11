import { NextResponse } from 'next/server';
import { Order } from '@/types/foodwok';

export interface KitchenStaffAttendance {
  staffName: string;
  loginTime: string;
  logoutTime: string;
}

export interface DailyAccountingRecord {
  id: string;
  dateString: string; // "YYYY-MM-DD"
  formattedDate: string;
  archivedAtTimestamp: number;
  totalOrdersCount: number;
  totalRevenueInKobo: number;
  completedOrders: Order[];
  itemizedSummary: {
    name: string;
    quantity: number;
    totalKobo: number;
  }[];
  kitchenStaffAttendance: KitchenStaffAttendance[];
}

interface AccountingStore {
  ledgers: DailyAccountingRecord[];
  lastRolloverDateString: string;
}

declare global {
  // eslint-disable-next-line no-var
  var _foodwok_accounting_store: AccountingStore | undefined;
}

const DEMO_PAST_LEDGERS: DailyAccountingRecord[] = [
  {
    id: 'ledger-2026-08-25',
    dateString: '2026-08-25',
    formattedDate: 'Tuesday, August 25, 2026',
    archivedAtTimestamp: Date.now() - 24 * 60 * 60 * 1000,
    totalOrdersCount: 14,
    totalRevenueInKobo: 6850000, // ₦68,500
    completedOrders: [],
    itemizedSummary: [
      { name: 'Smoky Party Jollof Rice', quantity: 8, totalKobo: 2800000 },
      { name: 'Chicken & Sausage Shawarma', quantity: 6, totalKobo: 2100000 },
      { name: 'Chilled Coke (50cl)', quantity: 10, totalKobo: 250000 },
      { name: 'Extra Melted Cheese', quantity: 5, totalKobo: 300000 },
    ],
    kitchenStaffAttendance: [
      { staffName: 'Chef Emeka (Head Cook)', loginTime: '07:30 AM', logoutTime: '10:45 PM' },
      { staffName: 'Bisi (KDS Manager)', loginTime: '08:00 AM', logoutTime: '10:30 PM' },
    ],
  },
  {
    id: 'ledger-2026-08-24',
    dateString: '2026-08-24',
    formattedDate: 'Monday, August 24, 2026',
    archivedAtTimestamp: Date.now() - 48 * 60 * 60 * 1000,
    totalOrdersCount: 19,
    totalRevenueInKobo: 9400000, // ₦94,000
    completedOrders: [],
    itemizedSummary: [
      { name: 'Party Platter Special', quantity: 5, totalKobo: 3250000 },
      { name: 'Nigerian Fried Rice', quantity: 9, totalKobo: 2880000 },
      { name: 'Jollof Spaghetti', quantity: 7, totalKobo: 1960000 },
      { name: 'Malt Drink (33cl)', quantity: 12, totalKobo: 300000 },
    ],
    kitchenStaffAttendance: [
      { staffName: 'Chef Emeka (Head Cook)', loginTime: '07:15 AM', logoutTime: '11:00 PM' },
      { staffName: 'Funke (Prep Staff)', loginTime: '08:30 AM', logoutTime: '09:45 PM' },
    ],
  },
];

if (!globalThis._foodwok_accounting_store) {
  globalThis._foodwok_accounting_store = {
    ledgers: DEMO_PAST_LEDGERS,
    lastRolloverDateString: new Date().toISOString().split('T')[0],
  };
}

export async function GET() {
  const store = globalThis._foodwok_accounting_store!;
  return NextResponse.json({
    ledgers: store.ledgers,
    lastRolloverDateString: store.lastRolloverDateString,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = globalThis._foodwok_accounting_store!;

    const { action, orders, targetDateString, staffAttendance } = body;

    if (action === 'ARCHIVE_DAY' && Array.isArray(orders)) {
      const todayStr = targetDateString || new Date().toISOString().split('T')[0];
      const formatted = new Date(todayStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const completedOrders: Order[] = orders.filter((o) => o.status === 'delivered');

      let totalRevenueInKobo = 0;
      const itemMap = new Map<string, { quantity: number; totalKobo: number }>();

      completedOrders.forEach((order) => {
        totalRevenueInKobo += order.totalInKobo || 0;
        order.items.forEach((item) => {
          const dishName = item.menuItem.name;
          const current = itemMap.get(dishName) || { quantity: 0, totalKobo: 0 };
          itemMap.set(dishName, {
            quantity: current.quantity + item.quantity,
            totalKobo: current.totalKobo + item.itemTotalInKobo,
          });
        });
      });

      const itemizedSummary = Array.from(itemMap.entries()).map(([name, val]) => ({
        name,
        quantity: val.quantity,
        totalKobo: val.totalKobo,
      }));

      const defaultAttendance: KitchenStaffAttendance[] = staffAttendance || [
        { staffName: 'Kitchen Staff (Shift 1)', loginTime: '08:00 AM', logoutTime: '10:00 PM' },
        { staffName: 'KDS Manager (Shift 2)', loginTime: '10:00 AM', logoutTime: '11:30 PM' },
      ];

      const newLedgerRecord: DailyAccountingRecord = {
        id: `ledger-${todayStr}-${Date.now()}`,
        dateString: todayStr,
        formattedDate: formatted,
        archivedAtTimestamp: Date.now(),
        totalOrdersCount: completedOrders.length,
        totalRevenueInKobo,
        completedOrders,
        itemizedSummary,
        kitchenStaffAttendance: defaultAttendance,
      };

      store.ledgers = [
        newLedgerRecord,
        ...store.ledgers.filter((l) => l.dateString !== todayStr),
      ];
      store.lastRolloverDateString = todayStr;

      return NextResponse.json({
        success: true,
        record: newLedgerRecord,
        totalLedgers: store.ledgers.length,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
