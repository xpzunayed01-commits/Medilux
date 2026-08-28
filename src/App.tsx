/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';

// Storefront pages
import { Home } from './pages/Home';
import { ProductPage } from './pages/ProductPage';
import { CollectionPage } from './pages/CollectionPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { About } from './pages/About';

// Info pages
import { Contact } from './pages/info/Contact';
import { FAQ } from './pages/info/FAQ';
import { Policies } from './pages/info/Policies';

// Admin components & pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Admin Aliases */}
        <Route path="/admin" element={<Navigate to="/xpzunayed" replace />} />
        <Route path="/admin-login" element={<Navigate to="/xpzunayed" replace />} />
        <Route path="/login" element={<Navigate to="/xpzunayed" replace />} />

        {/* Admin Login Screen */}
        <Route path="/xpzunayed" element={<AdminLogin />} />

        {/* Admin Protected Dashboard & Sub-modules */}
        <Route path="/xpzunayed" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/xpzunayed/dashboard" replace />} />
          </Route>
        </Route>

        {/* Public Storefront Routes with Layout */}
        <Route element={<Layout />}>
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
        </Route>
      </Routes>
    </CartProvider>
  );
}
