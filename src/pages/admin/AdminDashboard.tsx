import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  AlertTriangle, 
  Package, 
  Users, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react';
import { subscribeToOrders, subscribeToProducts, updateOrderStatus } from '../../lib/dataService';
import { Order, Product, OrderStatus } from '../../types';
import { formatPrice } from '../../lib/utils';

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubOrders = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });

    const unsubProducts = subscribeToProducts((data) => {
      setProducts(data);
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  // Metrics Calculations
  const totalOrders = orders.length;
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const newOrders = orders.filter((o) => o.status === 'new');
  const pendingOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'processing');
  const lowStockProducts = products.filter((p) => (p.stock ?? 25) <= 5);
  const recentOrders = orders.slice(0, 7);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">New Order</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">Processing</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-300">Shipped</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-300">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleQuickStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F2417] to-[#1D4A30] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold tracking-widest uppercase mb-2">
            <Sparkles size={16} />
            <span>Medilux Store Controller</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Welcome back, Admin 👋
          </h1>
          <p className="text-sm text-emerald-100/80 mt-1 max-w-xl">
            Track real-time sales, fulfill new customer orders, update product catalogs, and customize store settings.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/xpzunayed/orders"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <ShoppingCart size={15} />
            <span>Manage Orders ({newOrders.length})</span>
          </Link>
          <Link
            to="/xpzunayed/products"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-2"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
        {/* মোট Sales */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">মোট Sales</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">{formatPrice(totalSales)}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">From {totalOrders} orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <ShoppingCart size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">{totalOrders}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">All time lifetime</p>
        </div>

        {/* New Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Orders</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl relative">
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1 right-1 animate-ping"></span>
              <Sparkles size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-3">{newOrders.length}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Awaiting confirmation</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Orders</span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-3">{pendingOrders.length}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">In processing queue</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Low Stock</span>
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-3">{lowStockProducts.length}</p>
          <p className="text-xs text-rose-600 font-medium mt-1">Stock ≤ 5 units</p>
        </div>
      </div>

      {/* Low Stock Alert if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Low Stock Alert: {lowStockProducts.length} {lowStockProducts.length === 1 ? 'product is' : 'products are'} running out of stock!
              </p>
              <p className="text-xs text-amber-800/80">
                {lowStockProducts.map((p) => `${p.name} (${p.stock ?? 0} left)`).slice(0, 3).join(', ')}
                {lowStockProducts.length > 3 ? ` and ${lowStockProducts.length - 3} more` : ''}
              </p>
            </div>
          </div>
          <Link
            to="/xpzunayed/inventory"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            Update Inventory
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-xs text-gray-500">Live incoming customer orders</p>
          </div>
          <Link
            to="/xpzunayed/orders"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 hover:underline"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
            <ShoppingCart size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-600">No orders placed yet</p>
            <p className="text-xs text-gray-400 mt-1">When customers place orders on your website, they will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 px-2">Order ID</th>
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">Items</th>
                  <th className="pb-3 px-2">Total Amount</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-mono text-xs font-semibold text-gray-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-2">
                      <p className="font-semibold text-gray-900 text-xs">{order.customerName}</p>
                      <p className="text-[11px] text-gray-500">{order.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-2 text-xs text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3.5 px-2 font-bold text-xs text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3.5 px-2">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'new' && (
                          <button
                            onClick={() => handleQuickStatus(order.id, 'confirmed')}
                            className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-medium transition-colors"
                            title="Confirm Order"
                          >
                            Confirm
                          </button>
                        )}
                        <Link
                          to="/xpzunayed/orders"
                          className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/xpzunayed/products"
          className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Package size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Products</p>
              <p className="text-xs text-gray-500">{products.length} products live</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/xpzunayed/inventory"
          className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Inventory</p>
              <p className="text-xs text-gray-500">Stock & Alerts</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/xpzunayed/customers"
          className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Customers</p>
              <p className="text-xs text-gray-500">Contacts & History</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/xpzunayed/content"
          className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Website Content</p>
              <p className="text-xs text-gray-500">Hero & Banners</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
