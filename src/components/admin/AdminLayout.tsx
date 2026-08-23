import { Outlet, useLocation, Link, NavLink } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Bell, 
  ExternalLink, 
  Sparkles, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Layers,
  Sliders,
  X
} from 'lucide-react';
import { subscribeToOrders, subscribeToProducts, playNotificationSound, seedInitialDataIfEmpty } from '../../lib/dataService';
import { Order } from '../../types';
import { formatPrice } from '../../lib/utils';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrderToast, setNewOrderToast] = useState<Order | null>(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const prevOrdersCountRef = useRef<number | null>(null);
  const location = useLocation();

  // Initialize data on mount
  useEffect(() => {
    seedInitialDataIfEmpty();
  }, []);

  // Listen for new orders and stock
  useEffect(() => {
    const unsubOrders = subscribeToOrders((orders) => {
      const newCount = orders.filter((o) => o.status === 'new').length;
      setNewOrdersCount(newCount);

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

    const unsubProducts = subscribeToProducts((prods) => {
      const lowCount = prods.filter((p) => (p.stock ?? 25) <= 5).length;
      setLowStockCount(lowCount);
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  // Title formatting from path
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    switch (path) {
      case 'dashboard': return 'Dashboard';
      case 'orders': return 'Orders';
      case 'products': return 'Products';
      case 'categories': return 'Categories';
      case 'inventory': return 'Inventory';
      case 'customers': return 'Customers';
      case 'content': return 'Content Editor';
      case 'settings': return 'Store Settings';
      default: return 'Admin Portal';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6F4] text-gray-900 antialiased font-sans">
      {/* Real-time Order Toast Notification - Fully Responsive on Mobile & PC */}
      {newOrderToast && (
        <div className="fixed top-3 inset-x-3 sm:inset-x-auto sm:right-5 sm:top-5 z-50 sm:max-w-sm bg-[#0F2417] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-start gap-3 animate-bounce">
          <div className="p-2 bg-emerald-600 rounded-xl shrink-0 mt-0.5">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider truncate">New Order Received!</p>
              <button 
                onClick={() => setNewOrderToast(null)}
                className="text-gray-400 hover:text-white p-0.5"
                aria-label="Dismiss toast"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white mt-0.5 truncate">#{newOrderToast.orderNumber} - {newOrderToast.customerName}</p>
            <p className="text-[11px] text-gray-300">Total: <span className="font-bold text-emerald-300">{formatPrice(newOrderToast.total)}</span> ({newOrderToast.items.length} items)</p>
            <div className="mt-2 flex gap-2">
              <Link 
                to="/xpzunayed/orders" 
                onClick={() => setNewOrderToast(null)}
                className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium text-white transition-colors"
              >
                View Order
              </Link>
              <button 
                onClick={() => setNewOrderToast(null)} 
                className="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors"
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
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h2>
                {location.pathname.includes('orders') && newOrdersCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                    {newOrdersCount} New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 hidden md:block">Real-time store controller</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/xpzunayed/orders"
              className="p-2 rounded-xl text-gray-600 hover:text-emerald-700 hover:bg-gray-100 relative transition-colors"
              title="Orders"
            >
              <Bell size={18} />
              {newOrdersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white"></span>
              )}
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <span className="hidden sm:inline">Storefront</span>
              <span className="sm:hidden">Store</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </header>

        {/* Page View Outlet */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          <Outlet />
        </main>

        {/* Mobile Bottom Thumb Navigation Bar (for phones & small screens) */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <NavLink
            to="/xpzunayed/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#0F2417] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span className="mt-0.5">Overview</span>
          </NavLink>

          <NavLink
            to="/xpzunayed/orders"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium relative transition-colors ${
                isActive ? 'text-[#0F2417] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <ShoppingCart size={18} />
            <span className="mt-0.5">Orders</span>
            {newOrdersCount > 0 && (
              <span className="absolute top-0.5 right-1.5 min-w-[15px] h-[15px] flex items-center justify-center bg-emerald-600 text-white text-[9px] font-bold rounded-full px-0.5">
                {newOrdersCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/xpzunayed/products"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#0F2417] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <Package size={18} />
            <span className="mt-0.5">Products</span>
          </NavLink>

          <NavLink
            to="/xpzunayed/inventory"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium relative transition-colors ${
                isActive ? 'text-[#0F2417] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <Boxes size={18} />
            <span className="mt-0.5">Stock</span>
            {lowStockCount > 0 && (
              <span className="absolute top-0.5 right-1.5 min-w-[15px] h-[15px] flex items-center justify-center bg-amber-500 text-white text-[9px] font-bold rounded-full px-0.5">
                {lowStockCount}
              </span>
            )}
          </NavLink>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium text-gray-500 hover:text-gray-900"
          >
            <Menu size={18} />
            <span className="mt-0.5">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}

