/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const ProductPage = lazy(() => import('./pages/ProductPage').then(module => ({ default: module.ProductPage })));
const CollectionPage = lazy(() => import('./pages/CollectionPage').then(module => ({ default: module.CollectionPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(module => ({ default: module.OrderConfirmation })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(module => ({ default: module.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/xpzunayed" element={<AdminLogin />} />
        <Route path="/xpzunayed/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Add more routes here */}
        </Route>
        <Route path="*" element={
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
              </Routes>
            </Suspense>
          </Layout>
        } />
      </Routes>
    </CartProvider>
  );
}
