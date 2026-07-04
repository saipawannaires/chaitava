'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Compass, User } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Home', icon: Home, match: (p) => p === '/' },
  { href: '/discover', label: 'Universe', icon: Compass, match: (p) => p === '/discover' || p.startsWith('/universe') || p.startsWith('/explore') || p.startsWith('/timeline') || p.startsWith('/map') || p.startsWith('/cosmos') || p.startsWith('/ancient') || p.startsWith('/awakening') || p.startsWith('/body') || p.startsWith('/knowledge') || p.startsWith('/connected') },
  { href: '/ai', label: 'AI', icon: Sparkles, match: (p) => p === '/ai' || p.startsWith('/coach') || p.startsWith('/masters') || p.startsWith('/questions') },
  { href: '/journey', label: 'Journey', icon: User, match: (p) => p === '/journey' || p.startsWith('/meditate') || p.startsWith('/practices') || p.startsWith('/journal') || p.startsWith('/daily') || p.startsWith('/challenges') || p.startsWith('/paths') || p.startsWith('/community') || p.startsWith('/books') || p.startsWith('/music') },
];

export default function SiteNav() {
  const path = usePathname() || '/';
  return (
    <nav className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="glass-strong rounded-full px-4 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] via-fuchsia-400 to-purple-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-black font-serif text-lg leading-none">✵</span>
            </div>
            <div className="font-serif text-[19px] tracking-tight text-white">Chaitava</div>
          </Link>
          <div className="flex items-center gap-1">
            {TABS.map(t => {
              const active = t.match(path);
              const Icon = t.icon;
              return (
                <Link key={t.href} href={t.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm transition-all ${active ? 'bg-white text-black' : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'}`}>
                  <Icon size={14}/> <span>{t.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
