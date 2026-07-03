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
  aghoris: { title: 'The Aghoris', dev: 'अघोर', tagline: 'The path that sees no impurity. Cremation-ground mystics who worship Shiva as Bhairava.', color: 'from-slate-500 to-purple-800', endpoint: 'aghoris' },
  sadhus: { title: 'Sadhus & Ascetics', dev: 'साधु', tagline: 'The nine great orders of Hindu renunciation — from Naga warriors to Nath yogis.', color: 'from-orange-400 to-red-600', endpoint: 'sadhus' },
  gods: { title: 'The Gods', dev: 'देवगण', tagline: 'Shiva, Vishnu, Brahma, Devi — their decorations, weapons, and body correspondences.', color: 'from-amber-400 to-fuchsia-500', endpoint: 'gods' },
  avatars: { title: 'The Avatars', dev: 'अवतार', tagline: 'Ten of Vishnu, seven of Shiva, seven of Devi — why the divine descends.', color: 'from-cyan-400 to-purple-600', endpoint: 'avatars' },
  ashramas: { title: 'The Four Life Stages', dev: 'चतुराश्रम', tagline: 'Brahmacharya · Grihastha · Vanaprastha · Sannyasa — the classic 100-year map of a human life.', color: 'from-amber-400 to-fuchsia-500', endpoint: 'ashramas' },
  purusharthas: { title: 'Four Aims of Life', dev: 'पुरुषार्थ', tagline: 'Dharma · Artha · Kama · Moksha — everything a human being can legitimately pursue.', color: 'from-amber-400 to-purple-600', endpoint: 'purusharthas' },
  varnas: { title: 'The Four Orders', dev: 'चातुर्वर्ण्य', tagline: 'Brahmana · Kshatriya · Vaishya · Shudra — the original functional framework of society.', color: 'from-amber-400 to-cyan-500', endpoint: 'varnas' },
  samskaras: { title: 'Sixteen Sacraments', dev: 'षोडश संस्कार', tagline: 'From conception to cremation — the sixteen rites that mark a full human life.', color: 'from-cyan-400 to-fuchsia-500', endpoint: 'samskaras' },
  rituals: { title: 'Rituals of Pooja', dev: 'पूजा विधान', tagline: 'The 16 upacharas · 12 major poojas · aartis · implements · fire rituals · the daily rhythm.', color: 'from-orange-500 to-red-600', endpoint: 'rituals' },
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
  if (sectionKey === 'aghoris') return <AghorisView data={data}/>;
  if (sectionKey === 'sadhus') return <SadhusView data={data}/>;
  if (sectionKey === 'gods') return <GodsView data={data}/>;
  if (sectionKey === 'avatars') return <AvatarsView data={data}/>;
  if (sectionKey === 'ashramas') return <AshramasView data={data}/>;
  if (sectionKey === 'purusharthas') return <PurusharthasView data={data}/>;
  if (sectionKey === 'varnas') return <VarnasView data={data}/>;
  if (sectionKey === 'samskaras') return <SamskarasView data={data}/>;
  if (sectionKey === 'rituals') return <RitualsView data={data}/>;
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


// -------------------- Aghoris --------------------
function AghorisView({ data }) {
  return (<div className="space-y-6">
    <Card className="bg-white/[0.03] border-white/10 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-purple-500 to-slate-700 opacity-20 blur-3xl"/>
      <CardContent className="p-8 relative">
        <div className="text-purple-300 text-xs uppercase tracking-widest mb-3">Overview</div>
        <p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p>
      </CardContent>
    </Card>

    <div className="grid md:grid-cols-2 gap-4">
      <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
        <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">Historical Origin</div>
        <p className="text-slate-200 leading-relaxed">{data.origin}</p>
      </CardContent></Card>
      <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
        <div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-2">Core Philosophy</div>
        <p className="text-slate-200 leading-relaxed">{data.philosophy}</p>
      </CardContent></Card>
    </div>

    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-6">Sacred Practices</h3>
    <div className="grid md:grid-cols-2 gap-3">{data.practices.map(p => (
      <Card key={p.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
        <div className="font-devanagari text-lg text-purple-300">{p.dev}</div>
        <div className="font-[Cormorant_Garamond,serif] text-2xl text-white">{p.name}</div>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">{p.desc}</p>
      </CardContent></Card>
    ))}</div>

    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-6">Symbols &amp; Ornaments</h3>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{data.symbols.map(s => (
      <Card key={s.item} className="bg-white/[0.03] border-white/10"><CardContent className="p-4">
        <div className="text-amber-300 font-semibold">{s.item}</div>
        <p className="text-slate-300 text-sm mt-1 leading-relaxed">{s.meaning}</p>
      </CardContent></Card>
    ))}</div>

    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-6">Famous Aghoris</h3>
    <div className="grid md:grid-cols-2 gap-3">{data.famous.map(f => (
      <Card key={f.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
        {f.dev && <div className="font-devanagari text-lg text-purple-300">{f.dev}</div>}
        <div className="font-[Cormorant_Garamond,serif] text-2xl text-white">{f.name}</div>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">{f.about}</p>
      </CardContent></Card>
    ))}</div>

    <Card className="bg-gradient-to-br from-red-900/30 to-purple-900/20 border-red-400/20 mt-6"><CardContent className="p-6">
      <div className="text-red-300 text-xs uppercase tracking-widest mb-2">Beyond the Stereotypes</div>
      <p className="text-slate-200 leading-relaxed">{data.misconceptions}</p>
    </CardContent></Card>
  </div>);
}

// -------------------- Sadhus --------------------
function SadhusView({ data }) {
  return (<div className="space-y-6">
    <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
      <p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p>
    </CardContent></Card>

    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-6">Nine Great Orders</h3>
    <div className="grid md:grid-cols-2 gap-4">{data.types.map(t => (
      <Card key={t.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
        <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${t.color} opacity-20 blur-3xl`}/>
        <CardContent className="p-6 relative">
          <div className="font-devanagari text-xl text-white">{t.dev}</div>
          <h4 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>{t.name}</h4>
          <p className="text-slate-200 mt-3 leading-relaxed">{t.about}</p>
          <div className="mt-3 space-y-1.5">
            <div className="text-xs"><span className="text-emerald-300 uppercase tracking-widest">Practice · </span><span className="text-slate-300">{t.practice}</span></div>
            <div className="text-xs"><span className="text-cyan-300 uppercase tracking-widest">Identify · </span><span className="text-slate-300">{t.identify}</span></div>
          </div>
        </CardContent>
      </Card>
    ))}</div>

    <Card className="bg-gradient-to-br from-amber-900/30 to-red-900/20 border-amber-400/20 mt-6"><CardContent className="p-6">
      <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">How One Becomes a Sadhu</div>
      <p className="text-slate-200 leading-relaxed">{data.becoming}</p>
    </CardContent></Card>
  </div>);
}

// -------------------- Gods --------------------
function GodsView({ data }) {
  const [active, setActive] = useState(0);
  const g = data.gods[active];
  return (<div>
    {/* God selector */}
    <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4 justify-start md:justify-center">
      {data.gods.map((god, i) => (
        <button key={god.id} onClick={() => setActive(i)}
          className={`shrink-0 px-4 py-2 rounded-full border transition ${i === active ? 'bg-white/10 border-white/40 text-white' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <span className="font-devanagari text-base">{god.dev}</span> <span className="ml-1 text-sm">{god.name}</span>
        </button>
      ))}
    </div>

    {/* Hero card */}
    <Card className="bg-white/[0.03] border-white/10 relative overflow-hidden">
      <div className={`absolute -top-32 -right-24 w-96 h-96 rounded-full bg-gradient-to-br ${g.color} opacity-25 blur-3xl`}/>
      <div className={`absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br ${g.color} opacity-15 blur-3xl`}/>
      <CardContent className="p-8 relative">
        <div className="font-devanagari text-4xl md:text-6xl text-white">{g.dev}</div>
        <h2 className={`font-[Cormorant_Garamond,serif] text-5xl md:text-7xl bg-gradient-to-r ${g.color} bg-clip-text text-transparent mt-1`}>{g.name}</h2>
        <div className="text-slate-300 mt-2 text-lg">{g.role}</div>
        <div className="grid md:grid-cols-3 gap-3 mt-5 text-sm">
          <div><span className="text-amber-300 uppercase tracking-widest text-xs">Consort · </span><span className="text-slate-300">{g.consort}</span></div>
          <div><span className="text-emerald-300 uppercase tracking-widest text-xs">Mount · </span><span className="text-slate-300">{g.mount}</span></div>
          <div><span className="text-cyan-300 uppercase tracking-widest text-xs">Abode · </span><span className="text-slate-300">{g.abode}</span></div>
        </div>
      </CardContent>
    </Card>

    {/* Formation */}
    <Card className="bg-white/[0.03] border-white/10 mt-4"><CardContent className="p-6">
      <div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-2">Formation &amp; Origin Story</div>
      <p className="text-slate-200 leading-relaxed">{g.formation}</p>
    </CardContent></Card>

    {/* Decorations */}
    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-8 mb-4">Decorations &amp; Their Meaning</h3>
    <div className="grid md:grid-cols-2 gap-3">{g.decorations.map(d => (
      <Card key={d.item} className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-devanagari text-lg text-purple-300">{d.dev}</span>
          <span className="font-[Cormorant_Garamond,serif] text-xl text-white">{d.item}</span>
        </div>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">{d.why}</p>
      </CardContent></Card>
    ))}</div>

    {/* Weapons */}
    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-8 mb-4">Weapons &amp; How They Are Used</h3>
    <div className="grid md:grid-cols-2 gap-3">{g.weapons.map(w => (
      <Card key={w.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
        <div className="text-amber-300 font-semibold">{w.name}</div>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">{w.used_for}</p>
      </CardContent></Card>
    ))}</div>

    {/* Body connections */}
    <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border-cyan-400/20 mt-8"><CardContent className="p-6">
      <div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">Human Body &amp; Chakra Connections</div>
      <p className="text-slate-200 leading-relaxed">{g.body_connections}</p>
    </CardContent></Card>

    {/* Forms */}
    <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white text-center mt-8 mb-4">Major Forms</h3>
    <div className="flex flex-wrap gap-2 justify-center">{g.forms.map(f => (
      <Badge key={f} className="bg-white/[0.05] border-white/10 text-slate-300 text-sm py-1.5 px-3">{f}</Badge>
    ))}</div>
  </div>);
}

// -------------------- Avatars --------------------
function AvatarsView({ data }) {
  return (<div className="space-y-6">
    <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
      <p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p>
    </CardContent></Card>

    <Tabs defaultValue="vishnu" className="w-full">
      <TabsList className="bg-white/[0.03] border border-white/10 mx-auto flex flex-wrap justify-center h-auto">
        <TabsTrigger value="vishnu" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/60 data-[state=active]:to-cyan-500/60 px-6 py-2.5">Dashavatara (Vishnu)</TabsTrigger>
        <TabsTrigger value="shiva" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/60 data-[state=active]:to-slate-500/60 px-6 py-2.5">Shiva Avatars</TabsTrigger>
        <TabsTrigger value="devi" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/60 data-[state=active]:to-fuchsia-500/60 px-6 py-2.5">Devi Avatars</TabsTrigger>
      </TabsList>

      <TabsContent value="vishnu" className="mt-8 space-y-4">
        {data.vishnu_avatars.map(a => (
          <Card key={a.n} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
            <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br ${a.color} opacity-20 blur-3xl`}/>
            <CardContent className="p-6 relative">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${a.color} bg-clip-text text-transparent font-semibold`}>Avatar #{a.n}</div>
                <div className="text-slate-500 text-xs">{a.era}</div>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap mt-2">
                <span className="font-devanagari text-2xl text-white">{a.dev}</span>
                <h4 className={`font-[Cormorant_Garamond,serif] text-4xl bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>{a.name}</h4>
                <span className="text-slate-400 italic">— {a.form}</span>
              </div>
              <div className="mt-4 space-y-3">
                <div><div className="text-amber-300 text-xs uppercase tracking-widest mb-1">Why He Descended</div><p className="text-slate-200 leading-relaxed">{a.why}</p></div>
                <div><div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-1">Symbolism</div><p className="text-slate-200 leading-relaxed">{a.symbolism}</p></div>
                <div><div className="text-cyan-300 text-xs uppercase tracking-widest mb-1">Weapons</div><p className="text-slate-200 leading-relaxed">{a.weapons}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="shiva" className="mt-8">
        <div className="grid md:grid-cols-2 gap-3">{data.shiva_avatars.map(a => (
          <Card key={a.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
            <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${a.color} opacity-20 blur-3xl`}/>
            <CardContent className="p-5 relative">
              <div className="font-devanagari text-xl text-white">{a.dev}</div>
              <div className={`font-[Cormorant_Garamond,serif] text-2xl bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>{a.name}</div>
              <p className="text-slate-300 mt-2 leading-relaxed text-sm">{a.about}</p>
            </CardContent>
          </Card>
        ))}</div>
      </TabsContent>

      <TabsContent value="devi" className="mt-8">
        <div className="grid md:grid-cols-2 gap-3">{data.devi_avatars.map(a => (
          <Card key={a.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
            <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${a.color} opacity-20 blur-3xl`}/>
            <CardContent className="p-5 relative">
              <div className="font-devanagari text-xl text-white">{a.dev}</div>
              <div className={`font-[Cormorant_Garamond,serif] text-2xl bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>{a.name}</div>
              <p className="text-slate-300 mt-2 leading-relaxed text-sm">{a.about}</p>
            </CardContent>
          </Card>
        ))}</div>
      </TabsContent>
    </Tabs>

    <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-400/20 mt-8"><CardContent className="p-6">
      <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">Why the Divine Descends — from the Bhagavad Gita</div>
      <p className="text-slate-200 leading-relaxed italic">{data.why_incarnate}</p>
    </CardContent></Card>
  </div>);
}

// -------------------- Ashramas (Four Life Stages) --------------------
function AshramasView({ data }) {
  const [active, setActive] = useState(0);
  const s = data.stages[active];
  return (<div className="space-y-6">
    <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
      <p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p>
      <p className="text-slate-300 leading-relaxed mt-4 italic">{data.overview}</p>
    </CardContent></Card>

    {/* Timeline */}
    <div className="relative py-4">
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-cyan-500/40 via-amber-500/40 via-emerald-500/40 to-fuchsia-500/40"/>
      <div className="relative grid grid-cols-4 gap-2">
        {data.stages.map((stage, i) => (
          <button key={stage.n} onClick={() => setActive(i)}
            className={`group flex flex-col items-center gap-2 transition ${i === active ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}>
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg ring-2 ${i === active ? 'ring-white/60' : 'ring-white/10'}`}>
              <span className="text-white text-xl font-[Cormorant_Garamond,serif]">{stage.n}</span>
            </div>
            <div className="font-devanagari text-sm text-white text-center">{stage.dev}</div>
            <div className="text-slate-200 font-semibold text-sm text-center">{stage.name}</div>
            <div className="text-slate-400 text-xs">{stage.age}</div>
          </button>
        ))}
      </div>
    </div>

    {/* Selected stage detail */}
    <Card className="bg-white/[0.03] border-white/10 relative overflow-hidden">
      <div className={`absolute -top-32 -right-24 w-96 h-96 rounded-full bg-gradient-to-br ${s.color} opacity-25 blur-3xl`}/>
      <CardContent className="p-8 relative">
        <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${s.color} bg-clip-text text-transparent font-semibold`}>Stage {s.n} · {s.age}</div>
        <div className="font-devanagari text-4xl md:text-5xl text-white mt-2">{s.dev}</div>
        <h2 className={`font-[Cormorant_Garamond,serif] text-5xl md:text-6xl bg-gradient-to-r ${s.color} bg-clip-text text-transparent mt-1`}>{s.name}</h2>
        <div className="text-slate-300 text-lg mt-1">{s.english}</div>
        <div className="text-slate-400 text-sm mt-3 italic">{s.symbol}</div>
        <p className="text-slate-200 leading-relaxed mt-5 text-lg">{s.meaning}</p>
      </CardContent>
    </Card>

    <div className="grid md:grid-cols-2 gap-4">
      <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
        <div className="text-amber-300 text-xs uppercase tracking-widest mb-3">Duties &amp; Way of Life</div>
        <ul className="space-y-2">{s.duties.map((d, i) => (
          <li key={i} className="text-slate-200 flex gap-2 leading-relaxed"><span className="text-amber-300 shrink-0">•</span>{d}</li>
        ))}</ul>
      </CardContent></Card>
      <div className="space-y-4">
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
          <div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-2">Primary Purushartha</div>
          <p className="text-slate-200 leading-relaxed">{s.purushartha}</p>
        </CardContent></Card>
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
          <div className="text-emerald-300 text-xs uppercase tracking-widest mb-2">Core Practices</div>
          <p className="text-slate-200 leading-relaxed">{s.practices}</p>
        </CardContent></Card>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border-cyan-400/20"><CardContent className="p-6">
        <div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">Body &amp; Chakra Connection</div>
        <p className="text-slate-200 leading-relaxed">{s.body_connection}</p>
      </CardContent></Card>
      <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-400/20"><CardContent className="p-6">
        <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">Modern Interpretation</div>
        <p className="text-slate-200 leading-relaxed">{s.modern}</p>
      </CardContent></Card>
    </div>

    <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
      <div className="text-purple-300 text-xs uppercase tracking-widest mb-2">Key Texts</div>
      <div className="flex flex-wrap gap-2">{s.key_texts.map(t => (
        <Badge key={t} className="bg-white/[0.05] border-white/10 text-slate-300 text-sm">{t}</Badge>
      ))}</div>
      <div className="text-slate-400 text-sm mt-4 italic">Transition · {s.completion}</div>
    </CardContent></Card>

    <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-10">Variations of the Path</h3>
    <div className="grid md:grid-cols-3 gap-3">{data.variations.map(v => (
      <Card key={v.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
        {v.dev && <div className="font-devanagari text-lg text-purple-300">{v.dev}</div>}
        <div className="text-white font-semibold">{v.name}</div>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">{v.desc}</p>
      </CardContent></Card>
    ))}</div>

    <Card className="bg-gradient-to-br from-purple-900/30 to-fuchsia-900/20 border-purple-400/20 mt-6"><CardContent className="p-6">
      <div className="text-purple-300 text-xs uppercase tracking-widest mb-2">The Fractal Design</div>
      <p className="text-slate-200 leading-relaxed">{data.connections}</p>
    </CardContent></Card>
  </div>);
}

// -------------------- Purusharthas --------------------
function PurusharthasView({ data }) {
  return (<div className="space-y-6">
    <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
      <p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p>
    </CardContent></Card>

    <div className="grid md:grid-cols-2 gap-4">{data.aims.map(a => (
      <Card key={a.n} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
        <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br ${a.color} opacity-25 blur-3xl`}/>
        <CardContent className="p-6 relative">
          <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${a.color} bg-clip-text text-transparent font-semibold`}>Aim #{a.n}</div>
          <div className="flex items-baseline gap-3 flex-wrap mt-2">
            <span className="font-devanagari text-2xl text-white">{a.dev}</span>
            <h4 className={`font-[Cormorant_Garamond,serif] text-4xl bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>{a.name}</h4>
          </div>
          <div className="text-slate-300 mt-1">{a.english}</div>
          <p className="text-slate-200 mt-3 leading-relaxed">{a.about}</p>
          <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
            <div className="text-emerald-300 text-xs uppercase tracking-widest mb-1">Example</div>
            <p className="text-slate-200 text-sm">{a.example}</p>
          </div>
          <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-400/20">
            <div className="text-red-300 text-xs uppercase tracking-widest mb-1">Warning</div>
            <p className="text-slate-200 text-sm">{a.warning}</p>
          </div>
        </CardContent>
      </Card>
    ))}</div>

    <Card className="bg-gradient-to-br from-amber-900/30 to-purple-900/20 border-amber-400/20"><CardContent className="p-6">
      <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">The Progression</div>
      <p className="text-slate-200 leading-relaxed">{data.progression}</p>
    </CardContent></Card>
  </div>);
}

// -------------------- Varnas --------------------
function VarnasView({ data }) {
  return (<div className="space-y-6">
    <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
      <p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p>
    </CardContent></Card>

    <Card className="bg-yellow-500/10 border-yellow-400/30"><CardContent className="p-5">
      <div className="text-yellow-300 text-xs uppercase tracking-widest mb-2">Important Context</div>
      <p className="text-slate-200 leading-relaxed text-sm">{data.disclaimer}</p>
    </CardContent></Card>

    <div className="grid md:grid-cols-2 gap-4">{data.orders.map(o => (
      <Card key={o.n} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
        <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${o.color} opacity-20 blur-3xl`}/>
        <CardContent className="p-6 relative">
          <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${o.color} bg-clip-text text-transparent font-semibold`}>Order #{o.n}</div>
          <div className="flex items-baseline gap-3 flex-wrap mt-2">
            <span className="font-devanagari text-2xl text-white">{o.dev}</span>
            <h4 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${o.color} bg-clip-text text-transparent`}>{o.name}</h4>
          </div>
          <div className="text-slate-300 mt-1">{o.english}</div>
          <div className="text-slate-400 text-xs mt-2">{o.guna}</div>
          <p className="text-slate-200 mt-3 leading-relaxed text-sm italic">{o.body_origin}</p>
          <div className="mt-3">
            <div className="text-amber-300 text-xs uppercase tracking-widest mb-1">Duties</div>
            <ul className="space-y-1">{o.duties.map((d, i) => (<li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-amber-300">•</span>{d}</li>))}</ul>
          </div>
          <div className="mt-3">
            <div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-1">Inner Qualities</div>
            <p className="text-slate-300 text-sm">{o.qualities}</p>
          </div>
          <div className="mt-3">
            <div className="text-cyan-300 text-xs uppercase tracking-widest mb-1">Modern Parallel</div>
            <p className="text-slate-300 text-sm">{o.modern}</p>
          </div>
          {o.note && <div className="mt-3 text-slate-400 text-sm italic">{o.note}</div>}
        </CardContent>
      </Card>
    ))}</div>

    <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/20 border-purple-400/20"><CardContent className="p-6">
      <div className="text-purple-300 text-xs uppercase tracking-widest mb-2">The Key Teaching · Satyakama Jabala</div>
      <p className="text-slate-200 leading-relaxed">{data.key_teaching}</p>
    </CardContent></Card>
  </div>);
}

// -------------------- Samskaras --------------------
function SamskarasView({ data }) {
  return (<div className="space-y-6">
    <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
      <p className="text-slate-200 leading-relaxed text-lg">{data.intro}</p>
    </CardContent></Card>

    <div className="relative">
      <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-cyan-500/40 via-amber-500/40 to-fuchsia-500/40"/>
      <div className="space-y-3">{data.list.map(s => (
        <div key={s.n} className="relative pl-16">
          <div className="absolute left-0 top-2 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-white font-[Cormorant_Garamond,serif] text-lg shadow-lg">
            {s.n}
          </div>
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-devanagari text-lg text-purple-300">{s.dev}</span>
              <span className="font-[Cormorant_Garamond,serif] text-2xl text-white">{s.name}</span>
              <span className="text-slate-400 text-sm italic">— {s.english}</span>
            </div>
            <div className="text-amber-300 text-xs uppercase tracking-widest mt-1">When · {s.when}</div>
            <p className="text-slate-200 mt-2 leading-relaxed text-sm">{s.desc}</p>
          </CardContent></Card>
        </div>
      ))}</div>
    </div>

    <Card className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/20 border-cyan-400/20"><CardContent className="p-6">
      <div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">Why "Samskara" also means "Imprint"</div>
      <p className="text-slate-200 leading-relaxed">{data.meaning}</p>
    </CardContent></Card>
  </div>);
}


// -------------------- Rituals of Pooja --------------------
function RitualsView({ data }) {
  return (<div>
    <Tabs defaultValue="steps" className="w-full">
      <TabsList className="bg-white/[0.03] border border-white/10 mx-auto flex flex-wrap justify-center h-auto gap-1">
        <TabsTrigger value="steps" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/60 data-[state=active]:to-orange-500/60 px-4 py-2">16 Upacharas</TabsTrigger>
        <TabsTrigger value="poojas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/60 data-[state=active]:to-red-500/60 px-4 py-2">Major Poojas</TabsTrigger>
        <TabsTrigger value="aartis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/60 data-[state=active]:to-orange-500/60 px-4 py-2">Aartis</TabsTrigger>
        <TabsTrigger value="implements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/60 data-[state=active]:to-cyan-500/60 px-4 py-2">Implements</TabsTrigger>
        <TabsTrigger value="homas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/60 data-[state=active]:to-red-600/60 px-4 py-2">Homas</TabsTrigger>
        <TabsTrigger value="daily" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/60 data-[state=active]:to-purple-500/60 px-4 py-2">Daily Rhythm</TabsTrigger>
      </TabsList>

      {/* 16 UPACHARAS */}
      <TabsContent value="steps" className="mt-8 space-y-6">
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
          <div className="font-devanagari text-2xl text-amber-300">{data.steps.dev}</div>
          <p className="text-slate-200 leading-relaxed text-lg mt-3">{data.steps.intro}</p>
        </CardContent></Card>

        <div className="relative">
          <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-amber-500/40 via-orange-500/40 to-red-500/40"/>
          <div className="space-y-3">{data.steps.steps.map(s => (
            <div key={s.n} className="relative pl-16">
              <div className="absolute left-0 top-2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-[Cormorant_Garamond,serif] text-lg shadow-lg">
                {s.n}
              </div>
              <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-devanagari text-lg text-amber-300">{s.dev}</span>
                  <span className="font-[Cormorant_Garamond,serif] text-2xl text-white">{s.name}</span>
                  <span className="text-slate-400 text-sm italic">— {s.english}</span>
                </div>
                <p className="text-slate-200 mt-2 leading-relaxed text-sm">{s.desc}</p>
              </CardContent></Card>
            </div>
          ))}</div>
        </div>

        <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-400/20"><CardContent className="p-6">
          <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">Simpler Versions for Daily Home Worship</div>
          <p className="text-slate-200 leading-relaxed">{data.steps.simple_version}</p>
        </CardContent></Card>
      </TabsContent>

      {/* MAJOR POOJAS */}
      <TabsContent value="poojas" className="mt-8 space-y-6">
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
          <div className="font-devanagari text-2xl text-orange-300">{data.poojas.dev}</div>
          <p className="text-slate-200 leading-relaxed text-lg mt-3">{data.poojas.intro}</p>
        </CardContent></Card>

        <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white text-center">Four Categories of Pooja</h3>
        <div className="grid md:grid-cols-4 gap-3">{data.poojas.types.map(t => (
          <Card key={t.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4">
            <div className="font-devanagari text-purple-300">{t.dev}</div>
            <div className="text-white font-semibold">{t.name}</div>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">{t.desc}</p>
          </CardContent></Card>
        ))}</div>

        <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center mt-8">Twelve Major Poojas</h3>
        <div className="space-y-4">{data.poojas.major.map(p => (
          <Card key={p.id} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
            <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${p.color} opacity-20 blur-3xl`}/>
            <CardContent className="p-6 relative">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-devanagari text-2xl text-white">{p.dev}</span>
                <h4 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>{p.name}</h4>
              </div>
              <div className="text-slate-400 text-xs mt-1">Deity: <span className="text-slate-200">{p.deity}</span></div>

              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
                  <div className="text-amber-300 text-xs uppercase tracking-widest mb-1">When</div>
                  <p className="text-slate-200 text-sm">{p.when}</p>
                </div>
                <div className="p-3 rounded-lg bg-fuchsia-500/10 border border-fuchsia-400/20">
                  <div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-1">Purpose</div>
                  <p className="text-slate-200 text-sm">{p.purpose}</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div><span className="text-emerald-300 text-xs uppercase tracking-widest">Essentials · </span><span className="text-slate-300 text-sm">{p.essentials}</span></div>
                <div><span className="text-cyan-300 text-xs uppercase tracking-widest">Steps · </span><span className="text-slate-300 text-sm">{p.steps}</span></div>
              </div>

              <div className="mt-3">
                <div className="text-purple-300 text-xs uppercase tracking-widest mb-1.5">Mantras</div>
                <div className="flex flex-wrap gap-2">{p.mantras.map((m, i) => (
                  <Badge key={i} className="bg-white/[0.05] border-white/10 text-slate-300 text-xs py-1 px-2">{m}</Badge>
                ))}</div>
              </div>

              <div className="mt-3 text-slate-400 text-sm italic border-t border-white/5 pt-3">{p.significance}</div>
            </CardContent>
          </Card>
        ))}</div>
      </TabsContent>

      {/* AARTIS */}
      <TabsContent value="aartis" className="mt-8 space-y-6">
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
          <div className="font-devanagari text-2xl text-yellow-300">{data.aartis.dev}</div>
          <p className="text-slate-200 leading-relaxed text-lg mt-3">{data.aartis.intro}</p>
        </CardContent></Card>

        <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white text-center">Five Types of Aarti</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{data.aartis.types.map(t => (
          <Card key={t.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4">
            <div className="font-devanagari text-lg text-yellow-300">{t.dev}</div>
            <div className="text-white font-semibold">{t.name}</div>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">{t.desc}</p>
          </CardContent></Card>
        ))}</div>

        <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white text-center mt-6">Famous Aartis</h3>
        <div className="grid md:grid-cols-2 gap-3">{data.aartis.famous_aartis.map(a => (
          <Card key={a.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
            <div className="font-[Cormorant_Garamond,serif] text-2xl text-white">{a.name}</div>
            <div className="text-slate-400 text-xs mt-1">Deity: {a.deity} · By: {a.by}</div>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">{a.desc}</p>
          </CardContent></Card>
        ))}</div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-yellow-400/20"><CardContent className="p-6">
            <div className="text-yellow-300 text-xs uppercase tracking-widest mb-2">The Traditional Procedure</div>
            <p className="text-slate-200 leading-relaxed">{data.aartis.procedure}</p>
          </CardContent></Card>
          <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border-orange-400/20"><CardContent className="p-6">
            <div className="text-orange-300 text-xs uppercase tracking-widest mb-2">The Meaning</div>
            <p className="text-slate-200 leading-relaxed italic">{data.aartis.meaning}</p>
          </CardContent></Card>
        </div>
      </TabsContent>

      {/* IMPLEMENTS */}
      <TabsContent value="implements" className="mt-8 space-y-6">
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
          <div className="font-devanagari text-2xl text-emerald-300">{data.implements.dev}</div>
          <p className="text-slate-200 leading-relaxed text-lg mt-3">{data.implements.intro}</p>
        </CardContent></Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{data.implements.items.map(item => (
          <Card key={item.name} className="bg-white/[0.03] border-white/10"><CardContent className="p-4">
            <div className="font-devanagari text-lg text-emerald-300">{item.dev}</div>
            <div className="font-[Cormorant_Garamond,serif] text-xl text-white">{item.name}</div>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">{item.purpose}</p>
          </CardContent></Card>
        ))}</div>
      </TabsContent>

      {/* HOMAS */}
      <TabsContent value="homas" className="mt-8 space-y-6">
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
          <div className="font-devanagari text-2xl text-orange-300">{data.homas.dev}</div>
          <p className="text-slate-200 leading-relaxed text-lg mt-3">{data.homas.intro}</p>
        </CardContent></Card>

        <div className="grid md:grid-cols-2 gap-4">{data.homas.types.map(h => (
          <Card key={h.name} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
            <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br ${h.color} opacity-20 blur-3xl`}/>
            <CardContent className="p-6 relative">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-devanagari text-xl text-white">{h.dev}</span>
                <h4 className={`font-[Cormorant_Garamond,serif] text-2xl bg-gradient-to-r ${h.color} bg-clip-text text-transparent`}>{h.name}</h4>
              </div>
              <div className="mt-3 space-y-1.5 text-sm">
                <div><span className="text-amber-300 uppercase tracking-widest text-xs">When · </span><span className="text-slate-300">{h.when}</span></div>
                <div><span className="text-fuchsia-300 uppercase tracking-widest text-xs">Purpose · </span><span className="text-slate-300">{h.purpose}</span></div>
                <div><span className="text-emerald-300 uppercase tracking-widest text-xs">Offerings · </span><span className="text-slate-300">{h.offerings}</span></div>
                <div><span className="text-cyan-300 uppercase tracking-widest text-xs">Duration · </span><span className="text-slate-300">{h.duration}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}</div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border-orange-400/20"><CardContent className="p-6">
            <div className="text-orange-300 text-xs uppercase tracking-widest mb-2">The Fire Altar (Homa Kunda)</div>
            <p className="text-slate-200 leading-relaxed">{data.homas.fire_structure}</p>
          </CardContent></Card>
          <Card className="bg-gradient-to-br from-red-900/30 to-fuchsia-900/20 border-red-400/20"><CardContent className="p-6">
            <div className="text-red-300 text-xs uppercase tracking-widest mb-2">Every Offering ends with "Swaha"</div>
            <p className="text-slate-200 leading-relaxed">{data.homas.offering_mantra}</p>
          </CardContent></Card>
        </div>
      </TabsContent>

      {/* DAILY RITUAL */}
      <TabsContent value="daily" className="mt-8 space-y-6">
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-8">
          <div className="font-devanagari text-2xl text-amber-300">{data.daily.dev}</div>
          <p className="text-slate-200 leading-relaxed text-lg mt-3">{data.daily.intro}</p>
        </CardContent></Card>

        <div className="space-y-3">{data.daily.schedule.map((step, i) => (
          <Card key={i} className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
            <div className="grid md:grid-cols-4 gap-4 items-start">
              <div className="md:col-span-1">
                <div className="text-amber-300 text-xs uppercase tracking-widest">{step.time}</div>
                <div className="font-devanagari text-lg text-white mt-1">{step.dev}</div>
                <div className="font-[Cormorant_Garamond,serif] text-xl text-slate-100">{step.name}</div>
              </div>
              <div className="md:col-span-3">
                <p className="text-slate-200 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </CardContent></Card>
        ))}</div>

        <Card className="bg-gradient-to-br from-amber-900/30 to-purple-900/20 border-amber-400/20 mt-6"><CardContent className="p-6">
          <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">The Five Debts &amp; Five Daily Yajnas</div>
          <p className="text-slate-200 leading-relaxed">{data.daily.five_debts}</p>
        </CardContent></Card>
      </TabsContent>
    </Tabs>
  </div>);
}

