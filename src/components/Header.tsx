import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'SHOP', path: '/shop' },
    { label: 'COLLECTIONS', path: '/collections' },
    { label: 'ABOUT', path: '/about' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled
            ? 'glass shadow-sm py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -ml-2 text-primary"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Desktop Navigation (Left) */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-xs font-medium tracking-widest text-primary hover:opacity-60 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo (Center) */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-semibold tracking-widest text-primary flex-shrink-0"
          >
            <img src="https://i.postimg.cc/Y0Qrtp6H/Picsart-26-08-22-16-03-45-163.png" alt="MEDILUX" className="h-8 md:h-10" />
          </Link>

          {/* Icons (Right) */}
          <div className="flex items-center justify-end gap-4 md:gap-6 flex-1">
            <button
              onClick={onOpenSearch}
              className="p-2 -mr-2 text-primary hover:opacity-60 transition-opacity hidden md:block"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 -mr-2 text-primary hover:opacity-60 transition-opacity relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1 bg-primary text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            <div className="flex items-center justify-between p-6">
              <span className="text-xl font-semibold tracking-widest text-primary">
                <img src="https://i.postimg.cc/Y0Qrtp6H/Picsart-26-08-22-16-03-45-163.png" alt="MEDILUX" className="h-8" />
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-primary"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center px-8 gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-3xl font-medium tracking-wide text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="text-left text-3xl font-medium tracking-wide text-primary flex items-center gap-4"
              >
                SEARCH
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
