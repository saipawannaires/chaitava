'use client';
import { useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Network, Sparkles, ArrowRight } from 'lucide-react';

const CAT_COLORS = {
  science: 'from-cyan-400 to-blue-500',
  spirit: 'from-fuchsia-400 to-purple-500',
  philosophy: 'from-amber-400 to-orange-500',
  history: 'from-emerald-400 to-teal-500',
  practice: 'from-pink-400 to-rose-500',
};

const SEEDS = ['Breathing', 'Consciousness', 'Suffering', 'Love', 'Time', 'Death', 'Silence', 'Fire', 'Water'];

export default function ConnectedPage() {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function explore(t) {
    const term = (t || topic).trim();
    if (!term) return;
    setTopic(term); setLoading(true); setData(null);
    try {
      const res = await fetch('/api/connected', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ topic: term }) });
      const d = await res.json();
      setData(d);
      setHistory(h => [term, ...h.filter(x => x !== term)].slice(0, 10));
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(217,70,239,0.3), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-fuchsia-500/20 border-fuchsia-300/30 text-fuchsia-100 uppercase tracking-[0.25em] text-[10px]">Everything is Connected</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">One thread. All of it.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Type any concept — breathing, karma, time. Watch it unfold into science, spirit, philosophy, history, and practice. Click any node to keep pulling the thread.</p>
        </div>

        <Card className="bg-white/[0.04] border-white/10 backdrop-blur max-w-3xl mx-auto"><CardContent className="p-4">
          <div className="flex gap-2">
            <Input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && explore()} placeholder="Try: consciousness, karma, breathing, silence…" className="bg-transparent border-white/10 text-lg"/>
            <Button onClick={() => explore()} disabled={loading} className="bg-gradient-to-r from-fuchsia-500 to-purple-500">{loading ? <Loader2 size={16} className="animate-spin"/> : <><Sparkles size={14} className="mr-1"/>Explore</>}</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">{SEEDS.map(s => (
            <button key={s} onClick={() => explore(s)} className="text-xs px-3 py-1 rounded-full border border-white/10 text-slate-300 hover:bg-white/5">{s}</button>
          ))}</div>
          {history.length > 0 && (<div className="flex flex-wrap gap-1 mt-3 items-center text-xs text-slate-400"><span>Trail:</span>{history.map((h, i) => (<span key={i}>{h}{i < history.length - 1 && ' →'}</span>))}</div>)}
        </CardContent></Card>

        {data && (
          <div className="mt-10 relative">
            <div className="text-center mb-8">
              <div className="text-slate-400 text-xs uppercase tracking-widest">Center</div>
              <div className="font-[Cormorant_Garamond,serif] text-5xl text-white mt-2">{data.topic}</div>
              {data.summary && <p className="text-slate-300 mt-3 max-w-2xl mx-auto">{data.summary}</p>}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.nodes?.map((n, i) => (
                <button key={i} onClick={() => explore(n.name)} className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/25 transition relative overflow-hidden">
                  <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${CAT_COLORS[n.category] || 'from-slate-400 to-slate-600'} opacity-20 blur-2xl`}/>
                  <Badge className={`bg-gradient-to-r ${CAT_COLORS[n.category] || 'from-slate-500 to-slate-600'} border-0 text-white text-[10px] uppercase tracking-wider`}>{n.category}</Badge>
                  <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white mt-2">{n.name}</h3>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">{n.why}</p>
                  <div className="text-purple-300 text-xs mt-3 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">Follow the thread <ArrowRight size={12}/></div>
                </button>
              ))}
            </div>
          </div>
        )}
        {loading && !data && <div className="text-center py-16"><Loader2 className="animate-spin text-fuchsia-400 mx-auto" size={32}/><div className="text-slate-400 mt-3">Weaving connections…</div></div>}
      </main>
    </div>
  );
}
