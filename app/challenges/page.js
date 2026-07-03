'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Check, RotateCcw, ChevronLeft } from 'lucide-react';

export default function ChallengesPage() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    fetch('/api/challenges').then(r => r.json()).then(d => setItems(d.challenges || []));
    try { const raw = localStorage.getItem('sanatana_challenges'); if (raw) setProgress(JSON.parse(raw)); } catch {}
  }, []);

  function toggle(cid, dayIdx) {
    const list = progress[cid] || [];
    const next = list.includes(dayIdx) ? list.filter(x => x !== dayIdx) : [...list, dayIdx];
    const p = { ...progress, [cid]: next };
    setProgress(p);
    try { localStorage.setItem('sanatana_challenges', JSON.stringify(p)); } catch {}
  }
  function reset(cid) {
    const p = { ...progress }; delete p[cid]; setProgress(p);
    try { localStorage.setItem('sanatana_challenges', JSON.stringify(p)); } catch {}
  }

  if (active) {
    const done = (progress[active.id] || []).length;
    return (
      <div className="min-h-screen bg-[#0a0416] text-slate-100">
        <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(217,70,239,0.25), transparent 60%)' }}/>
        <SiteNav />
        <main className="max-w-4xl mx-auto px-6 py-10">
          <button onClick={() => setActive(null)} className="text-slate-400 hover:text-white flex items-center gap-1 mb-6"><ChevronLeft size={16}/>All challenges</button>
          <Card className="bg-white/[0.03] border-white/10 relative overflow-hidden">
            <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br ${active.color} opacity-20 blur-3xl`}/>
            <CardContent className="p-8 relative">
              <Badge className={`bg-gradient-to-r ${active.color} border-0 text-white`}>{active.duration}-day challenge</Badge>
              <h1 className="font-[Cormorant_Garamond,serif] text-4xl md:text-5xl text-white mt-3">{active.name}</h1>
              <p className="text-purple-300 mt-2">{active.tagline}</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden"><div className={`h-full bg-gradient-to-r ${active.color}`} style={{ width: `${(done / active.days.length) * 100}%` }}/></div>
                <div className="text-white font-semibold">{done}/{active.days.length}</div>
                <Button size="sm" variant="outline" onClick={() => reset(active.id)} className="border-white/15 bg-transparent"><RotateCcw size={12} className="mr-1"/>Reset</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2 mt-6">{active.days.map((d, i) => {
            const isDone = (progress[active.id] || []).includes(i);
            return (
              <button key={i} onClick={() => toggle(active.id, i)} className={`w-full text-left flex gap-3 p-4 rounded-xl border transition ${isDone ? 'bg-emerald-500/10 border-emerald-400/40' : 'bg-white/[0.02] border-white/10 hover:border-white/25'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-2 ${isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-white/20 text-slate-500'}`}>{isDone ? <Check size={16}/> : i + 1}</div>
                <div className={`leading-relaxed ${isDone ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{d}</div>
              </button>
            );
          })}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(217,70,239,0.25), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-fuchsia-500/20 border-fuchsia-300/30 text-fuchsia-100 uppercase tracking-[0.25em] text-[10px]">Daily Challenges</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Small streaks. Big change.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Progress tracked locally on your device. Start small. Finish anyway.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">{items.map(c => {
          const done = (progress[c.id] || []).length;
          return (
            <button key={c.id} onClick={() => setActive(c)} className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/25 transition relative overflow-hidden">
              <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${c.color} opacity-25 blur-3xl group-hover:opacity-45 transition`}/>
              <div className="relative">
                <div className="flex items-center gap-2"><Flame className="text-orange-400" size={16}/><Badge className="bg-white/[0.05] border-white/10 text-slate-300">{c.duration} days</Badge></div>
                <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white mt-3">{c.name}</h3>
                <p className="text-purple-300 text-sm mt-1">{c.tagline}</p>
                <div className="mt-4"><div className="flex justify-between text-xs mb-1"><span className="text-slate-400">{done > 0 ? 'In progress' : 'Not started'}</span><span className="text-slate-400">{done}/{c.days.length}</span></div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className={`h-full bg-gradient-to-r ${c.color}`} style={{ width: `${(done / c.days.length) * 100}%` }}/></div></div>
              </div>
            </button>
          );
        })}</div>
      </main>
    </div>
  );
}
