'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, MapPin, Loader2, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fpPromise from '@fingerprintjs/fingerprintjs';

import { api } from '@/lib/api';

export default function CheckinPage() {
  const params = useParams();
  const gymId = params?.gymId;
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);
  
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isDeviceMismatched, setIsDeviceMismatched] = useState(false);

  useEffect(() => {
    // Initialize Fingerprint
    fpPromise.load()
      .then((fp: any) => fp.get())
      .then((result: any) => setDeviceId(result.visitorId))
      .catch(console.error);
  }, []);

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!identifier) return setError('Please enter your Phone Number or Member ID');
    
    setLoading(true);
    setError('');
    
    try {
      const deviceInfo = navigator.userAgent;
      const data = await api.getCheckinQR({ gymId, identifier, deviceInfo, deviceId });
      
      if (data.message === 'DeviceMismatched') {
        setIsDeviceMismatched(true);
        throw new Error('DeviceMismatched');
      }
      
      if (data.error || data.message === 'Internal server error') {
         throw new Error(data.message || 'Check-in failed');
      }

      setSuccess(data);
    } catch (err: any) {
      if (err.message !== 'DeviceMismatched') {
        setError(err.message || 'Check-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            GymOS
          </h1>
          <p className="text-neutral-400 mt-2">Self Check-in Portal</p>
        </div>

        <AnimatePresence mode="wait">
          {isDeviceMismatched ? (
            <motion.div 
              key="mismatch-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900 border border-red-900/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.15)] text-center space-y-6"
            >
              <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-red-500">Unauthorized Device</h2>
              <p className="text-zinc-400 text-sm">This ID is securely bound to another phone. To prevent proxy scanning, your check-in has been blocked.</p>
              
              <div className="bg-neutral-950 rounded-xl p-6 text-left border border-neutral-800/50 mt-6 space-y-4">
                <p className="text-zinc-500 text-xs mb-1">If you recently bought a new phone or cleared your browser cache, please contact the manager to reset your secure device link.</p>
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/919876543210?text=${encodeURIComponent('Sir, mera phone change ho gaya hai, please device reset kar dijiye.')}`, '_blank')}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" /> Request Device Reset
                </button>
              </div>
              <button 
                onClick={() => { setIsDeviceMismatched(false); setError(''); }} 
                className="text-zinc-500 hover:text-white text-sm font-bold uppercase tracking-widest"
              >
                Go Back
              </button>
            </motion.div>
          ) : !success ? (
            <motion.form 
              key="checkin-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleCheckin} 
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Phone Number / Member ID
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium placeholder:text-neutral-600"
                      placeholder="e.g. 9876543210"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-start gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-sm"
                  >
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'CHECK-IN NOW'
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl text-center space-y-6"
            >
              <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Checked In!</h2>
              {success.message?.includes('Already') ? (
                <p className="text-amber-500 font-bold text-lg bg-amber-500/10 py-2 px-4 rounded-lg inline-block mx-auto border border-amber-500/20">{success.message}</p>
              ) : (
                <p className="text-green-400 font-medium">{success.message}</p>
              )}
              
              <div className="bg-neutral-950 rounded-xl p-4 text-left border border-neutral-800/50 mt-6">
                <p className="text-sm text-neutral-500 mb-1">Member Name</p>
                <p className="font-semibold text-lg text-neutral-200">{success.member?.name}</p>
                
                <div className="h-px bg-neutral-800 my-3"></div>
                
                <p className="text-sm text-neutral-500 mb-1">Plan Expiry</p>
                <p className="font-medium text-neutral-300">
                  {success.member?.expiryDate ? new Date(success.member.expiryDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
