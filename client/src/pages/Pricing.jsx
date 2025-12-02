import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for job seekers',
      features: [
        { text: 'Browse unlimited jobs', included: true },
        { text: 'Apply to jobs', included: true },
        { text: 'Basic profile', included: true },
        { text: 'Email notifications', included: true },
        { text: 'AI job matching', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For serious job seekers',
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'AI-powered job matching', included: true },
        { text: 'Resume builder', included: true },
        { text: 'Priority applications', included: true },
        { text: 'Interview preparation', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Recruiter',
      price: '$99',
      period: '/month',
      description: 'For hiring teams',
      features: [
        { text: 'Post unlimited jobs', included: true },
        { text: 'Access to candidate database', included: true },
        { text: 'AI candidate matching', included: true },
        { text: 'Team collaboration', included: true },
        { text: 'Analytics dashboard', included: true },
        { text: 'Dedicated support', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-float delay-200"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] animate-float delay-400"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Choose Your <span className="text-gradient animate-gradient">Perfect Plan</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Whether you're looking for your next opportunity or building your team, we have a plan for you.
            </motion.p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.2, duration: 0.8, ease: "easeOut" }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover-lift ${
                  plan.popular
                    ? 'border-primary bg-card shadow-2xl scale-105 hover-glow'
                    : 'border-border bg-card hover:border-primary/50 hover-glow'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Most Popular
                  </motion.div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <motion.div 
                    className="flex items-baseline justify-center gap-1"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </motion.div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + index * 0.2 + idx * 0.05, duration: 0.5 }}
                    >
                      {feature.included ? (
                        <FiCheck className="text-primary mt-0.5 flex-shrink-0" size={20} />
                      ) : (
                        <FiX className="text-muted-foreground mt-0.5 flex-shrink-0" size={20} />
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all relative overflow-hidden group ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-2xl'
                        : 'bg-secondary text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="relative z-10">{plan.cta}</span>
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom Text */}
          <motion.div 
            className="text-center mt-16 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <p className="text-lg mb-4">All plans include 14-day money-back guarantee</p>
            <p className="text-sm">Need a custom plan? <Link to="/contact" className="text-primary hover:underline">Contact us</Link></p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
