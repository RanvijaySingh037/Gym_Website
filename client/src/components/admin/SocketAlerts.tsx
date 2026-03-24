'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

export default function SocketAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000');

    socket.on('checkinAlert', (data: any) => {
      const newAlert = { id: Date.now(), ...data };
      setAlerts((prev) => [newAlert, ...prev]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.filter(a => a.id !== newAlert.id));
      }, 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-zinc-900 border border-green-500/30 shadow-2xl shadow-green-900/20 text-white p-4 rounded-2xl flex items-center gap-4 w-80"
          >
            <div className="bg-green-500/20 flex-shrink-0 p-2 rounded-full text-green-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-green-400">Checked In</h4>
              <p className="text-zinc-200 font-medium text-sm">{alert.message}</p>
            </div>
            <button 
              onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
