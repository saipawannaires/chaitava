'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

export default function YajnaPage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/yajna').then(r => r.json()).then(setData); }, []);
  if (!data) return <div className="min-h-screen bg-[#0a0416]"><SiteNav/></div>;

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(249,115,22,0.25), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-orange-500/20 border-orange-300/30 text-orange-100 uppercase tracking-[0.25em] text-[10px]"><Flame size={12} className="inline mr-1"/>Fire Ritual</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">{data.name}</h1>
          <p className="text-orange-300 mt-2">{data.subtitle}</p>
        </div>

        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
          <p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p>
        </CardContent></Card>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
            <h3 className="font-semibold text-orange-300 mb-3">Types of Fire Ritual</h3>
            <div className="space-y-3">{data.types.map(t => (
              <div key={t.name}><div className="text-white font-semibold">{t.name}</div><p className="text-slate-300 text-sm mt-1">{t.desc}</p></div>
            ))}</div>
          </CardContent></Card>
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
            <h3 className="font-semibold text-amber-300 mb-3">Procedure (simplified)</h3>
            <ol className="space-y-2">{data.procedure.map((p, i) => (
              <li key={i} className="flex gap-3 text-slate-200 leading-relaxed"><span className="text-amber-300 shrink-0">{i + 1}.</span><span>{p}</span></li>
            ))}</ol>
          </CardContent></Card>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
            <h3 className="font-semibold text-cyan-300 mb-3">The Science</h3>
            <ul className="space-y-2">{data.science.map((s, i) => (
              <li key={i} className="flex gap-3 text-slate-200 leading-relaxed"><span className="text-cyan-300">•</span><span>{s}</span></li>
            ))}</ul>
          </CardContent></Card>
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
            <h3 className="font-semibold text-fuchsia-300 mb-3">Benefits</h3>
            <ul className="space-y-2">{data.benefits.map((s, i) => (
              <li key={i} className="flex gap-3 text-slate-200 leading-relaxed"><span className="text-fuchsia-300">•</span><span>{s}</span></li>
            ))}</ul>
          </CardContent></Card>
        </div>
      </main>
    </div>
  );
}
