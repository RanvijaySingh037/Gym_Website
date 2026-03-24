'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MoreVertical, Edit, Trash2, Send, Loader2, X, Banknote, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', planType: 'Monthly' });
  const [submitting, setSubmitting] = useState(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({ amount: '', paymentMethod: 'Cash', sendReceipt: true, planType: 'Monthly' });
  const [paymentMember, setPaymentMember] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await api.getMembers();
      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        console.error('Invalid members data received:', data);
        setMembers([]);
      }
    } catch (err) {
      console.error('Failed to fetch members', err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingMemberId) {
        await api.updateMember(editingMemberId, formData);
      } else {
        await api.createMember(formData);
      }
      setIsModalOpen(false);
      setEditingMemberId(null);
      setFormData({ name: '', phone: '', planType: 'Monthly' });
      fetchMembers();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (member: any) => {
    setEditingMemberId(member._id || member.id);
    setFormData({ name: member.name, phone: member.phone, planType: member.planType || 'Monthly' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await api.deleteMember(id);
        fetchMembers();
      } catch (err) {
        console.error('Failed to delete member', err);
      }
    }
  };

  const handleResetDevice = async (id: string) => {
    if (confirm("Are you sure you want to completely reset this member's device hardware link? They will need to verify their new phone on next check-in.")) {
        try {
          await api.resetDevice(id);
          alert('Device link has been successfully reset.');
          fetchMembers();
        } catch(err) {
          console.error(err);
          alert('Failed to reset device link.');
        }
    }
  };

  const openPaymentModal = (member: any) => {
    setPaymentMember(member);
    let amount = '1500';
    if(member.planType === 'Quarterly') amount = '4000';
    if(member.planType === 'Annual') amount = '12000';
    setPaymentData({ amount, paymentMethod: 'Cash', sendReceipt: true, planType: member.planType || 'Monthly' });
    setIsPaymentModalOpen(true);
  };

  const getForecastedExpiry = () => {
    if (!paymentMember) return '';
    const currentExpiry = new Date(paymentMember.expiryDate);
    const today = new Date();
    let baseDate = currentExpiry > today ? currentExpiry : today;
    
    let duration = 1;
    if(paymentData.planType === 'Quarterly') duration = 3;
    if(paymentData.planType === 'Annual') duration = 12;

    const forecast = new Date(baseDate);
    forecast.setMonth(forecast.getMonth() + duration);
    return forecast.toLocaleDateString();
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    try {
      const result = await api.processPayment(paymentMember._id || paymentMember.id, paymentData);
      setIsPaymentModalOpen(false);
      fetchMembers();
      
      if (paymentData.sendReceipt && result.receiptUrl) {
        // Resolve receipt URL for production
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000';
        const finalReceiptUrl = result.receiptUrl.includes('localhost') && process.env.NEXT_PUBLIC_API_URL 
          ? `${baseUrl}/receipts/${result.receiptUrl.split('/').pop()}`
          : result.receiptUrl;

        const text = `Namaste ${result.member.name}!\n\nAapka payment ₹${paymentData.amount} successful raha.\nAapki membership ${new Date(result.member.expiryDate).toLocaleDateString()} tak valid hai.\n\nDownload Receipt: ${finalReceiptUrl}\n\nThank you for choosing GymOS Elite! Keep Training!`;
        window.open(`https://wa.me/91${result.member.phone}?text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (err) {
      console.error('Payment failed', err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleWhatsAppReminder = (member: any) => {
    const expiresDate = new Date(member.expiryDate).toLocaleDateString();
    const text = `Namaste ${member.name}, your GymOS membership expires on ${expiresDate}. Please renew to continue your journey!`;
    window.open(`https://wa.me/91${member.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:row items-center justify-between gap-6">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search members by name or phone..."
            className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 focus:border-rose-600 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => {
            setEditingMemberId(null);
            setFormData({ name: '', phone: '', planType: 'Monthly' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" /> ADD NEW MEMBER
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 uppercase text-xs font-bold tracking-widest">
                <th className="px-8 py-6">Member</th>
                <th className="px-8 py-6">Plan Details</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-12 w-48 bg-zinc-900 rounded-full" /></td>
                    <td className="px-8 py-6"><div className="h-10 w-32 bg-zinc-900 rounded-lg" /></td>
                    <td className="px-8 py-6"><div className="h-8 w-24 bg-zinc-900 rounded-full" /></td>
                    <td className="px-8 py-6"><div className="h-10 w-24 bg-zinc-900 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-zinc-500 font-medium italic">
                    No members found. Add your first member to get started!
                  </td>
                </tr>
              ) : members.map((member, index) => (
                <tr key={member._id || member.id || index} className="hover:bg-zinc-900/30 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold">{member.name[0]}</div>
                      <div>
                        <h4 className="font-bold text-lg">{member.name}</h4>
                        <p className="text-sm text-zinc-500">{member.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <span className="text-zinc-300 font-bold">{member.planType || member.plan}</span>
                      <p className="text-sm text-zinc-500">Expires: {member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : member.expires}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                      member.status === 'Active' ? 'bg-emerald-600/10 text-emerald-500' : 'bg-rose-600/10 text-rose-500'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openPaymentModal(member)}
                        className="p-3 bg-emerald-900/20 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-900/50"
                        title="Mark as Paid"
                      >
                        <Banknote className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleWhatsAppReminder(member)}
                        className="p-3 bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-xl transition-all"
                        title="Send Reminder"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(member)}
                        className="p-3 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all"
                        title="Edit Member"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleResetDevice(member._id || member.id)}
                        className="p-3 bg-zinc-900 border border-zinc-800 tracking-wider text-zinc-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/50 rounded-xl transition-all"
                        title="Reset Device Link"
                      >
                        <Smartphone className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(member._id || member.id)}
                        className="p-3 bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-xl transition-all"
                        title="Delete Member"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-w-md w-full relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">{editingMemberId ? 'Edit Member' : 'Add New Member'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-rose-600 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Phone Number</label>
                  <input 
                    type="tel" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-rose-600 outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Plan Type</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-rose-600 outline-none"
                    value={formData.planType}
                    onChange={(e) => setFormData({...formData, planType: e.target.value})}
                  >
                    <option value="Monthly">Monthly (1 Month)</option>
                    <option value="Quarterly">Quarterly (3 Months)</option>
                    <option value="Annual">Annual (12 Months)</option>
                  </select>
                </div>
                
                <button 
                  type="submit" disabled={submitting}
                  className="w-full py-4 mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {submitting ? 'SAVING...' : editingMemberId ? 'SAVE CHANGES' : 'ADD MEMBER'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-emerald-900/50 shadow-[0_0_50px_rgba(16,185,129,0.1)] rounded-3xl p-8 max-w-md w-full relative"
            >
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-black mb-1 flex items-center gap-3 text-emerald-500">
                <Banknote className="w-6 h-6" /> Payment & Renewal
              </h2>
              <p className="text-zinc-500 text-sm mb-6">Process payment for <strong>{paymentMember?.name}</strong></p>
              
              <div className="bg-emerald-900/10 p-4 rounded-2xl border border-emerald-900/20 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Forecasted Expiry</p>
                  <p className="text-emerald-400 font-bold text-lg">{getForecastedExpiry()}</p>
                </div>
                <div className="text-right">
                   <p className="text-zinc-500 text-xs">Based on current status</p>
                   <p className="text-zinc-300 text-sm">{paymentMember && new Date(paymentMember.expiryDate) > new Date() ? 'Adds to existing plan' : 'Starts from today'}</p>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2 font-bold uppercase tracking-wider">Plan Renewed For</label>
                  <select 
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                    value={paymentData.planType}
                    onChange={(e) => {
                       const planType = e.target.value;
                       let amount = '1500';
                       if(planType === 'Quarterly') amount = '4000';
                       if(planType === 'Annual') amount = '12000';
                       setPaymentData({...paymentData, planType, amount});
                    }}
                  >
                    <option value="Monthly">Monthly (1 Month)</option>
                    <option value="Quarterly">Quarterly (3 Months)</option>
                    <option value="Annual">Annual (12 Months)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2 font-bold uppercase tracking-wider">Amount Paid (₹)</label>
                  <input 
                    type="number" required
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white text-xl font-mono focus:border-emerald-500 outline-none transition-all"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2 font-bold uppercase tracking-wider">Payment Method</label>
                  <select 
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI (GPay/PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Card/POS">Credit / Debit Card (POS)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-emerald-900/10 rounded-2xl border border-emerald-900/30">
                  <div>
                    <p className="text-white font-bold text-sm">Send WhatsApp Digital Parcha</p>
                    <p className="text-zinc-500 text-xs">Instantly send PDF receipt</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={paymentData.sendReceipt}
                      onChange={(e) => setPaymentData({...paymentData, sendReceipt: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                
                <button 
                  type="submit" disabled={processingPayment}
                  className="w-full py-5 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {processingPayment ? 'Processing...' : 'CONFIRM PAYMENT'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

