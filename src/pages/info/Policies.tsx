import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';

export function Policies() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <AnimatedSection className="py-24 px-6 max-w-4xl mx-auto space-y-24">
      {/* Terms Section */}
      <section id="terms">
        <h1 className="text-3xl sm:text-5xl font-light tracking-tight mb-8 text-primary">TERMS & CONDITIONS</h1>
        <div className="prose prose-sm max-w-none text-text-muted font-light leading-relaxed">
          <p className="mb-4">Welcome to Medilux. By accessing or using our website, you agree to be bound by these Terms and Conditions.</p>
          
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">1. General Conditions</h3>
          <p className="mb-4">We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>
          
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">2. Products & Services</h3>
          <p className="mb-4">Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
          
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">3. Accuracy of Billing</h3>
          <p className="mb-4">We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.</p>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="pt-8 border-t border-black/5">
        <h1 className="text-3xl sm:text-5xl font-light tracking-tight mb-8 text-primary">PRIVACY POLICY</h1>
        <div className="prose prose-sm max-w-none text-text-muted font-light leading-relaxed">
          <p className="mb-4">At Medilux, we are committed to protecting your privacy and ensuring the security of your personal information.</p>
          
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">1. Information We Collect</h3>
          <p className="mb-4">When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address, phone number, and email address.</p>
          
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">2. Consent</h3>
          <p className="mb-4">When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.</p>
          
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">3. Disclosure</h3>
          <p className="mb-4">We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.</p>
        </div>
      </section>
      
      {/* Returns Section */}
      <section id="returns" className="pt-8 border-t border-black/5">
        <h1 className="text-3xl sm:text-5xl font-light tracking-tight mb-8 text-primary">RETURN POLICY</h1>
        <div className="prose prose-sm max-w-none text-text-muted font-light leading-relaxed">
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">1. Eligibility</h3>
          <p className="mb-4">To be eligible for a return, your item must be unused, sealed, and in the same condition that you received it. It must also be in the original packaging.</p>
          
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">2. Timeframe</h3>
          <p className="mb-4">Our policy lasts 7 days. If 7 days have gone by since your purchase was delivered, unfortunately we cannot offer you a refund or exchange.</p>
          
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mt-8 mb-4">3. Process</h3>
          <p className="mb-4">To initiate a return, please contact our support team with your order number and reason for return. Do not send your purchase back to the manufacturer.</p>
        </div>
      </section>
    </AnimatedSection>
  );
}
