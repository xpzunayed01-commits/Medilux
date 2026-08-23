import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as fallbackProducts, categories as fallbackCategories } from '../data';
import { ProductCard } from '../components/ProductCard';
import { AnimatedSection } from '../components/AnimatedSection';
import { subscribeToProducts, subscribeToCategories } from '../lib/dataService';
import { Product, Category } from '../types';

export function CollectionPage() {
  const { id } = useParams();
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    const unsubProds = subscribeToProducts((data) => {
      if (data && data.length > 0) setProductsList(data);
    });
    const unsubCats = subscribeToCategories((data) => {
      if (data && data.length > 0) setCategoriesList(data);
    });

    return () => {
      unsubProds();
      unsubCats();
    };
  }, []);
  
  // If id is undefined (e.g. /shop), show all products
  const category = id ? categoriesList.find((c) => c.id === id) : {
    id: 'all',
    name: 'ALL PRODUCTS',
    description: 'Thoughtfully selected essentials for the way you live.',
    image: 'https://picsum.photos/id/292/2000/1200'
  };

  const filteredProducts = id
    ? productsList.filter((p) => p.category === id)
    : productsList;

  if (id && !category) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6">
        <h1 className="text-2xl font-light mb-4">COLLECTION NOT FOUND</h1>
        <Link to="/shop" className="text-sm tracking-widest underline underline-offset-4">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Category Hero */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            referrerPolicy="no-referrer"
            src={category!.image}
            alt={category!.name}
            className="w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto mt-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-primary mb-4">
            {category!.name}
          </h1>
          <p className="text-lg text-primary/80 font-light">
            {category!.description}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <AnimatedSection className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-muted">NO PRODUCTS FOUND IN THIS COLLECTION.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
