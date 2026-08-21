import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

export function ProductCard({ product, key }: { product: Product; key?: React.Key }) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-[#F2F0EB] rounded-lg overflow-hidden mb-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-widest px-2 py-1 rounded">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-widest px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Add Button Overlay */}
        <button
          onClick={handleAdd}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-primary p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white"
          aria-label="Add to cart"
        >
          <Plus size={18} />
        </button>
      </div>

      <div>
        <h3 className="font-medium text-primary mb-1">{product.name}</h3>
        <p className="text-sm text-text-muted mb-2">{product.descriptor}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            className="text-xs font-medium tracking-widest text-text-muted hover:text-primary transition-colors md:hidden"
          >
            + ADD
          </button>
        </div>
      </div>
    </Link>
  );
}
