import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { menuItems, standardAddOns } from '@/data/menuData';
import { DEFAULT_CATEGORIES } from '@/context/MenuContext';

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Seed Categories
    const categoriesPayload = [
      { id: 'all', label: 'All Items' },
      ...DEFAULT_CATEGORIES,
    ];
    const { error: catErr } = await supabase.from('categories').upsert(categoriesPayload, { onConflict: 'id' });
    if (catErr) console.error('Categories seed error:', catErr);

    // 2. Seed Menu Items
    const menuItemsPayload = menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      full_description: item.fullDescription || item.description,
      price_in_kobo: item.priceInKobo,
      image: item.image,
      rating: item.rating,
      orders_count: item.ordersCount || '1,000+ orders',
      badge: item.badge || null,
      is_available: item.isAvailable ?? true,
    }));

    const { error: menuErr } = await supabase.from('menu_items').upsert(menuItemsPayload, { onConflict: 'id' });
    if (menuErr) console.error('Menu items seed error:', menuErr);

    // 3. Seed Add-ons
    const addOnsPayload = standardAddOns.map((a) => ({
      id: a.id,
      name: a.name,
      price_in_kobo: a.priceInKobo,
      is_available: a.isAvailable ?? true,
      scope: a.scope || 'UNIVERSAL',
      category_type: a.categoryType || 'FOOD',
      applicable_categories: a.applicableCategories || [],
    }));

    const { error: addOnErr } = await supabase.from('add_ons').upsert(addOnsPayload, { onConflict: 'id' });
    if (addOnErr) console.error('Add-ons seed error:', addOnErr);

    return NextResponse.json({
      status: true,
      message: 'Supabase database successfully seeded with updated FOODWOK Categories, Menu Items, and Add-ons!',
    });
  } catch (err: any) {
    return NextResponse.json({ status: false, message: err.message || 'Seeding error' }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
