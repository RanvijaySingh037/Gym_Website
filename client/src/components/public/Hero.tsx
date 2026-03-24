'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/30 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block px-4 py-1.5 mb-6 glassmorphism text-rose-500 text-sm font-medium tracking-wider uppercase"
        >
          Elevate Your Performance
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter"
        >
          WELCOME TO <span className="text-gradient">GYMOS</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed"
        >
          Experience fitness redefining. From Bihar to the world, we bring pro-level training 
          and technology to your fingertips.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
            className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(225,29,72,0.4)]"
          >
            JOIN THE ELITE
          </button>
          <button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} 
            className="px-8 py-4 glassmorphism hover:bg-white/10 text-white font-bold rounded-full transition-all duration-300"
          >
            VIEW PLANS
          </button>
        </motion.div>
      </div>
    </section>
  );
}
