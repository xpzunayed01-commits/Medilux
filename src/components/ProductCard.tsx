import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { Plus, Check, ArrowRight } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.isOutOfStock || (product.stock !== undefined && product.stock <= 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="group relative bg-white rounded-2xl p-2 sm:p-2.5 border border-black/[0.04] hover:border-black/10 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between h-full">
      <Link to={`/product/${product.id}`} className="block flex-1">
        {/* Minimalist Image Container */}
        <div className="relative aspect-[4/5] bg-[#F7F6F2] rounded-xl overflow-hidden mb-2.5">
          <img
            referrerPolicy="no-referrer"
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
          />

          {/* Minimal Tag */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 pointer-events-none">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-medium tracking-wider rounded-md uppercase">
                Sold Out
              </span>
            ) : product.isBestseller ? (
              <span className="px-2 py-0.5 bg-[#1A3626]/85 backdrop-blur-xs text-white text-[9px] font-medium tracking-wider rounded-md uppercase">
                Bestseller
              </span>
            ) : product.isNew ? (
              <span className="px-2 py-0.5 bg-emerald-800/85 backdrop-blur-xs text-white text-[9px] font-medium tracking-wider rounded-md uppercase">
                New
              </span>
            ) : null}
          </div>
        </div>

        {/* Minimal Product Meta */}
        <div className="px-1 pb-1">
          {product.descriptor && (
            <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider line-clamp-1 font-medium mb-0.5">
              {product.descriptor}
            </p>
          )}

          <h3 className="font-medium text-xs sm:text-sm text-primary line-clamp-1 group-hover:text-emerald-900 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xs sm:text-sm font-semibold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.regularPrice && product.regularPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Minimalist Action Controls */}
      <div className="mt-2 pt-2 border-t border-black/[0.03]">
        {isOutOfStock ? (
          <div className="py-1 text-center text-[10px] font-medium text-gray-400 tracking-wider">
            OUT OF STOCK
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {/* Minimal Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-1.5 sm:py-1.5 px-2.5 bg-[#1A3626] hover:bg-[#12271b] active:scale-[0.98] text-white text-[10px] sm:text-[11px] font-medium tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>BUY NOW</span>
              <ArrowRight size={10} className="opacity-70" />
            </button>

            {/* Minimal Add to Cart Quick Action */}
            <button
              type="button"
              onClick={handleAddToCart}
              title={justAdded ? "Added" : "Add to cart"}
              className={`h-7 sm:h-7 px-2 sm:px-2.5 rounded-lg border transition-all text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer flex-shrink-0 ${
                justAdded
                  ? 'bg-emerald-700 text-white border-emerald-700 scale-100'
                  : 'bg-black/[0.02] hover:bg-black/[0.05] text-primary border-black/[0.08] active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={11} strokeWidth={2.5} />
                  <span className="hidden sm:inline text-[10px]">ADDED</span>
                </>
              ) : (
                <>
                  <Plus size={11} strokeWidth={2} />
                  <span className="hidden sm:inline text-[10px]">CART</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


