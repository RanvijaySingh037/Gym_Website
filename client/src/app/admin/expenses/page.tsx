'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, IndianRupee, Filter, PieChart, Loader2, X } from 'lucide-react';
import { api } from '@/lib/api';

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Rent' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await api.getExpenses();
      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        console.error('Invalid expenses data received:', data);
        setExpenses([]);
      }
    } catch (err) {
      console.error('Failed to fetch expenses', err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createExpense({ ...formData, amount: Number(formData.amount) });
      setIsModalOpen(false);
      setFormData({ title: '', amount: '', category: 'Rent' });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const budgetLeft = Math.max(0, 100000 - totalSpent); // 1 Lakh assumed budget
  
  const categories = ['Rent', 'Salaries', 'Utilities', 'Maintenance', 'Equipment', 'Marketing', 'Other'];
  let breakdown = categories.map(cat => {
    const catSum = expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0);
    return {
      name: cat,
      value: totalSpent === 0 ? 0 : Math.round((catSum / totalSpent) * 100),
      color: cat === 'Rent' ? 'bg-rose-600' : 
             cat === 'Salaries' ? 'bg-zinc-400' : 
             cat === 'Utilities' ? 'bg-zinc-500' : 
             cat === 'Maintenance' ? 'bg-zinc-600' :
             cat === 'Equipment' ? 'bg-zinc-700' :
             cat === 'Marketing' ? 'bg-zinc-800' : 'bg-rose-900'
    };
  }).filter(cat => cat.value > 0).sort((a,b) => b.value - a.value);

  if (breakdown.length === 0) {
    breakdown = [{ name: 'No Data', value: 100, color: 'bg-zinc-900' }];
  }

  return (
    <div className="space-y-10">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-rose-600/10 rounded-2xl border border-rose-600/20">
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Spent</p>
               <h3 className="text-3xl font-black">₹{totalSpent.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800/50">
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Budget Left</p>
               <h3 className="text-3xl font-black text-zinc-400">₹{budgetLeft.toLocaleString('en-IN')}</h3>
            </div>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-rose-600 text-white font-bold rounded-2xl transition-all"
         >
            <Plus className="w-5 h-5 text-rose-600" /> ADD EXPENSE
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Expense List */}
         <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-4">
               <h4 className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Recent Transactions</h4>
               <Filter className="w-4 h-4 text-zinc-600 cursor-pointer" />
            </div>
            {loading ? (
               [1, 2, 3].map((i) => (
                  <div key={i} className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl animate-pulse flex justify-between">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900" />
                        <div className="space-y-2">
                           <div className="h-4 w-32 bg-zinc-900 rounded" />
                           <div className="h-3 w-24 bg-zinc-900 rounded" />
                        </div>
                     </div>
                     <div className="h-6 w-16 bg-zinc-900 rounded" />
                  </div>
               ))
            ) : expenses.length === 0 ? (
               <div className="p-12 text-center text-zinc-600 font-medium italic border-2 border-dashed border-zinc-900 rounded-2xl">
                  No expenses recorded yet.
               </div>
            ) : expenses.map((expense, index) => (
               <motion.div 
                  key={expense._id || expense.id || index}
                  whileHover={{ x: 5 }}
                  className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between group"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                        <IndianRupee className="w-6 h-6" />
                     </div>
                     <div>
                        <h5 className="font-bold">{expense.title}</h5>
                        <p className="text-xs text-zinc-500 font-medium uppercase">{expense.category} • {expense.date}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-xl font-black">₹{expense.amount.toLocaleString()}</p>
                  </div>
               </motion.div>
            ))}
         </div>

         {/* Category Breakdown (Mockup) */}
         <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl h-fit">
            <h4 className="font-bold mb-8 flex items-center gap-3">
               <PieChart className="w-5 h-5 text-rose-600" />
               Breakdown
            </h4>
            <div className="space-y-6">
               {breakdown.map((cat, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase">
                        <span className="text-zinc-500">{cat.name}</span>
                        <span>{cat.value}%</span>
                     </div>
                     <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
                     </div>
                  </div>
               ))}
            </div>
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
              
              <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>
              
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Title / Description</label>
                  <input 
                    type="text" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-rose-600 outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Amount (₹)</label>
                  <input 
                    type="number" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-rose-600 outline-none"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Category</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-rose-600 outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Rent">Rent</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <button 
                  type="submit" disabled={submitting}
                  className="w-full py-4 mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {submitting ? 'ADDING...' : 'ADD EXPENSE'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
