'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(res => {
        setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: 'Total Members', value: data.totalMembers.toString(), icon: Users, color: 'text-blue-500', trend: 'Active Directory' },
    { label: 'Revenue', value: data.revenueStr, icon: TrendingUp, color: 'text-emerald-500', trend: 'Estimated' },
    { label: 'Expiring Soon', value: data.expiringSoonCount.toString(), icon: AlertCircle, color: 'text-rose-500', trend: 'Next 7 days' },
    { label: 'Today\'s Attendance', value: data.todaysAttendance.toString(), icon: Calendar, color: 'text-amber-500', trend: 'Live count' },
  ] : [];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-rose-600/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-zinc-900 ${stat.color} group-hover:bg-rose-600/10 group-hover:text-rose-600 transition-all`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-3xl font-black mt-1 leading-none">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            Expiry Alerts
          </h3>
          <div className="space-y-4">
            {data?.expiryAlerts?.length > 0 ? (
              data.expiryAlerts.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg">
                      {member.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold">{member.name}</h4>
                      <p className="text-xs text-zinc-500">Expires: {new Date(member.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-rose-600/10 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-600 hover:text-white transition-all">
                    REMIND
                  </button>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 text-center py-8 italic">No expiring memberships this week.</div>
            )}
          </div>
        </div>

        <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Real-time Check-ins</h3>
          <div className="space-y-4">
            {data?.recentCheckins?.length > 0 ? (
               data.recentCheckins.map((checkin: any) => (
                 <div key={checkin.id} className="flex items-center gap-4 p-4 bg-zinc-900/30 rounded-xl">
                   {checkin.photo ? (
                      <img src={checkin.photo} alt={checkin.member} className="w-10 h-10 rounded-full object-cover" />
                   ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold">
                        {checkin.member[0]}
                      </div>
                   )}
                   <div className="flex-1">
                     <p className="font-bold text-sm">{checkin.member}</p>
                     <p className="text-xs text-zinc-500">Checked in</p>
                   </div>
                   <span className="text-xs font-bold text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full">{checkin.time}</span>
                 </div>
               ))
             ) : (
               <div className="h-64 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-900 rounded-2xl">
                  <Calendar className="w-10 h-10 mb-4 opacity-20" />
                  <p className="font-medium">Waiting for scans...</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
