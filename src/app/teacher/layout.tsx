"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ClipboardList, Users, LogOut, GraduationCap, Menu, School } from 'lucide-react';
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
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Kelas', path: '/teacher/classes', icon: School },
    { name: 'Manajemen Soal', path: '/teacher/quizzes', icon: ClipboardList },
    { name: 'Nilai Siswa', path: '/teacher/scores', icon: Users },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border/50">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg shadow-primary/20">
          <GraduationCap size={24} />
        </div>
        <span className="font-headline font-black text-xl text-primary tracking-tighter uppercase">BrainQuest</span>
      </div>
      
      <div className="flex-1 px-4 space-y-2 py-6 overflow-y-auto">
        <p className="px-5 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Navigasi Utama</p>
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 cursor-pointer ${
              pathname === item.path 
                ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' 
                : 'text-muted-foreground hover:bg-primary/10 hover:text-primary font-bold'
            }`}>
              <item.icon size={22} className={pathname === item.path ? "animate-pulse" : ""} />
              <span className="font-bold text-lg">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-6 mt-auto">
        <div className="bg-muted/30 rounded-[2rem] p-4 border border-border/50 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tampilan</span>
            <ThemeToggle />
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-14 rounded-2xl font-black text-lg transition-all"
            onClick={() => {
              localStorage.removeItem('teacher_session');
              router.push('/');
            }}
          >
            <LogOut className="mr-4" size={24} /> Keluar
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-80 hidden md:flex flex-col z-20 shadow-2xl">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={28} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 border-r-4 border-primary/20">
                <NavContent />
              </SheetContent>
            </Sheet>
            <h2 className="font-black text-xl md:text-2xl text-foreground tracking-tight truncate max-w-[200px] sm:max-w-none">
              {navItems.find(item => item.path === pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-4 md:px-5 py-2 md:py-2.5 bg-primary/10 rounded-xl md:rounded-2xl text-primary ring-2 ring-primary/5 shadow-inner">
                <Users size={18} className="md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] hidden sm:inline">Guru Aktif</span>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-10 bg-muted/20">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
