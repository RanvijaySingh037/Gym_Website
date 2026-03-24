'use client';

import { Dumbbell, Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-2 group w-fit">
              <Dumbbell className="w-8 h-8 text-rose-600 group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-black tracking-tighter text-white">GYM<span className="text-rose-600">OS</span></span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Elevating fitness standards in Bihar and beyond. We bring world-class training, state-of-the-art tech, and a premium atmosphere to your daily grind.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-rose-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-rose-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-rose-600 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#hero" onClick={(e) => scrollToSection('hero', e)} className="text-zinc-400 hover:text-rose-500 transition-colors text-sm">Home</a></li>
              <li><a href="#transformations" onClick={(e) => scrollToSection('transformations', e)} className="text-zinc-400 hover:text-rose-500 transition-colors text-sm">Transformations</a></li>
              <li><a href="#pricing" onClick={(e) => scrollToSection('pricing', e)} className="text-zinc-400 hover:text-rose-500 transition-colors text-sm">Pricing Plans</a></li>
              <li><a href="#contact" onClick={(e) => scrollToSection('contact', e)} className="text-zinc-400 hover:text-rose-500 transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-400 text-sm">
                <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                <span>123 Fitness Street, Fraser Road,<br/>Patna, Bihar 800001</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone className="w-5 h-5 text-rose-600" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail className="w-5 h-5 text-rose-600" />
                <span>hello@gymos.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Newsletter</h4>
            <p className="text-zinc-400 text-sm">Subscribe to get fitness tips and exclusive GymOS offers.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-rose-600 outline-none transition-all text-sm"
              />
              <button className="px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all">
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-zinc-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} GymOS. All rights reserved. Built with ❤️ by HiTechCrest.
          </p>
          <div className="flex gap-6">
             <a href="#" className="text-zinc-500 hover:text-white text-xs font-medium transition-colors">Privacy Policy</a>
             <a href="#" className="text-zinc-500 hover:text-white text-xs font-medium transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
