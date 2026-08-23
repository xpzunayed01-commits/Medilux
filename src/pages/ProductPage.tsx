import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products as fallbackProducts } from '../data';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Plus, Minus, ChevronDown, CheckCircle, AlertTriangle, XCircle, Truck, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToProducts, subscribeToSiteSettings, defaultSiteSettings } from '../lib/dataService';
import { Product, SiteSettings } from '../types';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    const unsubProds = subscribeToProducts((data) => {
      if (data && data.length > 0) setProductsList(data);
    });
    const unsubSettings = subscribeToSiteSettings((s) => {
      if (s) setSettings(s);
    });
    return () => {
      unsubProds();
      unsubSettings();
    };
  }, []);

  const product = productsList.find((p) => p.id === id) || fallbackProducts.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('description');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6">
        <h1 className="text-2xl font-light mb-4">PRODUCT NOT FOUND</h1>
        <Link to="/shop" className="text-sm tracking-widest underline underline-offset-4">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  const stock = product.stock ?? 25;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex-1 pt-24 sm:pt-32 pb-20 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* Gallery Section */}
          <div className="w-full lg:w-1/2">
            <div 
              className="aspect-[4/5] bg-accent/20 rounded-2xl sm:rounded-3xl overflow-hidden cursor-zoom-in relative group shadow-lg"
              onClick={() => setIsFullscreen(true)}
            >
              <img
                referrerPolicy="no-referrer"
                src={images[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                fetchPriority="high"
                loading="eager"
              />
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === idx ? 'border-primary shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Panel */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Link to={`/collections/${product.category}`} className="text-[11px] tracking-widest text-text-muted hover:text-primary transition-colors uppercase font-semibold">
                {product.category}
              </Link>
              {product.isBestseller && (
                <span className="px-2.5 py-0.5 rounded-md bg-[#1A3626] text-white text-[10px] font-bold uppercase tracking-wider">
                  BEST SELLER
                </span>
              )}
              {product.isNew && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
                  NEW
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary mb-2">
              {product.name}
            </h1>
            {product.descriptor && (
              <p className="text-sm sm:text-base text-text-muted mb-4 font-light">{product.descriptor}</p>
            )}

            <div className="mb-5 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.regularPrice && product.regularPrice > product.price && (
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <XCircle size={14} />
                  <span>Currently Out of Stock</span>
                </div>
              ) : stock <= 5 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  <AlertTriangle size={14} />
                  <span>Only {stock} items left in stock</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <CheckCircle size={14} />
                  <span>In Stock • Ready for delivery</span>
                </div>
              )}
            </div>

            {/* Quantity and Action Buttons - Minimal & High-End */}
            <div className="space-y-2.5 mb-8">
              <div className="flex items-center gap-2.5">
                {/* Minimalist Step Counter */}
                <div className="flex items-center border border-black/10 bg-white/80 rounded-xl h-11 px-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="w-7 h-7 flex items-center justify-center text-primary hover:bg-black/5 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-9 text-center font-medium text-sm text-primary">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="w-7 h-7 flex items-center justify-center text-primary hover:bg-black/5 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Minimal Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-white hover:bg-black/[0.02] active:bg-black/[0.04] text-primary border border-black/15 h-11 text-xs font-medium tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <ShoppingBag size={14} className="opacity-75" />
                  <span>ADD TO CART</span>
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-[#1A3626] hover:bg-[#12271b] active:scale-[0.99] text-white h-12 text-xs sm:text-sm font-medium tracking-widest rounded-xl transition-all shadow-[0_4px_12px_rgba(26,54,38,0.15)] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Modern Delivery & Authenticity Perks */}
            <div className="bg-[#F9F8F6] border border-black/5 rounded-2xl p-4 mb-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-800">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <Truck size={13} />
                </div>
                <span>
                  <strong className="font-semibold text-emerald-950">Free Nationwide Delivery</strong> on orders over {formatPrice(settings.freeDeliveryThreshold ?? 3000)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-800">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={13} />
                </div>
                <span>
                  <strong className="font-semibold text-emerald-950">Cash on Delivery</strong> available across all 64 districts
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-primary/10 pt-4 space-y-2">
              {/* Description */}
              <div>
                <button onClick={() => toggleAccordion('description')} className="w-full flex items-center justify-between py-4 text-xs font-semibold tracking-wider text-primary cursor-pointer">
                  <span>DESCRIPTION</span>
                  <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'description' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'description' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="pb-6 text-sm text-text-muted leading-relaxed font-light">{product.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="border-t border-primary/10">
                  <button onClick={() => toggleAccordion('ingredients')} className="w-full flex items-center justify-between py-4 text-xs font-semibold tracking-wider text-primary cursor-pointer">
                    <span>INGREDIENTS & FORMULATION</span>
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'ingredients' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'ingredients' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="pb-6 text-sm text-text-muted leading-relaxed font-light whitespace-pre-line">{product.ingredients}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* How to use */}
              {product.howToUse && (
                <div className="border-t border-primary/10">
                  <button onClick={() => toggleAccordion('howToUse')} className="w-full flex items-center justify-between py-4 text-xs font-semibold tracking-wider text-primary cursor-pointer">
                    <span>HOW TO USE / RITUAL</span>
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'howToUse' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'howToUse' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="pb-6 text-sm text-text-muted leading-relaxed font-light whitespace-pre-line">{product.howToUse}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
