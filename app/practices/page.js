'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Flame, Flower2, Hand, Loader2, Circle } from 'lucide-react';

export default function PracticesPage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/practices').then(r => r.json()).then(setData); }, []);

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10 opacity-30" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.4), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-amber-500/20 border-amber-300/30 text-amber-100 uppercase tracking-[0.25em] text-[10px]">Sacred Practices</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">The tools of the tradition.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Why keep a mala. Why receive deeksha. How to perform daily puja — explained honestly, with both scientific and spiritual purpose.</p>
        </div>

        {!data ? <Loader /> : (
          <Tabs defaultValue="mala" className="w-full">
            <TabsList className="bg-white/[0.03] border border-white/10 mx-auto flex justify-center h-auto flex-wrap">
              <TabsTrigger value="mala" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/60 data-[state=active]:to-fuchsia-500/60 px-6 py-2.5"><Circle size={14} className="mr-2"/>Mala</TabsTrigger>
              <TabsTrigger value="deeksha" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/60 data-[state=active]:to-fuchsia-500/60 px-6 py-2.5"><Hand size={14} className="mr-2"/>Deeksha</TabsTrigger>
              <TabsTrigger value="puja" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/60 data-[state=active]:to-fuchsia-500/60 px-6 py-2.5"><Flame size={14} className="mr-2"/>Puja Vidhanam</TabsTrigger>
            </TabsList>

            <TabsContent value="mala" className="mt-8">
              <SectionHeader title={data.mala.name} subtitle={data.mala.subtitle} />
              <p className="text-slate-200/90 max-w-3xl mx-auto text-center text-lg leading-relaxed">{data.mala.intro}</p>
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <ListCard title="Why 108?" items={data.mala.why108} accent="from-fuchsia-400 to-purple-500" />
                <ListCard title="How to Use It" items={data.mala.process} accent="from-amber-400 to-orange-500" ordered />
              </div>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">Types of Mala</h3>
                  <div className="space-y-2">{data.mala.types.map((t) => (
                    <div key={t.name} className="flex gap-3"><Flower2 size={14} className="text-fuchsia-300 mt-1 shrink-0"/><div><span className="text-white font-medium">{t.name}</span> <span className="text-slate-400 text-sm">— {t.tradition}</span></div></div>
                  ))}</div>
                </CardContent></Card>
                <ListCard title="Benefits" items={data.mala.benefits} accent="from-emerald-400 to-teal-500" />
              </div>
            </TabsContent>

            <TabsContent value="deeksha" className="mt-8">
              <SectionHeader title={data.deeksha.name} subtitle={data.deeksha.subtitle} />
              <p className="text-slate-200/90 max-w-3xl mx-auto text-center text-lg leading-relaxed">{data.deeksha.intro}</p>
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <ListCard title="Why Deeksha Matters" items={data.deeksha.why} accent="from-cyan-400 to-blue-500" />
                <ListCard title="Process" items={data.deeksha.process} accent="from-amber-400 to-orange-500" ordered />
              </div>
              <Card className="bg-white/[0.03] border-white/10 mt-6"><CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4">Types of Deeksha</h3>
                <div className="grid md:grid-cols-2 gap-3">{data.deeksha.types.map((t) => (
                  <div key={t.name} className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="text-purple-300 font-semibold">{t.name}</div>
                    <div className="text-slate-300 text-sm mt-1">{t.desc}</div>
                  </div>))}</div>
              </CardContent></Card>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <ListCard title="Benefits" items={data.deeksha.benefits} accent="from-emerald-400 to-teal-500" />
                <Card className="bg-amber-500/10 border-amber-400/30"><CardContent className="p-6">
                  <h3 className="text-amber-200 font-semibold mb-2">A Word of Caution</h3>
                  <p className="text-amber-100/80 text-sm leading-relaxed">{data.deeksha.caution}</p>
                </CardContent></Card>
              </div>
            </TabsContent>

            <TabsContent value="puja" className="mt-8">
              <SectionHeader title={data.puja.name} subtitle={data.puja.subtitle} />
              <p className="text-slate-200/90 max-w-3xl mx-auto text-center text-lg leading-relaxed">{data.puja.intro}</p>
              <ListCard title="Preparation" items={data.puja.preparation} accent="from-cyan-400 to-blue-500" ordered className="mt-10" />
              <div className="mt-6">
                <h3 className="text-white font-semibold text-center mb-6">The 16 Steps · Shodashopachara</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {data.puja.steps.map((s) => (
                    <Card key={s.n} className="bg-white/[0.03] border-white/10"><CardContent className="p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-fuchsia-600 flex items-center justify-center font-[Cormorant_Garamond,serif] text-white text-lg shrink-0">{s.n}</div>
                      <div><div className="text-white font-semibold">{s.sanskrit} <span className="text-slate-400 font-normal text-sm">· {s.english}</span></div>
                        <div className="text-slate-300 text-sm mt-1 leading-relaxed">{s.desc}</div></div>
                    </CardContent></Card>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <ListCard title="After the Puja" items={data.puja.after} accent="from-purple-400 to-fuchsia-500" />
                <ListCard title="Benefits" items={data.puja.benefits} accent="from-emerald-400 to-teal-500" />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

function Loader() { return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-400" size={32}/></div>; }
function SectionHeader({ title, subtitle }) {
  return (<div className="text-center mb-6"><h2 className="font-[Cormorant_Garamond,serif] text-4xl text-white">{title}</h2><p className="text-purple-300 mt-2">{subtitle}</p></div>);
}
function ListCard({ title, items, accent, ordered, className = '' }) {
  return (
    <Card className={`bg-white/[0.03] border-white/10 ${className}`}><CardContent className="p-6">
      <h3 className={`font-semibold mb-3 bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>{title}</h3>
      <ol className="space-y-2">{items.map((it, i) => (
        <li key={i} className="flex gap-3 text-slate-200/90 leading-relaxed">
          <span className="text-purple-300 shrink-0 mt-0.5">{ordered ? `${i + 1}.` : '•'}</span><span>{it}</span>
        </li>))}</ol>
    </CardContent></Card>
  );
}
