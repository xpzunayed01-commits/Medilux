import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products as fallbackProducts } from '../data';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { 
  Plus, 
  Minus, 
  ChevronDown, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  ArrowRight, 
  Check, 
  RotateCcw,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToProducts, subscribeToSiteSettings, defaultSiteSettings } from '../lib/dataService';
import { Product, SiteSettings } from '../types';
import { ProductCard } from '../components/ProductCard';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [justAdded, setJustAdded] = useState(false);

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

  // Related products
  const relatedProducts = productsList
    .filter((p) => p.id !== id && (p.category === product?.category || p.isBestseller))
    .slice(0, 4);

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-36 pb-24 px-6 text-center">
        <h1 className="text-2xl font-light text-[#14281D] mb-4">Product Not Found</h1>
        <p className="text-sm text-[#6B6862] mb-6">The requested item might have been moved or updated.</p>
        <Link 
          to="/shop" 
          className="px-6 py-3 bg-[#14281D] text-white text-xs tracking-widest uppercase font-semibold rounded-full hover:bg-black transition-colors"
        >
          EXPLORE ALL PRODUCTS
        </Link>
      </div>
    );
  }

  const stock = product.stock ?? 25;
  const isOutOfStock = product.isOutOfStock || stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const toggleAccordion = (sectionId: string) => {
    setActiveAccordion(activeAccordion === sectionId ? null : sectionId);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 pt-28 sm:pt-36 pb-24 bg-[#FAF9F5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-[#6B6862] uppercase mb-8">
          <Link to="/" className="hover:text-[#14281D] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#14281D] transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/collections/${product.category}`} className="hover:text-[#14281D] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#14281D] font-semibold truncate max-w-[160px] sm:max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          
          {/* Left: Gallery Section */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/5] bg-white rounded-3xl overflow-hidden relative group border border-black/[0.04] shadow-sm">
              <img
                referrerPolicy="no-referrer"
                src={images[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                fetchPriority="high"
                loading="eager"
              />

              {/* Floating badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestseller && (
                  <span className="px-3 py-1 bg-[#14281D] text-[#E6E1D6] text-[10px] font-bold tracking-widest rounded-full uppercase flex items-center gap-1 shadow-md">
                    <Sparkles size={11} className="text-[#C5A880]" />
                    Bestseller
                  </span>
                )}
                {product.isNew && (
                  <span className="px-3 py-1 bg-[#7D8E79] text-white text-[10px] font-bold tracking-widest rounded-full uppercase shadow-md">
                    New Formula
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-18 h-18 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImage === idx 
                        ? 'border-[#14281D] shadow-xs scale-100' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Meta & Purchase Panel */}
          <div className="w-full lg:w-1/2 flex flex-col">
            
            {/* Category & Ratings */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7D8E79]">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-[#C5A880]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
                <span className="text-[11px] text-[#6B6862] ml-1 font-medium">(4.9/5)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#14281D] mb-2 leading-tight">
              {product.name}
            </h1>

            {product.descriptor && (
              <p className="text-sm font-medium text-[#7D8E79] uppercase tracking-wider mb-4">
                {product.descriptor}
              </p>
            )}

            {/* Pricing Section */}
            <div className="mb-6 flex items-baseline gap-3 py-3 border-y border-black/[0.05]">
              <span className="text-2xl sm:text-3xl font-bold text-[#14281D]">
                {formatPrice(product.price)}
              </span>
              {product.regularPrice && product.regularPrice > product.price && (
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            {/* Stock status indicator */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>Currently Out of Stock</span>
                </div>
              ) : stock <= 5 ? (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Low Stock — Only {stock} units left in Dhaka Hub</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>In Stock • Ready for Immediate Nationwide Dispatch</span>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Buttons */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                {/* Minimalist Pill Stepper */}
                <div className="flex items-center border border-black/15 bg-white rounded-2xl h-12 px-3 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="w-8 h-8 flex items-center justify-center text-[#14281D] hover:bg-black/5 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#14281D] tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="w-8 h-8 flex items-center justify-center text-[#14281D] hover:bg-black/5 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 text-xs font-semibold tracking-[0.16em] uppercase rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs border ${
                    justAdded
                      ? 'bg-[#14281D] text-white border-[#14281D]'
                      : 'bg-white hover:bg-gray-50 text-[#14281D] border-black/15'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check size={16} strokeWidth={2.5} />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>ADD TO BAG</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-[#14281D] hover:bg-[#0d1b13] active:scale-[0.99] text-white h-13 text-xs font-semibold tracking-[0.2em] uppercase rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>PROCEED TO INSTANT CHECKOUT</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Delivery & Assurance Badges */}
            <div className="bg-white rounded-2xl p-4 border border-black/[0.04] shadow-xs mb-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#181816]">
                <Truck size={16} className="text-[#14281D] shrink-0" />
                <span>
                  <strong>Complimentary Shipping</strong> on orders above {formatPrice(settings.freeDeliveryThreshold ?? 2000)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#181816]">
                <ShieldCheck size={16} className="text-[#14281D] shrink-0" />
                <span>
                  <strong>Cash on Delivery</strong> available in all 64 districts
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#181816]">
                <RotateCcw size={16} className="text-[#14281D] shrink-0" />
                <span>
                  <strong>7-Day Easy Exchange</strong> for damaged or defective items
                </span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-black/[0.06] space-y-1">
              
              {/* Description */}
              <div className="border-b border-black/[0.06]">
                <button 
                  onClick={() => toggleAccordion('description')} 
                  className="w-full flex items-center justify-between py-4 text-xs font-bold tracking-[0.16em] uppercase text-[#14281D] cursor-pointer"
                >
                  <span>PRODUCT OVERVIEW & BENEFITS</span>
                  <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'description' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'description' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="pb-6 text-sm text-[#6B6862] leading-relaxed font-normal">{product.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="border-b border-black/[0.06]">
                  <button 
                    onClick={() => toggleAccordion('ingredients')} 
                    className="w-full flex items-center justify-between py-4 text-xs font-bold tracking-[0.16em] uppercase text-[#14281D] cursor-pointer"
                  >
                    <span>PURE INGREDIENTS & FORMULATION</span>
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'ingredients' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'ingredients' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="pb-6 text-sm text-[#6B6862] leading-relaxed font-normal whitespace-pre-line">{product.ingredients}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* How to use / Ritual */}
              {product.howToUse && (
                <div className="border-b border-black/[0.06]">
                  <button 
                    onClick={() => toggleAccordion('howToUse')} 
                    className="w-full flex items-center justify-between py-4 text-xs font-bold tracking-[0.16em] uppercase text-[#14281D] cursor-pointer"
                  >
                    <span>DAILY RITUAL / HOW TO USE</span>
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'howToUse' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'howToUse' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="pb-6 text-sm text-[#6B6862] leading-relaxed font-normal whitespace-pre-line">{product.howToUse}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Related Essentials Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-black/[0.06]">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7D8E79] block mb-2">
                  PAIR WITH
                </span>
                <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#14281D]">
                  Complete Your Daily Ritual
                </h2>
              </div>
              <Link 
                to="/shop" 
                className="text-xs font-semibold tracking-wider text-[#14281D] hover:text-[#7D8E79] transition-colors flex items-center gap-1"
              >
                <span>VIEW FULL CATALOG</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <div key={relProduct.id} className="h-full">
                  <ProductCard product={relProduct} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
