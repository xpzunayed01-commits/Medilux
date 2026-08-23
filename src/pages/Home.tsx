import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, Banknote, Clock, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { AnimatedSection } from '../components/AnimatedSection';
import { 
  subscribeToProducts, 
  subscribeToCategories, 
  subscribeToSiteContent,
  subscribeToSiteSettings,
  defaultSiteContent,
  defaultSiteSettings
} from '../lib/dataService';
import { Product, Category, SiteContent, SiteSettings } from '../types';
import { products as fallbackProducts, categories as fallbackCategories } from '../data';
import { formatPrice } from '../lib/utils';

export function Home() {
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(fallbackCategories);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

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
    const unsubSettings = subscribeToSiteSettings((data) => {
      if (data) setSettings(data);
    });

    return () => {
      unsubProds();
      unsubCats();
      unsubContent();
      unsubSettings();
    };
  }, []);

  const displayProducts = productsList.length > 0 ? productsList : fallbackProducts;

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
          
          scrollRef.current.scrollLeft += 2;
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
    <div className="flex flex-col bg-background text-text-main overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            referrerPolicy="no-referrer"
            src={content.heroImage || "https://i.postimg.cc/nzJnVXkz/Picsart-26-08-22-17-53-33-572.jpg"}
            alt="Minimalist lifestyle scene"
            className="w-full h-full object-cover scale-105"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-left w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-24 pb-16"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-primary leading-[1.05] sm:leading-[0.95] mb-6 whitespace-pre-line max-w-3xl">
            {content.heroTitle || "EVERYDAY,\nELEVATED."}
          </h1>

          {/* Subtitle conditionally rendered only if provided and not the deprecated slogan */}
          {content.heroSubtitle && !content.heroSubtitle.toLowerCase().includes('surreal') && (
            <p className="text-xs sm:text-base md:text-lg text-primary/85 font-light max-w-lg mb-6">
              {content.heroSubtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-4">
            <Link
              to={content.heroButtonLink || "/shop"}
              className="px-7 sm:px-9 py-3 sm:py-3.5 bg-primary text-white text-xs font-semibold tracking-widest rounded-full hover:bg-primary/90 transition-all shadow-md active:scale-98"
            >
              {content.heroButtonText || "SHOP NOW"}
            </Link>
            <Link
              to="/about"
              className="px-7 sm:px-9 py-3 sm:py-3.5 bg-white/70 backdrop-blur-md text-primary text-xs font-semibold tracking-widest rounded-full hover:bg-white transition-all border border-black/5 active:scale-98"
            >
              EXPLORE
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Modern Luxury Perks Strip */}
      <section className="border-y border-black/5 bg-[#F9F8F6] py-4 sm:py-5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5 sm:gap-3 p-2 bg-white/60 sm:bg-transparent rounded-xl">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <Truck size={16} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-primary truncate">{content.perkDeliveryTitle || 'Free Delivery'}</p>
              <p className="text-[10px] sm:text-[11px] text-text-muted truncate">
                {settings.freeDeliveryThreshold ? `Orders over ${formatPrice(settings.freeDeliveryThreshold)}` : (content.perkDeliverySubtitle || 'Orders over ৳3,000')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2 bg-white/60 sm:bg-transparent rounded-xl">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-primary truncate">{content.perkAuthenticTitle || '100% Authentic'}</p>
              <p className="text-[10px] sm:text-[11px] text-text-muted truncate">{content.perkAuthenticSubtitle || 'Direct formulation & care'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2 bg-white/60 sm:bg-transparent rounded-xl">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <Banknote size={16} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-primary truncate">{content.perkCodTitle || 'Cash on Delivery'}</p>
              <p className="text-[10px] sm:text-[11px] text-text-muted truncate">{content.perkCodSubtitle || 'Nationwide door-to-door'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2 bg-white/60 sm:bg-transparent rounded-xl">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <Clock size={16} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-primary truncate">{content.perkSupportTitle || 'Fast Dispatch'}</p>
              <p className="text-[10px] sm:text-[11px] text-text-muted truncate">{content.perkSupportSubtitle || 'Within 24-48 hours'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Scene Carousel */}
      {categoriesList.length > 0 && (
        <AnimatedSection className="py-10 sm:py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-3xl font-light tracking-tight text-primary">COLLECTIONS</h2>
                <p className="text-xs text-text-muted mt-1">Explore our curated formulations</p>
              </div>
              <Link to="/shop" className="text-xs font-bold tracking-widest text-emerald-800 hover:underline">
                VIEW ALL
              </Link>
            </div>

            <div 
              ref={scrollRef}
              onTouchStart={handleInteract}
              onTouchMove={handleInteract}
              onMouseDown={handleInteract}
              onWheel={handleInteract}
              className="flex flex-row overflow-x-auto gap-4 sm:gap-6 pb-4 no-scrollbar scroll-smooth"
            >
              {[...categoriesList, ...categoriesList, ...categoriesList].map((category, i) => (
                <Link
                  key={`${category.id}-${i}`}
                  to={`/collections/${category.id}`}
                  className="group block relative flex-shrink-0 w-[160px] sm:w-[220px] md:w-[260px]"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-xs group-hover:shadow-md transition-all">
                    <img
                      referrerPolicy="no-referrer"
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base sm:text-lg font-medium leading-tight">{category.name}</h3>
                      {category.description && (
                        <p className="text-[10px] sm:text-xs text-white/80 line-clamp-1 mt-0.5">{category.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Featured Products: Elevated Responsive Product Grid with Direct Buy Now */}
      <AnimatedSection className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              <Sparkles size={12} />
              Featured Selection
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-primary">
              OUR ESSENTIALS
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md font-light">
              Premium daily essentials. Order directly with instant checkout or explore full formulations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Brand Story */}
      <AnimatedSection className="py-16 sm:py-24 px-5 sm:px-8 bg-[#1A3626] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight mb-4 whitespace-pre-line">
              {content.storyHeading || "GOOD THINGS BELONG\nIN EVERYDAY LIFE."}
            </h2>
          </div>
          <div className="flex-1 text-sm sm:text-base md:text-lg font-light leading-relaxed text-secondary text-center md:text-left whitespace-pre-line">
            {content.storyBody || "Medilux redefines everyday wellness. We formulate clean, honest, and high-performance essentials designed to support your daily ritual with pure efficacy and uncompromising quality."}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

