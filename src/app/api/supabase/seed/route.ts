import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { standardAddOns } from '@/data/menuData';

const INITIAL_CATEGORIES = [
  { id: 'all', label: 'All Meals' },
  { id: 'rice', label: 'Rice Dishes' },
  { id: 'swallow', label: 'Swallow & Soups' },
  { id: 'grills', label: 'Grills & Barbecue' },
  { id: 'sides', label: 'Sides & Small Bites' },
  { id: 'drinks', label: 'Drinks & Beverages' },
];

const INITIAL_MENU_ITEMS = [
  {
    id: 'smoky-jollof-rice',
    name: 'Smoky Party Jollof Rice',
    category: 'rice',
    description: 'Perfectly seasoned Nigerian party jollof with rich tomato base, smoked paprika, and a charcoal finish.',
    full_description: 'Our signature Smoky Party Jollof Rice is slow-cooked over a firewood flame using long-grain parboiled rice, ripe plum tomatoes, red bell peppers, and Scotch bonnets. Served hot with sweet fried plantain and your choice of protein.',
    price_in_kobo: 350000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    orders_count: '1,240 orders',
    badge: 'POPULAR',
    is_available: true,
  },
  {
    id: 'special-fried-rice',
    name: 'Chef Special Fried Rice',
    category: 'rice',
    description: 'Wok-tossed seasoned rice with sweet corn, green peas, diced liver, and tender shredded chicken.',
    full_description: 'Freshly prepared fried rice tossed in a high-heat wok with diced carrots, sweet corn, green peas, kidney beans, and savory beef liver.',
    price_in_kobo: 400000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    orders_count: '890 orders',
    badge: 'CHEF SPECIAL',
    is_available: true,
  },
  {
    id: 'egusi-soup-pounded-yam',
    name: 'Egusi Soup & Pounded Yam',
    category: 'swallow',
    description: 'Rich melon seed soup cooked with stockfish, kanda, dried catfish, and bitter leaf, served with fluffy pounded yam.',
    full_description: 'Traditional Nigerian Egusi soup prepared with ground melon seeds, palm oil, crayfish, stockfish head, dried catfish, and fresh ugu leaves.',
    price_in_kobo: 450000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    orders_count: '1,500 orders',
    badge: 'TRADITIONAL',
    is_available: true,
  },
  {
    id: 'peppered-grilled-turkey',
    name: 'Spicy Peppered Turkey',
    category: 'grills',
    description: 'Succulent turkey lap marinated in local spices and deep-fried before tossing in scotch bonnet habanero sauce.',
    full_description: 'Jumbo turkey thigh deeply infused with ginger, garlic, and onion marinade, fried to a golden crunch and smothered in thick pepper sauce.',
    price_in_kobo: 380000,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    rating: 4.85,
    orders_count: '670 orders',
    badge: 'HOT & SPICY',
    is_available: true,
  },
  {
    id: 'fried-plantain-dodo',
    name: 'Golden Fried Plantain (Dodo)',
    category: 'sides',
    description: 'Sweet ripe yellow plantains sliced and fried to caramelized golden brown perfection.',
    full_description: 'Naturally sweet ripe plantains cut into thick coins and fried in clean vegetable oil until soft, sweet, and golden brown.',
    price_in_kobo: 120000,
    image: 'https://images.unsplash.com/photo-1628837741008-338234929695?auto=format&fit=crop&w=800&q=80',
    rating: 4.75,
    orders_count: '2,100 orders',
    badge: 'FAVORITE',
    is_available: true,
  },
  {
    id: 'chilled-zobo-drink',
    name: 'Handcrafted Zobo Hibiscus Drink (50cl)',
    category: 'drinks',
    description: 'Refreshing cold hibiscus tea infused with real pineapple, ginger, cloves, and mint leaves.',
    full_description: 'All-natural traditional Zobo brewed from organic dried hibiscus flowers, sweetened naturally with crushed pineapples, fresh ginger juice, and cloves.',
    price_in_kobo: 150000,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    orders_count: '1,430 orders',
    badge: 'ORGANIC',
    is_available: true,
  },
];

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Seed Categories
    const { error: catErr } = await supabase.from('categories').upsert(INITIAL_CATEGORIES, { onConflict: 'id' });
    if (catErr) console.error('Categories seed error:', catErr);

    // 2. Seed Menu Items
    const { error: menuErr } = await supabase.from('menu_items').upsert(INITIAL_MENU_ITEMS, { onConflict: 'id' });
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
      message: 'Supabase database successfully seeded with Categories, Menu Items, and Add-ons!',
    });
  } catch (err: any) {
    return NextResponse.json({ status: false, message: err.message || 'Seeding error' }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
