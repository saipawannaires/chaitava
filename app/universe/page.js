'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UniversePage() {
  const [scales, setScales] = useState([]);
  const [idx, setIdx] = useState(6);
  useEffect(() => { fetch('/api/universe').then(r => r.json()).then(d => setScales(d.scales || [])); }, []);

  if (scales.length === 0) return <div className="min-h-screen bg-[#0a0416]"><SiteNav/></div>;
  const s = scales[idx];

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ backgroundImage: 'url(https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=2000)', backgroundSize: 'cover', opacity: 0.25 }}/>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0a0416]/60 via-transparent to-[#0a0416]"/>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-indigo-500/20 border-indigo-300/30 text-indigo-100 uppercase tracking-[0.25em] text-[10px]">Universe Explorer</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Zoom out. See yourself.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">From the Planck length to the observable universe — forty orders of magnitude. Move the slider. Every step is a factor of ten.</p>
        </div>

        <Card className="bg-white/[0.03] border-white/10 relative overflow-hidden">
          <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br ${s.color} opacity-15 blur-3xl`}/>
          <CardContent className="p-10 relative">
            <div className="text-center">
              <div className={`inline-block text-6xl font-[Cormorant_Garamond,serif] bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>10<sup className="text-3xl">{s.power >= 0 ? s.power : `−${Math.abs(s.power)}`}</sup></div>
              <div className="text-slate-400 text-sm mt-1">meters</div>
              <h2 className="font-[Cormorant_Garamond,serif] text-4xl md:text-5xl text-white mt-4">{s.unit}</h2>
              <p className="text-slate-200 mt-4 max-w-2xl mx-auto leading-relaxed text-lg">{s.desc}</p>
            </div>

            <div className="mt-10">
              <input type="range" min={0} max={scales.length - 1} value={idx} onChange={e => setIdx(Number(e.target.value))} className="w-full accent-fuchsia-400"/>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Planck</span><span>You</span><span>Universe</span>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="text-purple-300 disabled:opacity-30 hover:text-white">← Zoom in</button>
              <div className="text-slate-500 text-sm">{idx + 1} / {scales.length}</div>
              <button disabled={idx === scales.length - 1} onClick={() => setIdx(idx + 1)} className="text-purple-300 disabled:opacity-30 hover:text-white">Zoom out →</button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-2 mt-6">{scales.map((sc, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`text-left p-3 rounded-lg border transition ${idx === i ? 'bg-white/[0.08] border-white/25' : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'}`}>
            <div className={`text-xs bg-gradient-to-r ${sc.color} bg-clip-text text-transparent`}>10^{sc.power} m</div>
            <div className="text-white text-sm">{sc.unit}</div>
          </button>
        ))}</div>
      </main>
    </div>
  );
}
