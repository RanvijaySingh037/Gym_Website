'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight, MessageCircle, Phone } from 'lucide-react';

interface Transformation {
  id: number;
  name: string;
  location: string;
  result: string;
  weightLoss: string;
  beforeImg: string;
  afterImg: string;
}

const transformations: Transformation[] = [
  {
    id: 1,
    name: 'Rahul Kumar',
    location: 'Ara, Bihar',
    result: 'Lost 12kg in 12 weeks',
    weightLoss: '92kg → 80kg',
    beforeImg: '/rahul_before_new.png',
    afterImg: '/rahul_after_new.png',
  },
  {
    id: 2,
    name: 'Anita Singh',
    location: 'Patna, Bihar',
    result: 'Lost 10kg & Gained Muscle',
    weightLoss: '75kg → 65kg',
    beforeImg: '/anita_before.webp',
    afterImg: '/anita_after.webp',
  },
  {
    id: 3,
    name: 'Vikram Raj',
    location: 'Gaya, Bihar',
    result: 'Transformed in 16 weeks',
    weightLoss: '88kg → 76kg',
    beforeImg: '/vikram_before.webp',
    afterImg: '/vikram_after.webp',
  }
];

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none border border-zinc-800 shadow-2xl group"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Full background) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${after})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 right-6 glassmorphism px-6 py-2 font-bold text-rose-500 text-sm md:text-base border border-rose-500/30">
          AFTER (12 WEEKS)
        </div>
      </div>

      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale transition-transform duration-500 group-hover:scale-105"
        style={{ 
          backgroundImage: `url(${before})`,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 glassmorphism px-6 py-2 font-bold text-zinc-400 text-sm md:text-base border border-white/10">
          BEFORE
        </div>
      </div>

      {/* Instruction text overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="glassmorphism px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 border border-white/10">
          Drag to see the magic →
        </span>
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-rose-600 flex items-center justify-center z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.8)] border-2 border-white/20"
        >
          <div className="flex gap-1">
             <div className="w-1 h-3 bg-white/70 rounded-full" />
             <div className="w-1 h-3 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TransformationHub() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="transformations" className="py-24 bg-black overflow-hidden relative scroll-mt-24">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 blur-[120px] rounded-full -mr-48 -mt-24" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/5 blur-[120px] rounded-full -ml-48 -mb-24" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none"
          >
            REAL <span className="text-rose-600">TRANSFORMATIONS</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto"
          >
            See how our members changed their lives in just 90 days. Real people, real sweat, real results.
          </motion.p>
        </div>

        {/* Carousel / Snap Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 scrollbar-hide no-scrollbar -mx-6 px-6">
          {transformations.map((item) => (
            <div key={item.id} className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[40vw] snap-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glassmorphism p-4 md:p-6 rounded-[2.5rem] border border-white/5 bg-zinc-900/40 backdrop-blur-xl"
              >
                <BeforeAfterSlider before={item.beforeImg} after={item.afterImg} />
                
                <div className="mt-8 px-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">{item.name}</h3>
                      <p className="text-zinc-500 font-medium text-sm tracking-wide">{item.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-rose-600/20 text-rose-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-rose-600/20">
                        {item.result}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-rose-500 font-black text-xl md:text-2xl tracking-tighter uppercase italic">
                      Weight Progress: {item.weightLoss}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Social Proof Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-12 mb-20"
        >
          {[
            { label: '200+ Transformations', desc: 'Success Stories' },
            { label: 'Certified Trainers', desc: 'Expert Guidance' },
            { label: 'Personalized Plans', desc: 'Diet & Workout' },
            { label: '90 Day Results', desc: 'Guaranteed Shift' }
          ].map((badge, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 group hover:border-rose-600/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-600/10 flex items-center justify-center group-hover:bg-rose-600/20 transition-colors">
                <CheckCircle2 className="text-rose-600" size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold leading-tight">{badge.label}</h4>
                <p className="text-zinc-500 text-xs font-medium">{badge.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Strong CTAs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(225, 29, 72, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto px-8 py-5 bg-rose-600 text-white rounded-full font-black uppercase tracking-tighter flex items-center justify-center gap-3 group transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(225,29,72,0.5)]"
          >
            Start Your Transformation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto px-8 py-5 bg-white/5 text-white rounded-full font-black uppercase tracking-tighter flex items-center justify-center gap-3 border border-white/10 transition-all duration-300"
          >
            <Phone size={20} /> Book Free Trial
          </motion.button>
        </div>

        <p className="mt-16 text-zinc-600 text-sm font-medium text-center">
          *Individual results may vary. Dedication and consistency are key to your success.
        </p>
      </div>
    </section>
  );
}
