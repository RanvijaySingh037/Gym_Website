'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Utensils, Zap, HeartPulse, Trophy } from 'lucide-react';

const services = [
  {
    icon: <Zap className="text-white" />,
    title: "Weight Loss",
    desc: "Burn fat efficiently with our scientifically backed high-intensity training programs.",
    color: "bg-rose-600"
  },
  {
    icon: <Dumbbell className="text-white" />,
    title: "Muscle building",
    desc: "Gain strength and size with personalized hypertrophy programs and proper lifting form.",
    color: "bg-zinc-800"
  },
  {
    icon: <Utensils className="text-white" />,
    title: "Diet Plan",
    desc: "Nutrition is 70% of the game. Get custom meal plans that actually taste good.",
    color: "bg-rose-600"
  },
  {
    icon: <HeartPulse className="text-white" />,
    title: "Cardio + Strength",
    desc: "The perfect hybrid approach to build an athletic body and improve heart health.",
    color: "bg-zinc-800"
  },
  {
    icon: <Trophy className="text-white" />,
    title: "Personal Training",
    desc: "1-on-1 attention to ensure every rep counts and your safety is never compromised.",
    color: "bg-rose-600"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-black relative scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6"
            >
              LEVEL UP YOUR <br /> <span className="text-rose-600">FITNESS GAME</span>
            </motion.h2>
            <p className="text-zinc-500 font-medium text-lg">From fat loss to muscle gain, we provide the tools and guidance you need to dominate your fitness goals.</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex -space-x-4 mb-4"
          >
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-2 border-black bg-rose-600 flex items-center justify-center text-[10px] font-bold">
              500+
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed mb-8">{service.desc}</p>
              
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <span>→</span>
              </div>

              {/* Decorative Background Icon */}
              <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity transform scale-150 rotate-12">
                {service.icon}
              </div>
            </motion.div>
          ))}

          {/* Special Promotion Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-rose-600 to-rose-900 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <h3 className="text-3xl font-black text-white uppercase leading-tight mb-4">Limited Seats <br /> Available!</h3>
              <p className="text-rose-100 font-medium">Join today and get a free nutrition consultation worth <span className="font-bold underline">₹1999</span></p>
            </div>
            <button className="mt-8 bg-white text-rose-600 font-black py-4 rounded-2xl uppercase tracking-tighter hover:bg-rose-50 transition-colors">
              Claim Offer Now
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
