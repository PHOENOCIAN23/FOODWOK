import { NextResponse } from 'next/server';
import { MenuItem, AddOnOption, CategoryOption } from '@/types/foodwok';
import { menuItems as defaultMenuItems, standardAddOns as defaultAddOns } from '@/data/menuData';

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'rice', label: 'Rice' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'specials', label: 'Specials' },
  { id: 'shawarma', label: 'Shawarma' },
];

interface ServerMenuStore {
  items: MenuItem[];
  addOns: AddOnOption[];
  categories: CategoryOption[];
  lastUpdated: number;
}

// In-memory global store persistent across requests in the Node server process
declare global {
  // eslint-disable-next-line no-var
  var _foodwok_server_menu_store: ServerMenuStore | undefined;
}

if (!globalThis._foodwok_server_menu_store) {
  globalThis._foodwok_server_menu_store = {
    items: defaultMenuItems,
    addOns: defaultAddOns,
    categories: DEFAULT_CATEGORIES,
    lastUpdated: Date.now(),
  };
}

export async function GET() {
  const store = globalThis._foodwok_server_menu_store!;
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = globalThis._foodwok_server_menu_store!;

    if (Array.isArray(body.items)) {
      store.items = body.items;
    }
    if (Array.isArray(body.addOns)) {
      store.addOns = body.addOns;
    }
    if (Array.isArray(body.categories)) {
      store.categories = body.categories;
    }

    store.lastUpdated = Date.now();

    return NextResponse.json({
      success: true,
      lastUpdated: store.lastUpdated,
      itemsCount: store.items.length,
      addOnsCount: store.addOns.length,
      categoriesCount: store.categories.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
