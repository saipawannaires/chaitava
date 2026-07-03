'use client';
import { useEffect, useMemo, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, MapPin } from 'lucide-react';

const REGIONS = ['All', 'Asia', 'Middle East', 'Europe', 'Americas', 'Africa', 'Oceania'];

export default function MapPage() {
  const [temples, setTemples] = useState([]);
  const [region, setRegion] = useState('All');
  const [active, setActive] = useState(null);

  useEffect(() => { fetch('/api/temples').then(r => r.json()).then(d => setTemples(d.temples || [])); }, []);

  const filtered = useMemo(() => region === 'All' ? temples : temples.filter(t => t.region === region), [temples, region]);

  // world map: convert lat/lng to percent (equirectangular)
  const pin = (lat, lng) => ({ left: `${((lng + 180) / 360) * 100}%`, top: `${((90 - lat) / 180) * 100}%` });

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(6,182,212,0.2), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-cyan-500/20 border-cyan-300/30 text-cyan-100 uppercase tracking-[0.25em] text-[10px]">World Sacred Sites</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Every continent holds a threshold.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Twenty-seven sacred sites across six continents and ten traditions. Click any pin to enter.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)} className={`px-3 py-1.5 rounded-full text-sm border ${region === r ? 'bg-purple-500/30 border-purple-300/50 text-white' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}>{r}</button>
          ))}
        </div>

        {/* Simple world map */}
        <Card className="bg-white/[0.02] border-white/10 overflow-hidden">
          <div className="relative w-full" style={{ paddingTop: '50%' }}>
            <div className="absolute inset-0" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg)', backgroundSize: 'cover', opacity: 0.35, filter: 'hue-rotate(220deg) saturate(0.6)' }}/>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0416]/50 via-transparent to-[#0a0416]/60"/>
            {filtered.map((t, i) => (
              <button key={i} onClick={() => setActive(t)} className="absolute -translate-x-1/2 -translate-y-1/2 group z-10" style={pin(t.lat, t.lng)}>
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-300 to-fuchsia-500 shadow-lg shadow-fuchsia-500/50 group-hover:scale-150 transition ring-2 ring-white/40"/>
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-fuchsia-500/40 blur-md animate-pulse"/>
                  <div className="absolute left-4 top-0 whitespace-nowrap text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">{t.name}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {filtered.map((t, i) => (
            <button key={i} onClick={() => setActive(t)} className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/25 transition">
              <div className="h-40 relative" style={{ backgroundImage: `url(${t.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0416] via-[#0a0416]/40 to-transparent"/>
                <Badge className="absolute top-3 right-3 bg-black/40 border-white/20 text-slate-200">{t.tradition}</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white">{t.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-sm mt-1"><MapPin size={12}/>{t.country} · {t.region}</div>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed line-clamp-3">{t.note}</p>
              </div>
            </button>
          ))}
        </div>

        <Dialog open={!!active} onOpenChange={o => !o && setActive(null)}>
          <DialogContent className="max-w-2xl bg-[#0f0722] border-white/10 p-0 overflow-hidden">
            {active && (<>
              <div className="h-64 relative" style={{ backgroundImage: `url(${active.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0722] via-[#0f0722]/30 to-transparent"/>
                <button onClick={() => setActive(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"><X size={16}/></button>
              </div>
              <div className="p-6">
                <Badge className="bg-cyan-500/20 border-cyan-300/30 text-cyan-100">{active.tradition}</Badge>
                <h2 className="font-[Cormorant_Garamond,serif] text-4xl text-white mt-3">{active.name}</h2>
                <div className="flex items-center gap-1 text-slate-400 text-sm mt-1"><MapPin size={12}/>{active.country} · {active.lat.toFixed(2)}, {active.lng.toFixed(2)}</div>
                <p className="text-slate-200 mt-4 leading-relaxed">{active.note}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lng}`} target="_blank" rel="noopener" className="inline-block mt-4 text-purple-300 hover:text-white text-sm">Open in maps →</a>
              </div>
            </>)}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
