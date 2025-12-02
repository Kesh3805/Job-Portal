import React from 'react';
import { Link } from 'react-router-dom';

const Philosophy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Organic Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] gradient-blob-1 blob opacity-60"></div>
          <div className="absolute top-[10%] right-[-15%] w-[700px] h-[700px] gradient-blob-2 blob-2 opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] gradient-blob-3 blob opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                CORE PRINCIPLES
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-12 leading-tight tracking-tighter">
                Our Philosophy.
              </h1>

              <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
                <p>
                  We believe that the future of work is fluid, dynamic, and deeply human. Technology should serve
                  to connect people with meaningful opportunities, not create barriers.
                </p>

                <p>
                  Every interaction in our platform is designed with intention. We've removed the friction,
                  the noise, and the unnecessary complexity that plagues traditional job portals.
                </p>

                <p>
                  What remains is pure signal—a direct connection between talent and opportunity,
                  governed by intelligent algorithms that understand context, not just keywords.
                </p>
              </div>
            </div>

            {/* Principles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                  01 — CLARITY
                </div>
                <h3 className="text-2xl font-bold mb-4">Transparent by Design</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No hidden fees, no dark patterns. Every feature, every interaction is designed
                  to be clear and straightforward.
                </p>
              </div>

              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                  02 — INTELLIGENCE
                </div>
                <h3 className="text-2xl font-bold mb-4">Smart Matching</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI doesn't just match keywords—it understands skills, context, and career trajectories
                  to find the perfect fit.
                </p>
              </div>

              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                  03 — EFFICIENCY
                </div>
                <h3 className="text-2xl font-bold mb-4">Streamlined Process</h3>
                <p className="text-muted-foreground leading-relaxed">
                  From application to interview scheduling, every step is optimized to save time
                  and reduce friction.
                </p>
              </div>

              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                  04 — ACCESSIBILITY
                </div>
                <h3 className="text-2xl font-bold mb-4">Open to All</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Opportunities should be accessible to everyone. We're committed to creating
                  an inclusive platform for all talent.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-24 text-center">
              <p className="text-xl text-foreground mb-8 font-medium">
                Ready to experience the future of hiring?
              </p>
              <Link to="/register">
                <button className="px-10 py-4 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:opacity-90 transition-opacity">
                  Join the Grid
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
          <div className="w-2 h-2 bg-foreground rounded-full"></div>
          <div className="w-2 h-2 bg-foreground/30 rounded-full"></div>
          <div className="w-2 h-2 bg-foreground/30 rounded-full"></div>
        </div>
      </section>
    </div>
  );
};

export default Philosophy;
