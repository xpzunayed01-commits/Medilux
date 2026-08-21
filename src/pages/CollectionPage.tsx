import { useParams, Link } from 'react-router-dom';
import { products, categories } from '../data';
import { ProductCard } from '../components/ProductCard';

export function CollectionPage() {
  const { id } = useParams();
  
  // If id is undefined (e.g. /shop), show all products
  const category = id ? categories.find((c) => c.id === id) : {
    name: 'ALL PRODUCTS',
    description: 'Thoughtfully selected essentials for the way you live.',
    image: 'https://images.unsplash.com/photo-1615397323282-315dc6b5a305?q=80&w=2070&auto=format&fit=crop'
  };

  const filteredProducts = id
    ? products.filter((p) => p.category === id)
    : products;

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
            src={category!.image}
            alt={category!.name}
            className="w-full h-full object-cover"
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
      <section className="py-24 px-6">
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
      </section>
    </div>
  );
}
