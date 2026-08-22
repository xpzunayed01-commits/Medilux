import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { products, categories } from '../data';
import { ProductCard } from '../components/ProductCard';
import { AnimatedSection } from '../components/AnimatedSection';

export function Home() {
  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestseller);

  return (
    <div className="flex flex-col bg-background text-text-main">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img referrerPolicy="no-referrer"
            src="https://picsum.photos/id/292/2000/1200"
            alt="Minimalist lifestyle scene"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-left w-full px-8 md:px-16"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-primary leading-[0.9] mb-8 floating">
            EVERYDAY,<br />ELEVATED.
          </h1>
          <div className="flex items-center gap-6 justify-start">
            <Link to="/shop" className="px-10 py-4 bg-primary text-white text-xs font-semibold tracking-widest rounded-full hover:bg-primary/90 transition-all">SHOP NOW</Link>
            <Link to="/about" className="px-10 py-4 bg-white/50 backdrop-blur-md text-primary text-xs font-semibold tracking-widest rounded-full hover:bg-white/80 transition-all">EXPLORE</Link>
          </div>
        </motion.div>
      </section>

      {/* Surreal Category Scene */}
      <AnimatedSection className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-row overflow-x-auto gap-6 pb-6 md:grid md:grid-cols-2 md:gap-12 md:overflow-visible">
            {categories.map((category, i) => (
              <Link
                key={category.id}
                to={`/collections/${category.id}`}
                className={`group block relative min-w-[220px] md:min-w-0 ${i % 2 === 0 ? 'mt-0' : 'md:mt-32'}`}
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-lg">
                  <img referrerPolicy="no-referrer"
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0"></div>
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <h3 className="text-2xl font-light text-primary">{category.name}</h3>
                  <p className="text-xs text-text-muted italic">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Products: Asymmetrical Grid */}
      <AnimatedSection className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-light tracking-tighter text-primary mb-24 text-center">THE ESSENTIALS</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className={`${i === 0 || i === 3 ? 'md:col-span-7' : 'md:col-span-5'}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Brand Story: Surreal Scale Contrast */}
      <AnimatedSection className="py-32 px-6 bg-[#1A3626] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <div className="w-64 h-64 rounded-full bg-white/10 blur-3xl mb-12 floating"></div>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-8">
              GOOD THINGS BELONG<br />IN EVERYDAY LIFE.
            </h2>
          </div>
          <div className="flex-1 text-lg font-light leading-relaxed text-secondary">
            Medilux redefines the mundane. We believe that the objects you interact with daily should not just be functional; they should be surreal, artistic experiences that elevate your consciousness and your space.
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
