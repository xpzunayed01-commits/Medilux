import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { products, categories } from '../data';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestseller);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1615397323282-315dc6b5a305?q=80&w=2070&auto=format&fit=crop"
            alt="Minimalist lifestyle scene"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24"
        >
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-primary leading-[1.05] mb-6">
              EVERYDAY,<br />ELEVATED.
            </h1>
            <p className="text-lg md:text-xl text-primary/80 max-w-md mx-auto md:mx-0 mb-10 font-light leading-relaxed">
              Thoughtfully selected essentials for the way you live.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white text-xs font-semibold tracking-widest rounded hover:opacity-90 transition-opacity text-center shadow-lg shadow-primary/20"
              >
                SHOP NOW
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-10 py-4 bg-white/50 backdrop-blur-md text-primary border border-primary/10 text-xs font-semibold tracking-widest rounded hover:bg-white/80 transition-colors text-center"
              >
                EXPLORE
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
          </div>
        </motion.div>
      </section>

      {/* Quick Category Navigation */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/collections/${category.id}`}
              className="group block"
            >
              <div className="aspect-square bg-accent/30 rounded-lg overflow-hidden mb-6 relative">
                <img referrerPolicy="no-referrer"
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium text-primary mb-1">{category.name}</h3>
                  <p className="text-sm text-text-muted">{category.description}</p>
                </div>
                <ArrowRight size={20} className="text-primary transform transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-primary mb-4">
              THE ESSENTIALS
            </h2>
            <p className="text-text-muted">Thoughtfully selected for everyday living.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-32 px-6 bg-[#F2F0EB]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-primary leading-tight mb-8">
            GOOD THINGS BELONG<br />IN EVERYDAY LIFE.
          </h2>
          <p className="text-lg md:text-xl text-text-muted font-light leading-relaxed max-w-2xl mx-auto">
            From what you drink to what you use every day, Medilux brings thoughtfully selected essentials together in one place.
          </p>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-primary mb-2">
                BEST SELLERS
              </h2>
            </div>
            <Link to="/shop" className="text-sm font-medium tracking-widest text-primary hover:opacity-60 transition-opacity hidden sm:block">
              SHOP ALL
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x">
            {bestSellers.map((product) => (
              <div key={product.id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
