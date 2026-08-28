import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { FreeDeliveryProgress } from '../components/FreeDeliveryProgress';
import { subscribeToSiteSettings, defaultSiteSettings } from '../lib/dataService';
import { SiteSettings } from '../types';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    const unsub = subscribeToSiteSettings((data) => {
      if (data) setSettings(data);
    });
    return () => unsub();
  }, []);

  const freeThreshold = settings.freeDeliveryThreshold ?? 2000;

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-36 pb-24 px-6 text-center bg-[#FAF9F5]">
        <div className="w-20 h-20 rounded-full bg-[#14281D]/[0.05] flex items-center justify-center text-[#14281D] mb-6">
          <ShoppingBag size={36} strokeWidth={1.5} className="opacity-70" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-light text-[#14281D] mb-3">Your shopping bag is empty</h1>
        <p className="text-sm text-[#6B6862] max-w-sm mb-8 font-light">
          You have not added any essentials to your bag yet. Explore our curated catalog.
        </p>
        <Link
          to="/shop"
          className="px-8 py-4 bg-[#14281D] text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-black transition-colors shadow-sm"
        >
          EXPLORE CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-32 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7D8E79] block mb-2">
            RITUAL ESSENTIALS
          </span>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#14281D]">
            Your Shopping Bag
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Cart Items List */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            {items.map((item) => (
              <div 
                key={item.product.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-3xl border border-black/[0.04] shadow-xs gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Link 
                    to={`/product/${item.product.id}`} 
                    className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 bg-[#FAF9F5] rounded-2xl overflow-hidden border border-black/[0.04]"
                  >
                    <img 
                      referrerPolicy="no-referrer"
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/product/${item.product.id}`} 
                      className="text-sm sm:text-base font-semibold text-[#14281D] hover:text-[#7D8E79] transition-colors block truncate"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.descriptor && (
                      <p className="text-xs text-[#7D8E79] uppercase tracking-wider mt-0.5 truncate">{item.product.descriptor}</p>
                    )}
                    <span className="text-xs font-semibold text-[#14281D] block mt-2 sm:hidden">
                      {formatPrice(item.product.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
                  {/* Stepper */}
                  <div className="flex items-center border border-black/15 rounded-xl bg-[#FAF9F5] h-9 px-1.5">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                      className="w-6 h-6 flex items-center justify-center text-[#14281D] hover:bg-black/5 rounded transition-colors cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#14281D] tabular-nums">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                      className="w-6 h-6 flex items-center justify-center text-[#14281D] hover:bg-black/5 rounded transition-colors cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-sm sm:text-base font-bold text-[#14281D]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.05] shadow-sm sticky top-36 space-y-6">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#14281D]">ORDER SUMMARY</h2>

              <FreeDeliveryProgress currentAmount={cartTotal} variant="expanded" />
              
              <div className="space-y-3 text-xs text-[#6B6862] border-t border-black/[0.06] pt-5">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#14281D] text-sm">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>{cartTotal >= freeThreshold ? <span className="text-emerald-800 font-bold">Complimentary</span> : 'Calculated at checkout'}</span>
                </div>
              </div>

              <div className="border-t border-black/[0.06] pt-5 flex justify-between items-baseline">
                <span className="text-xs font-bold tracking-widest uppercase text-[#14281D]">TOTAL</span>
                <span className="text-2xl font-bold text-[#14281D]">{formatPrice(cartTotal)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center px-8 py-4 bg-[#14281D] hover:bg-[#0d1b13] text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-2xl transition-all shadow-md cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
