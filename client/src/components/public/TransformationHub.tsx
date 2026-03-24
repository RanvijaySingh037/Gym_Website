'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TransformationHub() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <section id="transformations" className="py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16 uppercase tracking-tighter">
          Real <span className="text-rose-600">Transformations</span>
        </h2>

        <div 
          className="relative max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none border border-zinc-800"
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
        >
          {/* After Image (Full background) */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?q=80&w=2070&auto=format&fit=crop")' }}
          >
            <div className="absolute bottom-10 right-10 glassmorphism px-6 py-2 font-bold text-rose-500">AFTER (12 WEEKS)</div>
          </div>

          {/* Before Image (Clipped) */}
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop")',
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
            }}
          >
            <div className="absolute bottom-10 left-10 glassmorphism px-6 py-2 font-bold text-zinc-400">BEFORE</div>
          </div>

          {/* Slider Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-rose-600 flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.6)]">
              <div className="flex gap-1">
                 <div className="w-1 h-3 bg-white/50 rounded-full" />
                 <div className="w-1 h-3 bg-white/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 text-zinc-500 font-medium">Drag the slider to see the magic. Results vary by individual.</p>
      </div>
    </section>
  );
}
