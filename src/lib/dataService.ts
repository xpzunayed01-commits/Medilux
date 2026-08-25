import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Product, Category, Order, Customer, SiteContent, SiteSettings, OrderStatus } from '../types';
import { products as initialProducts, categories as initialCategories } from '../data';

// Local storage cache keys
const CACHE_PRODUCTS_KEY = 'medilux_cache_products';
const CACHE_CATEGORIES_KEY = 'medilux_cache_categories';
const CACHE_SETTINGS_KEY = 'medilux_cache_settings';
const CACHE_CONTENT_KEY = 'medilux_cache_content';
const CACHE_ORDERS_KEY = 'medilux_cache_orders';
const CACHE_CUSTOMERS_KEY = 'medilux_cache_customers';

/**
 * Remove undefined values to prevent Firestore 'Unsupported field value: undefined' errors
 */
function cleanForFirestore<T extends Record<string, any>>(obj: T): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => (typeof item === 'object' ? cleanForFirestore(item) : item));
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        cleaned[key] = cleanForFirestore(value);
      } else if (Array.isArray(value)) {
        cleaned[key] = value.map((item) => (typeof item === 'object' ? cleanForFirestore(item) : item));
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

function getLocalCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore JSON/storage issues
  }
  return fallback;
}

function setLocalCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Ignore storage quota issues
  }
}

// Default content configuration
export const defaultSiteContent: SiteContent = {
  heroTitle: 'EVERYDAY,\nELEVATED.',
  heroSubtitle: '',
  heroImage: 'https://i.postimg.cc/nzJnVXkz/Picsart-26-08-22-17-53-33-572.jpg',
  heroButtonText: 'SHOP NOW',
  heroButtonLink: '/shop',
  heroExploreLink: '/about',
  promoBarActive: false,
  promoBarText: '',
  perkDeliveryTitle: 'Free Delivery',
  perkDeliverySubtitle: 'On orders over ৳3,000',
  perkAuthenticTitle: '100% Authentic',
  perkAuthenticSubtitle: 'Direct formulation & care',
  perkCodTitle: 'Cash on Delivery',
  perkCodSubtitle: 'Available nationwide',
  perkSupportTitle: 'Fast Dispatch',
  perkSupportSubtitle: 'Within 24-48 hours',
  storyHeading: 'GOOD THINGS BELONG\nIN EVERYDAY LIFE.',
  storyBody: 'Medilux redefines the mundane. We believe that the objects you interact with daily should not just be functional; they should be surreal, artistic experiences that elevate your consciousness and your space.',
  bannerImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
  bannerTitle: 'Pure Organic Nutrition & Holistic Care',
  bannerLink: '/shop',
};

// Default store settings
export const defaultSiteSettings: SiteSettings = {
  storeName: 'MEDILUX',
  tagline: 'Elevated Everyday Living & Wellness',
  phone: '+880 1834-037142',
  storePhone: '+880 1834-037142',
  email: 'xpeee01@gmail.com',
  storeEmail: 'xpeee01@gmail.com',
  address: 'Gulshan 2, Dhaka 1212, Bangladesh',
  storeAddress: 'Gulshan 2, Dhaka 1212, Bangladesh',
  currency: 'BDT',
  currencySymbol: '৳',
  deliveryFeeDhaka: 80,
  deliveryFeeInsideDhaka: 80,
  deliveryFeeOutside: 150,
  deliveryFeeOutsideDhaka: 150,
  freeDeliveryThreshold: 3000,
  freeDeliveryText: 'Free Nationwide Delivery on orders over ৳3,000',
  codEnabled: true,
  codInstructions: 'Pay with cash upon delivery of your parcel at your doorstep.',
  facebookUrl: 'https://facebook.com/medilux',
  instagramUrl: 'https://instagram.com/medilux',
  whatsappNumber: '+8801834037142',
  youtubeUrl: 'https://youtube.com',
};

// Seed products & categories if Firestore is empty
export async function seedInitialDataIfEmpty() {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      console.log('Seeding initial products to Firestore...');
      const batch = writeBatch(db);
      for (const prod of initialProducts) {
        const prodRef = doc(db, 'products', prod.id);
        const data: Product = {
          ...prod,
          stock: prod.isOutOfStock ? 0 : 25,
          regularPrice: Math.round(prod.price * 1.15),
          isFeatured: prod.isBestseller || prod.isNew || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        batch.set(prodRef, cleanForFirestore(data));
      }
      await batch.commit();
    }

    const categoriesSnap = await getDocs(collection(db, 'categories'));
    if (categoriesSnap.empty) {
      console.log('Seeding initial categories to Firestore...');
      const batch = writeBatch(db);
      for (const cat of initialCategories) {
        const catRef = doc(db, 'categories', cat.id);
        const data: Category = {
          ...cat,
          isHidden: false,
          order: 1,
        };
        batch.set(catRef, cleanForFirestore(data));
      }
      await batch.commit();
    }

    // Check Settings
    const settingsRef = doc(db, 'settings', 'general');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, cleanForFirestore(defaultSiteSettings));
    }

    // Check Site Content
    const contentRef = doc(db, 'settings', 'content');
    const contentSnap = await getDoc(contentRef);
    if (!contentSnap.exists()) {
      await setDoc(contentRef, cleanForFirestore(defaultSiteContent));
    }
  } catch (err) {
    console.warn('Notice checking/seeding data in Firestore:', err);
  }
}

// Auto-seed on load
seedInitialDataIfEmpty().catch(() => {});

// ---------------- PRODUCTS ----------------
export function subscribeToProducts(callback: (products: Product[]) => void) {
  // First emit cached or default data immediately for instant render
  const cached = getLocalCache<Product[]>(
    CACHE_PRODUCTS_KEY,
    initialProducts.map((p) => ({
      ...p,
      stock: 25,
      isFeatured: p.isBestseller || p.isNew || false,
    }))
  );
  callback(cached);

  const q = query(collection(db, 'products'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If empty in DB, use default products
        callback(cached);
        if (auth.currentUser) {
          seedInitialDataIfEmpty();
        }
      } else {
        const items: Product[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Product, 'id'>),
        }));
        setLocalCache(CACHE_PRODUCTS_KEY, items);
        callback(items);
      }
    },
    (err) => {
      console.warn('Products subscription Firestore notice:', err);
      callback(getLocalCache<Product[]>(CACHE_PRODUCTS_KEY, cached));
    }
  );
}

export async function saveProduct(product: Partial<Product> & { name: string; price: number; category: string }): Promise<string> {
  const prodId = product.id || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
  const prodRef = doc(db, 'products', prodId);
  const dataToSave: Product = {
    id: prodId,
    name: product.name,
    descriptor: product.descriptor || '',
    description: product.description || '',
    price: Number(product.price) || 0,
    regularPrice: Number(product.regularPrice) || Number(product.price) || 0,
    image: product.image || 'https://picsum.photos/id/292/800/1200',
    images: product.images && product.images.length > 0 ? product.images : [product.image || 'https://picsum.photos/id/292/800/1200'],
    category: product.category,
    stock: Number(product.stock ?? 25),
    isNew: Boolean(product.isNew),
    isBestseller: Boolean(product.isBestseller),
    isFeatured: Boolean(product.isFeatured),
    isOutOfStock: Number(product.stock ?? 25) <= 0,
    ingredients: product.ingredients || '',
    howToUse: product.howToUse || '',
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Update local cache immediately
  const currentProds = getLocalCache<Product[]>(CACHE_PRODUCTS_KEY, []);
  const existingIdx = currentProds.findIndex((p) => p.id === prodId);
  let updatedList: Product[];
  if (existingIdx >= 0) {
    updatedList = [...currentProds];
    updatedList[existingIdx] = dataToSave;
  } else {
    updatedList = [dataToSave, ...currentProds];
  }
  setLocalCache(CACHE_PRODUCTS_KEY, updatedList);

  // Save to Firestore with clean sanitization
  try {
    await setDoc(prodRef, cleanForFirestore(dataToSave), { merge: true });
  } catch (err) {
    console.warn('Notice saving product to Firestore, cached locally:', err);
  }
  return prodId;
}

export async function deleteProduct(productId: string) {
  // Update local cache immediately
  const currentProds = getLocalCache<Product[]>(CACHE_PRODUCTS_KEY, []);
  const updatedList = currentProds.filter((p) => p.id !== productId);
  setLocalCache(CACHE_PRODUCTS_KEY, updatedList);

  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    console.warn('Notice deleting product from Firestore, removed locally:', err);
  }
}

export async function updateProductStock(productId: string, newStock: number) {
  // Update local cache
  const currentProds = getLocalCache<Product[]>(CACHE_PRODUCTS_KEY, []);
  const idx = currentProds.findIndex((p) => p.id === productId);
  if (idx >= 0) {
    currentProds[idx].stock = Number(newStock);
    currentProds[idx].isOutOfStock = Number(newStock) <= 0;
    currentProds[idx].updatedAt = new Date().toISOString();
    setLocalCache(CACHE_PRODUCTS_KEY, currentProds);
  }

  try {
    const prodRef = doc(db, 'products', productId);
    await updateDoc(prodRef, {
      stock: Number(newStock),
      isOutOfStock: Number(newStock) <= 0,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Notice updating product stock in Firestore:', err);
  }
}

// ---------------- CATEGORIES ----------------
export function subscribeToCategories(callback: (categories: Category[]) => void) {
  const cached = getLocalCache<Category[]>(CACHE_CATEGORIES_KEY, initialCategories);
  callback(cached);

  const q = query(collection(db, 'categories'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(cached);
        if (auth.currentUser) {
          seedInitialDataIfEmpty();
        }
      } else {
        const items: Category[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Category, 'id'>),
        }));
        setLocalCache(CACHE_CATEGORIES_KEY, items);
        callback(items);
      }
    },
    (err) => {
      console.warn('Categories subscription notice:', err);
      callback(getLocalCache<Category[]>(CACHE_CATEGORIES_KEY, cached));
    }
  );
}

export async function saveCategory(category: Category): Promise<string> {
  const catId = category.id || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
  const dataToSave: Category = {
    ...category,
    id: catId,
    isHidden: Boolean(category.isHidden),
  };

  // Update local cache
  const currentCats = getLocalCache<Category[]>(CACHE_CATEGORIES_KEY, []);
  const existingIdx = currentCats.findIndex((c) => c.id === catId);
  let updatedList: Category[];
  if (existingIdx >= 0) {
    updatedList = [...currentCats];
    updatedList[existingIdx] = dataToSave;
  } else {
    updatedList = [...currentCats, dataToSave];
  }
  setLocalCache(CACHE_CATEGORIES_KEY, updatedList);

  try {
    const catRef = doc(db, 'categories', catId);
    await setDoc(catRef, cleanForFirestore(dataToSave), { merge: true });
  } catch (err) {
    console.warn('Notice saving category to Firestore, cached locally:', err);
  }
  return catId;
}

export async function deleteCategory(categoryId: string) {
  const currentCats = getLocalCache<Category[]>(CACHE_CATEGORIES_KEY, []);
  const updatedList = currentCats.filter((c) => c.id !== categoryId);
  setLocalCache(CACHE_CATEGORIES_KEY, updatedList);

  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (err) {
    console.warn('Notice deleting category from Firestore, removed locally:', err);
  }
}

// ---------------- ORDERS ----------------
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const cached = getLocalCache<Order[]>(CACHE_ORDERS_KEY, []);
  callback(cached);

  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Order, 'id'>),
      }));
      setLocalCache(CACHE_ORDERS_KEY, orders);
      callback(orders);
    },
    (err) => {
      console.warn('Fallback ordering for orders:', err);
      const fallbackQ = query(collection(db, 'orders'));
      onSnapshot(fallbackQ, (s) => {
        const orders: Order[] = s.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Order, 'id'>),
          }))
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setLocalCache(CACHE_ORDERS_KEY, orders);
        callback(orders);
      });
    }
  );
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'> & { status?: OrderStatus }): Promise<Order> {
  const orderNumber = String(Math.floor(100000 + Math.random() * 900000));
  const newOrder: Order = {
    ...orderData,
    id: `ord_${Date.now()}`,
    orderNumber,
    status: orderData.status || 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Update local orders cache immediately
  const currentOrders = getLocalCache<Order[]>(CACHE_ORDERS_KEY, []);
  setLocalCache(CACHE_ORDERS_KEY, [newOrder, ...currentOrders]);

  try {
    const docRef = await addDoc(collection(db, 'orders'), newOrder);
    newOrder.id = docRef.id;
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
  }

  // 1. Automatically decrease stock for each ordered item
  try {
    for (const item of orderData.items) {
      updateProductStock(item.productId, (item.quantity ? Math.max(0, 25 - item.quantity) : 20));
      const prodRef = doc(db, 'products', item.productId);
      const prodSnap = await getDoc(prodRef);
      if (prodSnap.exists()) {
        const currentStock = prodSnap.data().stock ?? 25;
        const newStock = Math.max(0, currentStock - item.quantity);
        await updateDoc(prodRef, {
          stock: newStock,
          isOutOfStock: newStock === 0,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  } catch (stockErr) {
    console.error('Error updating stock after order:', stockErr);
  }

  // 2. Automatically record / update Customer profile
  try {
    const phoneClean = orderData.customerPhone.trim();
    if (phoneClean) {
      const customerId = `cust_${phoneClean.replace(/[^0-9]/g, '')}`;
      const customerRef = doc(db, 'customers', customerId);
      const customerSnap = await getDoc(customerRef);

      if (customerSnap.exists()) {
        const prev = customerSnap.data();
        await updateDoc(customerRef, {
          name: orderData.customerName || prev.name,
          email: orderData.customerEmail || prev.email || '',
          address: orderData.streetAddress || prev.address || '',
          city: orderData.city || prev.city || '',
          totalOrders: (prev.totalOrders || 0) + 1,
          totalSpent: (prev.totalSpent || 0) + orderData.total,
          lastOrderDate: new Date().toISOString(),
          orders: [...(prev.orders || []), newOrder.id],
        });
      } else {
        await setDoc(customerRef, {
          id: customerId,
          name: orderData.customerName,
          phone: phoneClean,
          email: orderData.customerEmail || '',
          address: orderData.streetAddress || '',
          city: orderData.city || '',
          totalOrders: 1,
          totalSpent: orderData.total,
          lastOrderDate: new Date().toISOString(),
          orders: [newOrder.id],
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (custErr) {
    console.error('Error updating customer record:', custErr);
  }

  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  // Update local cache
  const currentOrders = getLocalCache<Order[]>(CACHE_ORDERS_KEY, []);
  const idx = currentOrders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    currentOrders[idx].status = status;
    currentOrders[idx].updatedAt = new Date().toISOString();
    setLocalCache(CACHE_ORDERS_KEY, currentOrders);
  }

  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Notice updating order status in Firestore, updated locally:', err);
  }
}

export async function deleteOrder(orderId: string) {
  const currentOrders = getLocalCache<Order[]>(CACHE_ORDERS_KEY, []);
  const updated = currentOrders.filter((o) => o.id !== orderId);
  setLocalCache(CACHE_ORDERS_KEY, updated);

  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (err) {
    console.warn('Notice deleting order from Firestore, removed locally:', err);
  }
}

// ---------------- CUSTOMERS ----------------
export function subscribeToCustomers(callback: (customers: Customer[]) => void) {
  const cached = getLocalCache<Customer[]>(CACHE_CUSTOMERS_KEY, []);
  callback(cached);

  const q = query(collection(db, 'customers'));
  return onSnapshot(
    q,
    (snapshot) => {
      const customers: Customer[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Customer, 'id'>),
      }));
      setLocalCache(CACHE_CUSTOMERS_KEY, customers);
      callback(customers);
    },
    (err) => {
      console.error('Error subscribing to customers:', err);
      callback(getLocalCache<Customer[]>(CACHE_CUSTOMERS_KEY, []));
    }
  );
}

// ---------------- SETTINGS & CONTENT ----------------
export function subscribeToSettings(callback: (settings: SiteSettings) => void) {
  const cached = getLocalCache<SiteSettings>(CACHE_SETTINGS_KEY, defaultSiteSettings);
  callback(cached);

  const ref = doc(db, 'settings', 'general');
  return onSnapshot(
    ref,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        setLocalCache(CACHE_SETTINGS_KEY, data);
        callback(data);
      } else {
        callback(getLocalCache<SiteSettings>(CACHE_SETTINGS_KEY, defaultSiteSettings));
      }
    },
    (err) => {
      console.warn('Settings subscription notice:', err);
      callback(getLocalCache<SiteSettings>(CACHE_SETTINGS_KEY, defaultSiteSettings));
    }
  );
}

export const subscribeToSiteSettings = subscribeToSettings;

export async function saveSiteSettings(settings: SiteSettings) {
  setLocalCache(CACHE_SETTINGS_KEY, settings);
  try {
    const ref = doc(db, 'settings', 'general');
    await setDoc(ref, cleanForFirestore(settings), { merge: true });
  } catch (err) {
    console.warn('Notice saving settings to Firestore, cached locally:', err);
  }
}

export function subscribeToSiteContent(callback: (content: SiteContent) => void) {
  const cached = getLocalCache<SiteContent>(CACHE_CONTENT_KEY, defaultSiteContent);
  callback(cached);

  const ref = doc(db, 'settings', 'content');
  return onSnapshot(
    ref,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteContent;
        setLocalCache(CACHE_CONTENT_KEY, data);
        callback(data);
      } else {
        callback(getLocalCache<SiteContent>(CACHE_CONTENT_KEY, defaultSiteContent));
      }
    },
    (err) => {
      console.warn('Site content subscription notice:', err);
      callback(getLocalCache<SiteContent>(CACHE_CONTENT_KEY, defaultSiteContent));
    }
  );
}

export async function saveSiteContent(content: SiteContent) {
  setLocalCache(CACHE_CONTENT_KEY, content);
  try {
    const ref = doc(db, 'settings', 'content');
    await setDoc(ref, cleanForFirestore(content), { merge: true });
  } catch (err) {
    console.warn('Notice saving content to Firestore, cached locally:', err);
  }
}

// Sound alert notification utility
export function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // Browser audio policy might restrict before gesture
  }
}
