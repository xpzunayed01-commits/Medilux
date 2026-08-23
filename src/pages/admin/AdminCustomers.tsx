import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  Eye, 
  X, 
  ExternalLink,
  MessageCircle,
  Clock
} from 'lucide-react';
import { subscribeToCustomers, subscribeToOrders } from '../../lib/dataService';
import { Customer, Order } from '../../types';
import { formatPrice } from '../../lib/utils';

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const unsubCust = subscribeToCustomers((data) => setCustomers(data));
    const unsubOrders = subscribeToOrders((data) => setOrders(data));
    return () => {
      unsubCust();
      unsubOrders();
    };
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  // Get orders associated with a customer
  const getCustomerOrders = (customerPhone: string) => {
    return orders.filter(
      (o) => o.customerPhone.replace(/[^0-9]/g, '') === customerPhone.replace(/[^0-9]/g, '')
    );
  };

  const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers Database</h1>
          <p className="text-xs text-gray-500">Profiles, lifetime order history, and contact records</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center gap-2">
            <Users size={16} className="text-emerald-700" />
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">Total Clients</span>
              <span className="text-xs font-bold text-gray-900">{customers.length} registered</span>
            </div>
          </div>

          <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center gap-2">
            <DollarSign size={16} className="text-blue-700" />
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">Customer Value</span>
              <span className="text-xs font-bold text-gray-900">{formatPrice(totalSpentAll)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200/80 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <span className="text-xs text-gray-500 font-medium hidden sm:block">
          {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Customer' : 'Customers'}
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users size={44} className="mx-auto text-gray-300 mb-3" />
            <p className="text-base font-bold text-gray-800">No customers found</p>
            <p className="text-xs text-gray-400 mt-1">
              Customer profiles will be automatically created whenever orders are placed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Delivery Location</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Lifetime Spent</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                          {customer.name ? customer.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-xs">{customer.name}</p>
                          <p className="text-[11px] text-gray-400">{customer.email || 'No email provided'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone & Direct links */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${customer.phone}`}
                          className="text-xs font-semibold text-gray-900 hover:text-emerald-700"
                        >
                          {customer.phone}
                        </a>
                        <a
                          href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md"
                          title="WhatsApp Chat"
                        >
                          <MessageCircle size={13} />
                        </a>
                      </div>
                    </td>

                    {/* Address & City */}
                    <td className="py-3.5 px-4 text-xs text-gray-600 max-w-[200px] truncate">
                      {customer.address ? `${customer.address}, ${customer.city || ''}` : customer.city || 'Dhaka'}
                    </td>

                    {/* Total Orders */}
                    <td className="py-3.5 px-4 text-xs font-bold text-gray-900">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-full">
                        {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3.5 px-4 text-xs font-bold text-emerald-700">
                      {formatPrice(customer.totalSpent)}
                    </td>

                    {/* Last Order Date */}
                    <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye size={13} />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center uppercase">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">{selectedCustomer.name}</h2>
                  <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-[11px] text-gray-500 font-medium block">Total Orders</span>
                  <span className="text-lg font-bold text-gray-900 mt-1 block">{selectedCustomer.totalOrders}</span>
                </div>
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 font-medium block">Total Amount Spent</span>
                  <span className="text-lg font-bold text-emerald-800 mt-1 block">{formatPrice(selectedCustomer.totalSpent)}</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-gray-500 font-medium block">Location</span>
                  <span className="text-xs font-semibold text-gray-900 mt-1 block truncate">
                    {selectedCustomer.city || 'Dhaka, Bangladesh'}
                  </span>
                </div>
              </div>

              {/* Contact Card */}
              <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-2 text-xs">
                <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Saved Addresses & Contacts</h3>
                <p className="text-gray-700 flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{selectedCustomer.address || 'Address not specified'}</span>
                </p>
                {selectedCustomer.email && (
                  <p className="text-gray-700 flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span>{selectedCustomer.email}</span>
                  </p>
                )}
                <div className="pt-2 flex gap-3">
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-semibold flex items-center gap-1.5"
                  >
                    <Phone size={13} />
                    <span>Call Customer</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold flex items-center gap-1.5"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Order History Table */}
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Order History ({getCustomerOrders(selectedCustomer.phone).length})
                </h3>

                {getCustomerOrders(selectedCustomer.phone).length === 0 ? (
                  <p className="text-xs text-gray-400 p-4 bg-gray-50 rounded-2xl text-center">
                    No orders linked directly to this phone number.
                  </p>
                ) : (
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                    {getCustomerOrders(selectedCustomer.phone).map((ord) => (
                      <div key={ord.id} className="p-4 bg-white hover:bg-gray-50 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-gray-900">#{ord.orderNumber}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 uppercase font-semibold text-gray-600">
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-900">{formatPrice(ord.total)}</p>
                          <p className="text-[10px] text-gray-400 uppercase">{ord.paymentMethod || 'COD'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
