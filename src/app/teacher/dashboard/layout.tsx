
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ClipboardList, Users, LogOut, GraduationCap } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('teacher_session');
    if (!session) {
      router.push('/teacher/login');
    }
  }, [router]);

  const navItems = [
    { name: 'Ringkasan', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Soal', path: '/teacher/quizzes', icon: ClipboardList },
    { name: 'Nilai Siswa', path: '/teacher/scores', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7F9]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg text-white">
            <GraduationCap size={20} />
          </div>
          <span className="font-headline font-bold text-lg text-primary">Guru Panel</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === item.path 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
              }`}>
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              localStorage.removeItem('teacher_session');
              router.push('/');
            }}
          >
            <LogOut className="mr-3" size={20} /> Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 md:hidden">
          <div className="flex items-center gap-2">
             <GraduationCap className="text-primary" />
             <span className="font-bold">Guru Panel</span>
          </div>
          <Button size="icon" variant="ghost"><Users /></Button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
