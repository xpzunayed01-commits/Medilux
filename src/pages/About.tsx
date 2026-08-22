import { AnimatedSection } from '../components/AnimatedSection';

export function About() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img referrerPolicy="no-referrer"
            src="https://picsum.photos/id/292/2000/1200"
            alt="Minimalist lifestyle scene"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-primary leading-[1.1] mb-8">
            EVERYDAY,<br />MADE BETTER.
          </h1>
          <p className="text-lg md:text-xl text-primary/80 max-w-2xl mx-auto font-light leading-relaxed">
            We believe that the objects and rituals you interact with daily should bring a sense of calm, quality, and purpose to your life.
          </p>
        </div>
      </section>

      {/* Story Text */}
      <AnimatedSection className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12 text-lg md:text-xl font-light leading-relaxed text-text-main">
            <p>
              Medilux was born from a simple observation: modern life is complicated enough. The products we use every day shouldn't add to the noise. They should simplify it.
            </p>
            <p>
              We source and create essentials across wellness, personal care, and daily nourishment with a singular focus on uncompromising quality and minimal design.
            </p>
            <p>
              Every ingredient is considered. Every material is intentional. We strip away the unnecessary so you can focus on what actually matters—feeling good and living well.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Philosophy Grid */}
      <AnimatedSection className="py-24 px-6 bg-[#F2F0EB]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
          <div>
            <h3 className="text-sm font-medium tracking-widest text-primary mb-4">THOUGHTFUL SOURCING</h3>
            <p className="text-text-muted font-light leading-relaxed max-w-xs mx-auto">
              We work directly with producers who share our commitment to quality, sustainability, and ethical practices.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-widest text-primary mb-4">MINIMAL INTERVENTION</h3>
            <p className="text-text-muted font-light leading-relaxed max-w-xs mx-auto">
              We believe in doing less, but better. Our formulations are clean, effective, and free from unnecessary additives.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-widest text-primary mb-4">EVERYDAY DESIGN</h3>
            <p className="text-text-muted font-light leading-relaxed max-w-xs mx-auto">
              Our packaging is designed to live beautifully in your space, bringing a moment of quiet luxury to your daily routine.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
