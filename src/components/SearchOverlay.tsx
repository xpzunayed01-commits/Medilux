import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search as SearchIcon } from 'lucide-react';
import { products } from '../data';
import { Link, useNavigate } from 'react-router-dom';

export function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col"
        >
          <div className="max-w-4xl w-full mx-auto px-6 py-6 sm:py-12 flex-1 flex flex-col">
            <div className="flex justify-end mb-8">
              <button
                onClick={onClose}
                className="p-2 text-text-muted hover:text-primary transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative mb-12">
              <SearchIcon
                size={24}
                strokeWidth={1.5}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Medilux"
                className="w-full bg-transparent text-2xl sm:text-4xl placeholder-text-muted/50 border-b border-black/10 py-4 pl-10 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {query && results.length === 0 ? (
                <div className="text-center text-text-muted mt-12">
                  <p>NO RESULTS FOUND.</p>
                  <p className="text-sm mt-2">Try another search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="flex items-center gap-4 text-left group"
                    >
                      <div className="w-16 h-16 bg-accent/30 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary group-hover:underline underline-offset-4">
                          {product.name}
                        </h4>
                        <p className="text-sm text-text-muted mt-1">
                          {product.descriptor}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
