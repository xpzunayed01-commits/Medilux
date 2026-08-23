import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <h2 className="text-lg font-medium tracking-wide">YOUR CART</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 -mr-2 text-text-muted hover:text-primary transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Free Delivery Bar */}
            {items.length > 0 && (
              <div className="px-6 pt-4 pb-0">
                <FreeDeliveryProgress currentAmount={cartTotal} />
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 no-scrollbar">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-text-muted">
                  <ShoppingBag size={32} strokeWidth={1} className="opacity-50" />
                  <p className="text-sm">Looks like you haven't added anything yet.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-sm font-medium text-primary underline underline-offset-4"
                  >
                    EXPLORE PRODUCTS
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-accent/30 rounded overflow-hidden flex-shrink-0">
                      <img referrerPolicy="no-referrer"
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-medium">{item.product.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-text-muted hover:text-primary text-xs underline"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-text-muted mt-1">{item.product.descriptor}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-black/10 rounded">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-text-muted hover:text-primary"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-text-muted hover:text-primary"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-background border-t border-black/5 flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-xs text-text-muted">
                  Shipping & taxes calculated at checkout.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-4 text-xs tracking-widest font-medium rounded hover:opacity-90 transition-opacity"
                  >
                    CHECKOUT
                  </button>
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center py-4 text-xs tracking-widest font-medium border border-primary/20 rounded hover:bg-black/5 transition-colors"
                  >
                    VIEW CART
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
