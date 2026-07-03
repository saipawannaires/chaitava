'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';

export default function TestPage() {
  const [qs, setQs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { fetch('/api/chakra-quiz').then(r => r.json()).then(d => setQs(d.questions || [])); }, []);

  const colors = ['from-red-500 to-red-600','from-orange-500 to-orange-600','from-yellow-400 to-yellow-500','from-emerald-500 to-emerald-600','from-sky-500 to-blue-500','from-indigo-500 to-indigo-600','from-violet-500 to-purple-600'];
  const scale = ['Rarely', 'Sometimes', 'Often', 'Almost always'];

  const set = (i, v) => setAnswers(a => ({ ...a, [i]: v }));
  const scored = qs.map((q, i) => ({ chakra: q.chakra, score: answers[i] ?? 0, color: colors[i] }));

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.3), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">Spiritual Test</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-6xl mt-4 text-white">Chakra Balance Check</h1>
          <p className="text-slate-300/80 mt-4 max-w-xl mx-auto">Seven quick questions. Rate each one honestly. See where energy flows freely and where it may be blocked.</p>
          <p className="text-slate-500 text-xs mt-2">This is a reflective self-assessment based on traditional chakra theory — not a medical diagnosis.</p>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            {qs.map((q, i) => (
              <Card key={i} className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
                <div className={`text-xs uppercase tracking-widest bg-gradient-to-r ${colors[i]} bg-clip-text text-transparent`}>{q.chakra}</div>
                <p className="text-white text-lg mt-1">{q.q}</p>
                <div className="grid grid-cols-4 gap-2 mt-4">{scale.map((s, j) => (
                  <button key={s} onClick={() => set(i, j + 1)} className={`px-2 py-2 rounded-lg text-sm border transition ${answers[i] === j + 1 ? `bg-gradient-to-r ${colors[i]} text-white border-transparent` : 'border-white/10 text-slate-300 hover:bg-white/5'}`}>{s}</button>
                ))}</div>
              </CardContent></Card>
            ))}
            <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < qs.length} className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 py-6 text-lg">Reveal my chakra balance</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/20 border-purple-400/20"><CardContent className="p-8">
              <h2 className="font-[Cormorant_Garamond,serif] text-3xl text-white text-center">Your energy map</h2>
              <div className="space-y-3 mt-6">{scored.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-white">{s.chakra}</span><span className="text-slate-400">{['Blocked', 'Weak', 'Flowing', 'Balanced', 'Strong'][s.score]}</span></div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden"><div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: `${(s.score / 4) * 100}%` }}/></div>
                </div>
              ))}</div>
            </CardContent></Card>
            <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
              <h3 className="text-white font-semibold">Reflection</h3>
              <p className="text-slate-300 mt-2 leading-relaxed">Weakest chakra: <span className="text-fuchsia-300">{scored.reduce((a, b) => (b.score < a.score ? b : a)).chakra}</span>. Spend a week focusing meditation, breathwork, and journaling on the qualities of this energy center. The tradition holds that awareness itself is the healing.</p>
              <Button variant="outline" onClick={() => { setAnswers({}); setSubmitted(false); }} className="mt-4 border-white/15 bg-transparent"><RotateCcw size={14} className="mr-1"/>Take again</Button>
            </CardContent></Card>
          </div>
        )}
      </main>
    </div>
  );
}
