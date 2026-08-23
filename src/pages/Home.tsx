import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { AnimatedSection } from '../components/AnimatedSection';
import { 
  subscribeToProducts, 
  subscribeToCategories, 
  subscribeToSiteContent,
  defaultSiteContent 
} from '../lib/dataService';
import { Product, Category, SiteContent } from '../types';
import { products as fallbackProducts, categories as fallbackCategories } from '../data';

export function Home() {
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(fallbackCategories);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const unsubProds = subscribeToProducts((data) => {
      if (data && data.length > 0) setProductsList(data);
    });
    const unsubCats = subscribeToCategories((data) => {
      if (data && data.length > 0) setCategoriesList(data.filter((c) => !c.isHidden));
    });
    const unsubContent = subscribeToSiteContent((data) => {
      if (data) setContent(data);
    });

    return () => {
      unsubProds();
      unsubCats();
      unsubContent();
    };
  }, []);

  const featuredProducts = productsList.filter((p) => p.isFeatured || p.isBestseller).slice(0, 4);
  const displayEssentials = featuredProducts.length > 0 ? featuredProducts : productsList.slice(0, 4);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pauseTimeout = useRef<any>(null);
  const isPaused = useRef(false);

  const handleInteract = () => {
    isPaused.current = true;
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => {
      isPaused.current = false;
    }, 1500);
  };

  useEffect(() => {
    let animationId: number;
    const scroll = () => {
      if (scrollRef.current && !isPaused.current) {
        const { scrollWidth, clientWidth, scrollLeft, children } = scrollRef.current;
        if (scrollWidth > clientWidth && children.length >= categoriesList.length * 2) {
          const firstSetWidth = (children[categoriesList.length] as HTMLElement).offsetLeft - (children[0] as HTMLElement).offsetLeft;
          
          if (scrollLeft >= firstSetWidth) {
            scrollRef.current.scrollLeft -= firstSetWidth;
          } else if (scrollLeft <= 0) {
            scrollRef.current.scrollLeft += firstSetWidth;
          }
          
          scrollRef.current.scrollLeft += 3;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => {
      cancelAnimationFrame(animationId);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, [categoriesList]);

  return (
    <div className="flex flex-col bg-background text-text-main">
      {/* Promo Bar if active */}
      {content.promoBarActive && content.promoBarText && (
        <div className="bg-[#0F2417] text-emerald-200 text-xs py-2 px-4 text-center font-medium tracking-wide">
          {content.promoBarText}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            referrerPolicy="no-referrer"
            src={content.heroImage || "https://i.postimg.cc/nzJnVXkz/Picsart-26-08-22-17-53-33-572.jpg"}
            alt="Minimalist lifestyle scene"
            className="w-full h-full object-cover scale-110"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-left w-full px-8 md:px-16"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-primary leading-[0.9] mb-8 floating whitespace-pre-line">
            {content.heroTitle || "EVERYDAY,\nELEVATED."}
          </h1>
          <p className="text-sm md:text-lg text-primary/80 font-light max-w-lg mb-8">
            {content.heroSubtitle || "Surreal, artistic wellness and lifestyle rituals."}
          </p>
          <div className="flex items-center gap-6 justify-start mt-6">
            <Link
              to={content.heroButtonLink || "/shop"}
              className="px-10 py-4 bg-primary text-white text-xs font-semibold tracking-widest rounded-full hover:bg-primary/90 transition-all whitespace-nowrap shadow-lg"
            >
              {content.heroButtonText || "SHOP NOW"}
            </Link>
            <Link
              to="/about"
              className="px-10 py-4 bg-white/50 backdrop-blur-md text-primary text-xs font-semibold tracking-widest rounded-full hover:bg-white/80 transition-all"
            >
              EXPLORE
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Surreal Category Scene */}
      <AnimatedSection className="py-16">
        <div className="w-full md:max-w-7xl md:mx-auto md:px-6">
          <div 
            ref={scrollRef}
            onTouchStart={handleInteract}
            onTouchMove={handleInteract}
            onMouseDown={handleInteract}
            onWheel={handleInteract}
            className="flex flex-row overflow-x-auto gap-6 pb-6 md:grid md:grid-cols-2 md:gap-12 md:overflow-visible no-scrollbar px-0"
          >
            {[...categoriesList, ...categoriesList, ...categoriesList].map((category, i) => (
              <Link
                key={`${category.id}-${i}`}
                to={`/collections/${category.id}`}
                className={`group block relative min-w-[220px] md:min-w-0 ${i % 2 === 0 ? 'mt-0' : 'md:mt-32'} ${i >= categoriesList.length ? 'md:hidden' : ''}`}
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-lg">
                  <img
                    referrerPolicy="no-referrer"
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
            {displayEssentials.map((product, i) => (
              <div key={product.id} className={`${i === 0 || i === 3 ? 'md:col-span-7' : 'md:col-span-5'}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Brand Story */}
      <AnimatedSection className="py-32 px-6 bg-[#1A3626] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <div className="w-64 h-64 rounded-full bg-white/10 blur-3xl mb-12 floating"></div>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-8 whitespace-pre-line">
              {content.storyHeading || "GOOD THINGS BELONG\nIN EVERYDAY LIFE."}
            </h2>
          </div>
          <div className="flex-1 text-lg font-light leading-relaxed text-secondary whitespace-pre-line">
            {content.storyBody || "Medilux redefines the mundane. We believe that the objects you interact with daily should not just be functional; they should be surreal, artistic experiences that elevate your consciousness and your space."}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
