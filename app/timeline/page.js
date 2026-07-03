'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';

export default function TimelinePage() {
  const [eras, setEras] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => { fetch('/api/timeline').then(r => r.json()).then(d => setEras(d.eras || [])); }, []);

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ backgroundImage: 'url(https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=2000)', backgroundSize: 'cover', opacity: 0.3 }}/>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0a0416] via-[#1a0a3a]/60 to-[#0a0416]"/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">Cosmic Timeline</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">From the Big Bang to this moment.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Thirteen point eight billion years of a single continuous story — in which you are one of the newest, strangest chapters.</p>
        </div>

        {eras.length === 0 ? <div className="flex justify-center"><Loader2 className="animate-spin text-purple-400" size={32}/></div> : (
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <div className="space-y-1 lg:sticky lg:top-24 self-start max-h-[70vh] overflow-y-auto pr-2">
              {eras.map((e, i) => (
                <button key={i} onClick={() => setActive(i)} className={`w-full text-left px-4 py-3 rounded-lg transition ${active === i ? 'bg-white/[0.08] border-l-2 border-purple-400' : 'hover:bg-white/[0.03] border-l-2 border-transparent'}`}>
                  <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${e.color} bg-clip-text text-transparent`}>{e.when}</div>
                  <div className="text-white font-[Cormorant_Garamond,serif] text-xl leading-tight">{e.era}</div>
                </button>
              ))}
            </div>
            <Card className="bg-white/[0.03] backdrop-blur border-white/10 relative overflow-hidden">
              <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br ${eras[active].color} opacity-20 blur-3xl`}/>
              <CardContent className="p-10 relative">
                <div className={`text-sm uppercase tracking-[0.3em] bg-gradient-to-r ${eras[active].color} bg-clip-text text-transparent`}>{eras[active].when}</div>
                <h2 className="font-[Cormorant_Garamond,serif] text-5xl text-white mt-2">{eras[active].era}</h2>
                <div className="mt-8 space-y-6">
                  <div><div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-widest mb-2"><Sparkles size={12}/>Scientific Picture</div><p className="text-slate-200 leading-relaxed text-lg">{eras[active].science}</p></div>
                  <div><div className="flex items-center gap-2 text-fuchsia-300 text-xs uppercase tracking-widest mb-2"><Sparkles size={12}/>Wisdom Reflection</div><p className="text-slate-200 leading-relaxed text-lg">{eras[active].wisdom}</p></div>
                </div>
                <div className="flex justify-between mt-10 pt-6 border-t border-white/5">
                  <button disabled={active === 0} onClick={() => setActive(active - 1)} className="text-purple-300 disabled:opacity-30 hover:text-white">← Earlier</button>
                  <div className="text-slate-500 text-sm">{active + 1} / {eras.length}</div>
                  <button disabled={active === eras.length - 1} onClick={() => setActive(active + 1)} className="text-purple-300 disabled:opacity-30 hover:text-white">Later →</button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
