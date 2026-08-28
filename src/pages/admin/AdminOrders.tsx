import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
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
  ChevronDown,
  Send,
  Check,
  AlertCircle,
  RefreshCw,
  Package,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  subscribeToOrders, 
  updateOrderStatus, 
  deleteOrder, 
  resendTelegramNotification,
  subscribeToSiteSettings,
  defaultSiteSettings
} from '../../lib/dataService';
import { Order, OrderStatus, SiteSettings } from '../../types';
import { formatPrice } from '../../lib/utils';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [sendingTelegram, setSendingTelegram] = useState(false);

  useEffect(() => {
    const unsubOrders = subscribeToOrders((data) => {
      setOrders(data);
      setSelectedOrder((prevSelected) => {
        if (prevSelected) {
          const found = data.find((o) => o.id === prevSelected.id);
          return found ? found : prevSelected;
        }
        return prevSelected;
      });
    });

    const unsubSettings = subscribeToSiteSettings((data) => {
      if (data) setSettings(data);
    });

    return () => {
      unsubOrders();
      unsubSettings();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      const targetOrder = orders.find(o => o.id === orderId);
      const orderNum = targetOrder ? targetOrder.orderNumber : '';
      showToast(`Order #${orderNum} status changed to ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error('Failed to update status', err);
      showToast('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResendTelegram = async (order: Order) => {
    try {
      setSendingTelegram(true);
      const result = await resendTelegramNotification(order, settings.telegramBotToken, settings.telegramChatId);
      if (result.success) {
        showToast(`✅ Telegram alert sent for Order #${order.orderNumber}!`);
      } else {
        showToast(`❌ Telegram error: ${result.message || 'Check bot settings'}`);
      }
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`);
    } finally {
      setSendingTelegram(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    const orderNum = targetOrder ? targetOrder.orderNumber : '';
    if (window.confirm(`Are you sure you want to permanently delete Order #${orderNum}?`)) {
      try {
        await deleteOrder(orderId);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        showToast(`Order #${orderNum} deleted.`);
      } catch (err) {
        console.error(err);
        showToast('Failed to delete order.');
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
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">🟢 New</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-300">🔵 Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">🟡 Processing</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-300">🟣 Shipped</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-green-100 text-green-800 border border-green-300">✅ Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300">🔴 Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-gray-100 text-gray-800">{status}</span>;
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14281D] text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Track, update status, and fulfill customer purchases in real time</p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-2.5 sm:top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order #, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 sm:pb-2 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#14281D] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span>All</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">{counts.all}</span>
        </button>

        <button
          onClick={() => setStatusFilter('new')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'new'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <span>🟢 New</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-900/40 text-[10px] text-white font-bold">{counts.new}</span>
        </button>

        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'confirmed'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-blue-800 hover:bg-blue-50 border border-blue-200'
          }`}
        >
          <span>🔵 Confirmed</span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[10px]">{counts.confirmed}</span>
        </button>

        <button
          onClick={() => setStatusFilter('processing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'processing'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <span>🟡 Processing</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-[10px]">{counts.processing}</span>
        </button>

        <button
          onClick={() => setStatusFilter('shipped')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'shipped'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-purple-800 hover:bg-purple-50 border border-purple-200'
          }`}
        >
          <span>🟣 Shipped</span>
          <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[10px]">{counts.shipped}</span>
        </button>

        <button
          onClick={() => setStatusFilter('delivered')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'delivered'
              ? 'bg-green-700 text-white shadow-xs'
              : 'bg-white text-green-800 hover:bg-green-50 border border-green-200'
          }`}
        >
          <span>✅ Delivered</span>
          <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-[10px]">{counts.delivered}</span>
        </button>

        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'cancelled'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <span>🔴 Cancelled</span>
          <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-[10px]">{counts.cancelled}</span>
        </button>
      </div>

      {/* Orders List Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <ShoppingCart size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm sm:text-base font-bold text-gray-800">No matching orders found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search criteria.' : 'There are currently no orders in this status category.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View (< md screens) */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50/50 space-y-3">
                  {/* Top line: Order # + Date + Status Badge */}
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
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {order.city ? `${order.streetAddress}, ${order.city}` : order.streetAddress}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-[#14281D]">{formatPrice(order.total)}</p>
                      <p className="text-[10px] text-gray-400">{order.items?.length || 0} items • {order.paymentMethod?.toUpperCase() || 'COD'}</p>
                    </div>
                  </div>

                  {/* Quick Status Action Buttons */}
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Status:</span>
                    
                    <button
                      onClick={() => handleStatusChange(order.id, 'confirmed')}
                      disabled={updatingId === order.id || order.status === 'confirmed'}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        order.status === 'confirmed'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => handleStatusChange(order.id, 'shipped')}
                      disabled={updatingId === order.id || order.status === 'shipped'}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        order.status === 'shipped'
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      Ship
                    </button>

                    <button
                      onClick={() => handleStatusChange(order.id, 'delivered')}
                      disabled={updatingId === order.id || order.status === 'delivered'}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        order.status === 'delivered'
                          ? 'bg-green-600 text-white font-bold'
                          : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
                      }`}
                    >
                      Deliver
                    </button>

                    <button
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                      disabled={updatingId === order.id || order.status === 'cancelled'}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        order.status === 'cancelled'
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
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
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalamu Alaikum ${order.customerName}, your Medilux Order #${order.orderNumber} is currently: ${order.status.toUpperCase()}. Total: ৳${order.total}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs flex items-center gap-1"
                        title="WhatsApp Customer"
                      >
                        <MessageCircle size={13} />
                        <span className="text-[11px] font-semibold">WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-[#14281D] hover:bg-black text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg cursor-pointer"
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
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status & Quick Change</th>
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
                      <td className="py-4 px-4 font-bold text-xs text-gray-900 whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      
                      {/* Status & Quick Dropdown */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            disabled={updatingId === order.id}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 cursor-pointer ${
                              order.status === 'new' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              order.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              order.status === 'processing' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              order.status === 'shipped' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                              order.status === 'delivered' ? 'bg-green-50 text-green-800 border-green-300' :
                              'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="new">🟢 New</option>
                            <option value="confirmed">🔵 Confirmed</option>
                            <option value="processing">🟡 Processing</option>
                            <option value="shipped">🟣 Shipped</option>
                            <option value="delivered">✅ Delivered</option>
                            <option value="cancelled">🔴 Cancelled</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalamu Alaikum ${order.customerName}, regarding your Medilux Order #${order.orderNumber} (৳${order.total}) - Status: ${order.status.toUpperCase()}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </a>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F5]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-BD', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Status Update Grid - Direct Buttons */}
              <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Update Order Status</p>
                    <p className="text-[11px] text-gray-500">Click any status to immediately update order state</p>
                  </div>
                  {updatingId === selectedOrder.id && (
                    <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold animate-pulse">
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Updating...</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'new', label: '🟢 New Order', bg: 'bg-emerald-600 text-white', border: 'border-emerald-300 text-emerald-800 bg-white' },
                    { key: 'confirmed', label: '🔵 Confirmed', bg: 'bg-blue-600 text-white', border: 'border-blue-300 text-blue-800 bg-white' },
                    { key: 'processing', label: '🟡 Processing', bg: 'bg-amber-600 text-white', border: 'border-amber-300 text-amber-800 bg-white' },
                    { key: 'shipped', label: '🟣 Shipped', bg: 'bg-purple-600 text-white', border: 'border-purple-300 text-purple-800 bg-white' },
                    { key: 'delivered', label: '✅ Delivered', bg: 'bg-green-600 text-white', border: 'border-green-300 text-green-800 bg-white' },
                    { key: 'cancelled', label: '🔴 Cancelled', bg: 'bg-rose-600 text-white', border: 'border-rose-300 text-rose-800 bg-white' },
                  ].map((st) => {
                    const isActive = selectedOrder.status === st.key;
                    return (
                      <button
                        key={st.key}
                        onClick={() => handleStatusChange(selectedOrder.id, st.key as OrderStatus)}
                        disabled={updatingId === selectedOrder.id}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                          isActive
                            ? `${st.bg} shadow-md scale-[1.02]`
                            : `${st.border} hover:bg-gray-50`
                        }`}
                      >
                        <span>{st.label}</span>
                        {isActive && <Check size={14} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Customer Details</h3>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Phone size={12} />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalamu Alaikum ${selectedOrder.customerName}, your Medilux Order #${selectedOrder.orderNumber} is: ${selectedOrder.status.toUpperCase()}. Total: ৳${selectedOrder.total}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <MessageCircle size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-[11px] text-gray-400 block font-medium">Customer Name</span>
                    <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-medium">Phone Number</span>
                    <p className="font-bold text-emerald-800">{selectedOrder.customerPhone}</p>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Email Address</span>
                      <p className="text-gray-700">{selectedOrder.customerEmail}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] text-gray-400 block font-medium">City / District</span>
                    <p className="text-gray-800 font-semibold">{selectedOrder.city || 'Dhaka'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-gray-400 block font-medium">Delivery Address</span>
                    <p className="text-gray-800">{selectedOrder.streetAddress}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="sm:col-span-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs font-bold text-amber-800 block">Customer Instructions:</span>
                      <p className="text-xs text-amber-900 mt-0.5">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Ordered Products</h3>
                <div className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 sm:py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          referrerPolicy="no-referrer"
                          src={item.image || 'https://picsum.photos/id/292/800/1200'}
                          alt={item.name}
                          className="w-11 h-11 object-cover rounded-xl bg-gray-100 border border-gray-200 shrink-0"
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
                    <span className="text-[#14281D]">{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <div className="pt-2 text-xs text-gray-500 flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold uppercase">{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Instant Telegram Notification Section in Modal */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Send size={15} className="text-blue-600" />
                    <p className="text-xs font-bold text-blue-950">Telegram Notification Alert</p>
                  </div>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    {selectedOrder.telegramNotificationSent ? 'Telegram alert was recorded as sent.' : 'Send or resend instant alert to your Telegram bot.'}
                  </p>
                </div>

                <button
                  onClick={() => handleResendTelegram(selectedOrder)}
                  disabled={sendingTelegram}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>{sendingTelegram ? 'Sending...' : 'Send to Telegram'}</span>
                </button>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3 rounded-b-2xl sm:rounded-b-3xl">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedOrder.id)}
                  className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Delete Order
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-[#14281D] text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
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
