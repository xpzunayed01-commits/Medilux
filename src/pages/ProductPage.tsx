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
              <img referrerPolicy="no-referrer"
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Product Info Panel */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <Link to={`/collections/${product.category}`} className="text-xs tracking-[0.2em] text-text-muted hover:text-primary transition-colors uppercase mb-6 block font-semibold">
              {product.category}
            </Link>
            <h1 className="text-5xl md:text-6xl font-light tracking-tighter text-primary mb-6">
              {product.name}
            </h1>
            <p className="text-lg text-text-muted mb-10 font-light italic">{product.descriptor}</p>

            <div className="mb-12">
              <span className="text-3xl font-light">{formatPrice(product.price)}</span>
            </div>

            <div className="flex items-center gap-6 mb-12">
              <div className="flex items-center border border-primary/20 rounded-full h-14 px-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-primary hover:opacity-50">
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-light text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-primary hover:opacity-50">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white h-14 text-xs font-semibold tracking-[0.2em] rounded-full hover:opacity-90 transition-all shadow-xl"
              >
                ADD TO CART
              </button>
            </div>

            {/* Simplified Accordions */}
            <div className="border-t border-primary/10 pt-6">
              <button onClick={() => toggleAccordion('description')} className="w-full flex items-center justify-between py-6 text-xs font-semibold tracking-[0.2em] text-primary">
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
