import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ArrowUpRight } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Clean navigation links (Removed SHOP, CARE, COFFEE, FOOD, SKIN from header as requested)
  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'glass shadow-xs py-2.5 sm:py-3.5'
            : 'bg-gradient-to-b from-black/15 to-transparent py-3 sm:py-5'
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Hamburger or Desktop Minimal Nav */}
          <div className="flex items-center gap-6 flex-1">
            <button
              className="md:hidden p-2 -ml-2 text-primary hover:text-emerald-800 transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>

            {/* Desktop Minimal Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-xs font-semibold tracking-widest text-primary hover:text-emerald-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <Link
            to="/"
            className="flex items-center justify-center flex-shrink-0 group"
          >
            <img
              src="https://i.postimg.cc/Y0Qrtp6H/Picsart-26-08-22-16-03-45-163.png"
              alt="MEDILUX"
              className="h-7 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Right: Actions (Search & Cart) */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
            <button
              onClick={onOpenSearch}
              className="p-2 text-primary hover:text-emerald-800 transition-colors flex items-center gap-1.5 focus:outline-none"
              aria-label="Search products"
            >
              <Search size={20} strokeWidth={1.75} />
              <span className="hidden lg:inline-block text-[11px] font-medium tracking-wider text-text-muted">
                SEARCH
              </span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 -mr-1.5 text-primary hover:text-emerald-800 transition-colors relative flex items-center focus:outline-none cursor-pointer"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag size={21} strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#1A3626] text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-200">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-[85vw] max-w-sm h-full bg-[#FAF9F6] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Drawer Header */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-black/5">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <img
                      src="https://i.postimg.cc/Y0Qrtp6H/Picsart-26-08-22-16-03-45-163.png"
                      alt="MEDILUX"
                      className="h-8 w-auto"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-primary hover:bg-black/5 rounded-full transition-colors"
                    aria-label="Close Menu"
                  >
                    <X size={22} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-light tracking-wide text-primary hover:text-emerald-800 transition-colors py-1 flex items-center justify-between"
                  >
                    <span>Home</span>
                    <ArrowUpRight size={18} className="text-gray-400" />
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-light tracking-wide text-primary hover:text-emerald-800 transition-colors py-1 flex items-center justify-between"
                  >
                    <span>About Us</span>
                    <ArrowUpRight size={18} className="text-gray-400" />
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenSearch();
                    }}
                    className="text-left text-2xl font-light tracking-wide text-primary hover:text-emerald-800 transition-colors py-1 flex items-center justify-between"
                  >
                    <span>Search</span>
                    <Search size={18} className="text-gray-400" />
                  </button>
                </nav>
              </div>

              {/* Bottom Info */}
              <div className="pt-6 border-t border-black/5 text-xs text-text-muted space-y-2">
                <p className="font-semibold text-primary">MEDILUX LUXURY CARE</p>
                <p>Everyday, Elevated Living.</p>
                <p className="pt-2 text-[11px] text-gray-400">Dhaka, Bangladesh</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

