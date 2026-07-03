'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Atom, Flower2, BookOpen, Globe2, Heart, Loader2 } from 'lucide-react';

const META = [
  { key: 'scientific', label: 'Scientific', Icon: Atom, color: 'from-cyan-400 to-blue-500' },
  { key: 'spiritual', label: 'Spiritual', Icon: Flower2, color: 'from-fuchsia-400 to-purple-500' },
  { key: 'philosophical', label: 'Philosophical', Icon: BookOpen, color: 'from-amber-300 to-orange-500' },
  { key: 'historical', label: 'Historical', Icon: Globe2, color: 'from-emerald-300 to-teal-500' },
];

export default function QuestionsPage() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  useEffect(() => { fetch('/api/questions').then(r => r.json()).then(d => setItems(d.questions || [])); }, []);

  if (active) return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.3), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => setActive(null)} className="text-slate-400 hover:text-white flex items-center gap-1 mb-6"><ChevronLeft size={16}/>All questions</button>
        <div className="text-center mb-10">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">Life Question</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-4xl md:text-6xl mt-4 text-white leading-tight">{active.q}</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {META.map(({ key, label, Icon, color }) => (
            <Card key={key} className="bg-white/[0.03] border-white/10 relative overflow-hidden">
              <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl`}/>
              <CardContent className="p-5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}><Icon size={16} className="text-white"/></div>
                  <div className="font-semibold text-white">{label} View</div>
                </div>
                <p className="text-slate-200 leading-relaxed">{active[key]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {active.synthesis && (
          <Card className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/20 border-purple-400/20 mt-6"><CardContent className="p-8 text-center">
            <div className="text-purple-200 uppercase tracking-widest text-xs mb-2">A Humble Synthesis</div>
            <p className="font-[Cormorant_Garamond,serif] text-2xl md:text-3xl text-white leading-snug">{active.synthesis}</p>
          </CardContent></Card>
        )}
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.3), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">Life Questions</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">The questions humans keep asking.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Fifteen questions that every civilization has faced. Four honest perspectives on each. No AI wait — read them any time.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(q => (
            <button key={q.id} onClick={() => setActive(q)} className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/25 hover:-translate-y-0.5 transition">
              <div className="font-[Cormorant_Garamond,serif] text-2xl text-white leading-snug">{q.q}</div>
              <div className="text-purple-300 text-sm mt-3">Read four perspectives →</div>
            </button>
          ))}
          {items.length === 0 && <div className="col-span-full flex justify-center"><Loader2 className="animate-spin text-purple-400" size={32}/></div>}
        </div>
      </main>
    </div>
  );
}
