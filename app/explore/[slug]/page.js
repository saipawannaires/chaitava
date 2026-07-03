'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, ShoppingBag } from 'lucide-react';

const SECTIONS = {
  vedas: { title: 'The Vedic Tree', dev: 'वेदवृक्ष', tagline: 'Four Vedas, 108 Upanishads, six philosophies — the living library.', color: 'from-amber-400 to-orange-600', endpoint: 'vedas' },
  nakshatras: { title: 'The 27 Nakshatras', dev: 'नक्षत्र', tagline: 'Lunar mansions — the sky as a cognitive map.', color: 'from-indigo-400 to-purple-500', endpoint: 'nakshatras' },
  koshas: { title: 'The Five Koshas', dev: 'पंच कोश', tagline: 'The five sheaths of being — food, breath, mind, wisdom, bliss.', color: 'from-cyan-400 to-blue-500', endpoint: 'koshas' },
  mythology: { title: 'Mythology', dev: 'पुराण', tagline: 'Gods, avatars, epics — the stories we still live inside.', color: 'from-fuchsia-400 to-purple-500', endpoint: 'mythology' },
  'life-mysteries': { title: 'Life Mysteries', dev: 'रहस्य', tagline: 'Karma, rebirth, 84 lakh yonis, yugas, moksha.', color: 'from-violet-500 to-purple-700', endpoint: 'life-mysteries' },
  festivals: { title: 'Festivals & Routes', dev: 'उत्सव', tagline: 'Ten major festivals and five pilgrimage circuits.', color: 'from-amber-500 to-red-500', endpoint: 'festivals' },
  'lost-civilizations': { title: 'Lost Civilizations & Archived Temples', dev: 'लुप्त सभ्यता', tagline: 'Vanished worlds and destroyed sanctuaries — what survives and what does not.', color: 'from-slate-400 to-purple-500', endpoint: 'lost-civilizations' },
  shop: { title: 'Sacred Store', dev: 'दुकान', tagline: 'Mala, puja kits, homa supplies, meditation tools. Curated, ethical.', color: 'from-emerald-400 to-teal-500', endpoint: 'shop' },
};

export default function ExplorePage() {
  const params = useParams();
  const key = params.slug;
  const meta = SECTIONS[key];
  const [data, setData] = useState(null);
  useEffect(() => { if (meta) fetch(`/api/${meta.endpoint}`).then(r => r.json()).then(setData); }, [key]);

  if (!meta) return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <SiteNav />
      <main className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="font-[Cormorant_Garamond,serif] text-4xl text-white">Section not found</h1>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.3), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className={`font-devanagari text-3xl bg-gradient-to-r ${meta.color} bg-clip-text text-transparent`}>{meta.dev}</div>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-3 text-white leading-tight">{meta.title}</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">{meta.tagline}</p>
        </div>

        {!data ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-400" size={32}/></div> : (
          <Renderer sectionKey={key} data={data} meta={meta}/>
        )}
      </main>
    </div>
  );
}

function Renderer({ sectionKey, data, meta }) {
  if (sectionKey === 'vedas') return <VedasView data={data}/>;
  if (sectionKey === 'nakshatras') return <NakshatrasView data={data}/>;
  if (sectionKey === 'koshas') return <KoshasView data={data}/>;
  if (sectionKey === 'mythology') return <MythologyView data={data}/>;
  if (sectionKey === 'life-mysteries') return <MysteriesView data={data}/>;
  if (sectionKey === 'festivals') return <FestivalsView data={data}/>;
  if (sectionKey === 'lost-civilizations') return <LostView data={data}/>;
  if (sectionKey === 'shop') return <ShopView data={data}/>;
  return null;
}

function VedasView({ data }) {
  return (<>
    <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8"><p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p></CardContent></Card>
    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-10 mb-6">The Four Vedas</h3>
    <div className="grid md:grid-cols-2 gap-4">{data.vedas.map(v => (
      <Card key={v.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
        <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${v.color} opacity-20 blur-2xl`}/>
        <CardContent className="p-6 relative">
          <div className={`font-devanagari text-2xl bg-gradient-to-r ${v.color} bg-clip-text text-transparent`}>{v.dev}</div>
          <h4 className="font-[Cormorant_Garamond,serif] text-3xl text-white mt-1">{v.name}</h4>
          <div className="text-slate-400 text-xs mt-1">{v.hymns}</div>
          <p className="text-slate-200 mt-3 leading-relaxed">{v.about}</p>
          <div className="mt-3 space-y-1">{v.key.map((k, i) => (<div key={i} className="text-purple-300 text-sm">• {k}</div>))}</div>
        </CardContent>
      </Card>
    ))}</div>
    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-10 mb-4">Four Layers Within Each Veda</h3>
    <div className="grid md:grid-cols-4 gap-3">{data.layers.map(l => (
      <Card key={l.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-amber-300 font-semibold">{l.name}</div><p className="text-slate-300 text-sm mt-1">{l.desc}</p></CardContent></Card>
    ))}</div>
    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-10 mb-4">Six Vedangas (Limbs)</h3>
    <div className="grid md:grid-cols-3 gap-3">{data.vedangas.map(l => (
      <Card key={l.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4"><div className="text-fuchsia-300 font-semibold">{l.name}</div><p className="text-slate-300 text-sm mt-1">{l.desc}</p></CardContent></Card>
    ))}</div>
    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-10 mb-4">Six Darshanas (Classical Philosophies)</h3>
    <div className="flex flex-wrap gap-2 justify-center">{data.darshanas.map(d => (<Badge key={d} className="bg-white/[0.05] border-white/10 text-slate-300 text-sm py-1.5 px-3">{d}</Badge>))}</div>
  </>);
}

function NakshatrasView({ data }) {
  return (<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{data.nakshatras.map(n => (
    <Card key={n.n} className="bg-white/[0.03] border-white/10"><CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-devanagari text-lg text-purple-300">{n.dev}</div>
          <div className="font-[Cormorant_Garamond,serif] text-xl text-white">{n.name}</div>
        </div>
        <div className="text-slate-500 text-xs">#{n.n}</div>
      </div>
      <div className="text-slate-400 text-xs mt-2">Deity: <span className="text-slate-200">{n.deity}</span></div>
      <div className="text-slate-400 text-xs">Symbol: <span className="text-slate-200">{n.symbol}</span></div>
      <div className="text-purple-200 text-sm italic mt-2">{n.trait}</div>
    </CardContent></Card>
  ))}</div>);
}

function KoshasView({ data }) {
  return (<div className="space-y-4">{data.koshas.map(k => (
    <Card key={k.n} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
      <div className={`absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b ${k.color}`}/>
      <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${k.color} opacity-15 blur-3xl`}/>
      <CardContent className="p-6 pl-8 relative">
        <div className="flex items-baseline gap-3 flex-wrap">
          <div className="font-devanagari text-2xl text-white">{k.dev}</div>
          <div className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${k.color} bg-clip-text text-transparent`}>{k.name}</div>
          <div className="text-slate-400 text-sm">{k.english}</div>
        </div>
        <p className="text-slate-200 mt-3 leading-relaxed">{k.about}</p>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/20"><div className="text-emerald-300 text-xs uppercase tracking-widest mb-1">Practice</div><p className="text-slate-200 text-sm">{k.practice}</p></div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/20"><div className="text-red-300 text-xs uppercase tracking-widest mb-1">Obscures</div><p className="text-slate-200 text-sm">{k.obscures}</p></div>
        </div>
      </CardContent>
    </Card>
  ))}</div>);
}

function MythologyView({ data }) {
  return (<>
    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mb-6">The Gods</h3>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{data.gods.map(g => (
      <Card key={g.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${g.color} opacity-25 blur-2xl`}/>
        <CardContent className="p-4 relative">
          <div className="font-devanagari text-xl text-white">{g.dev}</div>
          <div className={`font-[Cormorant_Garamond,serif] text-2xl bg-gradient-to-r ${g.color} bg-clip-text text-transparent`}>{g.name}</div>
          <div className="text-purple-300 text-xs mt-1">{g.role}</div>
          <div className="text-slate-400 text-xs mt-2">{g.symbol}</div>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">{g.note}</p>
        </CardContent>
      </Card>
    ))}</div>
    <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-cyan-400/20 mt-8"><CardContent className="p-6">
      <div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">The Dasavatara</div>
      <p className="text-slate-200 leading-relaxed text-lg">{data.avatars}</p>
    </CardContent></Card>
    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-10 mb-4">The Two Epics</h3>
    <div className="grid md:grid-cols-2 gap-4">{data.epics.map(e => (
      <Card key={e.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-6"><h4 className="font-[Cormorant_Garamond,serif] text-3xl text-white">{e.name}</h4><p className="text-slate-300 mt-2 leading-relaxed">{e.desc}</p></CardContent></Card>
    ))}</div>
  </>);
}

function MysteriesView({ data }) {
  return (<div className="grid md:grid-cols-2 gap-4">{data.items.map(m => (
    <Card key={m.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
      <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${m.color} opacity-20 blur-3xl`}/>
      <CardContent className="p-6 relative">
        <div className="font-devanagari text-xl text-white">{m.dev}</div>
        <h4 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>{m.name}</h4>
        <p className="text-slate-200 mt-3 leading-relaxed">{m.desc}</p>
      </CardContent>
    </Card>
  ))}</div>);
}

function FestivalsView({ data }) {
  return (<Tabs defaultValue="festivals" className="w-full">
    <TabsList className="bg-white/[0.03] border border-white/10 mx-auto flex justify-center h-auto">
      <TabsTrigger value="festivals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/60 data-[state=active]:to-red-500/60 px-6 py-2.5">Festivals</TabsTrigger>
      <TabsTrigger value="routes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/60 data-[state=active]:to-red-500/60 px-6 py-2.5">Pilgrimage Routes</TabsTrigger>
    </TabsList>
    <TabsContent value="festivals" className="mt-8"><div className="grid md:grid-cols-2 gap-3">{data.festivals.map(f => (
      <Card key={f.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
        <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${f.color} opacity-20 blur-3xl`}/>
        <CardContent className="p-5 relative">
          <div className="font-devanagari text-lg text-white">{f.dev}</div>
          <div className={`font-[Cormorant_Garamond,serif] text-2xl bg-gradient-to-r ${f.color} bg-clip-text text-transparent`}>{f.name}</div>
          <div className="text-slate-400 text-xs mt-1">{f.when}</div>
          <p className="text-slate-200 mt-2 leading-relaxed text-sm">{f.about}</p>
        </CardContent>
      </Card>
    ))}</div></TabsContent>
    <TabsContent value="routes" className="mt-8"><div className="space-y-4">{data.routes.map(r => (
      <Card key={r.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
        <div className="font-devanagari text-lg text-purple-300">{r.dev}</div>
        <div className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${r.color} bg-clip-text text-transparent`}>{r.name}</div>
        <div className="text-slate-400 text-xs mt-1">Duration: {r.duration}</div>
        <p className="text-slate-200 mt-3 leading-relaxed">{r.stops}</p>
      </CardContent></Card>
    ))}</div></TabsContent>
  </Tabs>);
}

function LostView({ data }) {
  return (<Tabs defaultValue="civ" className="w-full">
    <TabsList className="bg-white/[0.03] border border-white/10 mx-auto flex justify-center h-auto">
      <TabsTrigger value="civ" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-400/60 data-[state=active]:to-purple-500/60 px-6 py-2.5">Lost Civilizations</TabsTrigger>
      <TabsTrigger value="temples" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-400/60 data-[state=active]:to-purple-500/60 px-6 py-2.5">Archived Temples</TabsTrigger>
    </TabsList>
    <TabsContent value="civ" className="mt-8"><div className="space-y-4">{data.civilizations.map(c => (
      <Card key={c.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
        <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>{c.when}</div>
        <h4 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${c.color} bg-clip-text text-transparent mt-1`}>{c.name}</h4>
        <p className="text-slate-200 mt-3 leading-relaxed">{c.about}</p>
      </CardContent></Card>
    ))}</div></TabsContent>
    <TabsContent value="temples" className="mt-8"><div className="space-y-4">{data.archived.map(t => (
      <Card key={t.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
        <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>{t.when}</div>
        <h4 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${t.color} bg-clip-text text-transparent mt-1`}>{t.name}</h4>
        <p className="text-slate-200 mt-3 leading-relaxed">{t.about}</p>
      </CardContent></Card>
    ))}</div></TabsContent>
  </Tabs>);
}

function ShopView({ data }) {
  return (<>
    <div className="text-center text-slate-400 text-sm italic mb-6">Preview catalog · checkout coming with the next release.</div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{data.items.map(item => (
      <Card key={item.id} className="bg-white/[0.03] border-white/10 overflow-hidden group hover:border-white/25 transition">
        <div className="h-48 relative" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0416] via-transparent to-transparent"/>
          <Badge className="absolute top-3 right-3 bg-black/60 border-white/20 text-slate-100">{item.category}</Badge>
        </div>
        <CardContent className="p-4">
          <h4 className={`font-[Cormorant_Garamond,serif] text-xl bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.name}</h4>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed line-clamp-3">{item.desc}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="text-white font-semibold text-lg">{item.price}</div>
            <button className="text-purple-300 hover:text-white text-sm flex items-center gap-1"><ShoppingBag size={12}/>Notify</button>
          </div>
        </CardContent>
      </Card>
    ))}</div>
  </>);
}
