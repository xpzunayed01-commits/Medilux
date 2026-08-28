import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ArrowUpRight, Sparkles, ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToCategories } from '../lib/dataService';
import { Category } from '../types';
import { categories as fallbackCategories } from '../data';

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsub = subscribeToCategories((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats.filter((c) => !c.isHidden));
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ALL PRODUCTS', path: '/shop' },
    { label: 'ABOUT', path: '/about' },
  ];

  return (
    <>
      {/* Top Luxury Announcement Ticker */}
      <div className="bg-[#14281D] text-[#E6E1D6] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-2 px-4 border-b border-white/5 relative z-50 overflow-hidden font-medium select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-6 text-[10px] text-[#E6E1D6]/70">
            <span className="flex items-center gap-1.5"><Truck size={12} className="text-[#C5A880]" /> Express Delivery Dhaka & Nationwide</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#C5A880]" /> 100% Genuine Certified</span>
          </div>

          <div className="w-full md:w-auto text-center flex items-center justify-center gap-2 mx-auto md:mx-0">
            <Sparkles size={11} className="text-[#C5A880] shrink-0 animate-pulse" />
            <span>Complimentary delivery on orders over ৳2,000</span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[10px] text-[#E6E1D6]/70">
            <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <span>•</span>
            <Link to="/xpzunayed" className="text-[#C5A880] hover:text-white font-semibold flex items-center gap-1 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'fixed top-8 sm:top-8 left-0 right-0 z-40 transition-all duration-500',
          isScrolled
            ? 'glass shadow-xs py-2.5 sm:py-3 top-0!'
            : 'bg-[#FAF9F5]/90 backdrop-blur-md py-3 sm:py-4 border-b border-black/[0.04]'
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Hamburger or Desktop Minimal Nav */}
          <div className="flex items-center gap-6 flex-1">
            <button
              className="md:hidden p-2 -ml-2 text-[#14281D] hover:text-[#7D8E79] transition-colors focus:outline-none cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Desktop Minimal Nav Links */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={cn(
                      "text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-300 relative py-1",
                      isActive
                        ? "text-[#14281D] font-bold"
                        : "text-[#6B6862] hover:text-[#14281D]"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span 
                        layoutId="navIndicator" 
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#14281D]" 
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <Link
            to="/"
            className="flex items-center justify-center flex-shrink-0 group py-0.5"
          >
            <img
              src="https://i.postimg.cc/Y0Qrtp6H/Picsart-26-08-22-16-03-45-163.png"
              alt="MEDILUX"
              className="h-7 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Right: Actions (Search & Cart) */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 flex-1">
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#14281D] hover:text-[#7D8E79] transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer rounded-full hover:bg-black/[0.03]"
              aria-label="Search products"
            >
              <Search size={19} strokeWidth={1.75} />
              <span className="hidden lg:inline-block text-[11px] font-semibold tracking-widest text-[#6B6862]">
                SEARCH
              </span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 -mr-1.5 text-[#14281D] hover:text-[#7D8E79] transition-colors relative flex items-center focus:outline-none cursor-pointer rounded-full hover:bg-black/[0.03]"
              aria-label="Shopping Cart"
            >
              <div className="relative flex items-center gap-1.5">
                <ShoppingBag size={20} strokeWidth={1.75} />
                <span className="hidden sm:inline-block text-[11px] font-semibold tracking-widest text-[#6B6862]">
                  BAG
                </span>
                {cartCount > 0 && (
                  <span className="bg-[#14281D] text-white text-[10px] font-bold h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-200">
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-[85vw] max-w-sm h-full bg-[#FAF9F5] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Drawer Header */}
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-black/[0.06]">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <img
                      src="https://i.postimg.cc/Y0Qrtp6H/Picsart-26-08-22-16-03-45-163.png"
                      alt="MEDILUX"
                      className="h-8 w-auto"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#14281D] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                    aria-label="Close Menu"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Primary Nav Links */}
                <nav className="flex flex-col gap-1 mt-6">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium tracking-wide text-[#14281D] hover:text-[#7D8E79] transition-colors py-2.5 flex items-center justify-between border-b border-black/[0.03]"
                  >
                    <span>Home</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium tracking-wide text-[#14281D] hover:text-[#7D8E79] transition-colors py-2.5 flex items-center justify-between border-b border-black/[0.03]"
                  >
                    <span>All Products</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium tracking-wide text-[#14281D] hover:text-[#7D8E79] transition-colors py-2.5 flex items-center justify-between border-b border-black/[0.03]"
                  >
                    <span>About Medilux</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenSearch();
                    }}
                    className="text-left text-lg font-medium tracking-wide text-[#14281D] hover:text-[#7D8E79] transition-colors py-2.5 flex items-center justify-between border-b border-black/[0.03] cursor-pointer"
                  >
                    <span>Search Catalog</span>
                    <Search size={16} className="text-gray-400" />
                  </button>
                </nav>

                {/* Categories quick links */}
                <div className="mt-8">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B6862] block mb-3">
                    Curated Collections
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/collections/${cat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 bg-white rounded-xl text-xs font-medium text-[#14281D] hover:bg-[#14281D] hover:text-white transition-all border border-black/[0.04] flex items-center justify-between"
                      >
                        <span className="truncate">{cat.name}</span>
                        <ArrowUpRight size={12} className="opacity-60" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

                {/* Bottom Info */}
                <div className="pt-6 border-t border-black/[0.06] text-xs text-[#6B6862] space-y-2">
                  <p className="font-semibold text-[#14281D]">MEDILUX CARE</p>
                  <p className="text-[11px]">Everyday, Elevated Living.</p>
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="underline text-[#14281D]">
                      Contact Support
                    </Link>
                    <Link to="/xpzunayed" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Admin Portal 🔒
                    </Link>
                  </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
