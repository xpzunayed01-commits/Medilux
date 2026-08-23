import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Layers, 
  Boxes, 
  Users, 
  Sliders, 
  Palette,
  LogOut,
  ExternalLink,
  X
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { subscribeToOrders, subscribeToProducts } from '../../lib/dataService';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const currentUserEmail = auth.currentUser?.email || 'xpeee01@gmail.com';

  useEffect(() => {
    const unsubOrders = subscribeToOrders((orders) => {
      const newCount = orders.filter(o => o.status === 'new').length;
      setNewOrdersCount(newCount);
    });

    const unsubProducts = subscribeToProducts((prods) => {
      const lowCount = prods.filter(p => (p.stock ?? 25) <= 5).length;
      setLowStockCount(lowCount);
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    } finally {
      navigate('/xpzunayed');
    }
  };

  const menuItems = [
    { path: '/xpzunayed/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/xpzunayed/orders', label: 'Orders', icon: ShoppingCart, badge: newOrdersCount > 0 ? newOrdersCount : null, badgeColor: 'bg-emerald-500' },
    { path: '/xpzunayed/products', label: 'Products', icon: Package },
    { path: '/xpzunayed/categories', label: 'Categories', icon: Layers },
    { path: '/xpzunayed/inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-amber-500' },
    { path: '/xpzunayed/customers', label: 'Customers', icon: Users },
    { path: '/xpzunayed/content', label: 'Content', icon: Palette },
    { path: '/xpzunayed/settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="admin-sidebar"
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-[#0F2417] text-white h-screen flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-white/10 shadow-2xl md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-6 pb-4 flex items-center justify-between border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h1 className="text-xl font-bold tracking-widest text-white">MEDILUX</h1>
              </div>
              <p className="text-[10px] tracking-wider text-emerald-400 font-mono mt-0.5 uppercase">Admin Control Panel</p>
            </div>
            <button 
              onClick={onClose} 
              className="md:hidden text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)] no-scrollbar">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-700/80 text-white font-semibold shadow-inner border border-emerald-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="shrink-0 opacity-90" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section with User Info & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
          {/* Quick View Website Link */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] text-gray-400">Live ↗</span>
          </a>

          {/* Admin User Info */}
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 shadow">
              {currentUserEmail.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">Admin</p>
              <p className="text-[11px] text-gray-400 truncate">{currentUserEmail}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-rose-900/30 transition-colors"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
