'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function PathsPage() {
  const [paths, setPaths] = useState([]);
  useEffect(() => { fetch('/api/paths').then(r => r.json()).then(d => setPaths(d.paths || [])); }, []);
  if (paths.length === 0) return <div className="min-h-screen bg-[#0a0416]"><SiteNav/></div>;

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.25), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-500/20 border-emerald-300/30 text-emerald-100 uppercase tracking-[0.25em] text-[10px]">Learning Paths</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Choose your depth.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Beginner, intermediate, or advanced — a structured curriculum honed by generations of teachers.</p>
        </div>
        <Tabs defaultValue={paths[0]?.id} className="w-full">
          <TabsList className="bg-white/[0.03] border border-white/10 mx-auto flex justify-center h-auto flex-wrap">
            {paths.map(p => (<TabsTrigger key={p.id} value={p.id} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/60 data-[state=active]:to-teal-500/60 px-6 py-2.5">{p.name}</TabsTrigger>))}
          </TabsList>
          {paths.map(p => (
            <TabsContent key={p.id} value={p.id} className="mt-8">
              <div className="text-center mb-8">
                <h2 className={`font-[Cormorant_Garamond,serif] text-4xl bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>{p.name}</h2>
                <p className="text-slate-300 mt-1">{p.subtitle}</p>
                <div className="text-slate-500 text-sm mt-1">Duration: {p.duration}</div>
              </div>
              <div className="space-y-4">
                {p.weeks.map((w, i) => (
                  <Card key={i} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
                    <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${p.color} opacity-15 blur-2xl`}/>
                    <CardContent className="p-6 relative">
                      <div className={`font-[Cormorant_Garamond,serif] text-2xl bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>{w.title}</div>
                      <ul className="mt-3 space-y-2">{w.items.map((it, j) => (
                        <li key={j} className="flex gap-3 text-slate-200 leading-relaxed"><span className="text-emerald-300 mt-1">→</span><span>{it}</span></li>
                      ))}</ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
