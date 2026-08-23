import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ListOrdered, 
  Users, 
  Settings, 
  FileText,
  LogOut 
} from 'lucide-react';

const menuItems = [
  { path: '/xpzunayed/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/xpzunayed/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/xpzunayed/products', label: 'Products', icon: Package },
  { path: '/xpzunayed/categories', label: 'Categories', icon: ListOrdered },
  { path: '/xpzunayed/inventory', label: 'Inventory', icon: FileText },
  { path: '/xpzunayed/customers', label: 'Customers', icon: Users },
  { path: '/xpzunayed/content', label: 'Content', icon: FileText },
  { path: '/xpzunayed/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-green-900 text-white min-h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-8">MEDILUX</h2>
      <nav className="flex-1">
        <ul className="space-y-4">
          {menuItems.map(item => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-green-800' : 'hover:bg-green-800'}`}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button className="flex items-center gap-3 p-2 text-red-300 hover:text-red-100">
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
