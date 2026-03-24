'use client';

import Sidebar from '@/components/admin/Sidebar';
import SocketAlerts from '@/components/admin/SocketAlerts';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Admin Panel</h2>
            <p className="text-zinc-500 font-medium">Manage your gym ecosystem with precision.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-rose-600">
              A
            </div>
          </div>
        </header>
        {children}
      </main>
      <SocketAlerts />
    </div>
  );
}
