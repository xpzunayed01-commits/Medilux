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
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Category, Order, Customer, SiteContent, SiteSettings, OrderStatus } from '../types';
import { products as initialProducts, categories as initialCategories } from '../data';

// Default content configuration
export const defaultSiteContent: SiteContent = {
  heroTitle: 'EVERYDAY,\nELEVATED.',
  heroSubtitle: 'Surreal, artistic wellness and lifestyle rituals.',
  heroImage: 'https://i.postimg.cc/nzJnVXkz/Picsart-26-08-22-17-53-33-572.jpg',
  heroButtonText: 'SHOP NOW',
  heroButtonLink: '/shop',
  heroExploreLink: '/about',
  promoBarActive: true,
  promoBarText: 'Complimentary shipping across Bangladesh on orders over ৳3,000.',
  storyHeading: 'GOOD THINGS BELONG\nIN EVERYDAY LIFE.',
  storyBody: 'Medilux redefines the mundane. We believe that the objects you interact with daily should not just be functional; they should be surreal, artistic experiences that elevate your consciousness and your space.',
  bannerImage: 'https://picsum.photos/id/292/1200/400',
  bannerTitle: 'Pure Organic Nutrition & Holistic Care',
  bannerLink: '/shop',
};

// Default store settings
export const defaultSiteSettings: SiteSettings = {
  storeName: 'MEDILUX',
  tagline: 'Elevated Everyday Living & Wellness',
  phone: '+880 1700-000000',
  email: 'xpeee01@gmail.com',
  address: 'Gulshan 2, Dhaka 1212, Bangladesh',
  currency: '৳',
  deliveryFeeDhaka: 60,
  deliveryFeeOutside: 120,
  freeDeliveryThreshold: 3000,
  codEnabled: true,
  codInstructions: 'Pay with cash upon delivery of your parcel.',
  bkashNumber: '01700000000 (Merchant/Personal)',
  bkashInstructions: 'Send money/payment to this number with Order ID in reference.',
  facebookUrl: 'https://facebook.com/medilux',
  instagramUrl: 'https://instagram.com/medilux',
  whatsappNumber: '+8801700000000',
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
        batch.set(prodRef, {
          ...prod,
          stock: prod.isOutOfStock ? 0 : 25,
          regularPrice: Math.round(prod.price * 1.15),
          isFeatured: prod.isBestseller || prod.isNew || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await batch.commit();
    }

    const categoriesSnap = await getDocs(collection(db, 'categories'));
    if (categoriesSnap.empty) {
      console.log('Seeding initial categories to Firestore...');
      const batch = writeBatch(db);
      for (const cat of initialCategories) {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(catRef, {
          ...cat,
          isHidden: false,
          order: 1,
        });
      }
      await batch.commit();
    }

    // Check Settings
    const settingsRef = doc(db, 'settings', 'general');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, defaultSiteSettings);
    }

    // Check Site Content
    const contentRef = doc(db, 'settings', 'content');
    const contentSnap = await getDoc(contentRef);
    if (!contentSnap.exists()) {
      await setDoc(contentRef, defaultSiteContent);
    }
  } catch (err) {
    console.error('Error checking/seeding data in Firestore:', err);
  }
}

// ---------------- PRODUCTS ----------------
export function subscribeToProducts(callback: (products: Product[]) => void) {
  const q = query(collection(db, 'products'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // Fallback to local products if empty and trigger seed
        callback(
          initialProducts.map((p) => ({
            ...p,
            stock: 25,
            isFeatured: p.isBestseller || p.isNew || false,
          }))
        );
        seedInitialDataIfEmpty();
      } else {
        const items: Product[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Product, 'id'>),
        }));
        callback(items);
      }
    },
    (err) => {
      console.warn('Products subscription fallback to local:', err);
      callback(
        initialProducts.map((p) => ({
          ...p,
          stock: 25,
          isFeatured: p.isBestseller || p.isNew || false,
        }))
      );
    }
  );
}

export async function saveProduct(product: Partial<Product> & { name: string; price: number; category: string }): Promise<string> {
  const prodId = product.id || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
  const prodRef = doc(db, 'products', prodId);
  const dataToSave = {
    ...product,
    id: prodId,
    descriptor: product.descriptor || '',
    description: product.description || '',
    price: Number(product.price) || 0,
    regularPrice: Number(product.regularPrice) || Number(product.price) || 0,
    image: product.image || 'https://picsum.photos/id/292/800/1200',
    images: product.images && product.images.length > 0 ? product.images : [product.image || 'https://picsum.photos/id/292/800/1200'],
    category: product.category,
    stock: Number(product.stock ?? 20),
    isNew: Boolean(product.isNew),
    isBestseller: Boolean(product.isBestseller),
    isFeatured: Boolean(product.isFeatured),
    isOutOfStock: (product.stock ?? 20) <= 0,
    ingredients: product.ingredients || '',
    howToUse: product.howToUse || '',
    updatedAt: new Date().toISOString(),
  };

  await setDoc(prodRef, dataToSave, { merge: true });
  return prodId;
}

export async function deleteProduct(productId: string) {
  await deleteDoc(doc(db, 'products', productId));
}

export async function updateProductStock(productId: string, newStock: number) {
  const prodRef = doc(db, 'products', productId);
  await updateDoc(prodRef, {
    stock: Number(newStock),
    isOutOfStock: Number(newStock) <= 0,
    updatedAt: new Date().toISOString(),
  });
}

// ---------------- CATEGORIES ----------------
export function subscribeToCategories(callback: (categories: Category[]) => void) {
  const q = query(collection(db, 'categories'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(initialCategories);
        seedInitialDataIfEmpty();
      } else {
        const items: Category[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Category, 'id'>),
        }));
        callback(items);
      }
    },
    (err) => {
      console.warn('Categories subscription fallback to local:', err);
      callback(initialCategories);
    }
  );
}

export async function saveCategory(category: Category): Promise<string> {
  const catId = category.id || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
  const catRef = doc(db, 'categories', catId);
  await setDoc(
    catRef,
    {
      ...category,
      id: catId,
      isHidden: Boolean(category.isHidden),
    },
    { merge: true }
  );
  return catId;
}

export async function deleteCategory(categoryId: string) {
  await deleteDoc(doc(db, 'categories', categoryId));
}

// ---------------- ORDERS ----------------
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Order, 'id'>),
      }));
      callback(orders);
    },
    (err) => {
      console.error('Error subscribing to orders:', err);
      // Try un-ordered fallback if indexing requires
      const fallbackQ = query(collection(db, 'orders'));
      onSnapshot(fallbackQ, (s) => {
        const orders: Order[] = s.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Order, 'id'>),
          }))
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        callback(orders);
      });
    }
  );
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'> & { status?: OrderStatus }): Promise<Order> {
  const orderNumber = String(Math.floor(100000 + Math.random() * 900000));
  const newOrder: Order = {
    ...orderData,
    id: '',
    orderNumber,
    status: orderData.status || 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, 'orders'), newOrder);
  newOrder.id = docRef.id;

  // 1. Automatically decrease stock for each ordered item
  try {
    for (const item of orderData.items) {
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
          orders: [...(prev.orders || []), docRef.id],
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
          orders: [docRef.id],
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
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteOrder(orderId: string) {
  await deleteDoc(doc(db, 'orders', orderId));
}

// ---------------- CUSTOMERS ----------------
export function subscribeToCustomers(callback: (customers: Customer[]) => void) {
  const q = query(collection(db, 'customers'));
  return onSnapshot(
    q,
    (snapshot) => {
      const customers: Customer[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Customer, 'id'>),
      }));
      callback(customers);
    },
    (err) => {
      console.error('Error subscribing to customers:', err);
      callback([]);
    }
  );
}

// ---------------- SETTINGS & CONTENT ----------------
export function subscribeToSettings(callback: (settings: SiteSettings) => void) {
  const ref = doc(db, 'settings', 'general');
  return onSnapshot(
    ref,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SiteSettings);
      } else {
        callback(defaultSiteSettings);
      }
    },
    (err) => {
      console.warn('Settings subscription fallback:', err);
      callback(defaultSiteSettings);
    }
  );
}

export const subscribeToSiteSettings = subscribeToSettings;

export async function saveSiteSettings(settings: SiteSettings) {
  const ref = doc(db, 'settings', 'general');
  await setDoc(ref, settings, { merge: true });
}

export function subscribeToSiteContent(callback: (content: SiteContent) => void) {
  const ref = doc(db, 'settings', 'content');
  return onSnapshot(
    ref,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SiteContent);
      } else {
        callback(defaultSiteContent);
      }
    },
    (err) => {
      console.warn('Site content subscription fallback:', err);
      callback(defaultSiteContent);
    }
  );
}

export async function saveSiteContent(content: SiteContent) {
  const ref = doc(db, 'settings', 'content');
  await setDoc(ref, content, { merge: true });
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
