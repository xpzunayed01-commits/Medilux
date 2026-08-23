export interface Product {
  id: string;
  name: string;
  descriptor?: string;
  description: string;
  price: number;
  regularPrice?: number;
  image: string;
  images: string[];
  category: string;
  stock?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isOutOfStock?: boolean;
  ingredients?: string;
  howToUse?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  isHidden?: boolean;
  order?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  streetAddress: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | string;
  paymentStatus?: 'unpaid' | 'paid';
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  orders?: string[];
  createdAt?: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroExploreLink?: string;
  promoBarActive?: boolean;
  promoBarText?: string;
  perkDeliveryTitle?: string;
  perkDeliverySubtitle?: string;
  perkAuthenticTitle?: string;
  perkAuthenticSubtitle?: string;
  perkCodTitle?: string;
  perkCodSubtitle?: string;
  perkSupportTitle?: string;
  perkSupportSubtitle?: string;
  storyHeading: string;
  storyBody: string;
  bannerImage?: string;
  bannerTitle?: string;
  bannerLink?: string;
}

export interface SiteSettings {
  storeName: string;
  tagline?: string;
  phone?: string;
  storePhone?: string;
  email?: string;
  storeEmail?: string;
  address?: string;
  storeAddress?: string;
  currency?: string;
  currencySymbol?: string;
  deliveryFeeDhaka?: number;
  deliveryFeeInsideDhaka?: number;
  deliveryFeeOutside?: number;
  deliveryFeeOutsideDhaka?: number;
  freeDeliveryThreshold?: number;
  freeDeliveryText?: string;
  codEnabled: boolean;
  codInstructions?: string;
  bkashNumber?: string;
  bkashInstructions?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  youtubeUrl?: string;
}
