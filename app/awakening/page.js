'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, Zap, Leaf } from 'lucide-react';

export default function AwakeningPage() {
  const [chakras, setChakras] = useState([]);
  const [cosmos, setCosmos] = useState(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    fetch('/api/chakras').then(r => r.json()).then(d => setChakras(d.chakras || []));
    fetch('/api/vedic-cosmos').then(r => r.json()).then(setCosmos);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.35), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-fuchsia-500/20 border-fuchsia-300/30 text-fuchsia-100 uppercase tracking-[0.25em] text-[10px]">Awakening</Badge>
          <div className="font-devanagari text-2xl text-purple-300 mt-4">जागरण</div>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-3 text-white leading-tight">Open the wheels. See the cosmos in the body.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Complete practices for opening each of the seven chakras — with bija mantras, when-closed / when-open indicators, specific asanas, and the science behind them. And the Vedic correspondences between the microcosm and macrocosm.</p>
        </div>

        <Tabs defaultValue="chakras" className="w-full">
          <TabsList className="bg-white/[0.03] border border-white/10 mx-auto flex justify-center h-auto flex-wrap">
            <TabsTrigger value="chakras" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/60 data-[state=active]:to-fuchsia-500/60 px-6 py-2.5"><Zap size={14} className="mr-1.5"/>Seven Chakras</TabsTrigger>
            <TabsTrigger value="cosmos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/60 data-[state=active]:to-fuchsia-500/60 px-6 py-2.5"><Sparkles size={14} className="mr-1.5"/>Body ↔ Cosmos</TabsTrigger>
          </TabsList>

          <TabsContent value="chakras" className="mt-10">
            {chakras.length > 0 && (
              <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                <div className="space-y-2 lg:sticky lg:top-24 self-start">
                  {chakras.map((c, i) => (
                    <button key={c.id} onClick={() => setActive(i)} className={`w-full text-left px-4 py-3 rounded-xl border transition ${active === i ? 'bg-white/[0.06] border-white/25' : 'bg-transparent border-white/5 hover:bg-white/[0.03]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center font-devanagari text-white text-lg shrink-0`}>{i + 1}</div>
                        <div>
                          <div className="font-devanagari text-lg text-white">{c.devanagari}</div>
                          <div className="text-xs text-slate-400">{c.english}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {(() => { const c = chakras[active]; return (
                  <Card className="bg-white/[0.03] border-white/10 relative overflow-hidden">
                    <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-3xl`}/>
                    <CardContent className="p-8 relative">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <div className="font-devanagari text-4xl text-white">{c.devanagari}</div>
                        <div className={`font-[Cormorant_Garamond,serif] text-4xl bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>{c.name}</div>
                      </div>
                      <div className="text-slate-400 text-sm mt-1">{c.english} · {c.location}</div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                        <MetaCell label="Bija" value={c.bija} accent={c.color}/>
                        <MetaCell label="Element" value={c.element} accent={c.color}/>
                        <MetaCell label="Petals" value={c.petals} accent={c.color}/>
                        <MetaCell label="Sense" value={c.sense} accent={c.color}/>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-400/20">
                          <div className="text-red-300 text-xs uppercase tracking-widest mb-2">When closed</div>
                          <p className="text-slate-200 leading-relaxed">{c.when_closed}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
                          <div className="text-emerald-300 text-xs uppercase tracking-widest mb-2">When open</div>
                          <p className="text-slate-200 leading-relaxed">{c.when_open}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="text-purple-300 text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><Leaf size={12}/>Opening practices</div>
                        <ol className="space-y-2">{c.practices.map((p, i) => (
                          <li key={i} className="flex gap-3 text-slate-200 leading-relaxed"><span className={`shrink-0 mt-0.5 bg-gradient-to-r ${c.color} bg-clip-text text-transparent font-semibold`}>{i + 1}.</span><span>{p}</span></li>
                        ))}</ol>
                      </div>

                      <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                        <div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">The science</div>
                        <p className="text-slate-200 leading-relaxed">{c.science}</p>
                      </div>

                      <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                        <button disabled={active === 0} onClick={() => setActive(active - 1)} className="text-purple-300 disabled:opacity-30 hover:text-white">← Lower</button>
                        <div className="text-slate-500 text-sm">{active + 1} / {chakras.length}</div>
                        <button disabled={active === chakras.length - 1} onClick={() => setActive(active + 1)} className="text-purple-300 disabled:opacity-30 hover:text-white">Higher →</button>
                      </div>
                    </CardContent>
                  </Card>
                );})()}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cosmos" className="mt-10">
            {cosmos && (<>
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-8">
                  <div className="font-devanagari text-center text-3xl text-purple-300">यत् पिण्डे तत् ब्रह्माण्डे</div>
                  <div className="text-center text-slate-400 mt-1 text-sm italic">yat pinde tat brahmande — as in the body, so in the cosmos</div>
                  <p className="text-slate-200 leading-relaxed text-lg mt-6">{cosmos.intro}</p>
                </CardContent>
              </Card>

              <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-10 mb-6">The Correspondences</h3>
              <div className="grid md:grid-cols-2 gap-3">{cosmos.correspondences.map((c, i) => (
                <Card key={i} className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                  <div className="flex items-center gap-3 font-[Cormorant_Garamond,serif] text-2xl">
                    <span className="text-white">{c.microcosm}</span>
                    <span className="text-purple-400">↔</span>
                    <span className="text-fuchsia-300">{c.macrocosm}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mt-3 text-sm">{c.science}</p>
                </CardContent></Card>
              ))}</div>

              <Card className="bg-gradient-to-br from-amber-900/20 to-fuchsia-900/10 border-amber-400/20 mt-8">
                <CardContent className="p-8">
                  <div className="text-amber-300 text-xs uppercase tracking-widest">From the Mahabharata</div>
                  <p className="text-slate-200 leading-relaxed mt-3 text-lg">{cosmos.mahabharata_note}</p>
                </CardContent>
              </Card>

              <div className="mt-8 space-y-4">
                {cosmos.quotes.map((q, i) => (
                  <Card key={i} className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
                    <p className="font-[Cormorant_Garamond,serif] text-2xl text-white leading-snug">"{q.text}"</p>
                    <div className="text-slate-400 mt-2 text-sm">— {q.source}</div>
                  </CardContent></Card>
                ))}
              </div>
            </>)}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function MetaCell({ label, value, accent }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
      <div className="text-slate-500 text-[10px] uppercase tracking-widest">{label}</div>
      <div className={`text-lg mt-0.5 font-[Cormorant_Garamond,serif] bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>{value}</div>
    </div>
  );
}
