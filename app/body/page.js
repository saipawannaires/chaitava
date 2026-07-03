'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BodyPage() {
  const [parts, setParts] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => { fetch('/api/body-map').then(r => r.json()).then(d => setParts(d.parts || [])); }, []);

  if (parts.length === 0) return <div className="min-h-screen bg-[#0a0416]"><SiteNav/></div>;
  const p = parts[active];

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.2), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-emerald-500/20 border-emerald-300/30 text-emerald-100 uppercase tracking-[0.25em] text-[10px]">Human Body · Spirit</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">The map is inside the body.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Where the ancient chakras meet the modern nervous system. Click any point to see both views.</p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          <div className="flex justify-center">
            <div className="relative w-64 h-[600px] rounded-full bg-gradient-to-b from-purple-900/30 via-fuchsia-900/20 to-blue-900/30 border border-white/10">
              {parts.map((pp, i) => {
                const top = 6 + i * 11.5;
                return (
                  <button key={i} onClick={() => setActive(i)} className="absolute left-1/2 -translate-x-1/2" style={{ top: `${top}%` }}>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${pp.color} ${active === i ? 'ring-4 ring-white/40 scale-125' : 'opacity-80 hover:opacity-100'} transition flex items-center justify-center text-white text-xs font-bold shadow-xl`}>{i + 1}</div>
                    <div className={`absolute left-14 top-1.5 whitespace-nowrap text-xs ${active === i ? 'text-white' : 'text-slate-400'}`}>{pp.part}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="bg-white/[0.03] border-white/10 h-fit sticky top-24"><CardContent className="p-8">
            <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>Point {active + 1}</div>
            <h2 className="font-[Cormorant_Garamond,serif] text-4xl text-white mt-2">{p.part}</h2>
            <div className="mt-6 space-y-5">
              <div><div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">Scientific View</div><p className="text-slate-200 leading-relaxed">{p.science}</p></div>
              <div><div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-2">Spiritual View</div><p className="text-slate-200 leading-relaxed">{p.spirit}</p></div>
            </div>
          </CardContent></Card>
        </div>
      </main>
    </div>
  );
}
