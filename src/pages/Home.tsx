import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, Banknote, Clock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isDraggingState, setIsDraggingState] = useState(false);

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
  const displayCategories = categoriesList.length > 0 ? categoriesList : fallbackCategories;

  // Infinite looped category array for seamless bi-directional wrap
  const infiniteCategories = displayCategories.length > 0
    ? [...displayCategories, ...displayCategories, ...displayCategories, ...displayCategories]
    : [];

  const carouselRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const hasInitializedScrollRef = useRef(false);

  // Pause helper
  const pauseAutoScroll = useCallback(() => {
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  }, []);

  // Resume helper with customizable delay
  const resumeAutoScroll = useCallback((delay = 1400) => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, delay);
  }, []);

  // Initial scroll position setup to set 1 so backward scroll works seamlessly
  useEffect(() => {
    if (carouselRef.current && displayCategories.length > 0 && !hasInitializedScrollRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const oneSetWidth = scrollWidth / 4;
      if (oneSetWidth > 0) {
        carouselRef.current.scrollLeft = oneSetWidth;
        hasInitializedScrollRef.current = true;
      }
    }
  }, [displayCategories]);

  // High-performance continuous infinite ticker animation loop
  useEffect(() => {
    let animId: number;

    const autoSlide = () => {
      if (carouselRef.current && !isPausedRef.current && !isDraggingRef.current && displayCategories.length > 0) {
        const { scrollWidth } = carouselRef.current;
        const oneSetWidth = scrollWidth / 4;

        if (oneSetWidth > 0) {
          // Smooth continuous progression to the right
          carouselRef.current.scrollLeft += 0.85;

          // Infinite wrap forward
          if (carouselRef.current.scrollLeft >= oneSetWidth * 2.5) {
            carouselRef.current.scrollLeft -= oneSetWidth;
          }
          // Infinite wrap backward (if user dragged leftward)
          else if (carouselRef.current.scrollLeft <= oneSetWidth * 0.4) {
            carouselRef.current.scrollLeft += oneSetWidth;
          }
        }
      }
      animId = requestAnimationFrame(autoSlide);
    };

    animId = requestAnimationFrame(autoSlide);
    return () => {
      cancelAnimationFrame(animId);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [displayCategories]);

  // Smooth scroll handler for carousel buttons
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    pauseAutoScroll();
    const scrollAmount = 260;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    resumeAutoScroll(2000);
  };

  // Mouse Drag handlers for PC & Touch handlers for Mobile
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    setIsDraggingState(true);
    hasDraggedRef.current = false;
    pauseAutoScroll();
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftStartRef.current = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    carouselRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDraggingState(false);
      resumeAutoScroll(1200);
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDraggingState(false);
    }
    resumeAutoScroll(800);
  };

  const handleTouchStart = () => {
    pauseAutoScroll();
  };

  const handleTouchEnd = () => {
    resumeAutoScroll(1400);
  };

  return (
    <div className="flex flex-col bg-background text-text-main overflow-x-hidden">
      {/* 
        Hero Section:
        - Full 9:16 aspect ratio on mobile screens (w-full aspect-[9/16] min-h-[580px] max-h-[100svh])
        - Spacious responsive height on larger screens (sm:min-h-[88vh] md:min-h-[92vh] sm:aspect-auto)
        - Clean gradient overlay so the top/center photo is crystal clear and the bottom text/buttons pop
      */}
      <section className="relative w-full aspect-[9/16] min-h-[580px] max-h-[100svh] sm:aspect-auto sm:min-h-[88vh] md:min-h-[92vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#0F2417]">
          <img
            referrerPolicy="no-referrer"
            src={content.heroImage || "https://i.postimg.cc/nzJnVXkz/Picsart-26-08-22-17-53-33-572.jpg"}
            alt="MEDILUX Everyday Elevated"
            className="w-full h-full object-cover object-center sm:object-center"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          {/* Mobile high-contrast gradient from bottom + subtle desktop ambient wash */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent sm:from-background/70 sm:via-background/30 sm:to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-20 pb-10 sm:pt-28 sm:pb-16"
        >
          <div className="max-w-2xl text-left">
            <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white sm:text-primary leading-[1.08] sm:leading-[0.95] mb-3 sm:mb-5 whitespace-pre-line drop-shadow-sm">
              {content.heroTitle || "EVERYDAY,\nELEVATED."}
            </h1>

            {/* Subtitle conditionally rendered if provided */}
            {content.heroSubtitle && !content.heroSubtitle.toLowerCase().includes('surreal') && (
              <p className="text-xs sm:text-base md:text-lg text-white/90 sm:text-primary/85 font-light max-w-lg mb-4 sm:mb-6">
                {content.heroSubtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-2 sm:mt-4">
              <Link
                to={content.heroButtonLink || "/shop"}
                className="px-6 sm:px-9 py-2.5 sm:py-3.5 bg-white text-primary sm:bg-primary sm:text-white text-xs font-semibold tracking-widest rounded-full hover:bg-white/90 sm:hover:bg-primary/90 transition-all shadow-md active:scale-98"
              >
                {content.heroButtonText || "SHOP NOW"}
              </Link>
              <Link
                to="/about"
                className="px-6 sm:px-9 py-2.5 sm:py-3.5 bg-black/40 sm:bg-white/70 backdrop-blur-md text-white sm:text-primary text-xs font-semibold tracking-widest rounded-full hover:bg-black/60 sm:hover:bg-white transition-all border border-white/20 sm:border-black/5 active:scale-98"
              >
                EXPLORE
              </Link>
            </div>
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

      {/* Modern Minimalist Infinite Collections Carousel */}
      {displayCategories.length > 0 && (
        <AnimatedSection className="py-8 sm:py-14">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div>
                <h2 className="text-lg sm:text-2xl font-light tracking-tight text-primary">COLLECTIONS</h2>
                <p className="text-[11px] sm:text-xs text-text-muted mt-0.5 font-light">Explore our curated formulations</p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/shop" className="text-[11px] sm:text-xs font-semibold tracking-widest text-emerald-800 hover:underline mr-1">
                  VIEW ALL
                </Link>

                {/* Minimalist Left/Right Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollCarousel('left')}
                    className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border border-black/[0.08] hover:bg-black/[0.04] text-primary flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                    aria-label="Previous categories"
                    title="Slide left"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => scrollCarousel('right')}
                    className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border border-black/[0.08] hover:bg-black/[0.04] text-primary flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                    aria-label="Next categories"
                    title="Slide right"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Continuous Smooth Infinite Carousel */}
            <div 
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={pauseAutoScroll}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onWheel={pauseAutoScroll}
              className={`flex flex-row overflow-x-auto gap-3.5 sm:gap-6 pb-4 no-scrollbar select-none ${
                isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {infiniteCategories.map((category, idx) => (
                <Link
                  key={`${category.id}-${idx}`}
                  to={`/collections/${category.id}`}
                  onClick={(e) => {
                    if (hasDraggedRef.current) {
                      e.preventDefault();
                    }
                  }}
                  draggable={false}
                  className="group block relative flex-shrink-0 w-[160px] sm:w-[220px] md:w-[260px]"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-xs group-hover:shadow-md transition-all bg-[#F5F4F0] pointer-events-none">
                    <img
                      referrerPolicy="no-referrer"
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity"></div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-sm sm:text-lg font-medium leading-tight">{category.name}</h3>
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

      {/* Featured Products: Minimalist Product Grid */}
      <AnimatedSection className="py-10 sm:py-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-full uppercase tracking-wider mb-2">
              <Sparkles size={11} />
              Curated Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-primary">
              OUR ESSENTIALS
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5 max-w-md font-light">
              Formulated with pure ingredients for your daily ritual.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {displayProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Brand Story */}
      <AnimatedSection className="py-12 sm:py-20 px-5 sm:px-8 bg-[#1A3626] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-14">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-3 whitespace-pre-line">
              {content.storyHeading || "GOOD THINGS BELONG\nIN EVERYDAY LIFE."}
            </h2>
          </div>
          <div className="flex-1 text-xs sm:text-sm md:text-base font-light leading-relaxed text-secondary text-center md:text-left whitespace-pre-line opacity-90">
            {content.storyBody || "Medilux redefines everyday wellness. We formulate clean, honest, and high-performance essentials designed to support your daily ritual with pure efficacy and uncompromising quality."}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

