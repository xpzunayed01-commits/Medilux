import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToSiteSettings, subscribeToCategories, defaultSiteSettings } from '../lib/dataService';
import { SiteSettings, Category } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Send, Check } from 'lucide-react';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    const unsubSettings = subscribeToSiteSettings((data) => {
      if (data) setSettings(data);
    });
    const unsubCats = subscribeToCategories((data) => {
      if (data) setCategories(data.filter((c) => !c.isHidden));
    });
    return () => {
      unsubSettings();
      unsubCats();
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubmitted(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#14281D] text-[#FAF9F5] pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden">
      
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[40vw] h-[30vw] bg-[#7D8E79]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Newsletter / VIP Club Banner */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 sm:p-12 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-xs">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A880] mb-2">
              <Sparkles size={12} />
              THE MEDILUX CIRCLE
            </span>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-2">
              Receive 10% off your next ritual.
            </h3>
            <p className="text-xs sm:text-sm text-[#E6E1D6]/70 font-light">
              Subscribe to get exclusive access to seasonal batches, wellness insights, and member-only promotions.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex-1 max-w-md">
            {newsletterSubmitted ? (
              <div className="flex items-center gap-2 p-3.5 bg-emerald-900/60 border border-emerald-500/40 rounded-full text-emerald-200 text-xs font-semibold justify-center">
                <Check size={16} />
                <span>Welcome to the Circle! Check your inbox soon.</span>
              </div>
            ) : (
              <div className="flex items-center bg-white/[0.07] border border-white/15 rounded-full p-1.5 focus-within:border-[#C5A880] transition-colors">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-transparent px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none flex-1 font-light"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C5A880] hover:bg-[#b0936b] text-[#14281D] text-xs font-bold tracking-wider rounded-full transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>JOIN</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="https://i.postimg.cc/Y0Qrtp6H/Picsart-26-08-22-16-03-45-163.png"
                alt="MEDILUX"
                className="h-9 w-auto filter brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-xs sm:text-sm text-[#E6E1D6]/70 font-light leading-relaxed max-w-sm">
              {settings.tagline || 'Everyday, Elevated Living. Thoughtfully formulated essentials crafted for modern wellness and daily vitality.'}
            </p>
            
            <div className="pt-2 space-y-1 text-xs text-[#E6E1D6]/70">
              {settings.phone && <p>Concierge: <span className="text-white font-medium">{settings.phone}</span></p>}
              {settings.email && <p>Inquiries: <span className="text-white font-medium">{settings.email}</span></p>}
              <p>Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5A880] mb-5">COLLECTIONS</h4>
            <ul className="space-y-3 text-xs text-[#E6E1D6]/75 font-normal">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">All Essentials</Link>
              </li>
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/collections/${cat.id}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5A880] mb-5">COMPANY</h4>
            <ul className="space-y-3 text-xs text-[#E6E1D6]/75 font-normal">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story & Craft</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/xpzunayed" className="text-[#C5A880] hover:underline font-semibold flex items-center gap-1">Admin Portal →</Link></li>
            </ul>
          </div>

          {/* Policies & Assurances */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5A880] mb-5">POLICIES</h4>
            <ul className="space-y-3 text-xs text-[#E6E1D6]/75 font-normal">
              <li><Link to="/policies#terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/policies#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policies#returns" className="hover:text-white transition-colors">Return & Exchange Policy</Link></li>
              <li><Link to="/policies#shipping" className="hover:text-white transition-colors">Shipping & Delivery Info</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#E6E1D6]/50">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} {settings.storeName || 'MEDILUX'} Lifestyle. All rights reserved.</p>
          </div>

          {/* Accepted Payment Channels */}
          <div className="flex items-center gap-2.5 text-[11px] text-[#E6E1D6]/80 font-medium flex-wrap justify-center">
            <span className="px-2.5 py-1 bg-white/10 rounded-md border border-white/10">Cash On Delivery</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md border border-white/10">bKash</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md border border-white/10">Nagad</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md border border-white/10">Visa / Mastercard</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-5">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
            )}
            {settings.whatsappNumber && (
              <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                WhatsApp
              </a>
            )}
          </div>

        </div>

      </div>
    </footer>
  );
}
