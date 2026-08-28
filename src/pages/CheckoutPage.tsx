import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { ShoppingBag, ShieldCheck, Truck, ArrowRight, Check } from 'lucide-react';
import { createOrder, subscribeToSiteSettings, defaultSiteSettings } from '../lib/dataService';
import { SiteSettings } from '../types';
import { FreeDeliveryProgress } from '../components/FreeDeliveryProgress';

export function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');

  useEffect(() => {
    const unsub = subscribeToSiteSettings((s) => {
      if (s) setSettings(s);
    });
    return () => unsub();
  }, []);

  // Compute dynamic delivery fee
  const isInsideDhaka = city.trim().toLowerCase().includes('dhaka');
  const baseDeliveryFee = isInsideDhaka
    ? (settings.deliveryFeeInsideDhaka ?? 80)
    : (settings.deliveryFeeOutsideDhaka ?? 150);

  const isFreeDelivery = (settings.freeDeliveryThreshold && cartTotal >= settings.freeDeliveryThreshold) || false;
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;
  const finalTotal = cartTotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !streetAddress) {
      alert('Please fill in your name, phone number, and street address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await createOrder({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        streetAddress: streetAddress,
        city: city,
        postalCode: postalCode,
        notes: notes,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        subtotal: cartTotal,
        deliveryFee: deliveryFee,
        total: finalTotal,
        paymentMethod: paymentMethod,
      });

      clearCart();
      navigate('/order-confirmation', { state: { order: newOrder } });
    } catch (err) {
      console.error('Order creation error:', err);
      alert('There was an issue processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-36 pb-24 px-6 text-center bg-[#FAF9F5]">
        <div className="w-20 h-20 rounded-full bg-[#14281D]/[0.05] flex items-center justify-center text-[#14281D] mb-6">
          <ShoppingBag size={36} strokeWidth={1.5} className="opacity-70" />
        </div>
        <h1 className="text-2xl font-light text-[#14281D] mb-3">Your shopping bag is empty</h1>
        <Link 
          to="/shop" 
          className="px-8 py-3.5 bg-[#14281D] text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-black transition-colors"
        >
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-32 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7D8E79] block mb-2">
            SECURE ORDER DISPATCH
          </span>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#14281D]">
            Instant Express Checkout
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Checkout Form */}
          <div className="lg:w-3/5">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* 1. Contact Info */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.04] shadow-xs">
                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#14281D] mb-6 pb-3 border-b border-black/[0.05]">
                  1. RECIPIENT INFORMATION
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#6B6862] mb-1.5">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ayesha Rahman"
                      className="w-full bg-[#FAF9F5] border border-black/10 rounded-2xl px-4 py-3 text-sm text-[#14281D] focus:outline-none focus:border-[#14281D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B6862] mb-1.5">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01700-000000"
                      className="w-full bg-[#FAF9F5] border border-black/10 rounded-2xl px-4 py-3 text-sm text-[#14281D] focus:outline-none focus:border-[#14281D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B6862] mb-1.5">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ayesha@example.com"
                      className="w-full bg-[#FAF9F5] border border-black/10 rounded-2xl px-4 py-3 text-sm text-[#14281D] focus:outline-none focus:border-[#14281D] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Destination */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.04] shadow-xs">
                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#14281D] mb-6 pb-3 border-b border-black/[0.05]">
                  2. DELIVERY DESTINATION
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#6B6862] mb-1.5">Street Address / House & Road *</label>
                    <input
                      required
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="House #12, Road #4, Block B, Banani"
                      className="w-full bg-[#FAF9F5] border border-black/10 rounded-2xl px-4 py-3 text-sm text-[#14281D] focus:outline-none focus:border-[#14281D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B6862] mb-1.5">City / District *</label>
                    <input
                      required
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Dhaka, Chittagong, Sylhet..."
                      className="w-full bg-[#FAF9F5] border border-black/10 rounded-2xl px-4 py-3 text-sm text-[#14281D] focus:outline-none focus:border-[#14281D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B6862] mb-1.5">Postal Code (Optional)</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1212"
                      className="w-full bg-[#FAF9F5] border border-black/10 rounded-2xl px-4 py-3 text-sm text-[#14281D] focus:outline-none focus:border-[#14281D] transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#6B6862] mb-1.5">Order Note / Special Instructions (Optional)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Delivery time preferences or landmark details..."
                      className="w-full bg-[#FAF9F5] border border-black/10 rounded-2xl px-4 py-3 text-sm text-[#14281D] focus:outline-none focus:border-[#14281D] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.04] shadow-xs">
                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#14281D] mb-6 pb-3 border-b border-black/[0.05]">
                  3. PAYMENT SELECTION
                </h2>
                
                <div className="p-4 rounded-2xl border-2 border-[#14281D] bg-emerald-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[#14281D] flex items-center justify-center bg-white">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#14281D]"></div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#14281D]">Cash on Delivery (COD)</span>
                      <p className="text-xs text-[#6B6862] mt-0.5">
                        {settings.codInstructions || 'Pay with cash or bKash/Nagad upon receiving your parcel'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold tracking-wider uppercase">
                    Guaranteed
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-[#14281D] hover:bg-[#0d1b13] active:scale-[0.99] text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'PROCESSING YOUR DISPATCH...' : `CONFIRM ORDER • ${formatPrice(finalTotal)}`}</span>
                <ArrowRight size={15} />
              </button>

            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-2/5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.04] shadow-sm sticky top-36 space-y-6">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#14281D]">ORDER BREAKDOWN</h2>

              <FreeDeliveryProgress currentAmount={cartTotal} />
              
              {/* Product items preview */}
              <div className="flex flex-col gap-3 max-h-[30vh] overflow-y-auto no-scrollbar pr-1 border-t border-black/[0.06] pt-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="w-14 h-16 bg-[#FAF9F5] rounded-xl overflow-hidden flex-shrink-0 relative border border-black/[0.04]">
                      <img
                        referrerPolicy="no-referrer"
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 bg-[#14281D] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full z-10 font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#14281D] truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-[#6B6862]">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="font-semibold text-xs text-[#14281D]">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-[#6B6862] border-t border-black/[0.06] pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#14281D]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Delivery ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-800 font-bold">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-black/[0.06] pt-4 flex justify-between items-baseline">
                <span className="text-xs font-bold tracking-widest uppercase text-[#14281D]">TOTAL PAYABLE</span>
                <span className="text-2xl font-bold text-[#14281D]">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
