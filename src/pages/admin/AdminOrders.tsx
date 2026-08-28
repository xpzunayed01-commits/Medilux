import { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Trash2, 
  X,
  Printer,
  MessageCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { subscribeToOrders, updateOrderStatus, deleteOrder } from '../../lib/dataService';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../lib/utils';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const unsub = subscribeToOrders((data) => {
      setOrders(data);
      // Keep selected order in sync if open using functional update
      setSelectedOrder((prevSelected) => {
        if (prevSelected) {
          const found = data.find((o) => o.id === prevSelected.id);
          return found ? found : prevSelected;
        }
        return prevSelected;
      });
    });

    return () => unsub();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this order?')) {
      try {
        await deleteOrder(orderId);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete order.');
      }
    }
  };

  // Filter and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'new_confirm'
        ? order.status === 'new' || order.status === 'confirmed'
        : order.status === statusFilter;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.toLowerCase().includes(q) ||
      (order.city && order.city.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

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

  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === 'new').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Track and fulfill all incoming customer purchases</p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-2.5 sm:top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order #, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Tabs - Horizontal Swipe on Mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 sm:pb-2 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'all'
              ? 'bg-[#0F2417] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span>All</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">{counts.all}</span>
        </button>

        <button
          onClick={() => setStatusFilter('new')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'new'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <span>New</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-900/40 text-[10px] text-white font-bold">{counts.new}</span>
        </button>

        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'confirmed'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span>Confirmed</span>
          <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px]">{counts.confirmed}</span>
        </button>

        <button
          onClick={() => setStatusFilter('processing')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'processing'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span>Processing</span>
          <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px]">{counts.processing}</span>
        </button>

        <button
          onClick={() => setStatusFilter('shipped')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'shipped'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span>Shipped</span>
          <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px]">{counts.shipped}</span>
        </button>

        <button
          onClick={() => setStatusFilter('delivered')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'delivered'
              ? 'bg-green-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span>Delivered</span>
          <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px]">{counts.delivered}</span>
        </button>

        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'cancelled'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span>Cancelled</span>
          <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px]">{counts.cancelled}</span>
        </button>
      </div>

      {/* Orders Content Area */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <ShoppingCart size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm sm:text-base font-bold text-gray-800">No matching orders found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search criteria.' : 'There are currently no orders in this category.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View (< md screens) - Structured Order Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-3.5 sm:p-4 hover:bg-gray-50/50 space-y-3">
                  {/* Top line: Order # + Date + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-900">#{order.orderNumber}</span>
                      <span className="text-[10px] text-gray-400 ml-2">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Customer Info & Address */}
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 max-w-[200px] truncate">
                        {order.city ? `${order.streetAddress}, ${order.city}` : order.streetAddress}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-emerald-800">{formatPrice(order.total)}</p>
                      <p className="text-[10px] text-gray-400">{order.items.length} items • {order.paymentMethod || 'COD'}</p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    {/* Quick Call & WhatsApp */}
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs flex items-center gap-1"
                        title="Call Customer"
                      >
                        <Phone size={13} />
                        <span className="text-[11px] font-semibold">Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs flex items-center gap-1"
                        title="WhatsApp"
                      >
                        <MessageCircle size={13} />
                        <span className="text-[11px] font-semibold">Chat</span>
                      </a>
                    </div>

                    {/* Status & Details */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>Details</span>
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                        title="Delete Order"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Order #</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Address</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-4 px-4 font-mono text-xs font-bold text-gray-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900 text-xs">{order.customerName}</p>
                        <a href={`tel:${order.customerPhone}`} className="text-[11px] text-emerald-700 hover:underline">
                          {order.customerPhone}
                        </a>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600 max-w-[180px] truncate">
                        {order.city ? `${order.streetAddress}, ${order.city}` : order.streetAddress}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-4 px-4 font-bold text-xs text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* Order Details Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-gray-900">Order #{selectedOrder.orderNumber}</span>
                  {getStatusBadge(selectedOrder.status)}
                  {selectedOrder.telegramNotificationSent === true && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-blue-50 text-blue-700 border border-blue-100" title="Telegram Sent">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                      Telegram Sent
                    </span>
                  )}
                  {selectedOrder.telegramNotificationSent === false && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-red-50 text-red-700 border border-red-100" title="Telegram Failed or Pending">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                      Telegram Error
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Status Update Controller */}
              <div className="p-3.5 sm:p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Change Order Status</p>
                  <p className="text-[11px] sm:text-xs text-gray-500">Updating will immediately reflect across the store</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    disabled={updatingStatus}
                    className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="new">🟢 New Order</option>
                    <option value="confirmed">🔵 Confirmed</option>
                    <option value="processing">🟡 Processing</option>
                    <option value="shipped">🟣 Shipped</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="cancelled">🔴 Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Name</span>
                    <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Phone</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a href={`tel:${selectedOrder.customerPhone}`} className="font-semibold text-emerald-800 hover:underline">
                        {selectedOrder.customerPhone}
                      </a>
                      <a
                        href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-medium hover:bg-emerald-100"
                        title="Chat on WhatsApp"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div>
                      <span className="text-[11px] text-gray-400 block">Email</span>
                      <p className="text-gray-700">{selectedOrder.customerEmail}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] text-gray-400 block">City / Area</span>
                    <p className="text-gray-700">{selectedOrder.city || 'Dhaka'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-gray-400 block">Street Address</span>
                    <p className="text-gray-800">{selectedOrder.streetAddress}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="sm:col-span-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs font-bold text-amber-800 block">Customer Note:</span>
                      <p className="text-xs text-amber-900 mt-0.5">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ordered Products</h3>
                <div className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 sm:py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          referrerPolicy="no-referrer"
                          src={item.image || 'https://picsum.photos/id/292/800/1200'}
                          alt={item.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-xl bg-gray-100 border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] sm:text-xs text-gray-500">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Charge</span>
                    <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Grand Total</span>
                    <span className="text-emerald-700">{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <div className="pt-2 text-xs text-gray-500 flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold uppercase">{selectedOrder.paymentMethod || 'Cash on Delivery'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3 rounded-b-2xl sm:rounded-b-3xl">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedOrder.id)}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-[#0F2417] text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

