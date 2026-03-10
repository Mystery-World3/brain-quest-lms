
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ClipboardList, Users, LogOut, GraduationCap, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('teacher_session');
    if (!session && !pathname.includes('login')) {
      router.push('/teacher/login');
    }
  }, [router, pathname]);

  if (pathname.includes('login')) return <>{children}</>;

  const navItems = [
    { name: 'Ringkasan', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Soal', path: '/teacher/quizzes', icon: ClipboardList },
    { name: 'Nilai Siswa', path: '/teacher/scores', icon: Users },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
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
      <div className="p-4 border-t space-y-4">
        <div className="flex items-center justify-between px-4">
          <span className="text-sm font-medium text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>
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
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-card border-r border-border hidden md:flex flex-col shadow-sm">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <NavContent />
              </SheetContent>
            </Sheet>
            <h2 className="font-bold text-lg hidden sm:block">
              {navItems.find(item => item.path === pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:block">
               <ThemeToggle />
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary">
                <Users size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Guru Aktif</span>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
