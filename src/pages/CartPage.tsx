import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center">
        <ShoppingBag size={48} strokeWidth={1} className="text-text-muted/50 mb-6" />
        <h1 className="text-2xl font-light mb-4">YOUR CART IS EMPTY.</h1>
        <p className="text-text-muted mb-8">Looks like you haven't added anything yet.</p>
        <Link
          to="/shop"
          className="px-8 py-4 bg-primary text-white text-xs font-medium tracking-widest rounded hover:opacity-90 transition-opacity"
        >
          EXPLORE PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-primary mb-16">
          YOUR CART
        </h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="lg:w-2/3 flex flex-col gap-8">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-black/10 text-xs font-medium tracking-widest text-text-muted">
              <div className="col-span-6">PRODUCT</div>
              <div className="col-span-2 text-center">PRICE</div>
              <div className="col-span-2 text-center">QUANTITY</div>
              <div className="col-span-2 text-right">TOTAL</div>
            </div>

            {items.map((item) => (
              <div key={item.product.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center py-6 border-b border-black/5">
                {/* Product Info */}
                <div className="w-full md:col-span-6 flex gap-6 items-center">
                  <Link to={`/product/${item.product.id}`} className="w-24 h-32 flex-shrink-0 bg-accent/30 rounded overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${item.product.id}`} className="font-medium hover:underline underline-offset-4 block mb-1">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-text-muted mb-3">{item.product.descriptor}</p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs text-text-muted underline underline-offset-4 hover:text-primary transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Mobile Layout Helpers */}
                <div className="w-full flex justify-between items-center md:hidden mt-4">
                  <div className="flex items-center border border-black/10 rounded h-10">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 text-text-muted hover:text-primary"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 text-text-muted hover:text-primary"><Plus size={14} /></button>
                  </div>
                  <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                </div>

                {/* Desktop Layout Helpers */}
                <div className="hidden md:block col-span-2 text-center text-sm">
                  {formatPrice(item.product.price)}
                </div>
                
                <div className="hidden md:flex col-span-2 justify-center">
                  <div className="flex items-center border border-black/10 rounded h-10">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 text-text-muted hover:text-primary"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 text-text-muted hover:text-primary"><Plus size={14} /></button>
                  </div>
                </div>

                <div className="hidden md:block col-span-2 text-right font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#F2F0EB] p-8 rounded-lg sticky top-32">
              <h2 className="text-lg font-medium tracking-wide mb-8">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-black/10 pt-6 mb-8 flex justify-between items-center">
                <span className="font-medium tracking-widest text-sm">TOTAL</span>
                <span className="text-xl font-medium">{formatPrice(cartTotal)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center px-8 py-4 bg-primary text-white text-xs font-medium tracking-widest rounded hover:opacity-90 transition-opacity mb-4"
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
