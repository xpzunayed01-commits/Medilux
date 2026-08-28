/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';

// Storefront pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const ProductPage = lazy(() => import('./pages/ProductPage').then(module => ({ default: module.ProductPage })));
const CollectionPage = lazy(() => import('./pages/CollectionPage').then(module => ({ default: module.CollectionPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(module => ({ default: module.OrderConfirmation })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));

// Info pages
const Contact = lazy(() => import('./pages/info/Contact').then(module => ({ default: module.Contact })));
const FAQ = lazy(() => import('./pages/info/FAQ').then(module => ({ default: module.FAQ })));
const Policies = lazy(() => import('./pages/info/Policies').then(module => ({ default: module.Policies })));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(module => ({ default: module.AdminLogin })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminRoute = lazy(() => import('./components/admin/AdminRoute').then(module => ({ default: module.AdminRoute })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(module => ({ default: module.AdminOrders })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(module => ({ default: module.AdminProducts })));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories').then(module => ({ default: module.AdminCategories })));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory').then(module => ({ default: module.AdminInventory })));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers').then(module => ({ default: module.AdminCustomers })));
const AdminContent = lazy(() => import('./pages/admin/AdminContent').then(module => ({ default: module.AdminContent })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(module => ({ default: module.AdminSettings })));

export default function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Admin Login Route */}
        <Route
          path="/xpzunayed"
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F4F6F4]"><div className="w-8 h-8 rounded-full border-2 border-emerald-800 border-t-transparent animate-spin"></div></div>}>
              <AdminLogin />
            </Suspense>
          }
        />

        {/* Admin Nested Panel Routes */}
        <Route
          path="/xpzunayed/*"
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F4F6F4]"><div className="w-8 h-8 rounded-full border-2 border-emerald-800 border-t-transparent animate-spin"></div></div>}>
              <AdminRoute />
            </Suspense>
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* Public Storefront Routes */}
        <Route
          path="*"
          element={
            <Layout>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<CollectionPage />} />
                  <Route path="/collections" element={<Navigate to="/shop" replace />} />
                  <Route path="/collections/:id" element={<CollectionPage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/policies" element={<Policies />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          }
        />
      </Routes>
    </CartProvider>
  );
}
