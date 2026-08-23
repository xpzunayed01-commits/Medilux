import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as fallbackProducts } from '../data';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Plus, Minus, ChevronDown, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToProducts } from '../lib/dataService';
import { Product } from '../types';

export function ProductPage() {
  const { id } = useParams();
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    const unsub = subscribeToProducts((data) => {
      if (data && data.length > 0) setProductsList(data);
    });
    return () => unsub();
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
    setQuantity(1);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="flex-1 pt-32 pb-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Surreal Image Gallery */}
          <div className="lg:w-1/2">
            <div 
              className="aspect-[3/4] bg-accent/20 rounded-[2rem] overflow-hidden cursor-zoom-in relative group shadow-2xl"
              onClick={() => setIsFullscreen(true)}
            >
              <img
                referrerPolicy="no-referrer"
                src={images[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                fetchPriority="high"
                loading="eager"
              />
            </div>
          </div>

          {/* Product Info Panel */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/collections/${product.category}`} className="text-xs tracking-[0.2em] text-text-muted hover:text-primary transition-colors uppercase block font-semibold">
                {product.category}
              </Link>
              {product.isBestseller && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  BEST SELLER
                </span>
              )}
              {product.isNew && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  NEW
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-primary mb-4">
              {product.name}
            </h1>
            <p className="text-base md:text-lg text-text-muted mb-6 font-light italic">{product.descriptor}</p>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-light text-primary">{formatPrice(product.price)}</span>
              {product.regularPrice && product.regularPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="mb-8">
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
                  <span>In Stock • Ready for dispatch</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mb-12">
              <div className="flex items-center border border-primary/20 rounded-full h-14 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="px-4 text-primary hover:opacity-50 disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-light text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  className="px-4 text-primary hover:opacity-50 disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-primary text-white h-14 text-xs font-semibold tracking-[0.2em] rounded-full hover:opacity-90 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-primary/10 pt-4 space-y-2">
              {/* Description */}
              <div>
                <button onClick={() => toggleAccordion('description')} className="w-full flex items-center justify-between py-4 text-xs font-semibold tracking-[0.2em] text-primary">
                  DESCRIPTION
                  <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'description' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'description' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="pb-6 text-text-muted leading-relaxed font-light">{product.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="border-t border-primary/10">
                  <button onClick={() => toggleAccordion('ingredients')} className="w-full flex items-center justify-between py-4 text-xs font-semibold tracking-[0.2em] text-primary">
                    INGREDIENTS & FORMULATION
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'ingredients' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'ingredients' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="pb-6 text-text-muted leading-relaxed font-light whitespace-pre-line">{product.ingredients}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* How to use */}
              {product.howToUse && (
                <div className="border-t border-primary/10">
                  <button onClick={() => toggleAccordion('howToUse')} className="w-full flex items-center justify-between py-4 text-xs font-semibold tracking-[0.2em] text-primary">
                    HOW TO USE / RITUAL
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'howToUse' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'howToUse' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 1 }} className="overflow-hidden">
                        <p className="pb-6 text-text-muted leading-relaxed font-light whitespace-pre-line">{product.howToUse}</p>
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
