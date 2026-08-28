import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  ShieldCheck, 
  Banknote, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Leaf, 
  Flame, 
  HeartHandshake, 
  Shield, 
  ShoppingBag 
} from 'lucide-react';
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
import { useCart } from '../context/CartContext';

export function Home() {
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(fallbackCategories);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  
  // Interactive product filter tab
  const [activeTab, setActiveTab] = useState<string>('all');
  const { addToCart } = useCart();
  const [spotlightAdded, setSpotlightAdded] = useState(false);

  // Carousel ref & manual scroll
  const categoryScrollRef = useRef<HTMLDivElement>(null);

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

  // Filter products by selected tab
  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return displayProducts;
    if (activeTab === 'bestsellers') return displayProducts.filter(p => p.isBestseller);
    if (activeTab === 'new') return displayProducts.filter(p => p.isNew);
    return displayProducts.filter(p => p.category === activeTab);
  }, [activeTab, displayProducts]);

  // Featured Spotlight Product
  const spotlightProduct = useMemo(() => {
    return displayProducts.find(p => p.isBestseller) || displayProducts[0] || fallbackProducts[0];
  }, [displayProducts]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSpotlightAddToCart = () => {
    if (spotlightProduct) {
      addToCart(spotlightProduct, 1);
      setSpotlightAdded(true);
      setTimeout(() => setSpotlightAdded(false), 2000);
    }
  };

  // Testimonials list
  const testimonials = [
    {
      name: "Sabrina Rahman",
      location: "Gulshan, Dhaka",
      review: "The Reishi Gano powder transformed my morning routine. Pure quality, completely authentic, and fast delivery within 24 hours.",
      rating: 5,
      product: "Reishi Gano Powder"
    },
    {
      name: "Tanzir Ahmed",
      location: "Banani, Dhaka",
      review: "Medilux is by far the most reliable wellness store in Bangladesh. The packaging is luxury and the customer service is outstanding.",
      rating: 5,
      product: "Signature Espresso Blend"
    },
    {
      name: "Farhana Chowdhury",
      location: "Dhanmondi, Dhaka",
      review: "The Hydrating Face Serum is genuinely lightweight and deeply hydrating. Cash on delivery was seamless. Highly recommended!",
      rating: 5,
      product: "Hydrating Face Serum"
    }
  ];

  return (
    <div className="w-full bg-[#FAF9F5] text-[#181816] selection:bg-[#14281D] selection:text-white pt-10 sm:pt-14">
      
      {/* 1. HERO SECTION - Editorial Luxury Atmosphere */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vw] max-w-4xl rounded-full bg-gradient-to-b from-[#E6E1D6]/70 via-[#FAF9F5]/40 to-transparent blur-3xl pointer-events-none -z-10"></div>

        {content.heroImage && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <img 
              src={content.heroImage} 
              alt="Medilux Hero" 
              className="w-full h-full object-cover opacity-15 mix-blend-multiply filter contrast-125" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F5]/70 via-[#FAF9F5]/90 to-[#FAF9F5]"></div>
          </div>
        )}

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14281D]/[0.06] border border-[#14281D]/10 text-[#14281D] text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-6 sm:mb-8"
          >
            <Sparkles size={12} className="text-[#C5A880]" />
            <span>Pure Botanical & Everyday Essentials</span>
          </motion.div>

          {/* Luxury Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light tracking-tight leading-[1.08] text-[#14281D] max-w-4xl"
          >
            {content.heroHeading || "Elevate your everyday ritual."}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-[#6B6862] font-normal max-w-2xl mx-auto leading-relaxed"
          >
            {content.heroSubheading || "Discover our thoughtfully curated collection of pure formulations and wellness lifestyle essentials, crafted for mindful living."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
          >
            <Link 
              to="/shop" 
              className="w-full sm:w-auto px-8 py-4 bg-[#14281D] text-white text-xs tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-[#0d1b13] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{content.heroButtonText || "SHOP THE COLLECTION"}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              to="/about" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#14281D] border border-[#14281D]/15 text-xs tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-[#FAF9F5] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xs"
            >
              OUR STORY
            </Link>
          </motion.div>

          {/* Live Trust Metrics Ribbon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="mt-16 sm:mt-20 pt-8 border-t border-black/[0.06] w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left"
          >
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-black/[0.04] flex items-center justify-center text-[#14281D] shrink-0">
                <Truck size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#14281D]">Free Delivery</p>
                <p className="text-[11px] text-[#6B6862]">Orders over ৳{settings.freeDeliveryThreshold || 2000}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-black/[0.04] flex items-center justify-center text-[#14281D] shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#14281D]">100% Genuine</p>
                <p className="text-[11px] text-[#6B6862]">Direct from certified sources</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-black/[0.04] flex items-center justify-center text-[#14281D] shrink-0">
                <Banknote size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#14281D]">Cash on Delivery</p>
                <p className="text-[11px] text-[#6B6862]">Pay at your doorstep</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-black/[0.04] flex items-center justify-center text-[#14281D] shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#14281D]">Fast Dispatch</p>
                <p className="text-[11px] text-[#6B6862]">24-48h Dhaka delivery</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. CURATED COLLECTIONS CAROUSEL */}
      {displayCategories.length > 0 && (
        <AnimatedSection className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-black/[0.04] bg-white">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7D8E79] block mb-2">
                  CURATED EDITS
                </span>
                <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-[#14281D]">
                  Shop by Purpose
                </h2>
              </div>

              {/* Slider Controls & Link */}
              <div className="flex items-center gap-3">
                <Link 
                  to="/shop" 
                  className="text-xs font-semibold tracking-wider text-[#14281D] hover:text-[#7D8E79] transition-colors flex items-center gap-1 mr-2"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight size={12} />
                </Link>

                <button
                  onClick={() => scrollCategories('left')}
                  className="w-9 h-9 rounded-full border border-black/10 hover:border-[#14281D] hover:bg-[#14281D] hover:text-white transition-all flex items-center justify-center text-[#14281D] cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollCategories('right')}
                  className="w-9 h-9 rounded-full border border-black/10 hover:border-[#14281D] hover:bg-[#14281D] hover:text-white transition-all flex items-center justify-center text-[#14281D] cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Carousel Container */}
            <div 
              ref={categoryScrollRef}
              className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
            >
              {displayCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/collections/${category.id}`}
                  className="group relative flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] rounded-2xl overflow-hidden bg-[#FAF9F5] border border-black/[0.04] shadow-xs hover:shadow-md transition-all duration-500"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#E6E1D6]/40 relative">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg sm:text-xl font-medium tracking-wide leading-snug">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-white/80 line-clamp-1 mt-1 font-light">
                          {category.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold tracking-wider text-[#E6E1D6] uppercase opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        Explore Category <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </AnimatedSection>
      )}

      {/* 3. SIGNATURE PRODUCT SPOTLIGHT SECTION */}
      {spotlightProduct && (
        <AnimatedSection className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Product Visual Container */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF9F5] border border-black/[0.04] shadow-sm relative group">
                  <img 
                    src={spotlightProduct.image} 
                    alt={spotlightProduct.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#14281D] text-[#E6E1D6] text-[10px] font-bold tracking-widest rounded-full uppercase flex items-center gap-1.5 shadow-md">
                      <Sparkles size={11} className="text-[#C5A880]" />
                      FLAGSHIP ESSENTIAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info & Highlights */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7D8E79] mb-2">
                  SIGNATURE SPOTLIGHT
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#14281D] mb-4">
                  {spotlightProduct.name}
                </h2>
                
                {spotlightProduct.descriptor && (
                  <p className="text-sm font-medium text-[#7D8E79] uppercase tracking-wider mb-4">
                    {spotlightProduct.descriptor}
                  </p>
                )}

                <p className="text-sm sm:text-base text-[#6B6862] font-normal leading-relaxed mb-6">
                  {spotlightProduct.description}
                </p>

                {/* Key Benefits Triad */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 py-4 border-y border-black/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#14281D]/[0.05] flex items-center justify-center text-[#14281D]">
                      <Leaf size={14} />
                    </div>
                    <span className="text-xs font-semibold text-[#14281D]">100% Pure Organic</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#14281D]/[0.05] flex items-center justify-center text-[#14281D]">
                      <Shield size={14} />
                    </div>
                    <span className="text-xs font-semibold text-[#14281D]">Third-Party Tested</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#14281D]/[0.05] flex items-center justify-center text-[#14281D]">
                      <Flame size={14} />
                    </div>
                    <span className="text-xs font-semibold text-[#14281D]">Maximum Potency</span>
                  </div>
                </div>

                {/* Price & Immediate Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#6B6862]">Standard Ritual Pack</span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#14281D]">
                      {formatPrice(spotlightProduct.price)}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <Link
                      to={`/product/${spotlightProduct.id}`}
                      className="flex-1 py-3.5 px-6 bg-[#14281D] hover:bg-[#0d1b13] text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-center cursor-pointer"
                    >
                      <span>VIEW FULL DETAILS</span>
                      <ArrowRight size={13} />
                    </Link>

                    <button
                      onClick={handleSpotlightAddToCart}
                      className={`h-11 px-5 rounded-xl border transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 ${
                        spotlightAdded
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white hover:bg-gray-50 text-[#14281D] border-black/15 shadow-xs'
                      }`}
                    >
                      {spotlightAdded ? (
                        <>
                          <CheckCircle2 size={15} />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={15} />
                          <span>ADD TO BAG</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </AnimatedSection>
      )}

      {/* 4. INTERACTIVE PRODUCT CATALOG (TABBED FILTERING) */}
      <AnimatedSection className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7D8E79] block mb-2">
              DISCOVER OUR CATALOG
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#14281D]">
              The Full Medilux Lineup
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6862] font-normal mt-2 max-w-md">
              Meticulously crafted formulas and pure essentials for your daily balance.
            </p>

            {/* Interactive Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-[#FAF9F5] rounded-full border border-black/[0.05] max-w-2xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#14281D] text-white shadow-xs'
                    : 'text-[#6B6862] hover:text-[#14281D]'
                }`}
              >
                ALL ESSENTIALS
              </button>

              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === 'bestsellers'
                    ? 'bg-[#14281D] text-white shadow-xs'
                    : 'text-[#6B6862] hover:text-[#14281D]'
                }`}
              >
                BESTSELLERS
              </button>

              {displayCategories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer uppercase ${
                    activeTab === cat.id
                      ? 'bg-[#14281D] text-white shadow-xs'
                      : 'text-[#6B6862] hover:text-[#14281D]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <motion.div 
            layout 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  key={product.id}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Bottom Button */}
          <div className="mt-14 sm:mt-18 text-center">
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 px-8 py-4 border border-black/15 text-[#14281D] hover:bg-[#14281D] hover:text-white text-xs tracking-[0.2em] uppercase font-semibold rounded-full transition-all duration-300 cursor-pointer"
            >
              <span>EXPLORE ALL {displayProducts.length} PRODUCTS</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </AnimatedSection>

      {/* 5. LUXURY VALUES & CRAFTSMANSHIP BENTO GRID */}
      <AnimatedSection className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7D8E79] block mb-2">
              THE MEDILUX PROMISE
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#14281D]">
              Uncompromising Quality in Every Detail
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-black/[0.04] shadow-xs flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#14281D]/[0.05] text-[#14281D] flex items-center justify-center mb-6">
                <Leaf size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#14281D] mb-2">Clean, Active Botanicals</h3>
                <p className="text-xs sm:text-sm text-[#6B6862] font-light leading-relaxed">
                  We formulate exclusively with pure, laboratory-verified extracts free from artificial fillers, toxic binders, and harsh synthetic chemicals.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-black/[0.04] shadow-xs flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#14281D]/[0.05] text-[#14281D] flex items-center justify-center mb-6">
                <HeartHandshake size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#14281D] mb-2">Mindfully Sourced & Fresh</h3>
                <p className="text-xs sm:text-sm text-[#6B6862] font-light leading-relaxed">
                  Imported in controlled micro-batches to guarantee freshness, maximum bio-availability, and unmatched potency upon arrival.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 border border-black/[0.04] shadow-xs flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#14281D]/[0.05] text-[#14281D] flex items-center justify-center mb-6">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#14281D] mb-2">Guaranteed Authenticity</h3>
                <p className="text-xs sm:text-sm text-[#6B6862] font-light leading-relaxed">
                  Every product shipped across Bangladesh comes sealed with our quality stamp and unconditional guarantee of authenticity.
                </p>
              </div>
            </div>

          </div>

        </div>
      </AnimatedSection>

      {/* 6. VERIFIED REVIEWS & SOCIAL PROOF */}
      <AnimatedSection className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <div className="flex items-center gap-1 text-[#C5A880] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#14281D]">
              Loved by 5,000+ Wellness Enthusiasts
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6862] font-light mt-2">
              Real experiences from our customers across Dhaka and nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#FAF9F5] rounded-3xl p-7 border border-black/[0.04] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C5A880] mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#181816] font-normal leading-relaxed italic mb-6">
                    "{item.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-[#14281D]">{item.name}</h4>
                    <p className="text-[11px] text-[#6B6862]">{item.location}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </AnimatedSection>

      {/* 7. BRAND MANIFESTO (Deep Forest Green Luxury Block) */}
      <AnimatedSection className="py-24 sm:py-32 px-6 bg-[#14281D] text-[#FAF9F5] text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] bg-[#7D8E79]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#C5A880] block mb-6">
            THE MEDILUX PHILOSOPHY
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] mb-8 text-[#FAF9F5]">
            {content.storyHeading || "Good things belong in everyday life."}
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto mb-8 opacity-70"></div>
          <p className="text-sm sm:text-base md:text-lg font-light leading-relaxed text-[#E6E1D6]/80 max-w-2xl mx-auto">
            {content.storyBody || "Medilux redefines everyday wellness. We formulate clean, honest, and high-performance essentials designed to support your daily ritual with pure efficacy and uncompromising quality."}
          </p>
        </div>
      </AnimatedSection>

    </div>
  );
}
