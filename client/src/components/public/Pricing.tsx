'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '999',
    duration: 'Monthly',
    features: ['Access to all equipment', 'Locker facility', 'General training'],
    recommended: false,
  },
  {
    name: 'Pro',
    price: '2499',
    duration: 'Quarterly',
    features: ['Personal trainer consult', 'Diet planning', 'High-intensity sessions', 'Everything in Basic'],
    recommended: true,
  },
  {
    name: 'Elite',
    price: '7999',
    duration: 'Annual',
    features: ['Priority support', 'Home workout plans', 'Full body transformation', 'Everything in Pro'],
    recommended: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16 uppercase tracking-tighter">Choose Your <span className="text-rose-600">Plan</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-2xl border ${plan.recommended ? 'border-rose-600 bg-rose-600/5' : 'border-zinc-800 bg-zinc-900/50'} relative overflow-hidden`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-rose-600 text-xs font-bold uppercase tracking-widest rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-4xl font-black">₹{plan.price}</span>
                <span className="text-zinc-500 font-medium">/{plan.duration}</span>
              </div>
              <ul className="text-left space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-400">
                    <Check className="w-5 h-5 text-rose-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${plan.recommended ? 'bg-rose-600 hover:bg-rose-700' : 'glassmorphism hover:bg-white/10'}`}
              >
                GET STARTED
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
