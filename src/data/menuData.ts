import { MenuItem, AddOnOption } from '@/types/foodwok';

// Universal Drinks & Beverages applicable across all meals
export const universalDrinks: AddOnOption[] = [
  {
    id: 'water',
    name: 'Bottled Water (50cl)',
    priceInKobo: 30000, // ₦300
    isAvailable: true,
    scope: 'UNIVERSAL',
    categoryType: 'DRINK',
  },
  {
    id: 'malt',
    name: 'Malt Drink (33cl)',
    priceInKobo: 50000, // ₦500
    isAvailable: true,
    scope: 'UNIVERSAL',
    categoryType: 'DRINK',
  },
  {
    id: 'coke',
    name: 'Chilled Soft Drink (50cl)',
    priceInKobo: 50000, // ₦500
    isAvailable: true,
    scope: 'UNIVERSAL',
    categoryType: 'DRINK',
  },
];

// Master Catalog of Standard Add-ons (used for seeding and category filtering)
export const standardAddOns: AddOnOption[] = [
  ...universalDrinks,

  // Universal / Common Food & Sides Extras
  {
    id: 'extra-plantain',
    name: 'Extra Fried Plantain (Dodo)',
    priceInKobo: 100000, // ₦1,000
    isAvailable: true,
    scope: 'UNIVERSAL',
    categoryType: 'FOOD',
    applicableCategories: ['your-food', 'the-chill', 'the-grill'],
  },
  {
    id: 'extra-coleslaw',
    name: 'Extra Creamy Coleslaw',
    priceInKobo: 100000, // ₦1,000
    isAvailable: true,
    scope: 'UNIVERSAL',
    categoryType: 'FOOD',
    applicableCategories: ['your-food', 'the-chill', 'the-grill'],
  },
  {
    id: 'extra-chicken',
    name: 'Extra Grilled Chicken Quarter',
    priceInKobo: 200000, // ₦2,000
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['your-food', 'the-chill'],
  },
  {
    id: 'extra-beef',
    name: 'Extra Tender Peppered Beef',
    priceInKobo: 150000, // ₦1,500
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['your-food', 'the-chill'],
  },
  {
    id: 'extra-chips',
    name: 'Extra Golden Chips (Fries)',
    priceInKobo: 150000, // ₦1,500
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['the-chill', 'the-grill', 'your-food'],
  },
  {
    id: 'extra-cheese',
    name: 'Extra Melted Cheese',
    priceInKobo: 100000, // ₦1,000
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['the-chill', 'your-food'],
  },
  {
    id: 'extra-moin-moin',
    name: 'Extra Steamed Moin-Moin',
    priceInKobo: 80000, // ₦800
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['your-food', 'the-chill'],
  },
  {
    id: 'extra-turkey',
    name: 'Extra Grilled Turkey Cutlet',
    priceInKobo: 250000, // ₦2,500
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['the-grill', 'your-food'],
  },
  {
    id: 'extra-shrimp',
    name: 'Extra Tiger Shrimp Portion',
    priceInKobo: 250000, // ₦2,500
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['your-food'],
  },
  {
    id: 'extra-swallow-fufu',
    name: 'Extra Pounded Fufu Wrap',
    priceInKobo: 70000, // ₦700
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['your-food'],
  },
  {
    id: 'extra-swallow-semo',
    name: 'Extra Semolina Wrap',
    priceInKobo: 70000, // ₦700
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['your-food'],
  },
  {
    id: 'extra-swallow-eba',
    name: 'Extra Garri Eba Wrap',
    priceInKobo: 60000, // ₦600
    isAvailable: true,
    scope: 'CATEGORY_SPECIFIC',
    categoryType: 'FOOD',
    applicableCategories: ['your-food'],
  },
];

export const menuItems: MenuItem[] = [
  // ==========================================
  // SECTION 1: THE CHILL
  // ==========================================
  {
    id: 'barrel-platter-for-4',
    name: 'BARREL PLATTER FOR 4',
    category: 'the-chill',
    description: 'Jollof rice, Fried Rice, Chicken, Diced beef, Plantain, Coleslaw, Moin-Moin',
    fullDescription: 'An impressive grand feast loaded with smoky Jollof rice, savory Fried Rice, succulent quarter grilled chicken, tender diced beef, sweet fried plantains, creamy coleslaw, and steamed Moin-Moin. Perfect for sharing among 4 people.',
    priceInKobo: 2000000, // ₦20,000
    image: '/images/dishes/barrel-platter-for-4.jpg',
    rating: 5.0,
    ordersCount: '1,420 orders',
    badge: 'CHEF SPECIAL',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'bp4-extra-chicken', name: 'Extra Grilled Chicken Quarter', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bp4-extra-beef', name: 'Extra Diced Beef Portion', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bp4-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bp4-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bp4-extra-moin-moin', name: 'Extra Steamed Moin-Moin', priceInKobo: 80000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'chops-platter-for-2',
    name: 'CHOPS PLATTER FOR 2',
    category: 'the-chill',
    description: 'Puff Puff, Samosa, Spring Rolls, Gizzdodo, Suya',
    fullDescription: 'The ultimate sharing platter for 2 featuring golden sweet Puff Puff, crispy minced meat Samosas, crunchy vegetable Spring Rolls, spicy peppered Gizzdodo (gizzard and plantain), and flame-grilled beef Suya.',
    priceInKobo: 800000, // ₦8,000
    image: '/images/dishes/chops-platter-for-2.jpg',
    rating: 4.9,
    ordersCount: '2,150 orders',
    badge: 'POPULAR',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'cp2-extra-suya', name: 'Extra Beef Suya Portion', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cp2-extra-gizzdodo', name: 'Extra Peppered Gizzdodo', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cp2-extra-puff-puff', name: 'Extra Sweet Puff Puff (6 pcs)', priceInKobo: 80000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cp2-extra-samosa', name: 'Extra Crispy Samosas (4 pcs)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cp2-extra-spring-rolls', name: 'Extra Spring Rolls (4 pcs)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'barrell-burger',
    name: 'BARRELL BURGER',
    category: 'the-chill',
    description: 'Signature flame-grilled patty served with crisp lettuce, fresh tomato, melted cheese & house sauce',
    fullDescription: 'Our heavyweight house specialty burger featuring a juicy flame-grilled beef patty, melted cheddar cheese, crisp iceberg lettuce, ripe sliced tomatoes, caramelized onions, and signature Barrell house burger sauce on a toasted sesame brioche bun.',
    priceInKobo: 500000, // ₦5,000
    image: '/images/dishes/barrell-burger.jpg',
    rating: 4.8,
    ordersCount: '980 orders',
    badge: 'FAVORITE',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'bb-extra-cheese', name: 'Extra Melted Cheddar Cheese', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bb-extra-patty', name: 'Extra Flame-Grilled Beef Patty', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bb-extra-chips', name: 'Side of Golden French Fries', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bb-extra-bacon', name: 'Crispy Bacon Strips', priceInKobo: 120000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bb-extra-sauce', name: 'Signature Barrell House Sauce', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'chicken-and-chips',
    name: 'CHICKEN AND CHIPS',
    category: 'the-chill',
    description: 'Crispy marinated grilled chicken quarter served with golden french fries',
    fullDescription: 'Deeply spiced and marinated quarter chicken, grilled to juicy perfection with a crispy exterior, served alongside a generous portion of hot, salted golden french fries and pepper dip.',
    priceInKobo: 500000, // ₦5,000
    image: '/images/dishes/chicken-and-chips.jpg',
    rating: 4.9,
    ordersCount: '3,410 orders',
    badge: 'POPULAR',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'cc-extra-chicken', name: 'Extra Grilled Chicken Quarter', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cc-extra-chips', name: 'Extra Portion Golden Chips', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cc-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cc-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cc-extra-pepper-dip', name: 'Signature Pepper Dip Sauce', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'asun',
    name: 'ASUN',
    category: 'the-chill',
    description: 'Spicy peppered roasted goat meat tossed with scotch bonnet habanero and sliced onions',
    fullDescription: 'Authentic Yoruba-style peppered goat meat. Tender goat cuts roasted over open flames, chopped into bite-sized pieces, and wok-tossed in crushed scotch bonnet peppers, red bell peppers, garlic, and sweet white onions.',
    priceInKobo: 300000, // ₦3,000
    image: '/images/dishes/asun.jpg',
    rating: 4.95,
    ordersCount: '2,890 orders',
    badge: 'HOT & SPICY',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'asun-extra-meat', name: 'Extra Peppered Roasted Goat Meat', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'asun-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'asun-extra-peppers', name: 'Extra Sautéed Scotch Bonnet & Onions', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'suya',
    name: 'SUYA',
    category: 'the-chill',
    description: 'Traditional Hausa spicy grilled beef skewers coated in aromatic Yaji spice',
    fullDescription: 'Thinly sliced tender beef strips skewered and heavily coated in authentic kuli-kuli Yaji spice powder, grilled over glowing coals and served hot with fresh sliced red onions and tomatoes.',
    priceInKobo: 100000, // ₦1,000
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80',
    rating: 4.85,
    ordersCount: '4,100 orders',
    badge: 'POPULAR',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'suya-extra-skewer', name: 'Extra Beef Suya Skewer', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'suya-extra-yaji', name: 'Extra Authentic Yaji Spice Pack', priceInKobo: 30000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'suya-extra-onions', name: 'Fresh Sliced Red Onions & Tomatoes', priceInKobo: 40000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'suya-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'small-chops',
    name: 'SMALL CHOPS',
    category: 'the-chill',
    description: 'Bite-sized portion of fresh Puff Puff, savory Samosas, and crunchy Spring Rolls',
    fullDescription: 'A classic single portion of freshly prepared Nigerian small chops featuring soft fluffy sweet Puff Puff balls, crispy spiced beef Samosas, and crunchy vegetable Spring Rolls.',
    priceInKobo: 300000, // ₦3,000
    image: '/images/dishes/small-chops.jpg',
    rating: 4.75,
    ordersCount: '1,890 orders',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'sc-extra-puff-puff', name: 'Extra Puff Puff (4 pcs)', priceInKobo: 60000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sc-extra-samosa', name: 'Extra Spiced Beef Samosas (2 pcs)', priceInKobo: 60000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sc-extra-spring-rolls', name: 'Extra Vegetable Spring Rolls (2 pcs)', priceInKobo: 60000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sc-extra-dip', name: 'House Sweet Pepper Dip', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'pepper-soup',
    name: 'PEPPER SOUP',
    category: 'the-chill',
    description: 'Hot and soothing traditional Nigerian pepper soup with aromatic local spices',
    fullDescription: 'Rich, broth-based spicy pepper soup slow-simmered with traditional West African herbs, grains of selim (uda), calabash nutmeg (ehu), scented leaves, and tender meat cutlets.',
    priceInKobo: 300000, // ₦3,000
    image: '/images/dishes/pepper-soup.jpg',
    rating: 4.8,
    ordersCount: '1,650 orders',
    badge: 'HOT & SPICY',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'ps-extra-meat', name: 'Extra Pepper Soup Meat Cutlets', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ps-extra-yam', name: 'Boiled White Yam Slice (in broth)', priceInKobo: 80000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ps-extra-scent-leaves', name: 'Extra Scent Leaves & Pepper Infusion', priceInKobo: 40000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },

  // ==========================================
  // SECTION 2: THE GRILL
  // ==========================================
  {
    id: 'grilled-fish-n-chips',
    name: 'GRILLED FISH N CHIPS',
    category: 'the-grill',
    description: 'Smokey grilled Cat or Croaker fish with crispy golden chips',
    fullDescription: 'Fresh whole Catfish or Croaker fish deeply scored and seasoned with rich pepper marinade, slow grilled over charcoal for a rich smoky aroma, served with a side of crispy golden chips and spicy sauce.',
    priceInKobo: 1800000, // ₦18,000
    image: '/images/dishes/grilled-fish-n-chips.jpg',
    rating: 5.0,
    ordersCount: '1,120 orders',
    badge: 'CHEF SPECIAL',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'gf-extra-chips', name: 'Extra Golden French Fries', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'gf-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'gf-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'gf-extra-sauce', name: 'Smoky Pepper Marinade Sauce', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'gf-extra-lime', name: 'Fresh Lime Wedges & Sliced Onions', priceInKobo: 40000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'turkey-n-chips',
    name: 'TURKEY N CHIPS',
    category: 'the-grill',
    description: 'Sliced turkey breast, served with golden chips',
    fullDescription: 'Juicy sliced turkey breast seasoned with garlic, ginger, and rosemary, grilled to perfection and served alongside golden crispy french fries with house pepper glaze.',
    priceInKobo: 800000, // ₦8,000
    image: '/images/dishes/turkey-and-chips.jpg',
    rating: 4.9,
    ordersCount: '1,560 orders',
    badge: 'POPULAR',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'tnc-extra-turkey', name: 'Extra Grilled Turkey Cutlet', priceInKobo: 250000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'tnc-extra-chips', name: 'Extra Portion Golden Chips', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'tnc-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'tnc-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'tnc-extra-glaze', name: 'House Pepper Glaze', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },

  // ==========================================
  // SECTION 3: YOUR FOOD !
  // ==========================================
  {
    id: 'jollof-rice',
    name: 'JOLLOF RICE',
    category: 'your-food',
    description: 'Smokey jollof served with beef, Chicken or Turkey.',
    fullDescription: 'Our hallmark Nigerian party jollof rice cooked in rich tomato puree, bell pepper stew, and traditional wood-smoke seasoning. Served hot with your choice of Tender Beef, Spiced Chicken, or Turkey.',
    priceInKobo: 300000, // From ₦3,000
    image: '/images/dishes/jollof-rice.jpg',
    rating: 4.9,
    ordersCount: '5,200 orders',
    badge: 'POPULAR',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'jr-extra-chicken', name: 'Extra Grilled Chicken Quarter', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'jr-extra-beef', name: 'Extra Tender Peppered Beef', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'jr-extra-turkey', name: 'Extra Spiced Grilled Turkey', priceInKobo: 250000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'jr-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'jr-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'jr-extra-moin-moin', name: 'Extra Steamed Moin-Moin', priceInKobo: 80000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'special-fried-rice',
    name: 'SPECIAL FRIED RICE',
    category: 'your-food',
    description: 'Rich flavored fried rice, loaded with juicy diced chicken, tender beef strips, succulent shrimp and an array of fresh vegetables.',
    fullDescription: 'Premium Nigerian fried rice wok-tossed with fresh sweet corn, green peas, diced carrots, juicy diced chicken breast, tender beef strips, and succulent tiger shrimp.',
    priceInKobo: 600000, // ₦6,000
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80',
    rating: 4.95,
    ordersCount: '3,840 orders',
    badge: 'CHEF SPECIAL',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'sfr-extra-shrimp', name: 'Extra Succulent Tiger Shrimp', priceInKobo: 250000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sfr-extra-chicken', name: 'Extra Grilled Chicken Quarter', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sfr-extra-beef', name: 'Extra Tender Beef Strips', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sfr-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sfr-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'all-star-jollof',
    name: 'ALL STAR JOLLOF',
    category: 'your-food',
    description: 'Smokey jollof rice with assorted meats, pieces and spices.',
    fullDescription: 'The deluxe jollof experience! Loaded party jollof rice packed with diced beef, chicken pieces, gizzard, fried plantains, and aromatic Nigerian chef spices.',
    priceInKobo: 600000, // ₦6,000
    image: '/images/dishes/all-star-jollof.jpg',
    rating: 5.0,
    ordersCount: '2,490 orders',
    badge: 'CHEF SPECIAL',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'asj-extra-gizzard', name: 'Extra Spicy Peppered Gizzard', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'asj-extra-chicken', name: 'Extra Grilled Chicken Quarter', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'asj-extra-beef', name: 'Extra Tender Diced Beef', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'asj-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'asj-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'asj-extra-moin-moin', name: 'Extra Steamed Moin-Moin', priceInKobo: 80000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'wraps-and-soups',
    name: 'WRAPS AND SOUPS',
    category: 'your-food',
    description: 'Select from our Ogbono, Egusi or Vegetable soups for Fufu, Semo and Eba.',
    fullDescription: 'Traditional Nigerian swallow dish. Choose your preferred swallow (smooth Pounded Fufu, Semolina, or Garri Eba) served with rich Egusi, drawsome Ogbono, or nutritious Vegetable Soup cooked with stockfish and beef.',
    priceInKobo: 300000, // ₦3,000
    image: '/images/dishes/wraps-and-soups.jpg',
    rating: 4.85,
    ordersCount: '2,100 orders',
    badge: 'TRADITIONAL',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'ws-extra-fufu', name: 'Extra Pounded Fufu Wrap', priceInKobo: 70000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-semo', name: 'Extra Semolina Wrap', priceInKobo: 70000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-eba', name: 'Extra Garri Eba Wrap', priceInKobo: 60000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-stockfish', name: 'Extra Traditional Stockfish', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-beef', name: 'Extra Assorted Beef Cutlets', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-fish', name: 'Extra Fried Fish Cutlet', priceInKobo: 180000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'chicken-sandwich',
    name: 'CHICKEN SANDWICH',
    category: 'your-food',
    description: 'Grilled chicken breast served on a bun with lettuce, tomato, and sauces.',
    fullDescription: 'Tender seasoned chicken breast grilled over flame, layered with crisp lettuce, fresh tomato slices, melted cheese, and creamy mayo served inside a toasted artisanal brioche bun.',
    priceInKobo: 450000, // ₦4,500
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1000&q=80',
    rating: 4.75,
    ordersCount: '1,320 orders',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'cs-extra-cheese', name: 'Extra Melted Cheddar Cheese', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cs-extra-chicken', name: 'Extra Grilled Chicken Breast', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cs-extra-chips', name: 'Side of Crispy French Fries', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cs-extra-coleslaw', name: 'Side of Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'cs-extra-bacon', name: 'Crispy Bacon Strips', priceInKobo: 120000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'wok-spaghetti',
    name: 'WOK SPAGHETTI',
    category: 'your-food',
    description: 'Tender spaghetti wok-tossed with sauce and your choice of protein.',
    fullDescription: 'High-heat stir-fried spaghetti tossed in peppered tomato sauce, sweet bell peppers, spring onions, sesame oil, and your choice of beef or chicken strips.',
    priceInKobo: 400000, // ₦4,000
    image: '/images/dishes/wok-spaghetti.jpg',
    rating: 4.8,
    ordersCount: '1,980 orders',
    badge: 'POPULAR',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'ws-extra-chicken-strips', name: 'Extra Grilled Chicken Strips', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-beef-strips', name: 'Extra Tender Beef Strips', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ws-extra-peppers', name: 'Extra Sautéed Bell Peppers & Veggies', priceInKobo: 80000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'beans-and-plantain',
    name: 'BEANS AND PLANTAIN',
    category: 'your-food',
    description: 'Cooked beans served with beef and plantain.',
    fullDescription: 'Slow-cooked brown beans seasoned with palm oil, crayfish, and onions, served with soft golden fried sweet plantains and tender peppered beef.',
    priceInKobo: 300000, // ₦3,000
    image: '/images/dishes/beans-and-plantain.jpg',
    rating: 4.7,
    ordersCount: '1,640 orders',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'bp-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bp-extra-beef', name: 'Extra Peppered Beef Portion', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bp-extra-fish', name: 'Extra Fried / Steamed Fish', priceInKobo: 180000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bp-extra-egg', name: 'Boiled Egg', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'bp-extra-garri', name: 'Crispy Drinking Ijebu Garri', priceInKobo: 40000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: '9ja-breakfast',
    name: '9JA BREAKFAST',
    category: 'your-food',
    description: 'Boiled/Fried Yam served with a scrambled or fried egg, often seasoned and flavorful.',
    fullDescription: 'Classic Nigerian morning hearty dish featuring hot boiled or crispy fried white yam slices served with a well-seasoned bell pepper & onion egg sauce.',
    priceInKobo: 500000, // ₦5,000
    image: '/images/dishes/9ja-breakfast.jpg',
    rating: 4.85,
    ordersCount: '2,300 orders',
    badge: 'FAVORITE',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'nb-extra-egg-sauce', name: 'Extra Nigerian Scrambled Egg Sauce', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'nb-extra-fried-yam', name: 'Extra Crispy Fried Yam Slices', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'nb-extra-boiled-yam', name: 'Extra Tender Boiled Yam Slices', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'nb-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'nb-corned-beef-upgrade', name: 'Corned Beef Egg Sauce Upgrade', priceInKobo: 120000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'full-english',
    name: 'FULL ENGLISH',
    category: 'your-food',
    description: 'Our classic fry up with bacon, sausages, eggs, baked beans,mushrooms and toast.',
    fullDescription: 'Traditional full English breakfast platter loaded with crispy bacon strips, beef sausages, sunny-side-up eggs, savory baked beans, sautéed mushrooms, and buttered toasted bread.',
    priceInKobo: 600000, // ₦6,000
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=80',
    rating: 4.9,
    ordersCount: '1,120 orders',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'fe-extra-bacon', name: 'Extra Crispy Bacon Strips (3 pcs)', priceInKobo: 120000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'fe-extra-sausage', name: 'Extra Grilled Beef Sausages (2 pcs)', priceInKobo: 120000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'fe-extra-egg', name: 'Extra Sunny-Side-Up Fried Egg', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'fe-extra-beans', name: 'Extra Heinz Baked Beans Portion', priceInKobo: 60000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'fe-extra-mushrooms', name: 'Extra Sautéed Herb Mushrooms', priceInKobo: 80000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'fe-extra-toast', name: 'Extra Buttered Brioche Toast (2 pcs)', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'shawarmas',
    name: 'SHAWARMAS',
    category: 'your-food',
    description: 'Chicken or Beef tendered and wrapped with crisp, fresh and unique sauces.',
    fullDescription: 'Double pita wrap stuffed with flame-marinated chicken or beef, grilled sausage, fresh cabbage, carrots, hot pepper sauce, and creamy garlic mayonnaise.',
    priceInKobo: 300000, // From ₦3,000
    image: '/images/dishes/shawarmas.jpg',
    rating: 4.9,
    ordersCount: '4,500 orders',
    badge: 'POPULAR',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'sw-extra-cheese', name: 'Extra Melted Cheese', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sw-extra-sausage', name: 'Extra Grilled Sausage', priceInKobo: 80000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sw-extra-chicken', name: 'Extra Flame-Marinated Chicken Filling', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sw-extra-beef', name: 'Extra Spiced Beef Filling', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sw-extra-sauce', name: 'Extra Garlic Cream & Chili Dip', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'sw-extra-chips', name: 'Side of Crispy French Fries', priceInKobo: 150000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
  {
    id: 'chips',
    name: 'CHIPS',
    category: 'your-food',
    description: 'Crispy golden fried chips.',
    fullDescription: 'Hot, salted crispy golden french fries served with ketchup or pepper sauce.',
    priceInKobo: 300000, // ₦3,000
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80',
    rating: 4.75,
    ordersCount: '2,900 orders',
    isAvailable: true,
    addOns: [
      ...universalDrinks,
      { id: 'ch-extra-chicken', name: 'Extra Grilled Chicken Quarter', priceInKobo: 200000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ch-extra-cheese', name: 'Melted Cheddar Cheese Sauce', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ch-extra-coleslaw', name: 'Extra Creamy Coleslaw', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ch-extra-plantain', name: 'Extra Fried Plantain (Dodo)', priceInKobo: 100000, isAvailable: true, categoryType: 'FOOD' },
      { id: 'ch-extra-dip', name: 'Spicy Pepper Dipping Sauce', priceInKobo: 50000, isAvailable: true, categoryType: 'FOOD' },
    ],
  },
];
