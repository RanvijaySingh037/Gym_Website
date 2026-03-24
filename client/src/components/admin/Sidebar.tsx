'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  Settings, 
  LogOut,
  IndianRupee,
  Megaphone 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Members', href: '/admin/members' },
  { icon: QrCode, label: 'Attendance', href: '/admin/attendance' },
  { icon: IndianRupee, label: 'Expenses', href: '/admin/expenses' },
  { icon: Megaphone, label: 'Marketing', href: '/admin/marketing' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Routing to home page as temporary logout
    router.push('/');
  };

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col fixed inset-y-0 left-0 z-50">
      <div className="p-8 border-b border-zinc-900">
        <h1 className="text-2xl font-black tracking-tighter text-rose-600">GYMOS<span className="text-white">PRO</span></h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              pathname === item.href 
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-900">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-rose-500 hover:bg-rose-600/5 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
