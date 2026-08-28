import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { FreeDeliveryProgress } from './FreeDeliveryProgress';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FAF9F5] shadow-2xl z-50 flex flex-col justify-between"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-black/[0.06] bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#14281D]" />
                  <h2 className="text-sm font-bold tracking-[0.16em] uppercase text-[#14281D]">
                    YOUR SHOPPING BAG ({items.reduce((acc, item) => acc + item.quantity, 0)})
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 -mr-1 text-[#6B6862] hover:text-[#14281D] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                  aria-label="Close Bag"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              {/* Free Delivery Bar */}
              {items.length > 0 && (
                <div className="p-4 bg-white border-b border-black/[0.04]">
                  <FreeDeliveryProgress currentAmount={cartTotal} />
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#6B6862]">
                  <div className="w-16 h-16 rounded-full bg-[#14281D]/[0.04] flex items-center justify-center text-[#14281D] mb-4">
                    <ShoppingBag size={28} strokeWidth={1.5} className="opacity-70" />
                  </div>
                  <h3 className="text-base font-semibold text-[#14281D] mb-1">Your bag is currently empty</h3>
                  <p className="text-xs text-[#6B6862] font-light max-w-xs mb-6">
                    Explore our curated daily essentials to add wellness to your everyday ritual.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/shop');
                    }}
                    className="px-6 py-3 bg-[#14281D] text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-full hover:bg-black transition-colors cursor-pointer shadow-xs"
                  >
                    EXPLORE ESSENTIALS
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-white rounded-2xl border border-black/[0.04] shadow-xs">
                    <div className="w-20 h-20 bg-[#FAF9F5] rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.03]">
                      <img 
                        referrerPolicy="no-referrer"
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs sm:text-sm font-semibold text-[#14281D] truncate">{item.product.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        {item.product.descriptor && (
                          <p className="text-[10px] text-[#7D8E79] uppercase tracking-wider truncate">{item.product.descriptor}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/[0.03]">
                        <div className="flex items-center border border-black/10 rounded-lg bg-[#FAF9F5] h-7 px-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#14281D] hover:bg-black/5 rounded transition-colors cursor-pointer"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#14281D] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#14281D] hover:bg-black/5 rounded transition-colors cursor-pointer"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#14281D]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 bg-white border-t border-black/[0.06] shadow-lg flex flex-col gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#6B6862]">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-[#14281D] text-sm">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-800">
                    <span>Shipping</span>
                    <span>{cartTotal >= 2000 ? 'Complimentary' : 'Calculated at checkout'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#14281D] hover:bg-[#0d1b13] active:scale-[0.99] text-white py-4 text-xs tracking-[0.2em] font-semibold uppercase rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>CHECKOUT NOW • {formatPrice(cartTotal)}</span>
                    <ArrowRight size={14} />
                  </button>

                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center py-2.5 text-[11px] tracking-wider font-semibold text-[#6B6862] hover:text-[#14281D] transition-colors"
                  >
                    View & Edit Full Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
