'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'Services', id: 'services' },
    { name: 'Reviews', id: 'transformations' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5 lg:py-8'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-2 group shrink-0">
          <Dumbbell className="w-7 h-7 md:w-8 md:h-8 text-rose-600 group-hover:rotate-12 transition-transform" />
          <span className="text-xl md:text-2xl font-black tracking-tighter">GYM<span className="text-rose-600">OS</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-bold text-zinc-300 hover:text-white uppercase tracking-widest transition-colors"
            >
              {link.name}
            </button>
          ))}
          <Link 
            href="/admin"
            className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold uppercase tracking-widest rounded-full transition-all border border-zinc-800"
          >
            Admin Panel
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-zinc-900 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <button 
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left text-lg font-bold text-zinc-300 hover:text-white transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-6 border-t border-zinc-900">
                <Link 
                  href="/admin"
                  className="block text-center px-6 py-4 bg-rose-600 text-white font-bold rounded-xl"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
