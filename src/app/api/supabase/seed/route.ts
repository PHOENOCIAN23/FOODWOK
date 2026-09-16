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

    // 4. Seed Authorized Staff Profiles (admin@foodwok.ng & kitchen@foodwok.ng)
    const staffProfilesPayload = [
      {
        id: 'a1111111-1111-1111-1111-111111111111',
        email: 'admin@foodwok.ng',
        first_name: 'Foodwok',
        last_name: 'Administrator',
        phone: '+2348000000001',
        role: 'ADMIN',
        addresses: [],
      },
      {
        id: 'b2222222-2222-2222-2222-222222222222',
        email: 'kitchen@foodwok.ng',
        first_name: 'Kitchen',
        last_name: 'Staff',
        phone: '+2348000000002',
        role: 'KITCHEN_STAFF',
        addresses: [],
      },
    ];
    const { error: staffErr } = await supabase.from('user_profiles').upsert(staffProfilesPayload, { onConflict: 'id' });
    if (staffErr) console.error('Staff profiles seed error:', staffErr);

    return NextResponse.json({
      status: true,
      message: 'Supabase database successfully seeded with Categories, Menu Items, Add-ons, and Authorized Staff Profiles!',
    });
  } catch (err: any) {
    return NextResponse.json({ status: false, message: err.message || 'Seeding error' }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
