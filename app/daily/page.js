'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun } from 'lucide-react';

export default function DailyPage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/daily-practices').then(r => r.json()).then(setData); }, []);
  if (!data) return <div className="min-h-screen bg-[#0a0416]"><SiteNav/></div>;

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.2), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-amber-500/20 border-amber-300/30 text-amber-100 uppercase tracking-[0.25em] text-[10px]">Daily Rhythm</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Live one good day, on repeat.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">{data.intro}</p>
        </div>
        <div className="space-y-6">
          {data.segments.map((s, i) => (
            <Card key={i} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
              <div className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-b ${s.color}`}/>
              <div className={`absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br ${s.color} opacity-15 blur-3xl`}/>
              <CardContent className="p-6 relative pl-8">
                <div className="flex items-center gap-2 text-amber-200/80 text-xs uppercase tracking-[0.25em]"><Sun size={12}/>Time window</div>
                <h3 className={`font-[Cormorant_Garamond,serif] text-3xl mt-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.time}</h3>
                <div className="mt-4 space-y-3">{s.practices.map((p, j) => (
                  <div key={j} className="pl-1">
                    <div className="text-white font-semibold">{p.name}</div>
                    <p className="text-slate-300 leading-relaxed text-sm mt-1">{p.desc}</p>
                  </div>
                ))}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
