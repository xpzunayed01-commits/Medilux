import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { ShoppingBag, CheckCircle, ShieldCheck } from 'lucide-react';
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
    const unsub = subscribeToSiteSettings((s) => setSettings(s));
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
      // Pass order info via state or query
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
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center">
        <ShoppingBag size={48} strokeWidth={1} className="text-text-muted/50 mb-6" />
        <h1 className="text-2xl font-light mb-4">YOUR CART IS EMPTY.</h1>
        <Link to="/shop" className="text-sm tracking-widest underline underline-offset-4">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-32 pb-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Checkout Form */}
          <div className="lg:w-3/5">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-primary mb-12">
              CHECKOUT
            </h1>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Contact */}
              <section>
                <h2 className="text-sm font-medium tracking-widest mb-6 border-b border-black/10 pb-4">
                  1. CONTACT INFORMATION
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-text-muted mb-2">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ayesha Rahman"
                      className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-2">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01700-000000"
                      className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-2">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ayesha@example.com"
                      className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="text-sm font-medium tracking-widest mb-6 border-b border-black/10 pb-4">
                  2. DELIVERY DETAILS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-text-muted mb-2">Street Address / House & Road *</label>
                    <input
                      required
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="House #12, Road #4, Block B, Banani"
                      className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-2">City / District *</label>
                    <input
                      required
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Dhaka, Chittagong, Sylhet..."
                      className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-2">Postal Code (Optional)</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1212"
                      className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-text-muted mb-2">Order Note / Special Instructions (Optional)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Delivery time preferences or landmark details..."
                      className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="text-sm font-medium tracking-widest mb-6 border-b border-black/10 pb-4">
                  3. PAYMENT METHOD
                </h2>
                <div className="space-y-3">
                  <div className="p-5 rounded-2xl border bg-emerald-50/60 border-emerald-600/30 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-700 flex items-center justify-center bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-700"></div>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900">Cash on Delivery (COD)</span>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {settings.codInstructions || 'Pay with cash upon delivery of your parcel at your doorstep'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Default & Guaranteed
                    </span>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full block text-center px-8 py-5 bg-primary text-white text-sm font-semibold tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? 'SUBMITTING ORDER...' : 'CONFIRM & PLACE ORDER'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/5">
            <div className="bg-[#F2F0EB] p-8 rounded-2xl sticky top-32 space-y-6">
              <h2 className="text-lg font-medium tracking-wide">ORDER SUMMARY</h2>

              <FreeDeliveryProgress currentAmount={cartTotal} />
              
              <div className="flex flex-col gap-4 max-h-[35vh] overflow-y-auto no-scrollbar pr-2 border-t border-black/10 pt-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-accent/30 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10 font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-medium line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-text-muted mt-1">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center font-medium text-sm">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 text-sm border-t border-black/10 pt-6">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">
                    Delivery ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-black/10 pt-6 flex justify-between items-center">
                <span className="font-medium tracking-widest text-sm">TOTAL</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
