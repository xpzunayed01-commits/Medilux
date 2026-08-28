import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as fallbackProducts, categories as fallbackCategories } from '../data';
import { ProductCard } from '../components/ProductCard';
import { AnimatedSection } from '../components/AnimatedSection';
import { subscribeToProducts, subscribeToCategories } from '../lib/dataService';
import { Product, Category } from '../types';
import { SlidersHorizontal, ArrowDownAZ, ArrowUpNarrowWide, ArrowDownWideNarrow, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function CollectionPage() {
  const { id } = useParams();
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(fallbackCategories);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  useEffect(() => {
    const unsubProds = subscribeToProducts((data) => {
      if (data && data.length > 0) setProductsList(data);
    });
    const unsubCats = subscribeToCategories((data) => {
      if (data && data.length > 0) setCategoriesList(data.filter(c => !c.isHidden));
    });

    return () => {
      unsubProds();
      unsubCats();
    };
  }, []);
  
  // Current category info
  const category = id ? categoriesList.find((c) => c.id === id) : {
    id: 'all',
    name: 'ALL ESSENTIALS',
    description: 'Thoughtfully selected botanical and everyday wellness essentials.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80'
  };

  const filteredProducts = useMemo(() => {
    let list = id
      ? productsList.filter((p) => p.category === id)
      : [...productsList];

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [id, productsList, sortBy]);

  return (
    <div className="flex-1 bg-[#FAF9F5] pt-20 sm:pt-24 pb-20">
      
      {/* Category Hero Banner */}
      <section className="relative min-h-[35vh] md:min-h-[42vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            referrerPolicy="no-referrer"
            src={category?.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80'}
            alt={category?.name || 'Collection'}
            className="w-full h-full object-cover opacity-25 mix-blend-multiply"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F5]/80 via-[#FAF9F5]/90 to-[#FAF9F5]"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto py-12">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#7D8E79] block mb-3">
            CURATED COLLECTION
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#14281D] mb-4 uppercase">
            {category?.name || 'ALL ESSENTIALS'}
          </h1>
          <p className="text-sm sm:text-base text-[#6B6862] font-light max-w-xl mx-auto leading-relaxed">
            {category?.description || 'Thoughtfully selected essentials for your daily ritual.'}
          </p>
        </div>
      </section>

      {/* Category Pills Navigation & Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-black/[0.06]">
          <Link
            to="/shop"
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 ${
              !id 
                ? 'bg-[#14281D] text-white shadow-xs' 
                : 'bg-white text-[#6B6862] hover:text-[#14281D] border border-black/[0.06]'
            }`}
          >
            ALL ESSENTIALS
          </Link>
          
          {categoriesList.map((cat) => {
            const isSelected = id === cat.id;
            return (
              <Link
                key={cat.id}
                to={`/collections/${cat.id}`}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 uppercase ${
                  isSelected 
                    ? 'bg-[#14281D] text-white shadow-xs' 
                    : 'bg-white text-[#6B6862] hover:text-[#14281D] border border-black/[0.06]'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Toolbar: Counter & Sorting */}
        <div className="flex items-center justify-between mt-6 text-xs text-[#6B6862]">
          <span className="font-medium">
            Showing <strong className="text-[#14281D]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] font-semibold tracking-wider uppercase text-[#6B6862]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-medium text-[#14281D] focus:outline-none focus:border-[#14281D] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured / Curated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Products Grid */}
      <AnimatedSection className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-black/[0.04] p-8 max-w-lg mx-auto shadow-xs">
              <Sparkles size={24} className="text-[#C5A880] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#14281D] mb-1">No items found</h3>
              <p className="text-xs text-[#6B6862] mb-6">There are no products in this category at the moment.</p>
              <Link 
                to="/shop" 
                className="px-6 py-2.5 bg-[#14281D] text-white text-xs font-semibold tracking-wider uppercase rounded-full hover:bg-black transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
      
    </div>
  );
}
