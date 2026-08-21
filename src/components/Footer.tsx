import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto border-t border-black/5 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-semibold tracking-widest text-primary block mb-4">
              MEDILUX
            </Link>
            <p className="text-sm text-text-muted">EVERYDAY, ELEVATED.</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest mb-6">SHOP</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link to="/collections/food" className="hover:text-primary transition-colors">Food</Link></li>
              <li><Link to="/collections/coffee" className="hover:text-primary transition-colors">Coffee</Link></li>
              <li><Link to="/collections/care" className="hover:text-primary transition-colors">Care</Link></li>
              <li><Link to="/collections/skin" className="hover:text-primary transition-colors">Skin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest mb-6">COMPANY</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest mb-6">POLICIES</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link to="#" className="hover:text-primary transition-colors">Shipping</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-text-muted/60 pt-8 border-t border-black/5">
          <p>&copy; {new Date().getFullYear()} MEDILUX. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
