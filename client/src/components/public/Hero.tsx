'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Phone, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden bg-black pt-20 pb-12 md:pt-0 md:pb-0">
      {/* Background with cinematic image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <img 
          src="/hero_bg.png" 
          alt="Premium Gym" 
          className="w-full h-full object-cover opacity-60 scale-105"
        />
      </div>

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-rose-600/10 rounded-full blur-[100px] md:blur-[150px] -z-10 animate-pulse-slow" />
      
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 glassmorphism-red rounded-full border border-rose-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-rose-500 text-[10px] md:text-xs font-black tracking-widest uppercase">
              Limited seats left for 90-Day Challenge
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-8 leading-[0.9] tracking-tighter uppercase"
          >
            TRANSFORM YOUR <br />
            <span className="text-gradient-red">BODY</span> IN <br />
            <span className="text-white">90 DAYS 🔥</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-xl text-zinc-400 text-base md:text-xl mb-10 md:mb-12 leading-relaxed font-medium"
          >
            No shortcuts. No excuses. Real transformations with expert trainers and personalized diet plans designed for your body.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 md:gap-6"
          >
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
              className="group w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_10px_40px_-10px_rgba(225,29,72,0.5)] flex items-center justify-center gap-3 uppercase tracking-tighter text-sm md:text-base"
            >
              Start Your Transformation 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} 
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 glassmorphism hover:bg-white/10 text-white font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-tighter text-sm md:text-base"
            >
              <Phone size={20} /> Book Free Trial
            </button>
          </motion.div>

          {/* Social Proof Line */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 md:mt-16 flex items-center gap-4 md:gap-6"
          >
            <div className="flex -space-x-2 md:-space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black bg-zinc-800" />
              ))}
            </div>
            <p className="text-zinc-500 text-xs md:text-sm font-bold">
              Joined by <span className="text-white">500+</span> Bihar Fitness Enthusiasts
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute right-12 bottom-0 w-px h-32 bg-gradient-to-t from-rose-600 to-transparent hidden lg:block" />
    </section>
  );
}

