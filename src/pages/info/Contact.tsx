import { AnimatedSection } from '../../components/AnimatedSection';

export function Contact() {
  return (
    <AnimatedSection className="py-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-5xl font-light tracking-tight mb-8 text-primary">CONTACT US</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-sm text-text-muted mb-8 leading-relaxed font-light">
            We'd love to hear from you. Whether you have a question about our products, need assistance with your order, or just want to share your Medilux experience.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold tracking-widest mb-2 uppercase">General Inquiries</h3>
              <p className="text-sm text-text-muted">info@medilux.com</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-widest mb-2 uppercase">Customer Support</h3>
              <p className="text-sm text-text-muted">support@medilux.com</p>
              <p className="text-sm text-text-muted mt-1">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-widest mb-2 uppercase">Business Hours</h3>
              <p className="text-sm text-text-muted">Monday - Friday: 9am - 6pm EST</p>
              <p className="text-sm text-text-muted mt-1">Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#F4F2EC] p-8 rounded-3xl">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <div>
              <label htmlFor="name" className="block text-[11px] font-semibold text-primary uppercase tracking-widest mb-2">Name</label>
              <input type="text" id="name" required className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow" />
            </div>
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold text-primary uppercase tracking-widest mb-2">Email</label>
              <input type="email" id="email" required className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow" />
            </div>
            <div>
              <label htmlFor="message" className="block text-[11px] font-semibold text-primary uppercase tracking-widest mb-2">Message</label>
              <textarea id="message" rows={4} required className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow resize-none"></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-primary text-white text-xs font-semibold tracking-widest rounded-full hover:bg-primary/90 transition-colors active:scale-95 shadow-md">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </AnimatedSection>
  );
}
