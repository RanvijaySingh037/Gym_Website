'use client';

import { motion } from 'framer-motion';
import { Store, User, Bell, Lock, MapPin, QrCode, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('gym');
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`)
      .then(res => res.json())
      .then(data => {
        if(data._id) setAdmin(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-12 h-12 text-rose-600 animate-spin" /></div>;

  const checkinUrl = admin ? `${window.location.origin}/checkin/${admin._id}` : '';

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Settings</h2>
        <p className="text-zinc-500 text-lg">Manage your gym profile and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-3 border-r border-zinc-900 pr-4">
           <button onClick={() => setActiveTab('gym')} className={`flex items-center gap-3 w-full p-4 text-left rounded-2xl font-bold transition-all border ${activeTab === 'gym' ? 'bg-zinc-900 text-white border-zinc-800' : 'hover:bg-zinc-950 text-zinc-500 border-transparent hover:border-zinc-800'}`}>
             <Store className={`w-5 h-5 ${activeTab === 'gym' ? 'text-rose-500' : 'text-zinc-600'}`} /> Gym Details
           </button>
           <button onClick={() => setActiveTab('checkin')} className={`flex items-center gap-3 w-full p-4 text-left rounded-2xl font-bold transition-all border ${activeTab === 'checkin' ? 'bg-zinc-900 text-white border-zinc-800' : 'hover:bg-zinc-950 text-zinc-500 border-transparent hover:border-zinc-800'}`}>
             <QrCode className={`w-5 h-5 ${activeTab === 'checkin' ? 'text-rose-500' : 'text-zinc-600'}`} /> Check-in Setup
           </button>
           <button className="flex items-center gap-3 w-full p-4 text-left rounded-2xl hover:bg-zinc-950 text-zinc-500 font-bold transition-all border border-transparent hover:border-zinc-800 opacity-50 cursor-not-allowed">
             <User className="w-5 h-5 text-zinc-600" /> Account (WIP)
           </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          {activeTab === 'gym' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 bg-zinc-950 border border-zinc-900 rounded-3xl"
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Store className="w-6 h-6 text-rose-600" /> General Preferences
              </h3>
              
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                     <label className="block text-zinc-500 text-sm font-bold uppercase tracking-widest mb-3">Gym Name</label>
                     <input 
                       type="text" 
                       defaultValue={admin?.gymName || "GymOS"} 
                       className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none transition-all" 
                     />
                   </div>
                   <div>
                     <label className="block text-zinc-500 text-sm font-bold uppercase tracking-widest mb-3">Contact Email</label>
                     <input 
                       type="email" 
                       defaultValue={admin?.email || ""} 
                       className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none transition-all" 
                     />
                   </div>
                </div>
                <div className="pt-4 border-t border-zinc-900">
                   <button type="button" className="px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                     SAVE ALL CHANGES
                   </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'checkin' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* QR Code Setup */}
              {admin && (
                <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col items-center text-center print:fixed print:inset-0 print:bg-white print:z-50 print:justify-center print:h-screen print:w-screen print:rounded-none">
                  <h3 className="text-2xl font-bold flex items-center justify-center gap-3 mb-2 print:text-black print:text-5xl print:mb-6">
                    <QrCode className="w-6 h-6 text-rose-600 print:hidden" /> The Wall QR
                  </h3>
                <p className="text-zinc-400 mb-10 max-w-lg print:text-zinc-600 print:text-2xl print:max-w-2xl">
                  Print this QR code and paste it on your gym entry wall. Members will scan it with their own camera to launch the check-in portal.
                </p>
                
                <div className="bg-white p-6 rounded-3xl shadow-2xl mb-6 print:shadow-none print:p-0 print:mb-8">
                  <QRCode 
                    value={checkinUrl} 
                    size={256}
                    level="H"
                    className="print:w-[400px] print:h-[400px]"
                  />
                </div>
                
                <p className="text-zinc-500 text-sm font-mono bg-black px-4 py-2 rounded-xl border border-zinc-900 break-all print:hidden">
                  {checkinUrl}
                </p>
                
                <button 
                  onClick={() => window.print()}
                  className="mt-8 px-10 py-5 bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.2)] cursor-pointer print:hidden"
                >
                  PRINT QR CODE
                </button>
              </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
