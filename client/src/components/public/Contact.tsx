'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Namaste! I am ${formData.name}. I am interested in GymOS. ${formData.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/919999999999?text=${encodedText}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">READY TO <br /><span className="text-rose-600">REWRITE</span> YOUR STORY?</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-md">Drop us a message or join now to get a 10% discount on your first quarterly plan.</p>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-rose-600/10 flex items-center justify-center text-rose-600">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">+91 99999 99999</span>
            </div>
            
            <div className="mt-10 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 hidden md:block">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14391.432612739327!2d85.1278107!3d25.5940947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5844f0bb6903%3A0x57ad3ebcdabf7087!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1711204000000!5m2!1sen!2sin" 
                width="100%" 
                height="200" 
                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%) hover:grayscale(0%)' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex-1 w-full glassmorphism p-8 md:p-12"
          >
            <form onSubmit={handleWhatsApp} className="space-y-6">
              <div>
                <label className="block text-zinc-500 text-sm font-bold uppercase mb-2">FullName</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-rose-600 outline-none transition-all"
                  placeholder="e.g. Ranvijay Singh"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-sm font-bold uppercase mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-rose-600 outline-none transition-all"
                  placeholder="+91 XXXXX XXXXX"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-sm font-bold uppercase mb-2">Message (Optional)</label>
                <textarea 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-12 text-white focus:border-rose-600 outline-none transition-all"
                  placeholder="I want to discuss about..."
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3"
              >
                SEND ON WHATSAPP <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
