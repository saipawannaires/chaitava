'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';

export default function KnowledgePage() {
  const [topics, setTopics] = useState([]);
  const [active, setActive] = useState(null);
  useEffect(() => { fetch('/api/knowledge').then(r => r.json()).then(d => setTopics(d.topics || [])); }, []);

  if (active) return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.3), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => setActive(null)} className="text-slate-400 hover:text-white flex items-center gap-1 mb-6"><ChevronLeft size={16}/>All topics</button>
        <div className="text-center mb-8">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">Ancient Knowledge</Badge>
          <h1 className={`font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 bg-gradient-to-r ${active.color} bg-clip-text text-transparent`}>{active.name}</h1>
          <p className="text-slate-300 mt-2 text-lg">{active.subtitle}</p>
          <p className="text-purple-300 mt-1 text-sm">{active.tagline}</p>
        </div>
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
          <p className="text-slate-200 leading-relaxed text-lg">{active.overview}</p>
        </CardContent></Card>

        {active.doshas && (<div className="mt-6 grid md:grid-cols-3 gap-4">{active.doshas.map(d => (
          <Card key={d.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden"><div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${d.color} opacity-25 blur-2xl`}/><CardContent className="p-5 relative">
            <div className={`text-2xl font-[Cormorant_Garamond,serif] bg-gradient-to-r ${d.color} bg-clip-text text-transparent`}>{d.name}</div>
            <p className="text-slate-200 mt-2">{d.desc}</p>
          </CardContent></Card>
        ))}</div>)}

        {active.pillars && <ListBlock title="Four Pillars of Health" items={active.pillars.map(p => `${p.name} — ${p.desc}`)} accent={active.color} />}
        {active.limbs && (<div className="mt-6"><h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white mb-4 text-center">The Eight Limbs</h3><div className="grid md:grid-cols-2 gap-3">{active.limbs.map(l => (
          <Card key={l.n} className="bg-white/[0.03] border-white/10"><CardContent className="p-4 flex gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${active.color} flex items-center justify-center font-[Cormorant_Garamond,serif] text-lg text-white shrink-0`}>{l.n}</div>
            <div><div className="text-white font-semibold">{l.name}</div><div className="text-slate-300 text-sm mt-1">{l.desc}</div></div>
          </CardContent></Card>
        ))}</div></div>)}

        {active.branches && (<div className="mt-6"><h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white mb-4 text-center">The Branches</h3><div className="grid md:grid-cols-2 gap-3">{active.branches.map(b => (
          <Card key={b.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-purple-300 font-semibold">{b.name}</div><p className="text-slate-300 text-sm mt-1">{b.desc}</p></CardContent></Card>
        ))}</div></div>)}

        {active.directions && (<div className="mt-6"><h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white mb-4 text-center">The Eight Directions</h3><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">{active.directions.map(d => (
          <Card key={d.dir} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-amber-300 font-semibold">{d.dir}</div><div className="text-slate-400 text-xs">{d.element}</div><p className="text-slate-200 text-sm mt-2">{d.use}</p></CardContent></Card>
        ))}</div></div>)}

        {active.principles && <ListBlock title="Core Principles" items={active.principles} accent={active.color} ordered />}
        {active.features && (<div className="mt-6"><h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white mb-4 text-center">Key Features</h3><div className="grid md:grid-cols-2 gap-3">{active.features.map(f => (
          <Card key={f.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-fuchsia-300 font-semibold">{f.name}</div><p className="text-slate-300 text-sm mt-1">{f.desc}</p></CardContent></Card>
        ))}</div></div>)}
        {active.keyWords && (<Card className="bg-white/[0.03] border-white/10 mt-6"><CardContent className="p-6"><h3 className="text-white font-semibold mb-3">Essential Words</h3><div className="grid md:grid-cols-2 gap-2">{active.keyWords.map(w => (
          <div key={w.word} className="flex gap-3 py-1"><span className="text-fuchsia-300 font-[Cormorant_Garamond,serif] text-lg shrink-0 w-24">{w.word}</span><span className="text-slate-300 text-sm">{w.meaning}</span></div>
        ))}</div></CardContent></Card>)}
        {active.patterns && (<div className="mt-6"><h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white mb-4 text-center">Recurring Patterns</h3><div className="grid md:grid-cols-2 gap-3">{active.patterns.map(p => (
          <Card key={p.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-cyan-300 font-semibold">{p.name}</div><p className="text-slate-300 text-sm mt-1">{p.desc}</p></CardContent></Card>
        ))}</div></div>)}
        {active.keyElements && (<div className="mt-6 grid md:grid-cols-2 gap-3">{active.keyElements.map(e => (
          <Card key={e.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-indigo-300 font-semibold">{e.name}</div><p className="text-slate-300 text-sm mt-1">{e.desc}</p></CardContent></Card>
        ))}</div>)}
        {active.lines && (<div className="mt-6 grid md:grid-cols-2 gap-3">{active.lines.map(l => (
          <Card key={l.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-rose-300 font-semibold">{l.name}</div><p className="text-slate-300 text-sm mt-1">{l.desc}</p></CardContent></Card>
        ))}</div>)}
        {active.parts && (<div className="mt-6 grid md:grid-cols-2 gap-3">{active.parts.map(p => (
          <Card key={p.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-amber-300 font-semibold">{p.name}</div><p className="text-slate-300 text-sm mt-1">{p.desc}</p></CardContent></Card>
        ))}</div>)}
        {active.styles && (<div className="mt-6 grid md:grid-cols-2 gap-3">{active.styles.map(s => (
          <Card key={s.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-amber-300 font-semibold">{s.name}</div><p className="text-slate-300 text-sm mt-1">{s.desc}</p></CardContent></Card>
        ))}</div>)}
        {active.evidence && <ListBlock title="Evidence & Honesty" items={active.evidence} accent="from-emerald-400 to-teal-500" />}
        {active.honest && (<Card className="bg-amber-500/10 border-amber-400/30 mt-6"><CardContent className="p-6"><div className="text-amber-200 font-semibold mb-2">Honest Note</div><p className="text-amber-100/90 leading-relaxed">{active.honest}</p></CardContent></Card>)}
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.3), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">Ancient Knowledge</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">The old sciences.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Ayurveda, Yoga, Vastu, Sanskrit, Sacred Geometry, Jyotisha — presented with honest evidence.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{topics.map(t => (
          <button key={t.id} onClick={() => setActive(t)} className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/25 transition relative overflow-hidden">
            <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${t.color} opacity-20 blur-3xl group-hover:opacity-40 transition`}/>
            <div className="relative">
              <h3 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>{t.name}</h3>
              <div className="text-slate-400 text-sm mt-1">{t.subtitle}</div>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">{t.tagline}</p>
              <div className="mt-3 text-purple-300 text-sm">Explore →</div>
            </div>
          </button>
        ))}</div>
      </main>
    </div>
  );
}

function ListBlock({ title, items, accent, ordered }) {
  return (
    <Card className="bg-white/[0.03] border-white/10 mt-6"><CardContent className="p-6">
      <h3 className={`font-semibold mb-3 bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>{title}</h3>
      <ol className="space-y-2">{items.map((it, i) => (
        <li key={i} className="flex gap-3 text-slate-200 leading-relaxed"><span className="text-purple-300 shrink-0">{ordered ? `${i+1}.` : '•'}</span><span>{it}</span></li>
      ))}</ol>
    </CardContent></Card>
  );
}
