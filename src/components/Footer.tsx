import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToSiteSettings, subscribeToCategories, defaultSiteSettings } from '../lib/dataService';
import { SiteSettings, Category } from '../types';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [categories, setCategories] = useState<Category[]>([]);

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

  return (
    <footer className="bg-background pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto border-t border-black/5 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-semibold tracking-widest text-primary block mb-4">
              {settings.storeName || 'MEDILUX'}
            </Link>
            <p className="text-sm text-text-muted">{settings.tagline || 'EVERYDAY, ELEVATED.'}</p>
            {settings.phone && (
              <p className="text-xs text-text-muted mt-3">Phone: {settings.phone}</p>
            )}
            {settings.email && (
              <p className="text-xs text-text-muted mt-1">Email: {settings.email}</p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest mb-6">SHOP</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              {categories.length > 0 ? (
                categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/collections/${cat.id}`} className="hover:text-primary transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/collections/food" className="hover:text-primary transition-colors">Food</Link></li>
                  <li><Link to="/collections/coffee" className="hover:text-primary transition-colors">Coffee</Link></li>
                  <li><Link to="/collections/care" className="hover:text-primary transition-colors">Care</Link></li>
                  <li><Link to="/collections/skin" className="hover:text-primary transition-colors">Skin</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest mb-6">COMPANY</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">Catalog</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest mb-6">POLICIES</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><span className="hover:text-primary transition-colors">Cash On Delivery</span></li>
              <li><span className="hover:text-primary transition-colors">100% Genuine Products</span></li>
              <li><span className="hover:text-primary transition-colors">Nationwide Shipping</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-text-muted/60 pt-8 border-t border-black/5">
          <p>&copy; {new Date().getFullYear()} {settings.storeName || 'MEDILUX'}. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Facebook</a>
            )}
            {settings.whatsappNumber && (
              <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
