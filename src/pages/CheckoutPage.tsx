import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { ShoppingBag } from 'lucide-react';

export function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = 60; // Example flat delivery fee
  const finalTotal = cartTotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      clearCart();
      navigate('/order-confirmation');
    }, 1500);
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
                <h2 className="text-sm font-medium tracking-widest mb-6 border-b border-black/10 pb-4">1. CONTACT INFORMATION</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-text-muted mb-2">Full Name</label>
                    <input required type="text" className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-2">Email Address (Optional)</label>
                    <input type="email" className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-2">Phone Number</label>
                    <input required type="tel" className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="text-sm font-medium tracking-widest mb-6 border-b border-black/10 pb-4">2. DELIVERY DETAILS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-text-muted mb-2">Street Address</label>
                    <input required type="text" className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-2">City / Area</label>
                    <input required type="text" className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-2">Postal Code (Optional)</label>
                    <input type="text" className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-text-muted mb-2">Order Note (Optional)</label>
                    <textarea rows={3} className="w-full bg-white border border-black/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                  </div>
                </div>
              </section>

              {/* Payment Method - Simple presentation for guest checkout */}
              <section>
                <h2 className="text-sm font-medium tracking-widest mb-6 border-b border-black/10 pb-4">3. PAYMENT</h2>
                <div className="bg-white border border-primary rounded p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-primary bg-white"></div>
                    <span className="text-sm font-medium">Cash on Delivery</span>
                  </div>
                  <span className="text-xs text-text-muted">Pay when you receive</span>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full block text-center px-8 py-5 bg-primary text-white text-sm font-medium tracking-widest rounded hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/5">
            <div className="bg-[#F2F0EB] p-8 rounded-lg sticky top-32">
              <h2 className="text-lg font-medium tracking-wide mb-8">ORDER SUMMARY</h2>
              
              <div className="flex flex-col gap-4 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-accent/30 rounded overflow-hidden flex-shrink-0 relative">
                      <img src={item.product.image} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10">{item.quantity}</span>
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

              <div className="space-y-4 mb-8 text-sm border-t border-black/10 pt-6">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Delivery</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
              </div>

              <div className="border-t border-black/10 pt-6 flex justify-between items-center">
                <span className="font-medium tracking-widest text-sm">TOTAL</span>
                <span className="text-2xl font-medium">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
