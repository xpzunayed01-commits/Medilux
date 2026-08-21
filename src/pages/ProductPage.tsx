import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
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

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 pt-24 pb-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div 
              className="aspect-[4/5] bg-[#F2F0EB] rounded-lg overflow-hidden cursor-zoom-in relative group"
              onClick={() => setIsFullscreen(true)}
            >
              <img referrerPolicy="no-referrer"
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs tracking-widest font-medium bg-black/40 px-4 py-2 rounded backdrop-blur-sm">CLICK TO EXPAND</span>
              </div>
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-24 flex-shrink-0 rounded bg-[#F2F0EB] overflow-hidden ${activeImage === index ? 'ring-1 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'} transition-all`}
                  >
                    <img referrerPolicy="no-referrer" src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="mb-8">
              <Link to={`/collections/${product.category}`} className="text-xs tracking-widest text-text-muted hover:text-primary transition-colors uppercase mb-4 block">
                {product.category}
              </Link>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-primary mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-text-muted">{product.descriptor}</p>
            </div>

            <div className="mb-10">
              <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-black/10 rounded h-14">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-text-muted hover:text-primary h-full"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 text-text-muted hover:text-primary h-full"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white h-14 text-xs font-medium tracking-widest rounded hover:opacity-90 transition-opacity"
              >
                ADD TO CART
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-black/10 pt-4 mt-8">
              <div className="border-b border-black/10">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between py-6 text-sm font-medium tracking-widest"
                >
                  DESCRIPTION
                  <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'description' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'description' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-text-muted leading-relaxed font-light">
                        {product.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {product.ingredients && (
                <div className="border-b border-black/10">
                  <button
                    onClick={() => toggleAccordion('ingredients')}
                    className="w-full flex items-center justify-between py-6 text-sm font-medium tracking-widest"
                  >
                    INGREDIENTS & SPECS
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'ingredients' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'ingredients' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-text-muted leading-relaxed font-light">
                          {product.ingredients}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {product.howToUse && (
                <div className="border-b border-black/10">
                  <button
                    onClick={() => toggleAccordion('usage')}
                    className="w-full flex items-center justify-between py-6 text-sm font-medium tracking-widest"
                  >
                    HOW TO USE
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${activeAccordion === 'usage' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'usage' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-text-muted leading-relaxed font-light">
                          {product.howToUse}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
            onClick={() => setIsFullscreen(false)}
          >
            <img referrerPolicy="no-referrer"
              src={product.images[activeImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain mix-blend-multiply"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
