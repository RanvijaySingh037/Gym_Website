'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Search, Users, Loader2, SendHorizontal, Filter, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

export default function MarketingBroadcast() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('All Active Members');
  const [message, setMessage] = useState('Chhath Puja ki shubhkamnaye! Gym kal 4 PM tak khula rahega. Keep Training! 💪');
  
  const [queueIndex, setQueueIndex] = useState(-1);
  const [broadcastActive, setBroadcastActive] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await api.getMembers();
      if (Array.isArray(data)) setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMembers = () => {
    const today = new Date();
    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);

    return members.filter(m => {
      const expiry = new Date(m.expiryDate);
      if (filterType === 'All Active Members') return m.status === 'Active';
      if (filterType === 'Expired Members') return expiry < today;
      if (filterType === 'Due in 7 Days') return expiry >= today && expiry <= next7Days;
      return true;
    });
  };

  const filteredMembers = getFilteredMembers();

  const handleStartBroadcast = () => {
    if (filteredMembers.length === 0) return alert('No members in the list!');
    if (!message.trim()) return alert('Please enter a message to send.');
    setQueueIndex(0);
    setBroadcastActive(true);
  };

  const handleSendNext = () => {
    if (queueIndex >= filteredMembers.length) return;
    
    // Send message via window.open
    const currentMember = filteredMembers[queueIndex];
    
    // Personalize the message for the current member
    const personalizedMessage = `Namaste ${currentMember.name},\n\n${message}`;
    window.open(`https://wa.me/91${currentMember.phone}?text=${encodeURIComponent(personalizedMessage)}`, '_blank');
    
    // Advance queue
    if (queueIndex + 1 >= filteredMembers.length) {
      setBroadcastActive(false);
      setQueueIndex(-1); // Finished
    } else {
      setQueueIndex(queueIndex + 1);
    }
  };

  const handleStopBroadcast = () => {
    setBroadcastActive(false);
    setQueueIndex(-1);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h2 className="text-4xl font-black uppercase tracking-tight mb-2 flex items-center gap-3">
          <Megaphone className="w-10 h-10 text-rose-600" /> Marketing & Broadcast
        </h2>
        <p className="text-zinc-500 text-lg">Send targeted WhatsApp blasts to your members safely and efficiently.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Creator & Queue Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Filter className="w-5 h-5 text-rose-500" /> Audience Filter</h3>
            
            <select 
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none transition-all appearance-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              disabled={broadcastActive}
            >
              <option value="All Active Members">All Active Members</option>
              <option value="Due in 7 Days">Due in 7 Days</option>
              <option value="Expired Members">Expired Members</option>
            </select>
            <p className="text-zinc-500 text-sm mt-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> <strong>{filteredMembers.length} targeted members</strong>
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Message Template</h3>
            <p className="text-xs text-zinc-500 mb-4">* The prefix "Namaste [Name]," will be generated automatically.</p>
            <textarea 
              rows={6}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none transition-all resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={broadcastActive}
              placeholder="Type your broadcast message here..."
            />
          </div>

          {!broadcastActive ? (
            <button 
              onClick={handleStartBroadcast}
              className="w-full py-5 bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-black uppercase tracking-widest rounded-3xl shadow-[0_0_30px_rgba(225,29,72,0.15)] transition-all"
            >
              START BROADCAST
            </button>
          ) : (
            <div className="bg-rose-950/20 border border-rose-900/50 rounded-3xl p-6 text-center space-y-4">
               <div className="animate-pulse flex justify-center mb-2">
                 <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
               </div>
               <p className="text-rose-500 font-bold uppercase tracking-widest text-sm">Broadcast Active</p>
               <h4 className="text-2xl font-black text-white">Sending {queueIndex + 1} of {filteredMembers.length}</h4>
               
               <button 
                 onClick={handleSendNext}
                 className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
               >
                 <SendHorizontal className="w-6 h-6" /> SEND TO NEXT
               </button>
               
               <button 
                 onClick={handleStopBroadcast}
                 className="mt-2 text-zinc-500 hover:text-white text-sm font-bold uppercase tracking-widest"
               >
                 Cancel Broadcast
               </button>
            </div>
          )}
        </div>

        {/* Right Column: Queue Preview Table */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <h3 className="font-bold text-lg">Broadcast Queue Preview</h3>
              {broadcastActive && <span className="px-3 py-1 bg-rose-500/20 text-rose-500 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> IN PROGRESS</span>}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-zinc-500">
                <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
                <p>No members match the selected filter.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-widest font-bold bg-black/50">
                    <th className="px-8 py-4">#</th>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4 text-right">Status in Queue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredMembers.map((member, i) => {
                    const isActive = i === queueIndex;
                    const isSent = broadcastActive && i < queueIndex;
                    const isPending = !broadcastActive || i > queueIndex;
                    
                    return (
                      <tr key={member._id} className={`${isActive ? 'bg-rose-900/10' : ''} transition-all`}>
                        <td className="px-8 py-4 text-zinc-500 font-mono">{i + 1}</td>
                        <td className="px-8 py-4">
                          <p className={`font-bold ${isActive ? 'text-rose-400' : 'text-zinc-200'}`}>{member.name}</p>
                          <p className="text-zinc-500 text-xs font-mono">{member.phone}</p>
                        </td>
                        <td className="px-8 py-4 text-right">
                          {isSent ? (
                            <span className="text-emerald-500 font-bold text-sm">SENT ✓</span>
                          ) : isActive ? (
                            <span className="text-rose-500 font-bold text-sm flex items-center justify-end gap-2">
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> SENDING...
                            </span>
                          ) : (
                            <span className="text-zinc-500 font-medium text-sm">Waiting</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
