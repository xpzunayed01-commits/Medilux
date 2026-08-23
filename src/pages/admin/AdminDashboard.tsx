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
  Plus,
  Phone
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
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">New Order</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-300">Confirmed</span>;
      case 'processing':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">Processing</span>;
      case 'shipped':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-300">Shipped</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-green-100 text-green-800 border border-green-300">Delivered</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-gray-100 text-gray-800">{status}</span>;
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
    <div className="space-y-5 sm:space-y-6 md:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#0F2417] via-[#153422] to-[#1D4A30] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <div className="relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-1 sm:mb-2">
            <Sparkles size={14} className="shrink-0" />
            <span>Medilux Store Controller</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
            Welcome back, Admin 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
            Track real-time sales, fulfill new customer orders, update product catalogs, and customize store settings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 relative z-10 w-full sm:w-auto">
          <Link
            to="/xpzunayed/orders"
            className="flex-1 sm:flex-initial justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <ShoppingCart size={15} />
            <span>Orders ({newOrders.length})</span>
          </Link>
          <Link
            to="/xpzunayed/products"
            className="flex-1 sm:flex-initial justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-2"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid - Responsive: 2 cols on mobile, 3 on tablet, 5 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-5">
        {/* মোট Sales */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">মোট Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{formatPrice(totalSales)}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5 truncate">From {totalOrders} orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <ShoppingCart size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{totalOrders}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">Lifetime count</p>
        </div>

        {/* New Orders */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">New Orders</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl relative">
              {newOrders.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-0.5 right-0.5 animate-ping"></span>
              )}
              <Sparkles size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-2">{newOrders.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Need confirmation</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-700 mt-2">{pendingOrders.length}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Processing</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Low Stock</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-rose-700 mt-2">{lowStockProducts.length}</p>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">Stock ≤ 5 units</p>
        </div>
      </div>

      {/* Low Stock Alert if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                Low Stock Alert: {lowStockProducts.length} {lowStockProducts.length === 1 ? 'product is' : 'products are'} low on stock!
              </p>
              <p className="text-[11px] sm:text-xs text-amber-800/80 mt-0.5">
                {lowStockProducts.map((p) => `${p.name} (${p.stock ?? 0})`).slice(0, 3).join(', ')}
                {lowStockProducts.length > 3 ? ` and ${lowStockProducts.length - 3} more` : ''}
              </p>
            </div>
          </div>
          <Link
            to="/xpzunayed/inventory"
            className="w-full sm:w-auto text-center px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            Update Inventory
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-[11px] sm:text-xs text-gray-500">Live incoming customer orders</p>
          </div>
          <Link
            to="/xpzunayed/orders"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>All Orders ({orders.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 sm:py-12 border-2 border-dashed border-gray-100 rounded-2xl">
            <ShoppingCart size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-gray-600">No orders placed yet</p>
            <p className="text-[11px] text-gray-400 mt-1">When customers place orders on your website, they will appear here in real-time.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View (< sm screens) */}
            <div className="sm:hidden space-y-3">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="p-3.5 rounded-xl border border-gray-200/80 bg-gray-50/50 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-gray-900">#{order.orderNumber}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-[11px] text-gray-500">{order.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-[10px] text-gray-500">{order.items.length} items</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Phone size={12} />
                      <span>Call</span>
                    </a>

                    <div className="flex items-center gap-2">
                      {order.status === 'new' && (
                        <button
                          onClick={() => handleQuickStatus(order.id, 'confirmed')}
                          className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-bold transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      <Link
                        to="/xpzunayed/orders"
                        className="p-1.5 text-gray-600 hover:text-emerald-700 bg-white border border-gray-200 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= sm screens) */}
            <div className="hidden sm:block overflow-x-auto">
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
                      <td className="py-3 px-2 font-mono text-xs font-semibold text-gray-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-semibold text-gray-900 text-xs">{order.customerName}</p>
                        <p className="text-[11px] text-gray-500">{order.customerPhone}</p>
                      </td>
                      <td className="py-3 px-2 text-xs text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3 px-2 font-bold text-xs text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 px-2 text-right">
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
          </>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link
          to="/xpzunayed/products"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Package size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs sm:text-sm">Products Catalog</p>
              <p className="text-[11px] text-gray-500">{products.length} live items</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/xpzunayed/inventory"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-amber-50 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs sm:text-sm">Inventory & Stock</p>
              <p className="text-[11px] text-gray-500">Live adjustments</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/xpzunayed/customers"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs sm:text-sm">Customers CRM</p>
              <p className="text-[11px] text-gray-500">Orders & Contacts</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/xpzunayed/content"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-700 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs sm:text-sm">Website Content</p>
              <p className="text-[11px] text-gray-500">Hero, text & perks</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}

