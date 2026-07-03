'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play, X } from 'lucide-react';

export default function MusicPage() {
  const [tracks, setTracks] = useState([]);
  const [active, setActive] = useState(null);
  const [category, setCategory] = useState('All');
  useEffect(() => { fetch('/api/music').then(r => r.json()).then(d => setTracks(d.tracks || [])); }, []);

  const cats = ['All', ...Array.from(new Set(tracks.map(t => t.category)))];
  const filtered = category === 'All' ? tracks : tracks.filter(t => t.category === category);

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.25), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-amber-500/20 border-amber-300/30 text-amber-100 uppercase tracking-[0.25em] text-[10px]">Sacred Music</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">The oldest technology of the nervous system.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Mantras, chants, Tibetan bowls, Sufi qawwali, Gregorian song, forest sound, binaural frequencies. Play any track for meditation or focus.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-6">{cats.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-sm border ${category === c ? 'bg-amber-500/30 border-amber-300/50 text-white' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}>{c}</button>
        ))}</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map(t => (
          <button key={t.id} onClick={() => setActive(t)} className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-5 hover:border-white/25 transition relative overflow-hidden">
            <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${t.color} opacity-25 blur-2xl group-hover:opacity-45 transition`}/>
            <div className="relative">
              <Badge className="bg-white/[0.05] border-white/10 text-slate-300 text-[10px]">{t.category}</Badge>
              <div className="text-slate-400 text-xs mt-2">{t.tradition}</div>
              <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white mt-2 leading-tight">{t.title}</h3>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">{t.note}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-amber-300 text-sm"><Play size={12}/>Play</div>
            </div>
          </button>
        ))}</div>

        <Dialog open={!!active} onOpenChange={o => !o && setActive(null)}>
          <DialogContent className="max-w-3xl bg-[#0f0722] border-white/10 p-0 overflow-hidden">
            {active && (<>
              <button onClick={() => setActive(null)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"><X size={16}/></button>
              <div className="aspect-video w-full bg-black">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`} title={active.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen/>
              </div>
              <div className="p-5">
                <Badge className="bg-amber-500/20 border-amber-300/30 text-amber-100">{active.category}</Badge>
                <h2 className="font-[Cormorant_Garamond,serif] text-3xl text-white mt-2">{active.title}</h2>
                <div className="text-slate-400 text-sm mt-1">{active.tradition}</div>
                <p className="text-slate-200 mt-3">{active.note}</p>
              </div>
            </>)}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
