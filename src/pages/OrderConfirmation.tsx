import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'motion/react';

export function OrderConfirmation() {
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <CheckCircle2 size={64} strokeWidth={1} className="text-primary mb-8 mx-auto" />
      </motion.div>
      
      <h1 className="text-3xl md:text-4xl font-light tracking-tight text-primary mb-4">
        ORDER CONFIRMED.
      </h1>
      
      <p className="text-lg text-text-muted mb-8 font-light">
        Thank you for choosing Medilux.
      </p>
      
      <div className="bg-[#F2F0EB] p-8 rounded-lg max-w-md w-full mb-12">
        <p className="text-xs text-text-muted tracking-widest font-medium mb-2">ORDER NUMBER</p>
        <p className="text-2xl font-light tracking-widest mb-6">#{orderNumber}</p>
        
        <div className="border-t border-black/10 pt-6 text-sm text-text-muted space-y-2">
          <p>We've received your order and will begin processing it shortly.</p>
          <p>You will receive a confirmation call before delivery.</p>
        </div>
      </div>

      <Link
        to="/shop"
        className="px-12 py-4 bg-primary text-white text-xs font-medium tracking-widest rounded hover:opacity-90 transition-opacity"
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  );
}
