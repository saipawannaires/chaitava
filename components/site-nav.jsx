'use client';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LINKS = [
  { href: '/questions', label: 'Questions' },
  { href: '/coach', label: 'Coach' },
  { href: '/practices', label: 'Practices' },
  { href: '/yajna', label: 'Yajna' },
  { href: '/knowledge', label: 'Ancient' },
  { href: '/paths', label: 'Paths' },
  { href: '/daily', label: 'Daily' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/meditate', label: 'Meditate' },
  { href: '/map', label: 'Map' },
  { href: '/universe', label: 'Universe' },
  { href: '/timeline', label: 'Cosmos' },
  { href: '/books', label: 'Books' },
  { href: '/music', label: 'Music' },
  { href: '/journal', label: 'Journal' },
  { href: '/community', label: 'Community' },
];

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0416]/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-amber-400 flex items-center justify-center"><Sparkles size={16} className="text-white"/></div>
          <div className="font-[Cormorant_Garamond,serif] text-2xl tracking-wide text-white">Sanatana</div>
        </Link>
        <div className="hidden lg:flex gap-5 text-sm text-slate-300 overflow-x-auto">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white whitespace-nowrap">{l.label}</Link>
          ))}
        </div>
        <Link href="/#guru"><Button size="sm" className="bg-gradient-to-r from-purple-500 to-fuchsia-500 shrink-0">Ask AI <ArrowRight size={14} className="ml-1"/></Button></Link>
      </div>
    </nav>
  );
}
