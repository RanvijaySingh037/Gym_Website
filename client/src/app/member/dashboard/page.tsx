'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { User, Activity, Flame, LogOut, Loader2, Plus } from 'lucide-react';

import { api } from '@/lib/api';

export default function MemberDashboard() {
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      router.push('/member/login');
      return;
    }

    api.getMemberProfile(memberId)
      .then(data => {
        if (data.message) {
          router.push('/member/login');
        } else {
          setMember(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    setUpdating(true);
    try {
      const date = new Date().toISOString().split('T')[0];
      const data = await api.updateMemberProgress(member._id, { date, weight: parseFloat(newWeight) });
      setMember({ ...member, progressHistory: data.progressHistory });
      setNewWeight('');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('memberId');
    router.push('/member/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center font-bold text-rose-500 border border-zinc-800">
              {member.memberPhoto ? <img src={member.memberPhoto} className="w-full h-full object-cover"/> : member.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold leading-tight">{member.name}</p>
              <p className="text-xs text-emerald-500 font-mono tracking-widest uppercase">{member.status}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900 rounded-full">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-6">
        
        {/* QR Code Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 blur-3xl rounded-full"></div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Your Access Pass</h2>
          <div className="bg-white p-4 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-all">
            <QRCode value={member.qrCodeString || member.phone} size={200} bgColor="#ffffff" fgColor="#000000" />
          </div>
          <p className="mt-6 text-sm text-zinc-500 font-medium">Scan this code at the reception to check-in.</p>
        </motion.div>

        {/* Plans Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Workout Plan</h3>
            </div>
            <div className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed h-32 overflow-y-auto pr-2 custom-scrollbar">
              {member.workoutPlan || "No workout plan assigned yet. Ask your trainer!"}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Diet Plan</h3>
            </div>
            <div className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed h-32 overflow-y-auto pr-2 custom-scrollbar">
              {member.dietPlan || "No diet plan assigned yet. Ask your nutritionist!"}
            </div>
          </motion.div>
        </div>

        {/* Progress Tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6">
          <h3 className="text-xl font-bold mb-6">Progress Tracker</h3>
          
          <form onSubmit={handleUpdateProgress} className="flex gap-4 mb-8">
            <input 
              type="number" 
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Latest Weight (kg)" 
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-rose-600 transition-colors font-mono"
            />
            <button 
              disabled={updating || !newWeight}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-2"
            >
              {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5"/> Log</>}
            </button>
          </form>

          <div className="space-y-3">
            {member.progressHistory && member.progressHistory.length > 0 ? (
              [...member.progressHistory].reverse().map((entry: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <span className="text-zinc-500 font-mono text-sm">{entry.date}</span>
                  <span className="font-bold text-rose-500 text-lg">{entry.weight} kg</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center italic py-4">No progress logged yet. Start today!</p>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
