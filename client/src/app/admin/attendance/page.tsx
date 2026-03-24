'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, History, AlertTriangle, Loader2, CheckCircle2, QrCode } from 'lucide-react';
import io from 'socket.io-client';

export default function AttendanceDashboard() {
  const [activeTab, setActiveTab] = useState<'live'|'history'|'retention'>('live');
  const [todayFeed, setTodayFeed] = useState<any[]>([]);
  const [historyFeed, setHistoryFeed] = useState<any[]>([]);
  const [retentionFeed, setRetentionFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyDate, setHistoryDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Fetch initial data
  useEffect(() => {
    fetchTodayFeed();
    fetchRetentionFeed();
  }, []);

  // Update history when date changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistoryFeed();
    }
  }, [historyDate, activeTab]);

  // Socket for live feed
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
    socket.on('checkinAlert', () => {
      // Refresh today's feed when someone checks in
      fetchTodayFeed();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchTodayFeed = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/attendance/today`);
      const data = await res.json();
      setTodayFeed(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchHistoryFeed = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/attendance/history?date=${historyDate}`);
      const data = await res.json();
      setHistoryFeed(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchRetentionFeed = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/attendance/retention`);
      const data = await res.json();
      setRetentionFeed(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const renderTable = (records: any[], type: 'attendance'|'retention') => (
    <div className="w-full overflow-hidden border border-zinc-900 rounded-3xl bg-zinc-950">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black border-b border-zinc-900">
            <th className="p-5 text-xs font-bold tracking-widest text-zinc-500 uppercase">Member Name</th>
            {type === 'attendance' && <th className="p-5 text-xs font-bold tracking-widest text-zinc-500 uppercase">Check-in Time</th>}
            <th className="p-5 text-xs font-bold tracking-widest text-zinc-500 uppercase">Status</th>
            <th className="p-5 text-xs font-bold tracking-widest text-zinc-500 uppercase text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan={4} className="p-10 text-center text-zinc-500 italic">No records found.</td></tr>
          ) : records.map((record) => {
            const member = type === 'attendance' ? record.memberId : record;
            if(!member) return null;
            return (
              <tr key={type === 'attendance' ? record._id : member._id} className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 shrink-0 overflow-hidden flex items-center justify-center font-black text-rose-500 border-2 border-zinc-800 shadow-lg">
                      {member.memberPhoto ? <img src={member.memberPhoto} className="w-full h-full object-cover"/> : member.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg leading-tight">{member.name}</h4>
                      <span className="text-sm font-mono text-zinc-500">{member.phone}</span>
                    </div>
                  </div>
                </td>
                {type === 'attendance' && (
                  <td className="p-5 font-mono text-zinc-400 font-medium">
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                )}
                <td className="p-5">
                  {member.status === 'Active' ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-wider border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                      <AlertTriangle className="w-3.5 h-3.5" /> {member.status}
                    </span>
                  )}
                </td>
                <td className="p-5 text-right">
                  {type === 'retention' ? (
                    <a 
                      href={`https://wa.me/${member.phone?.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${member.name}, we haven't seen you at the gym in a while! Let us know when you're planning to come back so we can help you stay on track with your fitness goals 💪`)}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-block px-5 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-sm font-bold rounded-xl border border-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
                    >
                      Send WhatsApp
                    </a>
                  ) : (
                    <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all border border-zinc-800 hover:border-zinc-700 hover:scale-105 active:scale-95">
                      View Profile
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-2 flex items-center gap-3">
            <QrCode className="w-8 h-8 text-rose-600" /> Live Attendance
          </h2>
          <p className="text-zinc-500 text-lg">Monitor real-time check-ins and analyze member retention.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-3 border-r border-zinc-900 pr-4">
           <button onClick={() => setActiveTab('live')} className={`flex items-center gap-3 w-full p-4 text-left rounded-2xl font-bold transition-all border ${activeTab === 'live' ? 'bg-zinc-900 text-white border-zinc-800' : 'hover:bg-zinc-950 text-zinc-500 border-transparent hover:border-zinc-800'}`}>
             <Users className={`w-5 h-5 ${activeTab === 'live' ? 'text-rose-500' : 'text-zinc-600'}`} /> Today's Feed
           </button>
           <button onClick={() => setActiveTab('history')} className={`flex items-center gap-3 w-full p-4 text-left rounded-2xl font-bold transition-all border ${activeTab === 'history' ? 'bg-zinc-900 text-white border-zinc-800' : 'hover:bg-zinc-950 text-zinc-500 border-transparent hover:border-zinc-800'}`}>
             <History className={`w-5 h-5 ${activeTab === 'history' ? 'text-rose-500' : 'text-zinc-600'}`} /> History & Reports
           </button>
           <div className="pt-4 mt-4 border-t border-zinc-900">
             <button onClick={() => setActiveTab('retention')} className={`flex items-center gap-3 w-full p-4 text-left rounded-2xl font-bold transition-all border ${activeTab === 'retention' ? 'bg-rose-900/10 text-rose-500 border-rose-900/30' : 'hover:bg-zinc-950 text-zinc-500 border-transparent hover:border-zinc-800'}`}>
               <AlertTriangle className={`w-5 h-5 ${activeTab === 'retention' ? 'text-rose-500' : 'text-zinc-600'}`} /> 10-Day Retention
             </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          {loading ? (
             <div className="flex h-[40vh] items-center justify-center">
               <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
             </div>
          ) : (
             <AnimatePresence mode="wait">
               {activeTab === 'live' && (
                 <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" /> Live Check-in Feed
                      </h3>
                      <div className="px-4 py-2 bg-zinc-900 rounded-xl font-bold text-sm text-zinc-400 border border-zinc-800">
                        Total Today: <span className="text-white text-lg ml-1">{todayFeed.length}</span>
                      </div>
                   </div>
                   {renderTable(todayFeed, 'attendance')}
                 </motion.div>
               )}

               {activeTab === 'history' && (
                 <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                      <h3 className="text-2xl font-black">Attendance History</h3>
                      <input 
                        type="date" 
                        value={historyDate}
                        onChange={(e) => setHistoryDate(e.target.value)}
                        className="bg-black border border-zinc-800 rounded-xl px-5 py-3 text-white focus:border-rose-600 outline-none transition-all font-mono"
                      />
                   </div>
                   {renderTable(historyFeed, 'attendance')}
                 </motion.div>
               )}

               {activeTab === 'retention' && (
                 <motion.div key="retention" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="mb-8">
                      <h3 className="text-2xl font-black text-rose-500 flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-6 h-6" /> Requires Attention
                      </h3>
                      <p className="text-zinc-500">Active members who have not checked in for the past 10 days. Call them to improve retention.</p>
                   </div>
                   {renderTable(retentionFeed, 'retention')}
                 </motion.div>
               )}
             </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
