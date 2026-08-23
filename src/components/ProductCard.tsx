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
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="group relative bg-white/70 hover:bg-white rounded-2xl p-2 sm:p-3 border border-black/[0.06] hover:border-black/15 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between h-full">
      <Link to={`/product/${product.id}`} className="block flex-1">
        {/* Minimalist Image Container */}
        <div className="relative aspect-[4/5] bg-[#F5F4F0] rounded-xl overflow-hidden mb-2.5">
          <img
            referrerPolicy="no-referrer"
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
          />

          {/* Minimal Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 pointer-events-none">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-medium tracking-wider rounded-md uppercase">
                Sold Out
              </span>
            ) : product.isBestseller ? (
              <span className="px-2 py-0.5 bg-[#1A3626]/90 backdrop-blur-xs text-white text-[9px] font-medium tracking-wider rounded-md uppercase">
                Bestseller
              </span>
            ) : null}
          </div>

          {/* Quick Floating Add Button on Image Hover */}
          {!isOutOfStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              title="Add to cart"
              className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-300 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-700 text-white scale-105'
                  : 'bg-white/95 text-primary hover:bg-[#1A3626] hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-1 sm:group-hover:translate-y-0'
              }`}
            >
              {justAdded ? (
                <Check size={13} strokeWidth={2.5} />
              ) : (
                <Plus size={14} strokeWidth={2} />
              )}
            </button>
          )}
        </div>

        {/* Minimal Product Meta */}
        <div className="px-0.5 pb-1">
          <h3 className="font-medium text-xs sm:text-sm text-primary line-clamp-1 group-hover:text-emerald-900 transition-colors">
            {product.name}
          </h3>
          {product.descriptor && (
            <p className="text-[10px] sm:text-[11px] text-text-muted mt-0.5 line-clamp-1 font-light">
              {product.descriptor}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
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

      {/* Minimal Action Footer */}
      <div className="mt-2 pt-2 border-t border-black/[0.04]">
        {isOutOfStock ? (
          <div className="py-1.5 text-center text-[10px] font-medium text-gray-400 tracking-wider">
            OUT OF STOCK
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {/* Minimal Direct Buy Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-1.5 sm:py-2 px-3 bg-[#1A3626] hover:bg-[#12271b] active:scale-[0.98] text-white text-[10px] sm:text-[11px] font-medium tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>BUY NOW</span>
              <ArrowRight size={11} className="opacity-70 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick Add icon toggle */}
            <button
              type="button"
              onClick={handleAddToCart}
              title="Add to cart"
              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg border transition-all flex items-center justify-center cursor-pointer flex-shrink-0 ${
                justAdded
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-black/[0.03] hover:bg-black/[0.06] text-primary border-black/[0.06] active:scale-95'
              }`}
            >
              {justAdded ? (
                <Check size={12} strokeWidth={2.5} />
              ) : (
                <Plus size={13} strokeWidth={2} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

