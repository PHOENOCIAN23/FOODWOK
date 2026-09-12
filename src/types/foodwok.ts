export type UserRole = 'CUSTOMER' | 'KITCHEN_STAFF' | 'ADMIN';

export interface CategoryOption {
  id: string;
  label: string;
}

export type AddOnScope = 'UNIVERSAL' | 'CATEGORY_SPECIFIC';
export type AddOnCategoryType = 'FOOD' | 'DRINK';

export interface AddOnOption {
  id: string;
  name: string;
  priceInKobo: number;
  isAvailable?: boolean;
  scope?: AddOnScope;
  applicableCategories?: string[];
  categoryType?: AddOnCategoryType;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string; // Dynamic category ID or label
  description: string;
  fullDescription?: string;
  priceInKobo: number;
  image: string;
  rating: number;
  ordersCount?: string;
  badge?: string;
  isAvailable?: boolean;
  addOns: AddOnOption[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedAddOns: AddOnOption[];
  itemTotalInKobo: number;
}

export interface DeliveryDetails {
  fullName: string;
  phoneNumber: string;
  address: string;
  landmark?: string;
}

export type OrderStatus = 'received' | 'confirmed' | 'preparing' | 'delivering' | 'delivered';

export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';

export interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paystackReference: string;
  paystackVerified: boolean;
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
  subtotalInKobo: number;
  deliveryFeeInKobo: number;
  totalInKobo: number;
  createdAt: string;
  createdAtTimestamp: number;
  estimatedDeliveryMinutes: string;
  riderName: string;
  riderVehicle: string;
  riderRating: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  landmark?: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses: SavedAddress[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
}
