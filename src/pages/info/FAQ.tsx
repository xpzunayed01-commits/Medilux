import { AnimatedSection } from '../../components/AnimatedSection';

export function FAQ() {
  const faqs = [
    {
      q: "What is your shipping policy?",
      a: "We offer Cash on Delivery (COD) and standard shipping nationwide. Orders are typically processed within 24-48 hours. Delivery usually takes 2-5 business days depending on your location."
    },
    {
      q: "Are your products authentic?",
      a: "Yes, 100%. We source our products directly from authorized distributors and manufacturers to guarantee authenticity and freshness."
    },
    {
      q: "Can I cancel or change my order?",
      a: "Orders can only be modified or cancelled if they have not yet been processed for shipping. Please contact our support team immediately if you need to make changes."
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship nationwide within our supported regions. We are looking to expand internationally in the future."
    },
    {
      q: "How can I track my order?",
      a: "Once your order is dispatched, you will receive an SMS and email notification with your tracking details."
    }
  ];

  return (
    <AnimatedSection className="py-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-5xl font-light tracking-tight mb-12 text-center text-primary">FREQUENTLY ASKED QUESTIONS</h1>
      
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-black/5 pb-8">
            <h3 className="text-sm font-semibold tracking-wide text-primary mb-3 leading-relaxed">{faq.q}</h3>
            <p className="text-sm text-text-muted font-light leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
