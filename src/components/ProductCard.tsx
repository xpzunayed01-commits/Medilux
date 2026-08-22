import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="relative aspect-[3/4] bg-accent/20 rounded-2xl overflow-hidden mb-4 shadow-md transition-all duration-700 group-hover:-translate-y-2">
        {/* Image */}
        <img referrerPolicy="no-referrer"
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-primary p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white shadow-md"
          aria-label="Add to cart"
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="px-1">
        <h3 className="font-light text-lg text-primary mb-1 tracking-tighter">{product.name}</h3>
        <p className="text-xs text-text-muted mb-2 font-light italic">{product.descriptor}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-primary">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
