import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { Plus, Check, ArrowRight, Sparkles, Eye } from 'lucide-react';

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
    <div className="group relative flex flex-col justify-between h-full bg-white rounded-2xl p-2.5 sm:p-3 border border-black/[0.04] hover:border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-500">
      <Link to={`/product/${product.id}`} className="block flex-1">
        {/* Image Container with high-end editorial styling */}
        <div className="relative aspect-[4/5] bg-[#F5F4F0] rounded-xl overflow-hidden mb-3">
          <img
            referrerPolicy="no-referrer"
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold tracking-wider rounded-md uppercase">
                Sold Out
              </span>
            ) : product.isBestseller ? (
              <span className="px-2 py-0.5 bg-[#14281D]/90 backdrop-blur-md text-[#E6E1D6] text-[9px] font-bold tracking-widest rounded-md uppercase flex items-center gap-1">
                <Sparkles size={9} className="text-[#C5A880]" />
                Bestseller
              </span>
            ) : product.isNew ? (
              <span className="px-2 py-0.5 bg-[#7D8E79]/90 backdrop-blur-md text-white text-[9px] font-bold tracking-widest rounded-md uppercase">
                New
              </span>
            ) : null}
          </div>

          {/* Subtle View Hint on Hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur-md text-[#14281D] text-[10px] font-semibold tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye size={12} />
              View Details
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="px-1">
          {product.descriptor && (
            <p className="text-[10px] sm:text-[11px] text-[#6B6862] uppercase tracking-[0.14em] line-clamp-1 font-medium mb-1">
              {product.descriptor}
            </p>
          )}

          <h3 className="font-medium text-xs sm:text-sm text-[#14281D] line-clamp-1 group-hover:text-[#7D8E79] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-xs sm:text-sm font-bold text-[#14281D]">
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

      {/* Action Buttons */}
      <div className="mt-3 pt-2.5 border-t border-black/[0.04]">
        {isOutOfStock ? (
          <div className="py-1.5 text-center text-[10px] font-semibold text-gray-400 tracking-wider bg-gray-50 rounded-lg">
            OUT OF STOCK
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {/* Direct Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-2 px-2 bg-[#14281D] hover:bg-[#0d1b13] active:scale-[0.98] text-white text-[10px] sm:text-[11px] font-semibold tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              <span>BUY NOW</span>
              <ArrowRight size={10} className="opacity-80" />
            </button>

            {/* Quick Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              title={justAdded ? "Added to bag" : "Add to bag"}
              className={`h-8 sm:h-8.5 px-2.5 rounded-xl border transition-all text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer flex-shrink-0 ${
                justAdded
                  ? 'bg-[#14281D] text-white border-[#14281D] scale-100'
                  : 'bg-black/[0.02] hover:bg-black/[0.05] text-[#14281D] border-black/[0.08] active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={12} strokeWidth={2.5} />
                  <span className="hidden sm:inline text-[10px]">ADDED</span>
                </>
              ) : (
                <>
                  <Plus size={12} strokeWidth={2} />
                  <span className="hidden sm:inline text-[10px]">BAG</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
