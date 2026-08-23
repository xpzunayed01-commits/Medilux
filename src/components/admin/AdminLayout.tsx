import { Outlet, useLocation, Link } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, ExternalLink, Sparkles } from 'lucide-react';
import { subscribeToOrders, playNotificationSound, seedInitialDataIfEmpty } from '../../lib/dataService';
import { Order } from '../../types';
import { formatPrice } from '../../lib/utils';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrderToast, setNewOrderToast] = useState<Order | null>(null);
  const prevOrdersCountRef = useRef<number | null>(null);
  const location = useLocation();

  // Initialize data on mount
  useEffect(() => {
    seedInitialDataIfEmpty();
  }, []);

  // Listen for new orders and alert admin
  useEffect(() => {
    const unsub = subscribeToOrders((orders) => {
      if (prevOrdersCountRef.current !== null && orders.length > prevOrdersCountRef.current) {
        // Find latest new order
        const newest = orders[0];
        if (newest) {
          playNotificationSound();
          setNewOrderToast(newest);
          setTimeout(() => {
            setNewOrderToast(null);
          }, 7000);
        }
      }
      prevOrdersCountRef.current = orders.length;
    });

    return () => unsub();
  }, []);

  // Title formatting from path
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    switch (path) {
      case 'dashboard': return 'Dashboard Overview';
      case 'orders': return 'Orders Management';
      case 'products': return 'Products Catalog';
      case 'categories': return 'Categories Management';
      case 'inventory': return 'Inventory & Stock Control';
      case 'customers': return 'Customer Database';
      case 'content': return 'Website Content Editor';
      case 'settings': return 'Store & Business Settings';
      default: return 'Admin Portal';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6F4] text-gray-900 antialiased font-sans">
      {/* Real-time Order Toast Notification */}
      {newOrderToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-[#0F2417] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-start gap-3 animate-bounce">
          <div className="p-2 bg-emerald-600 rounded-xl shrink-0 mt-0.5">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">New Order Received!</p>
              <span className="text-[10px] text-gray-300">Just now</span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">#{newOrderToast.orderNumber} - {newOrderToast.customerName}</p>
            <p className="text-xs text-gray-300 mt-0.5">Total: <span className="font-bold text-emerald-300">{formatPrice(newOrderToast.total)}</span> ({newOrderToast.items.length} items)</p>
            <div className="mt-2 flex gap-2">
              <Link 
                to="/xpzunayed/orders" 
                onClick={() => setNewOrderToast(null)}
                className="text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium text-white transition-colors"
              >
                View Order
              </Link>
              <button 
                onClick={() => setNewOrderToast(null)} 
                className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">{getPageTitle()}</h2>
              <p className="text-xs text-gray-500 hidden md:block">Real-time store management system</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/xpzunayed/orders"
              className="p-2 rounded-xl text-gray-600 hover:text-emerald-700 hover:bg-gray-100 relative transition-colors"
              title="Orders"
            >
              <Bell size={18} />
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <span>Storefront</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </header>

        {/* Page View Outlet */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
