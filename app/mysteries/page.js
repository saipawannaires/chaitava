'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MysteriesPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch('/api/mysteries').then(r => r.json()).then(d => setItems(d.mysteries || [])); }, []);

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.25), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-violet-500/20 border-violet-300/30 text-violet-100 uppercase tracking-[0.25em] text-[10px]">Mysteries of the World</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Where the map ends.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Six genuine unresolved questions, presented with the boundary between established fact and hypothesis clearly drawn.</p>
        </div>
        <div className="space-y-5">{items.map((m, i) => (
          <Card key={i} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
            <div className={`absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br ${m.color} opacity-15 blur-3xl`}/>
            <CardContent className="p-6 relative">
              <h2 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>{m.name}</h2>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div><div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">Established facts</div><p className="text-slate-200 leading-relaxed">{m.facts}</p></div>
                <div><div className="text-amber-300 text-xs uppercase tracking-widest mb-2">Hypotheses & debate</div><p className="text-slate-200 leading-relaxed">{m.hypotheses}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}</div>
      </main>
    </div>
  );
}
