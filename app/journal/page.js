'use client';
import { useEffect, useMemo, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Trash2, Sparkles } from 'lucide-react';

const PROMPTS = [
  "What am I grateful for today?",
  "What am I struggling with, honestly?",
  "What did I meditate on?",
  "One thing I noticed about my mind today.",
  "What did today teach me?",
];

function todayKey(d = new Date()) { return d.toISOString().slice(0, 10); }

export default function JournalPage() {
  const [entries, setEntries] = useState({});
  const [today, setToday] = useState('');
  const [prompt, setPrompt] = useState(PROMPTS[0]);

  useEffect(() => {
    try { const raw = localStorage.getItem('sanatana_journal'); if (raw) setEntries(JSON.parse(raw)); } catch {}
  }, []);

  function save() {
    if (!today.trim()) return;
    const key = todayKey();
    const next = { ...entries, [key]: [...(entries[key] || []), { text: today.trim(), prompt, at: new Date().toISOString() }] };
    setEntries(next);
    try { localStorage.setItem('sanatana_journal', JSON.stringify(next)); } catch {}
    setToday('');
  }

  function del(key, idx) {
    const list = [...(entries[key] || [])];
    list.splice(idx, 1);
    const next = { ...entries };
    if (list.length === 0) delete next[key]; else next[key] = list;
    setEntries(next);
    try { localStorage.setItem('sanatana_journal', JSON.stringify(next)); } catch {}
  }

  // streak: consecutive days ending today
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    while (true) {
      const k = d.toISOString().slice(0, 10);
      if (entries[k] && entries[k].length > 0) { count++; d.setDate(d.getDate() - 1); } else break;
      if (count > 3650) break;
    }
    return count;
  }, [entries]);

  const days = Object.keys(entries).sort().reverse();
  const totalEntries = Object.values(entries).reduce((a, b) => a + b.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(236,72,153,0.25), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-pink-500/20 border-pink-300/30 text-pink-100 uppercase tracking-[0.25em] text-[10px]">Spiritual Journal</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Write. Notice. Repeat.</h1>
          <p className="text-slate-300/80 mt-4 max-w-xl mx-auto text-lg">The oldest form of self-inquiry. Stored locally on your device — private by default.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400"><Flame size={16}/><div className="text-2xl font-bold text-white">{streak}</div></div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Day streak</div>
          </CardContent></Card>
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalEntries}</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Total entries</div>
          </CardContent></Card>
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{days.length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Days written</div>
          </CardContent></Card>
        </div>

        <Card className="bg-white/[0.04] border-white/10 backdrop-blur"><CardContent className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">{PROMPTS.map(p => (
            <button key={p} onClick={() => setPrompt(p)} className={`text-xs px-3 py-1.5 rounded-full border ${prompt === p ? 'bg-pink-500/30 border-pink-300/50 text-white' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}>{p}</button>
          ))}</div>
          <Textarea value={today} onChange={e => setToday(e.target.value)} rows={5} placeholder={prompt} className="bg-transparent border-white/10 text-lg font-[Cormorant_Garamond,serif] focus-visible:ring-pink-400/40"/>
          <div className="flex justify-end mt-3">
            <Button onClick={save} disabled={!today.trim()} className="bg-gradient-to-r from-pink-500 to-fuchsia-500"><Sparkles size={14} className="mr-1"/>Save entry</Button>
          </div>
        </CardContent></Card>

        <div className="mt-8 space-y-4">
          {days.map(k => (
            <div key={k}>
              <div className="text-slate-400 text-sm uppercase tracking-widest mb-2">{new Date(k).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <div className="space-y-2">{entries[k].map((e, i) => (
                <Card key={i} className="bg-white/[0.02] border-white/10"><CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="text-pink-300 text-xs uppercase tracking-widest">{e.prompt}</div>
                      <div className="text-slate-200 leading-relaxed mt-1 whitespace-pre-line">{e.text}</div>
                    </div>
                    <button onClick={() => del(k, i)} className="text-slate-500 hover:text-red-400"><Trash2 size={14}/></button>
                  </div>
                </CardContent></Card>
              ))}</div>
            </div>
          ))}
          {days.length === 0 && <div className="text-center text-slate-500 italic py-10">Your first entry begins the streak.</div>}
        </div>
      </main>
    </div>
  );
}
