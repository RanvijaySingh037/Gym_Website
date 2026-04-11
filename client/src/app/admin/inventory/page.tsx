'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, ShoppingCart, Loader2, AlertTriangle, Box } from 'lucide-react';
import { api } from '@/lib/api';

export default function InventoryDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ itemName: '', stockLeft: '', price: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await api.getInventory();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createInventoryItem({ 
        itemName: formData.itemName, 
        stockLeft: parseInt(formData.stockLeft), 
        price: parseFloat(formData.price) 
      });
      setIsModalOpen(false);
      setFormData({ itemName: '', stockLeft: '', price: '' });
      fetchInventory();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSell = async (id: string, currentStock: number) => {
    if (currentStock <= 0) return;
    try {
      await api.sellInventoryItem(id, 1);
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-rose-600" /> Inventory / Stock
          </h2>
          <p className="text-zinc-500 text-lg">Track gym supplements, accessories and sell items directly.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 ? (
             <div className="col-span-full h-64 border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-zinc-600">
                <Box className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-medium font-bold text-lg">No items in inventory.</p>
                <p className="text-sm mt-1">Click the button above to add some!</p>
             </div>
          ) : items.map((item) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-zinc-950 border ${item.stockLeft <= 5 ? 'border-orange-500/50 hover:border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-zinc-900 hover:border-zinc-800'} rounded-3xl p-6 transition-all ring-1 ${item.stockLeft <= 0 ? 'ring-rose-500/50' : 'ring-transparent'}`}
            >
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-xl font-bold">{item.itemName}</h3>
                 <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${
                    item.stockLeft <= 0 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                    item.stockLeft <= 5 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                    'bg-zinc-900 text-zinc-500 border-zinc-800'
                 }`}>
                   {item.status}
                 </span>
              </div>
              
              <div className="flex items-end justify-between mb-8">
                 <div>
                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Stock Left</p>
                   <p className={`text-4xl font-black ${item.stockLeft <= 5 ? 'text-orange-500' : 'text-white'}`}>
                     {item.stockLeft}
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Price</p>
                   <p className="text-xl font-bold font-mono">₹{item.price}</p>
                 </div>
              </div>

              <button 
                disabled={item.stockLeft <= 0}
                onClick={() => handleSell(item._id, item.stockLeft)}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                  item.stockLeft <= 0 
                  ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed' 
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                }`}
              >
                <ShoppingCart className="w-5 h-5" /> 
                {item.stockLeft <= 0 ? 'Sold Out' : 'Sell 1 Unit'}
              </button>

            </motion.div>
          ))}
        </div>
      )}

      {/* Add New Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Add New Product</h3>
              
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Product Name</label>
                  <input type="text" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-600" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Initial Stock</label>
                    <input type="number" min="0" value={formData.stockLeft} onChange={e => setFormData({...formData, stockLeft: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-600 font-mono" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Price (₹)</label>
                    <input type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-600 font-mono" required />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 mt-8 border-t border-zinc-900">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex justify-center items-center">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
